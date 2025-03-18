import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./LoginScreen.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguagePopup from "./components/languagePopup";

function LoginScreen() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const { t } = useTranslation("common");

  return (
    <main className="container">
      <LanguagePopup/>
      <div className="loginBox backdrop-blur-md">
        <p className="loginBoxTitle">{t("login")}</p>
        <div className="formDiv">
          <form>
            <input type="text" placeholder={t("username")} id="username" />
            <input type="password" placeholder={t("password")} id="password" />
            <div className="formLabels">
              <div className="checkboxDiv"><input type="checkbox" /> <label className="checkboxLabel">{t("rememberme")}</label></div>
              <div className="forgotDiv"><a href="#">{t("forgotpasswd")}</a></div>
            </div>
            <button type="submit" className="loginButton">{t("login_button")}</button>
          </form>
          <div className="noAccountDiv">
            <p>{t("dontHaveAnAccount")}</p>
            <Link to="/RegisterScreen">{t("signup")}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginScreen;