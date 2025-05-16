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

    useEffect(() => {
        // Carga los scripts de Wowhead dinámicamente
        const script1 = document.createElement('script');
        script1.type = 'text/javascript';
        script1.src = 'http://static.wowhead.com/widgets/power.js';
        document.body.appendChild(script1);

        const script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.text = 'var wowhead_tooltips = { iconSize: "small"}';
        document.body.appendChild(script2);

        // Limpieza al desmontar el componente
        return () => {
            if (document.body.contains(script1)) {
                document.body.removeChild(script1);
            }
            if (document.body.contains(script2)) {
                document.body.removeChild(script2);
            }
        };
    }, []); // El array vacío asegura que esto solo se ejecute una vez

    if (loading) {
        return <div className="loading">Cargando items...</div>;
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
                        return (
                            <Link
                                key={item.id}
                                to={`/shoppingCartScreen?id=${item.id}`} // Pasamos el id como parámetro GET
                                className={`item-card ${item.isVoteItem ? 'vote-item' : 'donation-item'}`}
                            >
                                {item.isVoteItem === 1 && (
                                    <span className='vote-badge'>
                                        Vote Item
                                    </span>
                                )}
                                <img src={item.icon_link} alt={item.title} className="item-icon" />
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
                        )
                    })
                ) : (
                    <div className="no-items">No hay items activos disponibles.</div>
                )}
            </div>
        </PageLayout>
    );
}

export default Shop;