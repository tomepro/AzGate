use std::env;
use serde::{Deserialize, Serialize};
use reqwest;

#[derive(Debug, Serialize, Deserialize)]
pub struct Response {
    realm: String,
    online: String,
    flag: u32
}

#[tauri::command]
pub async fn fetch_realms() -> Result<Vec<Response>, String> {
    let api_url = std::env::var("API_URL").map_err(|err| err.to_string())? + "/world/realms";
    let res = reqwest::get(&api_url).await.map_err(|e| e.to_string())?;
    let parsed = res.json::<Vec<Response>>().await.map_err(|e| e.to_string())?;

    Ok(parsed)
}

