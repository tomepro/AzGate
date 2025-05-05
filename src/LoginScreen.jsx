import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  

  async function login() {
    finalMessage;
    try {
      setLoading(true);
      const message = await invoke('log_in_request', { username, password });
      console.log(message)
      setFinalMessage(message); // Save message to state
      if (rememberMe) {
        console.log("saving jwt");
        
        try {
          await invoke('save_jwt', { jwt: message.token })
        } catch (error) {
          console.log("error saving jwt " + error)
        }
      }
      if (message.status === "success") {
        window.location.replace("/home");
<<<<<<< HEAD
        localStorage.setItem("token", message.token); // Guardamos el JWT
        localStorage.setItem("username", message.account.username); // Guardamos el username
=======
        console.log("success");
>>>>>>> 614497b01078204c61c6483cfd7316dc603a849e
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchJWT() {
      try {
        const storedJwt = await invoke('get_jwt');
        console.log("JWT from backend:", storedJwt);
        setJWT(storedJwt);
  
        // Only try login if JWT exists
        if (storedJwt && storedJwt !== "") {
          const jwtLoginMessage = await invoke("jwt_login", { jwt: storedJwt });
          console.log("JWT login message:", jwtLoginMessage);
          if (jwtLoginMessage.status === "success") {
            window.location.replace("/home");
          }
        }
      } catch (error) {
        console.error("Error fetching JWT:", error);
      }
    }
  
    fetchJWT(); // Call the async function
  }, []); // Runs once after initial render

  return (
    <main className="containerLoginScreen">
      <Titlebar/>
      <LanguagePopup/>
      <LoaderSpinner visible={loading} />
      <div className="loginBox">
        <p className="loginBoxTitle">{t("login")}</p>
        <div className="formDiv">
          <form
            onSubmit={
              (e) => {
                e.preventDefault();
                login();
              }
            }
          >
            <input type="text" placeholder={t("username")} id="username" onChange={(e) => setName(e.currentTarget.value)} />
            <input type="password" placeholder={t("password")} id="password" onChange={(e) => setPassword(e.currentTarget.value)} />
            <div className="formLabels">
              <div className="checkboxDiv"><input type="checkbox" checked={rememberMe} onChange={(e) => setIsChecked(!rememberMe)}/> <label className="checkboxLabel">{t("rememberme")}</label></div>
              <div className="forgotDiv"><Link to="/passwdRecoveryScreen">{t("forgotpasswd")}</Link></div>
            </div>
            <button type="submit" className="loginButton">{t("login_button")}</button>
          </form>
          <div className="noAccountDiv">
            <p>{t("dontHaveAnAccount")}</p>
            <Link to="/registerScreen">{t("signup")}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginScreen;