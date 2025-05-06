use regex::Regex;
use serde_json::{json, Value};
use std::fs::File;
use std::io::{BufReader, Read};
use std::path::Path;

pub fn extract_version_from_exe<P: AsRef<Path>>(path: P) -> Option<String> {
    let file = File::open(path).ok()?;
    let mut reader = BufReader::new(file);
    let mut buffer = Vec::new();
    reader.read_to_end(&mut buffer).ok()?;

    let text = String::from_utf8_lossy(&buffer);

    let patterns = [
        r"Version\s+(\d+\.\d+\.\d+\.\d+)",
        r"(\d+\.\d+\.\d+)\s+\((\d+)\)",
        r"Build\s+(\d+)",
    ];

    for pat in patterns {
        let regex = Regex::new(pat).ok()?;
        if let Some(caps) = regex.captures(&text) {
            return Some(caps.get(0)?.as_str().to_string());
        }
    }

    None
}

pub fn expansion_from_version(version_str: &str) -> Option<&'static str> {
    let known_versions = [
        ("1.12", "Classic (Vanilla)"),
        ("2.4", "The Burning Crusade"),
        ("3.3", "Wrath of the Lich King"),
        ("4.3", "Cataclysm"),
        ("5.4", "Mists of Pandaria"),
        ("6.2", "Warlords of Draenor"),
        ("7.3", "Legion"),
        ("8.3", "Battle for Azeroth"),
        ("9.2", "Shadowlands"),
        ("10.2", "Dragonflight"),
        ("11.0", "The War Within"),
    ];

    for (ver_prefix, name) in known_versions {
        if version_str.starts_with(ver_prefix) {
            return Some(name);
        }
    }

    let build_map: [(&str, Vec<i32>); 11] = [
        (
            "VA",
            vec![
                4297, 4544, 4695, 4735, 4878, 4983, 5178, 5360, 5464, 5595, 5810, 6005, 6141,
            ],
        ),
        ("TBC", vec![6180, 6299, 6692, 6898, 7318, 7741, 8606]),
        ("LK", vec![9056, 9464, 9947, 10192, 11159, 12340]),
        ("CATA", vec![13164, 13623, 14333, 15595]),
        ("MOP", vec![16016, 16309, 16826, 17128, 18414]),
        ("WOD", vec![19027, 19702, 20779]),
        ("LG", vec![21996, 22522, 23222, 23911, 26365]),
        ("BFA", vec![26624, 27602, 29981, 31478, 35662]),
        ("SL", vec![35917, 37862, 39015, 45745]),
        ("DF", vec![46313, 47181, 48676, 53443]),
        ("TWW", vec![]),
    ];

    if let Some(build) = version_str
        .chars()
        .filter(|c| c.is_digit(10))
        .collect::<String>()
        .parse::<u32>()
        .ok()
    {
        for (name, builds) in build_map {
            if !builds.is_empty() {
                let min_build = *builds.first().unwrap() as u32;
                let max_build = *builds.last().unwrap() as u32;
                if build >= min_build && build <= max_build {
                    return Some(name);
                }
            }
        }
    }
    None
}

#[tauri::command]
pub async fn get_version(path: Option<String>) -> Result<Value, String> {
    let path = path.unwrap_or("".to_string());
    println!("Path: {}", path);
    match extract_version_from_exe(&path) {
        Some(version_str) => match expansion_from_version(&version_str) {
            Some(expansion) => Ok(json!({ "expansion": expansion })),
            None => Ok(json!({ "expansion": "default" })),
        },
        None => Ok(json!({ "expansion": "default" })),
    }
}
