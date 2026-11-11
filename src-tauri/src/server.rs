//! Local network server embedded in the desktop app: serves the web app to phones on the same
//! Wi-Fi and keeps a shared collection, protected by a pairing code.

use crate::merge;
use serde::Serialize;
use serde_json::{json, Value};
use std::collections::HashMap;
use std::fs;
use std::io::Read;
use std::net::{IpAddr, UdpSocket};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::thread::JoinHandle;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};
use tiny_http::{Header, Method, Request, Response, Server};

const MAX_BODY: u64 = 250_000_000;
const MAX_FAILURES: usize = 10;
const FAILURE_WINDOW: Duration = Duration::from_secs(600);

/// Serves a static file from the bundled web app: (bytes, mime type).
pub type AssetFn = dyn Fn(&str) -> Option<(Vec<u8>, String)> + Send + Sync;

#[derive(Serialize, Clone)]
pub struct Status {
    pub running: bool,
    pub port: u16,
    pub urls: Vec<String>,
    pub code: String,
}

struct Shared {
    data_file: PathBuf,
    code: String,
    sightings: Mutex<Vec<Value>>,
    failures: Mutex<HashMap<IpAddr, Vec<Instant>>>,
    assets: Box<AssetFn>,
}

pub struct Running {
    server: Arc<Server>,
    thread: Option<JoinHandle<()>>,
    status: Status,
}

impl Running {
    pub fn status(&self) -> Status {
        self.status.clone()
    }

    pub fn stop(mut self) {
        self.server.unblock();
        if let Some(t) = self.thread.take() {
            let _ = t.join();
        }
    }
}

pub fn now_iso() -> String {
    let d = SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default();
    let secs = d.as_secs() as i64;
    let (days, rem) = (secs.div_euclid(86_400), secs.rem_euclid(86_400));
    // Civil date from days since 1970-01-01 (Howard Hinnant's algorithm).
    let z = days + 719_468;
    let era = z.div_euclid(146_097);
    let doe = z.rem_euclid(146_097);
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let day = doy - (153 * mp + 2) / 5 + 1;
    let month = if mp < 10 { mp + 3 } else { mp - 9 };
    let year = yoe + era * 400 + i64::from(month <= 2);
    format!(
        "{year:04}-{month:02}-{day:02}T{:02}:{:02}:{:02}.{:03}Z",
        rem / 3600,
        rem % 3600 / 60,
        rem % 60,
        d.subsec_millis()
    )
}

pub fn new_code() -> String {
    let mut bytes = [0u8; 4];
    getrandom::fill(&mut bytes).expect("system random generator");
    bytes.iter().map(|b| format!("{b:02X}")).collect()
}

fn same_code(given: &str, expected: &str) -> bool {
    let g = given.trim().to_ascii_uppercase();
    g.len() == expected.len() && g.bytes().zip(expected.bytes()).fold(0u8, |acc, (a, b)| acc | (a ^ b)) == 0
}

fn load_or_create_code(dir: &std::path::Path) -> String {
    let file = dir.join("pairing-code.txt");
    if let Ok(c) = fs::read_to_string(&file) {
        let c = c.trim().to_string();
        if c.len() == 8 && c.bytes().all(|b| b.is_ascii_hexdigit() && !b.is_ascii_lowercase()) {
            return c;
        }
    }
    let c = new_code();
    let _ = fs::write(&file, &c);
    c
}

fn lan_ip() -> Option<IpAddr> {
    // Connecting a UDP socket sends nothing; it only selects the outgoing interface.
    let s = UdpSocket::bind("0.0.0.0:0").ok()?;
    s.connect("192.0.2.1:9").ok()?;
    s.local_addr().ok().map(|a| a.ip())
}

fn header(name: &str, value: &str) -> Header {
    Header::from_bytes(name.as_bytes(), value.as_bytes()).expect("valid header")
}

