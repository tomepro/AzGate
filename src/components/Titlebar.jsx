import { useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import styles from './styles/Titlebar.module.css'; // Import the CSS module

const Titlebar = () => {
  useEffect(() => {
    const appWindow = getCurrentWindow();

    const minimizeBtn = document.getElementById('titlebar-minimize');
    const closeBtn = document.getElementById('titlebar-close');

    const minimizeHandler = () => appWindow.minimize();
    const closeHandler = () => appWindow.close();

    minimizeBtn?.addEventListener('click', minimizeHandler);
    closeBtn?.addEventListener('click', closeHandler);

    // Cleanup: Remove listeners when component unmounts
    return () => {
      minimizeBtn?.removeEventListener('click', minimizeHandler);;
      closeBtn?.removeEventListener('click', closeHandler);
    };
  }, []);

  return (
    <div className={styles.titlebar}>
      <img src={'./icons/classic.webp'} alt="Logo" className={styles.logo} />
      <div className={styles.buttonContainer}>
        <button className={styles.button}>
          <a href="https://discord.gg/v8ye5XzVUV" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-discord"></i>
          </a>
        </button>
        <button id="titlebar-minimize" className={styles.button}>
          -
        </button>
        <button id="titlebar-close" className={styles.button}>
          x
        </button>
      </div>
    </div>
  );
};

export default Titlebar;