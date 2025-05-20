use reqwest;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct Ticket {
    id: u32,
    #[serde(rename = "type")]
    ticket_type: u32,
    name: String,
    description: String,
    #[serde(rename = "createTime")]
    create_time: u64,
    response: String,
    completed: u32,
    race: u32,
    gender: u32
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TicketResponse {
    gm: bool,
    tickets: Vec<Ticket>,
}

#[tauri::command]
pub async fn fetch_tickets(token: String) -> Result<TicketResponse, String> {
    let api_url = env::var("API_URL").map_err(|err| err.to_string())? + "/characters/tickets";

    let client = reqwest::Client::new();
    let res = client
        .get(&api_url)
        .bearer_auth(token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let parsed = res
        .json::<TicketResponse>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(parsed)
}


#[tauri::command]
pub async fn complete_ticket(ticketId: u32, token: String) -> Result<String, String> {
    let api_url = format!(
        "{}{}{}",
        env::var("API_URL").map_err(|e| e.to_string())?,
        "/characters/tickets/complete/",
        ticketId
    );

    let client = reqwest::Client::new();
    let res = client
        .patch(&api_url)
        .bearer_auth(token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if res.status().is_success() {
        let response_text = res.text().await.map_err(|e| e.to_string())?;
        Ok(response_text)
    } else {
        Err(format!("Failed to complete ticket: {}", res.status()))
    }
}

#[tauri::command]
pub async fn update_ticket_response(ticketId: u32, responseMsg: String, token: String) -> Result<String, String> {
    let api_url = format!(
        "{}{}{}",
        env::var("API_URL").map_err(|e| e.to_string())?,
        "/characters/tickets/response/",
        ticketId
    );

    let client = reqwest::Client::new();
    let res = client
        .patch(&api_url)
        .bearer_auth(token)
        .json(&json!({ "response": responseMsg }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if res.status().is_success() {
        let response_text = res.text().await.map_err(|e| e.to_string())?;
        Ok(response_text)
    } else {
        Err(format!("Failed to update ticket: {}", res.status()))
    }
}

#[tauri::command]
pub async fn delete_ticket(ticketId: u32, token: String) -> Result<String, String> {
    let api_url = format!(
        "{}{}{}",
        env::var("API_URL").map_err(|e| e.to_string())?,
        "/characters/tickets/",
        ticketId
    );

    let client = reqwest::Client::new();
    let res = client
        .delete(&api_url)
        .bearer_auth(token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if res.status().is_success() {
        let response_text = res.text().await.map_err(|e| e.to_string())?;
        Ok(response_text)
    } else {
        Err(format!("Failed to delete ticket FROM RUST: {}", res.status()))
    }
}