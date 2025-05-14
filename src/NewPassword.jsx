import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguagePopup from "./components/languagePopup";
import("./NewPassword.css");
import Titlebar from "./components/Titlebar";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';

function NewPasswordScreen() {
  const { t } = useTranslation("common");

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  async function resetPassword() {
    try {
      const response = await invoke("reset_password", { token, password, passwordConfirm });
      console.log(response);
      setPopupMessage(response.message[0] || t("passwordResetSuccess"));
      setPopupOpen(true);
    } catch (error) {
      console.log(error)
      setPopupMessage(t("passwordResetError") || "Failed to reset Password");
      setPopupOpen(true);
    }
  }

  return (
    <main className="containerNewPassword">
      <Titlebar/>
      <div className="recoveryBoxNewPass backdrop-blur-md">
        <p className="recoveryBoxTitleNewPass">{t("resetPassword")}</p>
        <div className="formDiv">
          <form
          onSubmit={(e) => {
              e.preventDefault();
              resetPassword();
            }}>
            <input type="text" placeholder={t("codverificacion")} id="codverificacion" onChange={(e) => setToken(e.currentTarget.value)}/>
            <input type="password" placeholder={t("newPassword")} id="newPassword" onChange={(e) => setPassword(e.currentTarget.value)}/>
            <input type="password" placeholder={t("confirmNewPassword")} id="confirmNewPassword" onChange={(e) => setPasswordConfirm(e.currentTarget.value)}/>
            <button type="submit" className="confirmNewPass">{t("send")}</button><br></br>
          </form>
          <div className="recoveryBackDiv">
            <Link to="/passwdRecoveryScreen">{t("back")}</Link>
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

export default NewPasswordScreen;
