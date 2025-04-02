import React, { useEffect, useState } from 'react';
import "./ArmoryScreen.css";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import Titlebar from './components/Titlebar';
    

function ArmoryIframe() {
  const [resizeSetup, setResizeSetup] = useState(false);


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
    <main className='containerHomeScreen'>
      <Titlebar/>
      <div className='homeNavBar'>
            <img className='userIcon' src="user_icon.png"></img>
            <button className='userButton'>{t("nameUser")}<p>{t("IDuser")}</p></button>
            <button><Link className='navButton' to="/home">{t("home")}</Link></button>
            <button>{t("news")}</button>
            <button>{t("shop")}</button>
            <button>{t("ranking")}</button>
            <button><Link to="/armoryScreen" className='navButton'>{t("armory")}</Link></button>
            <button>{t("addons")}</button>
            <button className='changelogButton'>{t("changelog")}</button>
        </div>
      <iframe id="armory-iframe" title="Armory Iframe" />
    </main>
  );
}

export default ArmoryIframe;