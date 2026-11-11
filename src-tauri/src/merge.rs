//! Validation and merging of AutoDex collections. Mirrors `src/merge.js`.

use serde_json::{json, Map, Value};
use std::collections::HashMap;

pub const MAX_SIGHTINGS: usize = 20_000;
pub const MAX_PHOTO_CHARS: usize = 3_000_000;

fn valid_id(s: &str) -> bool {
    !s.is_empty()
        && s.len() <= 80
        && s.bytes()
            .all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || b == b'-')
}

fn valid_photo(s: &str) -> bool {
    if s.len() > MAX_PHOTO_CHARS {
        return false;
    }
    let body = [
        "data:image/jpeg;base64,",
        "data:image/png;base64,",
        "data:image/webp;base64,",
    ]
    .iter()
    .find_map(|p| s.strip_prefix(p));
    matches!(body, Some(b) if !b.is_empty() && b.bytes().all(|c| c.is_ascii_alphanumeric() || c == b'+' || c == b'/' || c == b'='))
}

/// Normalises `YYYY-MM-DDTHH:MM:SS[.fff]Z` to millisecond precision, so timestamps compare as strings.
pub fn normalize_time(s: &str) -> Option<String> {
    let s = s.strip_suffix('Z')?;
    let (main, frac) = match s.split_once('.') {
        Some((m, f)) => (m, f),
        None => (s, ""),
    };
    let b = main.as_bytes();
    if b.len() != 19 || frac.len() > 9 || !frac.bytes().all(|c| c.is_ascii_digit()) {
        return None;
    }
    for (i, c) in b.iter().enumerate() {
        let ok = match i {
            4 | 7 => *c == b'-',
            10 => *c == b'T',
            13 | 16 => *c == b':',
            _ => c.is_ascii_digit(),
        };
        if !ok {
            return None;
        }
    }
    let ms: String = frac.chars().chain("000".chars()).take(3).collect();
    Some(format!("{main}.{ms}Z"))
}

fn clean_sighting(v: &Value) -> Option<Value> {
    let o = v.as_object()?;
    let id = o.get("id")?.as_str().filter(|s| valid_id(s))?;
    let car_id = o.get("carId")?.as_str().filter(|s| valid_id(s))?;
    let created = normalize_time(o.get("createdAt")?.as_str()?)?;
    let updated = normalize_time(o.get("updatedAt")?.as_str()?)?;
    let method = if o.get("method").and_then(Value::as_str) == Some("ai") {
        "ai"
    } else {
        "manual"
    };
    let deleted = o.get("deleted").and_then(Value::as_bool) == Some(true);
    let mut out = Map::new();
    out.insert("id".into(), json!(id));
    out.insert("carId".into(), json!(car_id));
    out.insert("createdAt".into(), json!(created));
    out.insert("updatedAt".into(), json!(updated));
    out.insert("method".into(), json!(method));
    out.insert("deleted".into(), json!(deleted));
    if !deleted {
        let photo = o.get("photo")?.as_str().filter(|p| valid_photo(p))?;
        out.insert("photo".into(), json!(photo));
        if method == "ai" {
            let c = o
                .get("confidence")
                .and_then(Value::as_f64)
                .filter(|c| c.is_finite())
                .unwrap_or(0.0);
            out.insert("confidence".into(), json!(c.clamp(0.0, 1.0)));
        }
        if let Some(note) = o.get("note").and_then(Value::as_str) {
            out.insert("note".into(), json!(note.chars().take(500).collect::<String>()));
        }
    }
    Some(Value::Object(out))
}

/// Returns the cleaned sightings, or `None` when the document is not a valid AutoDex collection.
pub fn validate(input: &Value) -> Option<Vec<Value>> {
    let version = input.get("version")?.as_i64()?;
    if version != 1 && version != 2 {
        return None;
    }
    let list = input.get("sightings")?.as_array()?;
    if list.len() > MAX_SIGHTINGS {
        return None;
    }
    list.iter().map(clean_sighting).collect()
}

