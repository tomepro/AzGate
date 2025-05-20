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

const [claseFondo, setClaseFondo] = useState('');

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

  useEffect(() => {
    const hoy = new Date();

    const esEntre = (fecha, inicioMes, inicioDia, finMes, finDia) => {
      const anio = fecha.getFullYear();
      const inicio = new Date(anio, inicioMes - 1, inicioDia);
      const fin = new Date(anio, finMes - 1, finDia);
      if (fin < inicio) {
        if (fecha >= inicio) return true;
        const inicioProxAnio = new Date(anio + 1, inicioMes - 1, inicioDia);
        const finProxAnio = new Date(anio + 1, finMes - 1, finDia);
        return fecha >= new Date(anio, 0, 1) && fecha <= finProxAnio;
      } else {
        return fecha >= inicio && fecha <= fin;
      }
    };

    if (esEntre(hoy, 1, 23, 2, 5)) {
      setClaseFondo('fondo-ancestros');
    } else if (esEntre(hoy, 2, 7, 2, 20)) {
      setClaseFondo('fondo-enamorados');
    } else if (esEntre(hoy, 4, 12, 4, 18)) {
      setClaseFondo('fondo-pascua');
    } else if (esEntre(hoy, 4, 30, 5, 6)) {
      setClaseFondo('fondo-ninos');
    } else if (esEntre(hoy, 6, 21, 7, 4)) {
      setClaseFondo('fondo-solsticio');
    // } else if (esEntre(hoy, 3, 19, 7, 4)) {
    //   setClaseFondo('fondo-solsticio');
    } else if (hoy.getMonth() + 1 === 9 && hoy.getDate() === 19) {
      setClaseFondo('fondo-piratas');
    } else if (esEntre(hoy, 9, 20, 10, 5)) {
      setClaseFondo('fondo-cerveza');
    } else if (esEntre(hoy, 10, 18, 10, 31)) {
      setClaseFondo('fondo-halloween');
    } else if (esEntre(hoy, 11, 1, 11, 2)) {
      setClaseFondo('fondo-muertos');
    } else if (esEntre(hoy, 11, 22, 11, 28)) {
      setClaseFondo('fondo-pelegrino');
    } else if (
      (hoy.getMonth() + 1 === 12 && hoy.getDate() >= 15) ||
      (hoy.getMonth() + 1 === 1 && hoy.getDate() <= 2)
    ) {
      setClaseFondo('fondo-navidad');
    } else {
      setClaseFondo('fondo-df-molino'); // clase por defecto sin fondo
    }
  }, []);

  return (
    // <main className="containerLoginScreen">
    <main className={`containerLoginScreen ${claseFondo}`}>
      <Titlebar />
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