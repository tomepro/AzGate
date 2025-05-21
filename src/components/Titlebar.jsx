import { useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import styles from './styles/Titlebar.module.css';
import TitlebarLanguages from './TitlebarLanguages';

const Titlebar = () => {
  const version = localStorage.getItem("versionSelected") || "DEFAULT";

  const getImageForVersion = (version) => {
    if (!version) return "icons/default.webp";
    switch (version.toUpperCase()) {
      case "VA": return "icons/classic.webp";
      case "TBC": return "icons/tbc.webp";
      case "LK": return "icons/lk.webp";
      case "CATA": return "icons/cata.webp";
      case "MOP": return "icons/mop.webp";
      case "WOD": return "icons/wod.webp";
      case "LG": return "icons/lg.webp";
      case "BFA": return "icons/bfa.webp";
      case "SL": return "icons/sl.webp";
      case "DF": return "icons/df.webp";
      case "TWW": return "icons/tww.webp";
      case "DEFAULT":
      default: return "icons/default.webp";
    }
  };

  useEffect(() => {
    const appWindow = getCurrentWindow();

    const minimizeBtn = document.getElementById('titlebar-minimize');
    const closeBtn = document.getElementById('titlebar-close');
    const iconElement = document.getElementById("versionIcon");

    const minimizeHandler = () => appWindow.minimize();
    const closeHandler = () => appWindow.close();

    minimizeBtn?.addEventListener('click', minimizeHandler);
    closeBtn?.addEventListener('click', closeHandler);

    if (iconElement) {
      iconElement.src = getImageForVersion(version);
    }

    return () => {
      minimizeBtn?.removeEventListener('click', minimizeHandler);
      closeBtn?.removeEventListener('click', closeHandler);
    };
  }, [version]);

  return (
    <div className={styles.titlebar}>
      <img id="versionIcon" src="icons/default.webp" alt="Logo" className={styles.logo} />
      <div className={styles.buttonContainer}>
        <TitlebarLanguages />
        <button className={styles.button}>
          <a href="https://discord.gg/v8ye5XzVUV" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-discord"></i>
          </a>
        </button>
        <button id="titlebar-minimize" className={styles.button}>-</button>
        <button id="titlebar-close" className={styles.button}>x</button>
      </div>
    </div>
  );
};

export default Titlebar;
