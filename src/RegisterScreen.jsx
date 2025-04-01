import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguagePopup from "./components/languagePopup";
import './RegisterScreen.css';
import Titlebar from "./components/Titlebar";

function RegisterScreen() {
  const { t } = useTranslation("common");

  return (
    <main className="containerRegisterScreen">
      <Titlebar/>
      <LanguagePopup/>
      <div className="registerBox backdrop-blur-md">
        <p className="registerBoxTitle">{t("register")}</p>
        <div className="formDiv">
          <form>
            <input type="text" placeholder={t("name")} id="name" />
            <input type="text" placeholder={t("surname")} id="surname" />
            <input type="text" placeholder={t("username")} id="username" />
            <input type="text" placeholder={t("email")} id="email" />
            <input type="password" placeholder={t("password")} id="password" />
            <input type="password" placeholder={t("cpasswd")} id="cpasswd" /><br />
            <button type="submit" className="registerButton">{t("register_button")}</button>
          </form>
          <div className="noAccountDiv">
            <p>{t("alreadyHaveAnAccount")}</p>
            <Link to="/">{t("login")}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterScreen;