use reqwest;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct ShopItem {
    id: u32,
    title: String,
    price: String,
    wowhead_link: String,
    data_wowhead: Option<String>, // Puede ser null en el JSON
    icon_link: String,
    active: u32,
    #[serde(rename = "isVoteItem")]
    is_vote_item: u32,
}

#[tauri::command]
pub async fn fetch_shop_items() -> Result<Vec<ShopItem>, String> {
    let api_url = env::var("API_URL").map_err(|err| err.to_string())? + "/shop/"; // Usamos el endpoint "/shop/"

    let res = reqwest::get(&api_url).await.map_err(|e| e.to_string())?;
    let parsed = res
        .json::<Vec<ShopItem>>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(parsed)
}