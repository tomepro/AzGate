mod api;
mod game;
use api::login::log_in_request;
use api::jwt::{get_jwt,save_jwt};
use game::version::get_version;
use tauri_plugin_fs::init;
use std::path::Path;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let env_path = Path::new(env!("CARGO_MANIFEST_DIR")).join(".env");
    match dotenvy::from_path(&env_path) {
        Ok(()) => println!("Loaded .env from {:?}", env_path),
        Err(e) => panic!("Failed to load .env from {:?}: {}", env_path, e),
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(init())
        .invoke_handler(tauri::generate_handler![log_in_request,get_jwt,save_jwt,get_version])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}   
