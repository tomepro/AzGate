import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguagePopup from "./components/languagePopup";
import "./PasswdRecoveryScreen.css";
import Titlebar from "./components/Titlebar";
import { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { invoke } from '@tauri-apps/api/core';

function RegisterScreen() {
  const { t } = useTranslation("common");

  const [email, setEmail] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  async function sendPasswordEmail() {
    try {
      const response = await invoke("send_password_email", { email });
      console.log(response);
      setPopupMessage(response.message[0] || t("emailSentSuccess"));
      setPopupOpen(true);
    } catch (error) {
      console.log(error)
      setPopupMessage(t("emailSentError") || "Failed to send email");
      setPopupOpen(true);
    }
  }

  return (
    <main className="containerPasswdRecovery">
      <Titlebar />
      <div className="recoveryBox backdrop-blur-md">
        <p className="recoveryBoxTitle">{t("resetPassword")}</p>
        <div className="formDiv">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendPasswordEmail();
            }}
          >
            <input
              type="text"
              placeholder={t("email")}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <br />
            <button type="submit" className="sendEmailButton">
              {t("send")}
            </button>
            <br />
          </form>
          <div className="recoveryBackDiv">
            <Link to="/newPassword">{t("tengoCodigo")}</Link>
            <br />
            <br />
            <Link to="/">{t("back")}</Link>
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