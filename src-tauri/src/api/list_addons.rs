use std::fs;
use std::process::Command;
use std::path::Path;
use std::io::Cursor;
use zip::ZipArchive;

#[tauri::command]
pub fn unzip_and_move(zip_bytes: Vec<u8>, dest_path: String) -> Result<(), String> {
    let dest_path = Path::new(&dest_path);

    if !dest_path.exists() {
        return Err(format!("La ruta destino '{}' no existe", dest_path.display()));
    }
    if !dest_path.is_dir() {
        return Err(format!("La ruta destino '{}' no es un directorio", dest_path.display()));
    }

    let cursor = Cursor::new(zip_bytes);
    let mut zip = ZipArchive::new(cursor).map_err(|e| format!("Error abriendo ZIP: {}", e))?;

    for i in 0..zip.len() {
        let mut file = zip.by_index(i).map_err(|e| format!("Error leyendo archivo ZIP: {}", e))?;
        let outpath = dest_path.join(file.sanitized_name());

        if file.name().ends_with('/') {
            // Es directorio, crear si no existe
            fs::create_dir_all(&outpath).map_err(|e| format!("Error creando directorio: {}", e))?;
        } else {
            // Archivo, crear directorio padre si no existe y copiar contenido
            if let Some(p) = outpath.parent() {
                if !p.exists() {
                    fs::create_dir_all(p).map_err(|e| format!("Error creando directorio padre: {}", e))?;
                }
            }
            let mut outfile = fs::File::create(&outpath).map_err(|e| format!("Error creando archivo: {}", e))?;
            std::io::copy(&mut file, &mut outfile).map_err(|e| format!("Error copiando archivo: {}", e))?;
        }
    }

    Ok(())
}



#[tauri::command]
pub fn open_folder(path: String) -> Result<(), String> {
    // En Windows
    if let Err(e) = Command::new("explorer").arg(path).spawn() {
        return Err(format!("No se pudo abrir la carpeta: {}", e));
    }
    Ok(())
}


#[tauri::command]
pub fn list_addons(path: String) -> Result<Vec<String>, String> {
    match fs::read_dir(&path) {
        Ok(entries) => {
            let mut names = Vec::new();
            for entry in entries.flatten() {
                if let Some(name) = entry.file_name().to_str() {
                    names.push(name.to_string());
                }
            }
            Ok(names)
        }
        Err(e) => Err(format!("Error leyendo directorio: {}", e)),
    }
}

