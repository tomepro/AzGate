use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;
use dotenvy::dotenv;
use std::env;

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
#[serde(untagged)] // Allows handling multiple response types
enum AuthResponse {
    Success {
        status: String,
        token: String,
        account: Account,
    },
    Error {
        status_code: u16,
        message: Vec<String>,
        error: String,
    },
}

#[derive(Debug, Deserialize)]
struct Account {
    id: u32,
    username: String,
    reg_mail: String,
}

#[derive(Serialize)]
struct RegisterRequest {
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    phone: String,
    passwordConfirm: String,
    email: String
}

#[tauri::command]
pub async fn register_user(username: String, password: String, firstName: String, lastName: String, passwordConfirm: String, email:String) -> Result<serde_json::Value, String>{
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
        email
    };
    let api_url = env::var("API_URL").map_err(|err| err.to_string())? + "/auth/signup";

    let response = client
        .post(&api_url)
        .json(&register_data)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let body = response.json::<AuthResponse>().await.map_err(|err| err.to_string())?;
    match body {
        AuthResponse::Success { token, account, .. } => {
            Ok(json!({
                "status": "success",
                "token": token,
                "account": {
                    "id": account.id,
                    "username": account.username,
                    "reg_mail": account.reg_mail
                }
            }))
        }
        AuthResponse::Error { message, .. } => {
            Ok(json!({
                "status": "error",
                "message": message.join(", ")
            }))
        }
    }
}