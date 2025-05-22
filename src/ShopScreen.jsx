import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Link } from 'react-router-dom';
import Titlebar from "./components/Titlebar";
import NavBar from './components/NavBar';
import './ShopScreen.css';
import { useTranslation } from 'react-i18next';

// Componente reutilizable para la estructura de la página
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

// Componente Shop
function Shop() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation("common");

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

    // Effect to load Wowhead scripts and initialize tooltips
    useEffect(() => {
        if (items.length > 0) { // Only attempt to load scripts and refresh if items are loaded
            const script1 = document.createElement('script');
            script1.type = 'text/javascript';
            script1.src = 'http://static.wowhead.com/widgets/power.js';
            document.body.appendChild(script1);

            const script2 = document.createElement('script');
            script2.type = 'text/javascript';
            script2.text = 'var wowhead_tooltips = { iconSize: false}';
            document.body.appendChild(script2);

            // Important: Re-initialize Wowhead tooltips after items are rendered
            script1.onload = () => {
                if (window.WH && typeof window.WH.refreshLinks === 'function') {
                    window.WH.refreshLinks();
                } else {
                    // Fallback or a slight delay if refreshLinks isn't immediately available
                    setTimeout(() => {
                        if (window.WH && typeof window.WH.refreshLinks === 'function') {
                            window.WH.refreshLinks();
                        }
                    }, 100);
                }
            };
        }

        // Cleanup function for scripts
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
            // Also remove the inline script for wowhead_tooltips
            const inlineScript = document.querySelector('script[text*="wowhead_tooltips"]');
            if (inlineScript && document.body.contains(inlineScript)) {
                document.body.removeChild(inlineScript);
            }
        };
    }, [items]); // Rerun this effect when 'items' state changes

    if (loading) {
        return <div className="loading">{t("loading")}</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <PageLayout backgroundImage={'ruta/a/imagen/de/fondo/tienda.jpg'}>
            <div id="shop-items">
                {items.length > 0 ? (
                    items.map(item => {
                        const priceClass = item.isVoteItem === 1 ? 'vote-item-price' : 'donation-item-price';
                        
                        // Use item.wowhead_link directly from the backend
                        const wowheadLink = item.wowhead_link; 

                        return (
                            <Link
                                key={item.id}
                                to={`/shoppingCartScreen?id=${item.id}`}
                                className={`item-card ${item.isVoteItem ? 'vote-item' : 'donation-item'}`}
                            >
                                {item.isVoteItem === 1 && (
                                    <span>
                                        
                                    </span>
                                )}
                                {/* If wowhead_link exists, wrap the image in an <a> tag for the tooltip */}
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