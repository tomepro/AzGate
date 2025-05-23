import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguagePopup from "./components/languagePopup";
import './RegisterScreen.css';
import Titlebar from "./components/Titlebar";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { message } from "@tauri-apps/plugin-dialog";

function RegisterScreen() {
  const { t } = useTranslation("common");

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFN] = useState("");
  const [lastName, setLN] = useState("");
  const [passwordConfirm, setPC] = useState("");
  const [email, setEmail] = useState("");

  const [finalMessage, setFinalMessage] = useState(null);
  async function register() {
    finalMessage;
    try {
      const message = await invoke('register_user', { username, password, firstName, lastName, passwordConfirm, email });
      console.log(message)
      setFinalMessage(message); // Save message to state
      setPopupMessage(t(message.message));
      setPopupOpen(true);
  
      if (message.status === "success") {
        setPopupMessage(t("success_register"));
        setPopupOpen(true);
        window.location.replace("/");
      }
    } catch (error) {
      console.error(error);
      setPopupMessage(t(message.message));
      setPopupOpen(true);

    } finally {
    }
  }

  return (
    <main className="containerRegisterScreen">
      <Titlebar/>
      <div className="registerBox backdrop-blur-md">
        <p className="registerBoxTitle">{t("register")}</p>
        <div className="formDiv">
          <form
            onSubmit={
              (e) => {
                e.preventDefault();
                register();
              }
            }
          >
            <input type="text" placeholder={t("name")} id="firstName" onChange={(e) => setFN(e.currentTarget.value)}/>
            <input type="text" placeholder={t("surname")} id="lastName" onChange={(e) => setLN(e.currentTarget.value)}/>
            <input type="text" placeholder={t("username")} id="username" onChange={(e) => setName(e.currentTarget.value)}/>
            <input type="text" placeholder={t("email")} id="email" onChange={(e) => setEmail(e.currentTarget.value)}/>
            <input type="password" placeholder={t("password")} id="password" onChange={(e) => setPassword(e.currentTarget.value)}/>
            <input type="password" placeholder={t("cpasswd")} id="passwordConfirm" onChange={(e) => setPC(e.currentTarget.value)}/><br />
            <button type="submit" className="registerButton">{t("register_button")}</button>
          </form>
          <div className="noAccountDiv">
            <p>{t("alreadyHaveAnAccount")}</p>
            <Link to="/">{t("login")}</Link>
          </div>
        </div>
      </div>
      <Popup
                    open={popupOpen}
                    onClose={() => setPopupOpen(false)}
                    modal
                    closeOnDocumentClick
                  >
                    <div className="pwrs-popup-content">
                      <p>{popupMessage}</p>
                      <button onClick={() => setPopupOpen(false)}>{t("close")}</button>
                    </div>
                  </Popup>
    </main>
  );
}

export default RegisterScreen;