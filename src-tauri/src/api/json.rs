use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use tokio::fs;

#[derive(Serialize, Deserialize, Clone)]
pub struct Version {
    pub name: String,
    pub path: String, // Ruta del .exe proporcionada desde el frontend
    pub version: String,
}

#[tauri::command]
pub async fn crear_json_vacio(app_handle: AppHandle) -> Result<(), String> {
    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| format!("Error al obtener config_dir: {}", e))?;
    let json_path = config_dir.join("versiones_wow.json");

    if json_path.exists() {
        println!("El archivo ya existe: {}", json_path.display());
        return Ok(());
    }

    if let Some(parent) = json_path.parent() {
        fs::create_dir_all(parent).await.map_err(|e| e.to_string())?;
    }

    fs::write(&json_path, "[]").await.map_err(|e| e.to_string())?;
    println!("Archivo JSON creado en: {}", json_path.display());
    Ok(())
}

#[tauri::command]
pub async fn save_version_to_file(app_handle: AppHandle, version: Version) -> Result<(), String> {
    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| format!("Error al obtener config_dir: {}", e))?;
    let json_path = config_dir.join("versiones_wow.json");

    let mut versions: Vec<Version> = if json_path.exists() {
        let data = fs::read_to_string(&json_path).await.map_err(|e| e.to_string())?;
        serde_json::from_str(&data).unwrap_or_else(|_| vec![])
    } else {
        vec![]
    };

    versions.push(version);

    let data = serde_json::to_string_pretty(&versions).map_err(|e| e.to_string())?;
    fs::write(&json_path, data).await.map_err(|e| e.to_string())?;

    println!("Versión guardada correctamente.");
    Ok(())
}

#[tauri::command]
pub async fn get_all_versions(app_handle: AppHandle) -> Result<Vec<Version>, String> {
    let config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| format!("Error al obtener config_dir: {}", e))?;
    let json_path = config_dir.join("versiones_wow.json");

    if !json_path.exists() {
        return Ok(vec![]);
    }

    let data = fs::read_to_string(&json_path)
        .await
        .map_err(|e| e.to_string())?;
    let versions: Vec<Version> =
        serde_json::from_str(&data).unwrap_or_else(|_| vec![]);

    Ok(versions)
}
