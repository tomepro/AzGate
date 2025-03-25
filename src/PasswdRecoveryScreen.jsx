import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguagePopup from "./components/languagePopup";
import("./PasswdRecoveryScreen.css");

function RegisterScreen() {
  const { t } = useTranslation("common");

  return (
    <main className="containerPasswdRecovery">
      <LanguagePopup/>
      <div className="recoveryBox backdrop-blur-md">
        <p className="recoveryBoxTitle">{t("resetPassword")}</p>
        <div className="formDiv">
          <form>
            <input type="text" placeholder={t("email")} id="email" /><br></br>
            <button type="submit" className="sendEmailButton">{t("send")}</button><br></br>
          </form>
          <div className="recoveryBackDiv">
            <Link to="/">{t("back")}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterScreen;