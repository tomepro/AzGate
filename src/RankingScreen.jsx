import React, { useEffect, useState } from 'react';
import "./RankingScreen.css";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import Titlebar from './components/Titlebar';
import NavBar from './components/NavBar';
    

function RankingIframe() {
  const [resizeSetup, setResizeSetup] = useState(false);


  const { t } = useTranslation("common");
  useEffect(() => {
    const iframe = document.getElementById('ranking-iframe');
    const url = window.location.search.replace(/^\?/, '');
    if (iframe) {
      iframe.src = `http://172.17.42.49:48733/arena${url}`;
    }



    const handleMessage = (ev) => {
      if (ev.data.url !== undefined) {
        const url = ev.data.url.trim().replace(/^\//, '');
        window.history.replaceState(null, null, url === '' ? window.location.pathname : `?${url}`);
      } else if (ev.data === 'contentLoaded') {
        if (!resizeSetup) {
          iFrameResize({ checkOrigin: false, autoResize: true }, '#ranking-iframe');
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
      <NavBar />
      <iframe id="ranking-iframe" title="Ranking Iframe" />
    </main>
  );
}

export default RankingIframe;