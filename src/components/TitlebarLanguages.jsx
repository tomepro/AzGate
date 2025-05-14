import React from 'react';
import Popup from 'reactjs-popup';
import i18n from "../i18n";
import styles from './styles/TitlebarLanguages.module.css'; 

const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang); // Save selection
  };

export default () => (
  <Popup
    trigger={open => (
    //   <button className="openPopupButton"><i className="fa-solid fa-language"></i></button>
      <button className={styles.openPopupButton}><i className={styles.icon + ' fa-solid fa-earth-europe'}></i></button>
    )}
    position="bottom center"
    closeOnDocumentClick
    >
    <div className={styles.popupDiv}> <button onClick={() => changeLanguage('en')}><img src='/languages/en_gb.png' className='flagButton'/></button><hr/>
    <button onClick={() => changeLanguage('es')}><img src='/languages/es_es.webp' className='flagButton'/></button> <hr/>
    <button onClick={() => changeLanguage('ca')}><img src='/languages/ca_ca.png' className='flagButton'/></button><hr/>
    <button onClick={() => changeLanguage('zh')}><img src='/languages/zh_zh.png' className='flagButton'/></button>
    </div>
  </Popup>
);