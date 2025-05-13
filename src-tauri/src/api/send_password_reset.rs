use reqwest;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct ResetPasswordStruct {
    email: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PasswordResetResponse {
    status: String,
    message: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PasswordResetError {
    #[serde(rename = "statusCode")]
    status_code: i32,
    message: Vec<String>,
    error: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
enum PasswordResetResult {
    Success(PasswordResetResponse),
    Error(PasswordResetError),
}

#[tauri::command]
pub async fn send_password_email(email: String) -> Result<serde_json::Value, String> {
    let api_url = env::var("API_URL").map_err(|err| err.to_string())? + "/auth/forgotPassword";

    let client = reqwest::Client::new();
    let reset_struct = ResetPasswordStruct { email };

    let res = client
        .post(&api_url)
        .json(&reset_struct)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    // Log the raw response for debugging
    let raw_body = res
        .text()
        .await
        .map_err(|e| format!("Failed to read response body: {}", e))?;
    
    // Attempt to parse the response as PasswordResetResult
    let parsed: PasswordResetResult = match serde_json::from_str(&raw_body) {
        Ok(result) => result,
        Err(e) => {
            // Log the raw body and error for debugging
            return Err(format!(
                "Failed to decode response: {}\nRaw response: {}",
                e, raw_body
            ));
        }
    };

    // Convert the parsed result to serde_json::Value
    let json_value = serde_json::to_value(&parsed).map_err(|e| e.to_string())?;

    Ok(json_value)
}