fn updated(v: &Value) -> &str {
    v.get("updatedAt").and_then(Value::as_str).unwrap_or("")
}

/// Last write wins per sighting id; deletions travel as tombstones.
pub fn merge(a: &[Value], b: &[Value]) -> Vec<Value> {
    let mut by_id: HashMap<String, Value> = HashMap::new();
    for s in a.iter().chain(b) {
        let id = s.get("id").and_then(Value::as_str).unwrap_or_default().to_string();
        match by_id.get(&id) {
            Some(cur) if updated(s) <= updated(cur) => {}
            _ => {
                by_id.insert(id, s.clone());
            }
        }
    }
    let mut out: Vec<Value> = by_id.into_values().collect();
    out.sort_by(|x, y| {
        let k = |v: &Value| v.get("createdAt").and_then(Value::as_str).unwrap_or("").to_string();
        k(x).cmp(&k(y))
    });
    out
}

pub fn document(sightings: &[Value], updated_at: &str) -> Value {
    json!({ "format": "autodex", "version": 2, "sightings": sightings, "updatedAt": updated_at })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn s(id: &str, updated: &str) -> Value {
        json!({ "id": id, "carId": "peugeot-205-1983", "photo": "data:image/jpeg;base64,AAAA", "method": "manual",
                "createdAt": "2026-01-01T00:00:00Z", "updatedAt": updated })
    }

    #[test]
    fn normalizes_times() {
        assert_eq!(
            normalize_time("2026-01-02T03:04:05Z").unwrap(),
            "2026-01-02T03:04:05.000Z"
        );
        assert_eq!(
            normalize_time("2026-01-02T03:04:05.1Z").unwrap(),
            "2026-01-02T03:04:05.100Z"
        );
        assert!(normalize_time("2026-01-02 03:04:05Z").is_none());
        assert!(normalize_time("2026-01-02T03:04:05+01:00").is_none());
    }

    #[test]
    fn rejects_bad_documents() {
        assert!(validate(&json!({ "version": 3, "sightings": [] })).is_none());
        assert!(validate(&json!({ "version": 2, "sightings": [{ "id": "../x" }] })).is_none());
        let mut bad = s("a", "2026-01-01T00:00:00Z");
        bad["photo"] = json!("https://example.com/x.jpg");
        assert!(validate(&json!({ "version": 2, "sightings": [bad] })).is_none());
        let mut svg = s("a", "2026-01-01T00:00:00Z");
        svg["photo"] = json!("data:image/svg+xml;base64,AAAA");
        assert!(validate(&json!({ "version": 2, "sightings": [svg] })).is_none());
    }

    #[test]
    fn strips_unknown_fields_and_clamps_confidence() {
        let mut v = s("a", "2026-01-01T00:00:00Z");
        v["evil"] = json!("<script>");
        v["method"] = json!("ai");
        v["confidence"] = json!(7);
        let out = validate(&json!({ "version": 2, "sightings": [v] })).unwrap();
        assert!(out[0].get("evil").is_none());
        assert_eq!(out[0]["confidence"], json!(1.0));
    }

    #[test]
    fn last_write_wins_and_tombstones() {
        let a = validate(&json!({ "version": 2, "sightings": [s("a", "2026-01-02T00:00:00Z")] })).unwrap();
        let dead = json!({ "id": "a", "carId": "peugeot-205-1983", "method": "manual", "deleted": true,
                           "createdAt": "2026-01-01T00:00:00Z", "updatedAt": "2026-01-05T00:00:00Z" });
        let b = validate(&json!({ "version": 2, "sightings": [dead, s("b", "2026-01-01T00:00:00Z")] })).unwrap();
        for m in [merge(&a, &b), merge(&b, &a)] {
            assert_eq!(m.len(), 2);
            assert_eq!(m.iter().find(|x| x["id"] == "a").unwrap()["deleted"], json!(true));
        }
    }
}
