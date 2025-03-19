import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./PasswdRecoveryScreen.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { Link } from "react-router-dom";
import LanguagePopup from "./components/languagePopup";

function RegisterScreen() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const { t } = useTranslation("common");
  const navigate = useNavigate(); // Inicializa useNavigate

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  const handleLoginClick = () => { // Función para manejar el clic en "Iniciar sesión"
    navigate('/');
  };

  return (
    <main className="container">
      <LanguagePopup/>
      <div className="registerBox backdrop-blur-md">
        <p className="registerBoxTitle">{t("resetPassword")}</p>
        <div className="formDiv">
          <form>
            <input type="text" placeholder={t("email")} id="email" /><br></br>
            <button type="submit" className="resetPasswordButton">{t("send")}</button><br></br>
            <input type="text" placeholder={t("resetCode")} id="code" /><br></br>
            <button type="submit" className="validateCodeButton">{t("comprobate")}</button><br></br>
          </form>
          <div className="noAccountDiv">
            <Link to="/">{t("back")}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterScreen;