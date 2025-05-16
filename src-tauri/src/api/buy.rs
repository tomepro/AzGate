use reqwest;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct PurchaseResponse {
    pub message: Option<String>,
    pub status_code: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct BuyItemPayload {
    pub characterId: u32,
}

#[tauri::command]
pub async fn buy_shop_item(id: u32, characterId: u32, token: String) -> Result<PurchaseResponse, String> {
    let api_url = env::var("API_URL").map_err(|err| err.to_string())? + "/shop/buy/" + &id.to_string();

    let client = reqwest::Client::new();
    println!("{}", characterId);
    let payload = BuyItemPayload { characterId : characterId };
    println!("{}", payload.characterId);
    let res = client
        .post(&api_url)
        .bearer_auth(token)
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Error al enviar la petición de compra: {}", e))?;

    let parsed = res
        .json::<PurchaseResponse>()
        .await
        .map_err(|e| format!("Error al parsear la respuesta de compra: {}", e))?;

    Ok(parsed)
}