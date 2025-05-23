use dotenvy::dotenv;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::env;

#[derive(Debug, Deserialize)]
struct Account {
    id: u32,
    username: String,
    reg_mail: String,
}

#[derive(Serialize)]
#[allow(non_snake_case)]
struct RegisterRequest {
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    phone: String,
    passwordConfirm: String,
    email: String,
}

#[tauri::command]
#[allow(non_snake_case)]
pub async fn register_user(
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    passwordConfirm: String,
    email: String,
) -> Result<serde_json::Value, String> {
    dotenv().ok();
    let client = Client::new();
    let phone = String::from("+78005553536");
    let register_data = RegisterRequest {
        username,
        password,
        firstName,
        lastName,
        phone,
        passwordConfirm,
        email,
    };
    let api_url = env::var("API_URL").map_err(|err| err.to_string())? + "/auth/signup";

    let response = client
        .post(&api_url)
        .json(&register_data)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    // Just deserialize to generic JSON value
    let body = response
        .json::<serde_json::Value>()
        .await
        .map_err(|err| err.to_string())?;

    Ok(body)
}