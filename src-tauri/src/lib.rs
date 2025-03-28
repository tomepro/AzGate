mod api;
use api::login::log_in_request;
use api::jwt::{get_jwt,save_jwt};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![log_in_request,get_jwt,save_jwt])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}   
