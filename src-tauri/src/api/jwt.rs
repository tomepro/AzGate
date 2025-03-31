use tauri::Manager;
use tokio::fs;

#[tauri::command]
pub async fn save_jwt(jwt: String, app_handle: tauri::AppHandle) -> Result<(), String> {
    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| e.to_string())?;
    let token_path = config_dir.join("auth_token.txt");

    if let Some(parent) = token_path.parent() {
        fs::create_dir_all(parent)
            .await
            .map_err(|e| e.to_string())?;
    }

    fs::write(&token_path, jwt)
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn get_jwt(app_handle: tauri::AppHandle) -> Result<Option<String>, String> {
    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| e.to_string())?;
    let token_path = config_dir.join("auth_token.txt");

    match fs::read_to_string(&token_path).await {
        Ok(jwt) => Ok(Some(jwt)),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}