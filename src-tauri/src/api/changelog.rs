//use reqwest;
//use serde::Deserialize;

// #[derive(Debug, Deserialize)]
// struct Response {
//     id: u32,
//     created_at: String,
//     text: String,
// }

// #[tokio::main]
// async fn main() -> Result<(), Box<dyn std::error::Error>> {
//     //let url = format!("http://azgate.com:3000/world/changelog");
//     let api_url = env::var("API_URL").map_err(|err| err.to_string())? + "/world/changelog";
//     let resp = reqwest::get(api_url)
//         .await?
//         .json::<Response>()
//         .await?;
//     // Iterate and print details
//     println!("{}",resp.id);
//     println!("{}",resp.created_at);
//     println!("{}",resp.text);
//     Ok(())
// }

use reqwest;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct Response {
    id: u32,
    created_at: String,
    text: String,
}

#[tauri::command]
pub async fn fetch_changelog() -> Result<Response, String> {
    //let api_url = env::var("API_URL").unwrap_or_else(|_| "http://azgate.com:3000".into()) + "/world/changelog";
    let api_url = env::var("API_URL").map_err(|err| err.to_string())? + "/world/changelog";

    let res = reqwest::get(&api_url).await.map_err(|e| e.to_string())?;
    let parsed = res.json::<Response>().await.map_err(|e| e.to_string())?;

    Ok(parsed)
}
