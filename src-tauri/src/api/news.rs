use reqwest;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct NewsItem {
    id: u32,
    created_at: String,
    title: String,
    #[serde(rename = "type")]
    item_type: u32, // Usamos otro nombre para evitar confusión con la palabra clave 'type'
    image: String,
    author: String,
    text: String,
}

#[tauri::command]
pub async fn fetch_news() -> Result<Vec<NewsItem>, String> {
    let api_url = env::var("API_URL").map_err(|err| err.to_string())? + "/world/news"; // Ajusta la ruta a "/world/news" o la correcta para tu API

    let res = reqwest::get(&api_url).await.map_err(|e| e.to_string())?;
    let parsed = res
        .json::<Vec<NewsItem>>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(parsed)
}
