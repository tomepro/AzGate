use std::fs;
use std::path::Path;
use std::io::{Read, Write};

/// Construye la ruta completa al archivo Config.wtf dado el path del ejecutable del juego.
///
/// Si el `game_path` es un archivo (el ejecutable), toma su directorio padre.
/// Si el `game_path` es un directorio, lo usa directamente.
fn get_config_wtf_path(game_path: &str) -> Result<String, String> {
    let path = Path::new(game_path);

    // Determina el directorio base del juego
    let base_dir = if path.is_file() {
        path.parent()
            .ok_or_else(|| "No se pudo obtener el directorio padre del ejecutable del juego".to_string())?
    } else if path.is_dir() {
        path
    } else {
        return Err(format!("La ruta del juego '{}' no es un archivo ni un directorio válido", game_path));
    };

    let wtf_folder = base_dir.join("WTF");
    let config_wtf_file = wtf_folder.join("Config.wtf");

    // Convertir la ruta a una cadena segura
    Ok(config_wtf_file.to_string_lossy().into_owned())
}

/// Lee el contenido del archivo Config.wtf.
///
/// Recibe la ruta del ejecutable del juego y devuelve el contenido del archivo
/// Config.wtf como una cadena de texto.
#[tauri::command]
pub fn read_config_wtf(game_path: String) -> Result<String, String> {
    let config_path = get_config_wtf_path(&game_path)?;
    fs::read_to_string(&config_path).map_err(|e| {
        format!("Error al leer el archivo Config.wtf en '{}': {}", config_path, e)
    })
}

/// Escribe el contenido en el archivo Config.wtf.
///
/// Recibe la ruta del ejecutable del juego y el nuevo contenido como una cadena de texto.
/// Sobrescribe el archivo Config.wtf con el contenido proporcionado.
#[tauri::command]
pub fn write_config_wtf(game_path: String, content: String) -> Result<(), String> {
    let config_path = get_config_wtf_path(&game_path)?;
    fs::write(&config_path, content).map_err(|e| {
        format!("Error al escribir en el archivo Config.wtf en '{}': {}", config_path, e)
    })
}