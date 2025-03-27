import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguagePopup from "./components/languagePopup";
import LoaderSpinner from "./components/LoaderSpinner";
import './LoginScreen.css';

function LoginScreen() {
  const { t } = useTranslation("common");

  const [username, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalMessage, setFinalMessage] = useState(null);
  const [password, setPassword] = useState("");

  async function login() {
    finalMessage;
    try {
      setLoading(true);
      const message = await invoke('log_in_request', { username, password });
      setFinalMessage(message); // Save message to state
  
      if (message.status === "success") {
        window.location.replace("/home");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="containerLoginScreen">
      <LanguagePopup/>
      <LoaderSpinner visible={loading} />
      <div className="loginBox">
        <p className="loginBoxTitle">{t("login")}</p>
        <div className="formDiv">
          <form
            onSubmit={
              (e) => {
                e.preventDefault();
                login();
              }
            }
          >
            <input type="text" placeholder={t("username")} id="username" onChange={(e) => setName(e.currentTarget.value)} />
            <input type="password" placeholder={t("password")} id="password" onChange={(e) => setPassword(e.currentTarget.value)} />
            <div className="formLabels">
              <div className="checkboxDiv"><input type="checkbox" /> <label className="checkboxLabel">{t("rememberme")}</label></div>
              <div className="forgotDiv"><Link to="/passwdRecoveryScreen">{t("forgotpasswd")}</Link></div>
            </div>
            <button type="submit" className="loginButton">{t("login_button")}</button>
          </form>
          <div className="noAccountDiv">
            <p>{t("dontHaveAnAccount")}</p>
            <Link to="/registerScreen">{t("signup")}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginScreen;