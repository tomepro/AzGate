import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { Link } from "react-router-dom";
import LanguagePopup from "./components/languagePopup";
import LoaderSpinner from "./components/LoaderSpinner";
import './LoginScreen.css';
import Titlebar from "./components/Titlebar";

function LoginScreen() {
  const { t } = useTranslation("common");

  const [username, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalMessage, setFinalMessage] = useState(null);
  const [password, setPassword] = useState("");
  const [rememberMe, setIsChecked] = useState(false);
  const [jwt, setJWT] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  async function login() {
    try {
      setLoading(true);
      const message = await invoke("log_in_request", { username, password });
      console.log("Login response:", message);
      setFinalMessage(message);

      if (message.status === "success") {
        if (rememberMe) {
          console.log("Saving JWT");
          try {
            await invoke("save_jwt", { jwt: message.token });
          } catch (error) {
            console.log("Error saving JWT:", error);
          }
        }
        window.location.replace("/home");
        localStorage.setItem("token", message.token);
        localStorage.setItem("username", message.account.username);
        console.log("Login success");
      } else {
        // Show popup for non-success response
        setPopupMessage(
          message.message?.[0] || message.error || t("loginError") || "Login failed"
        );
        setPopupOpen(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setPopupMessage(t("loginError") || "An error occurred during login");
      setPopupOpen(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchJWT() {
      try {
        const storedJwt = await invoke("get_jwt");
        console.log("JWT from backend:", storedJwt);
        setJWT(storedJwt);

        if (storedJwt && storedJwt !== "") {
          const jwtLoginMessage = await invoke("jwt_login", { jwt: storedJwt });
          console.log("JWT login message:", jwtLoginMessage);
          if (jwtLoginMessage.status === "success") {
            window.location.replace("/home");
          } else {
            // Optionally show popup for JWT login failure
            setPopupMessage(
              jwtLoginMessage.message?.[0] ||
                jwtLoginMessage.error ||
                t("jwtLoginError") ||
                "JWT login failed"
            );
            setPopupOpen(true);
          }
        }
      } catch (error) {
        console.error("Error fetching JWT:", error);
        setPopupMessage(t("jwtLoginError") || "Failed to fetch JWT");
        setPopupOpen(true);
      }
    }

    fetchJWT();
  }, []);

  return (
    <main className="containerLoginScreen">
      <Titlebar />
      <LanguagePopup />
      <LoaderSpinner visible={loading} />
      <div className="loginBox">
        <p className="loginBoxTitle">{t("login")}</p>
        <div className="formDiv">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <input
              type="text"
              placeholder={t("username")}
              id="username"
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <input
              type="password"
              placeholder={t("password")}
              id="password"
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <div className="formLabels">
              <div className="checkboxDiv">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setIsChecked(!rememberMe)}
                />
                <label className="checkboxLabel">{t("rememberme")}</label>
              </div>
              <div className="forgotDiv">
                <Link to="/passwdRecoveryScreen">{t("forgotpasswd")}</Link>
              </div>
            </div>
            <button type="submit" className="loginButton">
              {t("login_button")}
            </button>
          </form>
          <div className="noAccountDiv">
            <p>{t("dontHaveAnAccount")}</p>
            <Link to="/registerScreen">{t("signup")}</Link>
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

export default LoginScreen;