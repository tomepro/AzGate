import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguagePopup from "./components/languagePopup";
import("./NewPassword.css");
import Titlebar from "./components/Titlebar";

function NewPasswordScreen() {
  const { t } = useTranslation("common");

  return (
    <main className="containerNewPassword">
      <Titlebar/>
      <LanguagePopup/>
      <div className="recoveryBoxNewPass backdrop-blur-md">
        <p className="recoveryBoxTitleNewPass">{t("resetPassword")}</p>
        <div className="formDiv">
          <form>
            <input type="password" placeholder={t("codverificacion")} id="codverificacion" />
            <input type="password" placeholder={t("newPassword")} id="newPassword" />
            <input type="password" placeholder={t("confirmNewPassword")} id="confirmNewPassword" />
            <button type="submit" className="confirmNewPass">{t("send")}</button><br></br>
          </form>
          <div className="recoveryBackDiv">
            <Link to="/passwdRecoveryScreen">{t("back")}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NewPasswordScreen;
