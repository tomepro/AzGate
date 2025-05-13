use reqwest;
use serde::{Deserialize, Serialize};
use serde_json;
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct ResetPasswordRequest {
    password: String,
    #[serde(rename = "passwordConfirm")]
    password_confirm: String,
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
pub async fn reset_password(token: String, password: String, password_confirm: String) -> Result<serde_json::Value, String> {
    // Construct the API URL with the token parameter
    let api_url = env::var("API_URL")
        .map_err(|err| err.to_string())?
        + &format!("/auth/resetPassword/{}", token);

    let client = reqwest::Client::new();
    let reset_request = ResetPasswordRequest {
        password,
        password_confirm,
    };

    let res = client
        .patch(&api_url)
        .json(&reset_request)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    // Log the raw response for debugging
    let raw_body = res
        .text()
        .await
        .map_err(|e| format!("Failed to read response body: {}", e))?;

    // Attempt to parse the response as PasswordResetResult
    let parsed: PasswordResetResult = serde_json::from_str(&raw_body).map_err(|e| {
        format!(
            "Failed to decode response: {}\nRaw response: {}",
            e, raw_body
        )
    })?;

    // Convert the parsed result to serde_json::Value
    let json_value = serde_json::to_value(&parsed).map_err(|e| e.to_string())?;

    Ok(json_value)
}