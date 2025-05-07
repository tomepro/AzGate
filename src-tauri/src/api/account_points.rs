use reqwest;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Response {
    coins: u32,
    points: u32,
}

#[tauri::command]
pub async fn fetch_coins(token: String) -> Result<Response, String> {
    // Recupera la URL de la API desde el archivo .env
    let api_url =
        std::env::var("API_URL").map_err(|err| err.to_string())? + "/auth/wallet";

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
        .json::<Response>()
        .await
        .map_err(|e| format!("Error al parsear JSON: {}", e))?;

    // Devuelve la respuesta parseada
    Ok(parsed)
}
