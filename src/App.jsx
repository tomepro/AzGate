import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { useTranslation } from "react-i18next";
import LanguagePopup from "./components/languagePopup";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const { t } = useTranslation("common");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">
      <LanguagePopup />
      <div className="loginBox backdrop-blur-md">
        <p className="loginBoxTitle">{t("login")}</p>
        <div className="formDiv">
          <form>
            <input type="text" placeholder={t("username")} id="username"></input>
            <input type="text" placeholder={t("password")} id="password"></input><br/>
            <div className="formLabels">
              <div className="checkboxDiv"><input type="checkbox"/> <label className="checkboxLabel">{t("rememberme")}</label></div>
              <div className="forgotDiv"><a href="#">{t("forgotpasswd")}</a></div>
            </div>
            <button type="submit" className="loginButton">{t("login_button")}</button>
          </form>
          <div className="noAccountDiv">
            <p>{t("dontHaveAnAccount")}</p><a href="#">{t("signup")}</a>
            </div>
        </div>
      </div>
    </main>
    
  );
}

export default App;
