use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;
use dotenvy::dotenv;
use std::env;

#[derive(Serialize)]
struct AuthRequest {
    username: String,
    password: String,
}

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
#[serde(untagged)] // Allows handling multiple response types
enum JWTAuthResponse {
    Success {
        status: String,
    },
    Error {
        status_code: u16,
        message: Vec<String>,
        error: String,
    }
}

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

#[tauri::command]
pub async fn log_in_request(username: String, password: String) -> Result<serde_json::Value, String> {
    dotenv().ok();
    let client = Client::new();

    let login_data = AuthRequest {
        username,
        password,
    };
    
    
    let api_url = env::var("API_URL").map_err(|err| err.to_string())? + "/auth/signin";

    let response = client
        .post(&api_url)
        .json(&login_data)
        .send()
        .await
        .map_err(|err| err.to_string())?;
    
    #[allow(unused_variables)]
    let status = response.status();
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


#[tauri::command]
pub async fn jwt_login(jwt: String) -> Result<serde_json::Value, String>{
    dotenv().ok();
    let client = Client::new();
    let token_header =  "Bearer ".to_string() + &jwt;
    let api_url = env::var("API_URL").map_err(|err| err.to_string())? + "/auth/me";
    let response = client
        .get(&api_url)
        .header("Authorization", token_header)
        .send()
        .await
        .map_err(|err| err.to_string())?;
    let body = response.json::<JWTAuthResponse>().await.map_err(|err| err.to_string())?;

    match body {
        #[allow(unused_variables)]
        JWTAuthResponse::Success { status, .. } => {
            Ok(json!({
                "status": "success"
            }))
        }
        JWTAuthResponse::Error { message, .. } => {
            Ok(json!({
                "status": "error",
                "message": message.join(", ")
            }))
        }
    }
}