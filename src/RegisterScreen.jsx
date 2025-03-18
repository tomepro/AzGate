import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./RegisterScreen.css";
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
        <p className="registerBoxTitle">{t("register")}</p>
        <div className="formDiv">
          <form>
            <input type="text" placeholder={t("name")} id="name" />
            <input type="text" placeholder={t("surname")} id="surname" />
            <input type="text" placeholder={t("username")} id="username" />
            <input type="email" placeholder={t("email")} id="email" />
            <input type="password" placeholder={t("password")} id="password" />
            <input type="password" placeholder={t("cpasswd")} id="cpasswd" /><br />
            <button type="submit" className="registerButton">{t("register_button")}</button>
          </form>
          <div className="noAccountDiv">
            <Link to="/">{t("login")}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterScreen;