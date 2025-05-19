mod api;
mod game;
use api::changelog::fetch_changelog;
use api::json::crear_json_vacio;
use api::json::save_version_to_file;
use api::jwt::{delete_jwt, get_jwt, save_jwt};
use api::login::log_in_request;
use api::news::fetch_news;
use api::profile::fetch_profile;
use api::realms::fetch_realms;
use api::register::register_user;
use api::json::get_all_versions;
use api::account_points::fetch_coins;
use api::json::launch_version;
use api::send_password_reset::send_password_email;
use api::json::update_version;
use api::json::delete_version;
use api::list_addons::list_addons;
use api::list_addons::open_folder;
use api::list_addons::unzip_and_move;

use api::reset_password::reset_password;

use api::login::jwt_login;
use game::version::get_version;
use std::path::Path;
use tauri_plugin_fs::init;

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
            log_in_request,
            get_jwt,
            save_jwt,
            get_version,
            register_user,
            fetch_realms,
            fetch_changelog,
            fetch_news,
            jwt_login,
            delete_jwt,
            fetch_profile,
            crear_json_vacio,
            save_version_to_file,
            get_all_versions,
            fetch_coins,
            launch_version,
            send_password_email,
            reset_password,
            update_version,
            delete_version,
            list_addons,
            open_folder,
            unzip_and_move
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
