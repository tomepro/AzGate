import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/NavBar.module.css';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.homeNavBar}>
      <div className={styles.botonUser}>
        <div className={styles.imagenesUser}>
          <img className={styles.userIcon} src="/races/6/0.webp" alt="User Icon" />
          <img className={styles.classIcon} src="/classes/11.webp" alt="Class Icon" />
        </div>
        <div className={styles.nombreUser}>
          <p className={styles.userName}>Popy</p>
          <p className={styles.userID}>tomepro</p>
        </div>
      </div>

      <button><Link className={styles.navButton} to="/home">{t("home")}</Link></button>
      <button>{t("news")}</button>
      <button>{t("shop")}</button>
      <button><Link className={styles.navButton}>{t("ranking")}</Link></button>
      <button><Link className={styles.navButton} to="/armoryScreen">{t("armory")}</Link></button>
      <button>{t("addons")}</button>
      <button ><Link className={styles.navButton} to="/changelogScreen">{t("changelog")}</Link></button>
      <button><Link className='macrosButton' to="/macrosScreen">{t("Macros")}</Link></button>
    </div>
  );
};

export default NavBar;
