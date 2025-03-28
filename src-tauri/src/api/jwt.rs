use std::fs;

#[tauri::command]
pub fn save_jwt(jwt: String, app_handle: tauri::AppHandle) -> Result<(), String> {
    let config_dir = tauri::api::path::app_config_dir(&app_handle.config())
        .ok_or("Failed to get config dir")?;
    let token_path = config_dir.join("auth_token.txt");

    // Create directory if it doesn’t exist
    fs::create_dir_all(token_path.parent().unwrap()).map_err(|e| e.to_string())?;

    // Save the plain text JWT
    fs::write(&token_path, jwt).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_jwt(app_handle: tauri::AppHandle) -> Result<Option<String>, String> {
    let config_dir = tauri::api::path::app_config_dir(&app_handle.config())
        .ok_or("Failed to get config dir")?;
    let token_path = config_dir.join("auth_token.txt");

    if token_path.exists() {
        let jwt = fs::read_to_string(&token_path).map_err(|e| e.to_string())?;
        Ok(Some(jwt))
    } else {
        Ok(None)
    }
}