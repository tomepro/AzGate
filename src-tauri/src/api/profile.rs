use serde::{Deserialize, Serialize};
use reqwest;

#[derive(Debug, Serialize, Deserialize)]
pub struct Response {
    guid: u32,
    name: String,
    race: u32,
    class: u32,
    gender: u32,
    level: u32,
    totaltime: u32,
}

#[tauri::command]
pub async fn fetch_profile(token: String) -> Result<Vec<Response>, String> {
    // Recupera la URL de la API desde el archivo .env
    let api_url = std::env::var("API_URL").map_err(|err| err.to_string())? + "/characters/accountCharacters";
    
    // Crea un cliente HTTP usando reqwest
    let client = reqwest::Client::new();

    // Realiza la petición GET, pasando el token en el header Authorization como Bearer
    let res = client
        .get(&api_url)
        .bearer_auth(token) // Aquí se añade el token en el header Authorization: Bearer <token>
        .send()
        .await
        .map_err(|e| format!("Error en la petición: {}", e))?;

    // Verifica si la respuesta es exitosa
    if !res.status().is_success() {
        return Err(format!("Error del servidor: {}", res.status()));
    }

    // Si la respuesta es exitosa, parsea el JSON recibido
    let parsed = res
        .json::<Vec<Response>>()
        .await
        .map_err(|e| format!("Error al parsear JSON: {}", e))?;

    // Devuelve la lista de respuestas parseadas
    Ok(parsed)
}
