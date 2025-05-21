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
  const [started, setStarted] = useState(false);
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

// async function trySetPresence(maxRetries = 5) {
//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       console.log(`Attempt ${attempt} to set Rich Presence...`);
//       const result = invoke("set_rich_presence", { stateText: "default" });
//       console.log("Rich Presence set:", result);
//       return;
//     } catch (e) {
//       console.warn(`Attempt ${attempt} failed: ${e}`);
//       await new Promise((r) => setTimeout(r, 1000)); // Wait 1 sec before retry
//     }
//   }
//   console.error("All attempts to set Rich Presence failed.");
// }

// async function startDiscordRPC() {
//   await invoke("start_discord");
// }

// useEffect(() => {
//   startDiscordRPC();
// }, []); 

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

    const fondoMap = [
      { key: 'fondo-ancestros', check: () => esEntre(hoy, 1, 23, 2, 5) },
      { key: 'fondo-enamorados', check: () => esEntre(hoy, 2, 7, 2, 20) },
      { key: 'fondo-pascua', check: () => esEntre(hoy, 4, 12, 4, 18) },
      { key: 'fondo-ninos', check: () => esEntre(hoy, 4, 30, 5, 6) },
      { key: 'fondo-solsticio', check: () => esEntre(hoy, 6, 21, 7, 4) },
      // { key: 'fondo-solsticio', check: () => esEntre(hoy, 3, 19, 7, 4) },
      { key: 'fondo-piratas', check: () => hoy.getMonth() + 1 === 9 && hoy.getDate() === 19 },
      { key: 'fondo-cerveza', check: () => esEntre(hoy, 9, 20, 10, 5) },
      { key: 'fondo-halloween', check: () => esEntre(hoy, 10, 18, 10, 31) },
      { key: 'fondo-muertos', check: () => esEntre(hoy, 11, 1, 11, 2) },
      { key: 'fondo-pelegrino', check: () => esEntre(hoy, 11, 22, 11, 28) },
      { key: 'fondo-navidad', check: () =>
      (hoy.getMonth() + 1 === 12 && hoy.getDate() >= 15) ||
      (hoy.getMonth() + 1 === 1 && hoy.getDate() <= 2)
      },
    ];

    const found = fondoMap.find(f => f.check());
    setClaseFondo(found ? found.key : 'fondo-df-molino');
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