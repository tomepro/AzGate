mod api;
mod game;
use game::version::get_version;
use std::path::Path;

use tauri_plugin_fs::init;

use std::env;

use game::discord::{setup_discord_rpc,update_presence};

// --- API Modules ---
use api::{
    account_points::fetch_coins,
    buy::buy_shop_item,
    changelog::fetch_changelog,
    json::{
        crear_json_vacio, delete_version, get_all_versions, launch_version, save_version_to_file,
        update_version,
    },
    jwt::{delete_jwt, get_jwt, save_jwt},
    list_addons::list_addons,
    list_addons::open_folder,
    list_addons::unzip_and_move,
    login::{jwt_login, log_in_request},
    news::fetch_news,
    profile::fetch_profile,
    realms::fetch_realms,
    register::register_user,
    reset_password::reset_password,
    send_password_reset::send_password_email,
    shop::fetch_shop_items,
    tickets,
    configFile::read_config_wtf,
    configFile::write_config_wtf,
};

// --- Entry Point ---
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let env_path = Path::new(env!("CARGO_MANIFEST_DIR")).join(".env");
    match dotenvy::from_path(&env_path) {
        Ok(()) => println!("Loaded .env from {:?}", env_path),
        Err(e) => panic!("Failed to load .env from {:?}: {}", env_path, e),
    }

    // println!("{}",client_id);
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
            fetch_coins,
            launch_version,
            update_version,
            delete_version,
            list_addons,
            open_folder,
            unzip_and_move,
            fetch_shop_items,
            buy_shop_item,
            unzip_and_move,
            open_folder,
            tickets::fetch_tickets,
            tickets::complete_ticket,
            tickets::update_ticket_response,
            tickets::delete_ticket,

            // Config File
            read_config_wtf,
            write_config_wtf,
            update_presence
        ])
            .setup(|_app| {
            setup_discord_rpc();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
