mod merge;
mod server;

use std::sync::Mutex;
use tauri::{Manager, State};

#[derive(Default)]
struct ServerSlot(Mutex<Option<server::Running>>);

#[tauri::command]
fn server_start(app: tauri::AppHandle, slot: State<ServerSlot>, port: u16) -> Result<server::Status, String> {
    start_server(&app, &slot, port)
}

fn start_server(app: &tauri::AppHandle, slot: &ServerSlot, port: u16) -> Result<server::Status, String> {
    if port < 1024 {
        return Err("port".into());
    }
    let mut guard = slot.0.lock().map_err(|e| e.to_string())?;
    if let Some(running) = guard.as_ref() {
        return Ok(running.status());
    }
    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?.join("server");
    let handle = app.clone();
    let assets: Box<server::AssetFn> = Box::new(move |path: &str| {
        handle
            .asset_resolver()
            .get(path.trim_start_matches('/').to_string())
            .map(|a| (a.bytes, a.mime_type))
    });
    let running = server::start(port, data_dir, assets)?;
    let status = running.status();
    *guard = Some(running);
    Ok(status)
}

#[tauri::command]
fn server_stop(slot: State<ServerSlot>) -> Result<(), String> {
    if let Some(running) = slot.0.lock().map_err(|e| e.to_string())?.take() {
        running.stop();
    }
    Ok(())
}

#[tauri::command]
fn server_status(slot: State<ServerSlot>) -> Result<server::Status, String> {
    let guard = slot.0.lock().map_err(|e| e.to_string())?;
    Ok(guard.as_ref().map(|r| r.status()).unwrap_or(server::Status {
        running: false,
        port: 0,
        urls: vec![],
        code: String::new(),
    }))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(ServerSlot::default())
        .setup(|app| {
            // AUTODEX_SERVER_PORT=4174 starts the local server at launch (handy for an always-on computer).
            if let Some(port) = std::env::var("AUTODEX_SERVER_PORT").ok().and_then(|p| p.parse().ok()) {
                let handle = app.handle().clone();
                let slot = app.state::<ServerSlot>();
                if let Err(e) = start_server(&handle, &slot, port) {
                    eprintln!("AutoDex server: {e}");
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![server_start, server_stop, server_status])
        .run(tauri::generate_context!())
        .expect("error while running AutoDex");
}
