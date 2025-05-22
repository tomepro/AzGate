import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Link } from 'react-router-dom';
import Titlebar from "./components/Titlebar";
import NavBar from './components/NavBar';
import './ShopScreen.css';
import { useTranslation } from 'react-i18next';

// Función para obtener la imagen de fondo según la versión
const getImageForVersion = (version) => {
  if (!version) return 'classic.webp'; // fallback

  switch (version.toUpperCase()) {
    case 'VA': return 'classic.webp';
    case 'TBC': return 'tbc.webp';
    case 'LK': return 'wotlk_wallpaper.webp';
    case 'CATA': return 'cata.webp';
    case 'MOP': return 'mop.webp';
    case 'WOD': return 'wod.webp';
    case 'LG': return 'legion.webp';
    case 'BFA': return 'bfa.webp';
    case 'SL': return 'shadowlands.webp';
    case 'DF': return 'df.webp';
    case 'TWW': return 'tww.webp';
    default: return 'classic.webp';
  }
};

// Componente de estructura general
const PageLayout = ({ children, backgroundImage }) => {
  return (
    <main className='containerHomeScreen'>
      <div className='launcherBackground' style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Titlebar version={false} />
        <NavBar />
        <div className='contentArea' style={{ overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </main>
  );
};

// Componente principal de la tienda
function Shop() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('');
  const { t } = useTranslation("common");

  // Obtener imagen de fondo según la versión seleccionada
  useEffect(() => {
    const version = localStorage.getItem("versionSelected");
    const bg = getImageForVersion(version);
    setBackgroundImage(bg);
  }, []);

  // Obtener los items de la tienda
  useEffect(() => {
    async function getShopItems() {
      setLoading(true);
      setError(null);
      try {
        const result = await invoke('fetch_shop_items');
        setItems(result);
        setLoading(false);
      } catch (e) {
        console.error("Error invoking fetch_shop_items:", e);
        setError("Error al cargar los items de la tienda. Por favor, intenta de nuevo más tarde.");
        setLoading(false);
      }
    }

    getShopItems();
  }, []);

  // Cargar scripts de Wowhead y refrescar tooltips
  useEffect(() => {
    if (items.length > 0) {
      const script1 = document.createElement('script');
      script1.type = 'text/javascript';
      script1.src = 'http://static.wowhead.com/widgets/power.js';
      document.body.appendChild(script1);

      const script2 = document.createElement('script');
      script2.type = 'text/javascript';
      script2.text = 'var wowhead_tooltips = { iconSize: false }';
      document.body.appendChild(script2);

      script1.onload = () => {
        if (window.WH && typeof window.WH.refreshLinks === 'function') {
          window.WH.refreshLinks();
        } else {
          setTimeout(() => {
            if (window.WH && typeof window.WH.refreshLinks === 'function') {
              window.WH.refreshLinks();
            }
          }, 100);
        }
      };

      return () => {
        const scriptsToRemove = [
          'http://static.wowhead.com/widgets/power.js',
        ];
        scriptsToRemove.forEach(src => {
          const script = document.querySelector(`script[src="${src}"]`);
          if (script && document.body.contains(script)) {
            document.body.removeChild(script);
          }
        });
        const inlineScript = document.querySelector('script[text*="wowhead_tooltips"]');
        if (inlineScript && document.body.contains(inlineScript)) {
          document.body.removeChild(inlineScript);
        }
      };
    }
  }, [items]);

  if (loading) {
    return <div className="loading">{t("loading")}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <PageLayout backgroundImage={backgroundImage}>
      <div id="shop-items">
        {items.length > 0 ? (
          items.map(item => {
            const priceClass = item.isVoteItem === 1 ? 'vote-item-price' : 'donation-item-price';
            const wowheadLink = item.wowhead_link;

            return (
              <Link
                key={item.id}
                to={`/shoppingCartScreen?id=${item.id}`}
                className={`item-card ${item.isVoteItem ? 'vote-item' : 'donation-item'}`}
              >
                {item.isVoteItem === 1 && (
                  <span className='vote-badge'>{t("vote_item")}</span>
                )}
                {wowheadLink ? (
                  <a href={wowheadLink} data-wh-icon-size="small" className="q">
                    <img src={item.icon_link} alt={item.title} className="item-icon" />
                  </a>
                ) : (
                  <img src={item.icon_link} alt={item.title} className="item-icon" />
                )}
                <h2 className="item-title">{item.title}</h2>
                <p className={priceClass}>
                  {item.price}
                  {item.isVoteItem === 1 ? (
                    <img className='monedaVotador' src='/moneda_votacion.png' alt="Votación" />
                  ) : (
                    <img className='monedaDonador' src='/moneda_donacion.png' alt="Donación" />
                  )}
                </p>
              </Link>
            );
          })
        ) : (
          <div className="no-items">{t("no_items_available")}</div>
        )}
      </div>
    </PageLayout>
  );
}

export default Shop;
