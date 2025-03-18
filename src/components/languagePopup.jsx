import React from 'react';
import Popup from 'reactjs-popup';
import i18n from "../i18n";

const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang); // Save selection
  };

export default () => (
  <Popup
    trigger={open => (
      <button className="openPopupButton"><i className="fa-solid fa-language"></i></button>
    )}
    position="top center"
    closeOnDocumentClick
    >
    <div className='popupDiv'> <button onClick={() => changeLanguage('en')}><img src='en_gb.png' className='flagButton'/></button><hr/>
    <button onClick={() => changeLanguage('es')}><img src='es_es.webp' className='flagButton'/></button> <hr/>
    <button onClick={() => changeLanguage('ca')}><img src='ca_ca.png' className='flagButton'/></button><hr/>
    <button onClick={() => changeLanguage('zh')}><img src='zh_zh.png' className='flagButton'/></button>
    </div>
  </Popup>
);