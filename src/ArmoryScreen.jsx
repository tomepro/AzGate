import React, { useEffect, useState } from 'react';
import "./ArmoryScreen.css";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import Titlebar from './components/Titlebar';
import NavBar from './components/NavBar';
    

function ArmoryIframe() {
  const [resizeSetup, setResizeSetup] = useState(false);


  const version = localStorage.getItem("versionSelected");

  console.log(version)

    const getImageForVersion = (version) => {
    switch (version.toUpperCase()) {
    case 'VA':
      return 'classic.webp';
    case 'TBC':
      return 'tbc.webp';
    case 'LK':
      return 'wotlk_wallpaper.webp';
    case 'CATA':
      return 'cata.webp';
    case 'MOP':
      return 'mop.webp';
    case 'WOD':
      return 'wod.webp';
    case 'LG':
      return 'legion.webp';
    case 'BFA':
      return 'bfa.webp';
    case 'SL':
      return 'shadowlands.webp';
    case 'DF':
      return 'df.webp';
    case 'TWW':
      return 'tww.webp';
    default:
      return 'classic.webp'; // fondo por defecto
  }
  };

  const backgroundImage = getImageForVersion(version);

  const { t } = useTranslation("common");
  useEffect(() => {
    const iframe = document.getElementById('armory-iframe');
    const url = window.location.search.replace(/^\?/, '');
    if (iframe) {
      iframe.src = `http://172.17.42.49:48733${url}`;
    }



    const handleMessage = (ev) => {
      if (ev.data.url !== undefined) {
        const url = ev.data.url.trim().replace(/^\//, '');
        window.history.replaceState(null, null, url === '' ? window.location.pathname : `?${url}`);
      } else if (ev.data === 'contentLoaded') {
        if (!resizeSetup) {
          iFrameResize({ checkOrigin: false, autoResize: true }, '#armory-iframe');
          setResizeSetup(true);
        } else {
          if (iframe && iframe.iFrameResizer) {
            iframe.iFrameResizer.resize();
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [resizeSetup]);

  return (
    <main className='containerHomeScreen' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Titlebar/>
      <NavBar />
      {/* <div className='homeNavBar'>
            <img className='userIcon' src="user_icon.png"></img>
            <button className='userButton'>{t("nameUser")}<p>{t("IDuser")}</p></button>
            <button><Link className='navButton' to="/home">{t("home")}</Link></button>
            <button>{t("news")}</button>
            <button>{t("shop")}</button>
            <button><Link to="/rankingScreen" className='navButton'>{t("ranking")}</Link></button>
            <button><Link to="/armoryScreen" className='navButton'>{t("armory")}</Link></button>
            <button>{t("addons")}</button>
            <button className='changelogButton'>{t("changelog")}</button>
        </div> */}
        
      <iframe id="armory-iframe" title="Armory Iframe" />

      
      
    </main>
  );
}

export default ArmoryIframe;