fn with_common<R: Read>(mut r: Response<R>, api: bool) -> Response<R> {
    r.add_header(header("X-Content-Type-Options", "nosniff"));
    r.add_header(header("Referrer-Policy", "no-referrer"));
    r.add_header(header("X-Frame-Options", "DENY"));
    if api {
        r.add_header(header("Cache-Control", "no-store"));
        r.add_header(header("Access-Control-Allow-Origin", "*"));
        r.add_header(header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS"));
        r.add_header(header("Access-Control-Allow-Headers", "Content-Type, X-AutoDex-Code"));
    }
    r
}

fn json_response(status: u16, body: &Value) -> Response<std::io::Cursor<Vec<u8>>> {
    let r = Response::from_data(serde_json::to_vec(body).unwrap_or_default())
        .with_status_code(status)
        .with_header(header("Content-Type", "application/json; charset=utf-8"));
    with_common(r, true)
}

impl Shared {
    fn blocked(&self, ip: IpAddr) -> bool {
        let mut f = self.failures.lock().unwrap();
        let list = f.entry(ip).or_default();
        list.retain(|t| t.elapsed() < FAILURE_WINDOW);
        list.len() >= MAX_FAILURES
    }

    fn fail(&self, ip: IpAddr) {
        self.failures
            .lock()
            .unwrap()
            .entry(ip)
            .or_default()
            .push(Instant::now());
    }

    fn save(&self, doc: &Value) {
        let tmp = self.data_file.with_extension("json.tmp");
        if fs::write(&tmp, serde_json::to_vec(doc).unwrap_or_default()).is_ok() {
            let _ = fs::rename(&tmp, &self.data_file);
        }
    }

    fn api(&self, req: &mut Request) -> Response<std::io::Cursor<Vec<u8>>> {
        let path = req.url().split('?').next().unwrap_or("").to_string();
        if *req.method() == Method::Options {
            return json_response(204, &Value::Null);
        }
        if path == "/api/ping" {
            return json_response(200, &json!({ "autodex": true, "version": 2 }));
        }
        if path != "/api/state" {
            return json_response(404, &json!({ "error": "not_found" }));
        }
        let ip = req.remote_addr().map(|a| a.ip()).unwrap_or(IpAddr::from([0, 0, 0, 0]));
        if self.blocked(ip) {
            return json_response(429, &json!({ "error": "rate_limited" }));
        }
        let given = req
            .headers()
            .iter()
            .find(|h| h.field.equiv("X-AutoDex-Code"))
            .map(|h| h.value.as_str().to_string())
            .unwrap_or_default();
        if !same_code(&given, &self.code) {
            self.fail(ip);
            return json_response(401, &json!({ "error": "bad_code" }));
        }
        self.failures.lock().unwrap().remove(&ip);
        match req.method() {
            Method::Get => {
                let s = self.sightings.lock().unwrap();
                json_response(200, &merge::document(&s, &now_iso()))
            }
            Method::Put => {
                let mut body = Vec::new();
                if req.as_reader().take(MAX_BODY + 1).read_to_end(&mut body).is_err() {
                    return json_response(400, &json!({ "error": "invalid" }));
                }
                if body.len() as u64 > MAX_BODY {
                    return json_response(413, &json!({ "error": "too_large" }));
                }
                let incoming = match serde_json::from_slice::<Value>(&body)
                    .ok()
                    .as_ref()
                    .and_then(merge::validate)
                {
                    Some(v) => v,
                    None => return json_response(400, &json!({ "error": "invalid" })),
                };
                let mut s = self.sightings.lock().unwrap();
                *s = merge::merge(&s, &incoming);
                let doc = merge::document(&s, &now_iso());
                self.save(&doc);
                json_response(200, &doc)
            }
            _ => json_response(405, &json!({ "error": "method" })),
        }
    }

    fn handle(&self, mut req: Request) {
        let url = req.url().split('?').next().unwrap_or("/").to_string();
        if url.starts_with("/api/") {
            let r = self.api(&mut req);
            let _ = req.respond(r);
            return;
        }
        if !matches!(req.method(), Method::Get | Method::Head) || url.contains("..") || url.contains('\\') {
            let _ = req.respond(json_response(403, &json!({ "error": "forbidden" })));
            return;
        }
        let path = if url == "/" { "/index.html" } else { url.as_str() };
        let found = (self.assets)(path).or_else(|| (self.assets)("/index.html"));
        let r = match found {
            Some((bytes, mime)) => with_common(
                Response::from_data(bytes)
                    .with_header(header("Content-Type", &mime))
                    .with_header(header(
                        "Cache-Control",
                        if path.ends_with(".html") {
                            "no-cache"
                        } else {
                            "public, max-age=86400"
                        },
                    )),
                false,
            ),
            None => json_response(404, &json!({ "error": "not_found" })),
        };
        let _ = req.respond(r);
    }
}

pub fn start(port: u16, data_dir: PathBuf, assets: Box<AssetFn>) -> Result<Running, String> {
    fs::create_dir_all(&data_dir).map_err(|e| e.to_string())?;
    let data_file = data_dir.join("collection.json");
    let sightings = fs::read(&data_file)
        .ok()
        .and_then(|b| serde_json::from_slice::<Value>(&b).ok())
        .and_then(|v| merge::validate(&v))
        .unwrap_or_default();
    let server = Arc::new(Server::http(("0.0.0.0", port)).map_err(|e| e.to_string())?);
    let code = load_or_create_code(&data_dir);
    let shared = Arc::new(Shared {
        data_file,
        code: code.clone(),
        sightings: Mutex::new(sightings),
        failures: Mutex::new(HashMap::new()),
        assets,
    });
    let mut urls = vec![format!("http://127.0.0.1:{port}")];
    if let Some(ip) = lan_ip().filter(|ip| !ip.is_loopback()) {
        urls.insert(0, format!("http://{ip}:{port}"));
    }
    let srv = Arc::clone(&server);
    let thread = std::thread::spawn(move || {
        for req in srv.incoming_requests() {
            let shared = Arc::clone(&shared);
            std::thread::spawn(move || shared.handle(req));
        }
    });
    Ok(Running {
        server,
        thread: Some(thread),
        status: Status {
            running: true,
            port,
            urls,
            code,
        },
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn iso_time_has_js_format() {
        let t = now_iso();
        assert!(merge::normalize_time(&t).as_deref() == Some(t.as_str()), "{t}");
        assert!(t.starts_with("20"));
    }

    #[test]
    fn codes() {
        let c = new_code();
        assert_eq!(c.len(), 8);
        assert!(same_code(&c.to_lowercase(), &c));
        assert!(!same_code("", &c));
    }

    #[test]
    fn serves_api_and_assets() {
        let dir = std::env::temp_dir().join(format!("autodex-test-{}", new_code()));
        let assets: Box<AssetFn> =
            Box::new(|p: &str| (p == "/index.html").then(|| (b"<html>".to_vec(), "text/html".into())));
        let running = start(0, dir.clone(), assets).expect("start");
        let port = running.server.server_addr().to_ip().unwrap().port();
        let code = running.status().code;
        let get = |path: &str, code: &str| -> (u16, String) {
            use std::io::Write;
            let mut s = std::net::TcpStream::connect(("127.0.0.1", port)).unwrap();
            write!(
                s,
                "GET {path} HTTP/1.1\r\nHost: x\r\nX-AutoDex-Code: {code}\r\nConnection: close\r\n\r\n"
            )
            .unwrap();
            let mut out = String::new();
            s.read_to_string(&mut out).unwrap();
            (out[9..12].parse().unwrap(), out)
        };
        assert_eq!(get("/api/ping", "").0, 200);
        assert_eq!(get("/api/state", "WRONG").0, 401);
        assert_eq!(get("/api/state", &code).0, 200);
        assert!(get("/some/page", "").1.ends_with("<html>"));
        assert_eq!(get("/../secret", "").0, 403);
        running.stop();
        let _ = fs::remove_dir_all(dir);
    }
}
