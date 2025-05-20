mod api;
mod game;
use game::version::get_version;
use std::path::Path;

use tauri_plugin_fs::init;



// --- API Modules ---
use api::{
    account_points::fetch_coins,
    changelog::fetch_changelog,
    json::{
        crear_json_vacio, delete_version, get_all_versions, launch_version, save_version_to_file,
        update_version,
    },
    jwt::{delete_jwt, get_jwt, save_jwt},
    login::{jwt_login, log_in_request},
    news::fetch_news,
    profile::fetch_profile,
    realms::fetch_realms,
    register::register_user,
    reset_password::reset_password,
    send_password_reset::send_password_email,
    shop::fetch_shop_items,
    tickets,
    list_addons::list_addons,
    list_addons::unzip_and_move,
    list_addons::open_folder,
    buy::buy_shop_item,
};

// --- Entry Point ---
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let env_path = Path::new(env!("CARGO_MANIFEST_DIR")).join(".env");
    match dotenvy::from_path(&env_path) {
        Ok(()) => println!("Loaded .env from {:?}", env_path),
        Err(e) => panic!("Failed to load .env from {:?}: {}", env_path, e),
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(init())
        .invoke_handler(tauri::generate_handler![
            // Auth & Session
            log_in_request,
            jwt_login,
            get_jwt,
            save_jwt,
            delete_jwt,

            // Account
            register_user,
            reset_password,
            send_password_email,
            fetch_profile,
            fetch_coins,

            // Game & UI
            get_version,
            fetch_realms,
            fetch_changelog,
            fetch_news,

            // Version Management
            crear_json_vacio,
            save_version_to_file,
            get_all_versions,
            launch_version,
            update_version,
            delete_version,
            list_addons,
            open_folder,
            unzip_and_move,
            fetch_shop_items,
            buy_shop_item,

        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
