// ShoppingCartScreen.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import Titlebar from "./components/Titlebar";
import NavBar from './components/NavBar';
import './ShoppingCartScreen.css'; // Asegúrate de crear este archivo CSS
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const ShoppingCartScreen = () => {
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [searchParams] = useSearchParams();
    const itemId = searchParams.get('id'); // Obtenemos el id del parámetro GET
    const [item, setItem] = useState(null);
    const [loadingItem, setLoadingItem] = useState(true);
    const [errorItem, setErrorItem] = useState(null);
    const [selectedCharacter, setSelectedCharacter] = useState('');
    const [characters, setCharacters] = useState([]);
    const [loadingCharacters, setLoadingCharacters] = useState(true);
    const [errorCharacters, setErrorCharacters] = useState(null);
    const token = localStorage.getItem("token");
    const { t } = useTranslation("common");

    useEffect(() => {
        async function getShopItemById(id) {
            setLoadingItem(true);
            setErrorItem(null);
            try {
                const result = await invoke('fetch_shop_items'); // Obtenemos todos los items
                const selectedItem = result.find(item => item.id.toString() === id); // Buscamos el item por id
                if (selectedItem) {
                    setItem(selectedItem);
                } else {
                    setErrorItem("No se encontró el item seleccionado.");
                }
                setLoadingItem(false);
            } catch (error) {
                console.error("Error al obtener el item:", error);
                setErrorItem("Error al cargar el item. Por favor, intenta de nuevo más tarde.");
                setLoadingItem(false);
            }
        }

        if (itemId) {
            getShopItemById(itemId);
        } else {
            setErrorItem("No se proporcionó un ID de item.");
            setLoadingItem(false);
        }
    }, [itemId]);

    useEffect(() => {
        async function getCharacters() {
            if (!token) {
                setErrorCharacters("No se encontró el token de autenticación.");
                setLoadingCharacters(false);
                return;
            }

            setLoadingCharacters(true);
            setErrorCharacters(null);
            try {
                const result = await invoke('fetch_profile', { token: token });
                setCharacters(result);
                setLoadingCharacters(false);
            } catch (error) {
                console.error("Error al obtener los personajes:", error);
                setErrorCharacters("Error al cargar los personajes. Por favor, intenta de nuevo más tarde.");
                setLoadingCharacters(false);
            }
        }

        getCharacters();
    }, [token]);

    const handleCharacterChange = (event) => {
        setSelectedCharacter(event.target.value);
    };

    const handleBuyItem = async () => {
        if (selectedCharacter && item && token) {
            try {
                console.log("Comprando item:", itemId, "para personaje:", selectedCharacter);
                const purchaseResult = await invoke('buy_shop_item', {
                    id: parseInt(itemId),
                    characterId: parseInt(selectedCharacter),
                    token: token,
                });

                console.log("Resultado de la compra:", purchaseResult);
                // Aquí puedes manejar la respuesta, mostrar un mensaje de éxito o error al usuario
                if (purchaseResult?.message) {

                    setPopupMessage("purchaseResult.message");
                    setPopupOpen(true);
                    // alert(purchaseResult.message);
                    // Redirigir a una página de éxito o limpiar el carrito
                } else if (purchaseResult?.error) {
                    // alert(`Error al comprar el item: ${purchaseResult.error}`);
                    setPopupMessage(`Error al comprar el item: ${purchaseResult.error}`);
                    setPopupOpen(true);
                } else {
                    // alert("Error desconocido al intentar comprar el item.");
                    setPopupMessage("Error desconocido al intentar comprar el item");
                    setPopupOpen(true);
                }

            } catch (error) {
                console.error("Error al invocar buy_shop_item:", error);
                // alert(`Error al intentar comprar el item: ${error}`);
                setPopupMessage(`Error al intentar comprar el item: ${error}`);
                setPopupOpen(true);
            }
        } else {
            // alert('Por favor, selecciona un personaje.');
            setPopupMessage("Por favor, selecciona un personaje");
            setPopupOpen(true);
        }
    };

    if (loadingItem) {
        return (
            <main className='containerHomeScreen'>
                <div className='launcherBackground'>
                    <Titlebar version={false} />
                    <NavBar />
                    <div className='contentArea'>
                        <p>{t("loading")}</p>
                    </div>
                </div>
            </main>
        );
    }

    if (errorItem) {
        return (
            <main className='containerHomeScreen'>
                <div className='launcherBackground'>
                    <Titlebar version={false} />
                    <NavBar />
                    <div className='contentArea'>
                        <p className="error">{errorItem}</p>
                        <Link to="/shopScreen">{t("back_shop")}</Link>
                    </div>
                </div>
            </main>
        );
    }

    if (!item) {
        return (
            <main className='containerHomeScreen'>
                <div className='launcherBackground'>
                    <Titlebar version={false} />
                    <NavBar />
                    <div className='contentArea'>
                        <p>{t("no_item_selected")}</p>
                        <Link to="/shopScreen">{t("back_shop")}</Link>
                    </div>
                </div>
            </main>
        );
    }

    if (loadingCharacters) {
        return (
            <main className='containerHomeScreen'>
                <div className='launcherBackground'>
                    <Titlebar version={false} />
                    <NavBar />
                    <div className='contentArea'>
                        <p>{t("loading")}</p>
                    </div>
                </div>
            </main>
        );
    }

    if (errorCharacters) {
        return (
            <main className='containerHomeScreen'>
                <div className='launcherBackground'>
                    <Titlebar version={false} />
                    <NavBar />
                    <div className='contentArea'>
                        <p className="error">{errorCharacters}</p>
                        <Link to="/shop">{t("back_shop")}</Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className='containerHomeScreen'>
            <div className='launcherBackground'>
                <Titlebar version={false} />
                <NavBar />
                <div className='contentArea'>
                    <div className="shopping-cart-item">
                        <img src={item.icon_link} alt={item.title} className="item-icon" />
                        <h2 className="item-title">{item.title}</h2>
                        <div className="price-container"> {/* Nuevo contenedor */}
                            <p className="item-price">{item.price}</p>
                            {item.isVoteItem === 1 ? (
                                <img className='monedaVotador' src='/moneda_votacion.png' alt="Votación" />
                            ) : (
                                <img className='monedaDonador' src='/moneda_donacion.png' alt="Donación" />
                            )}
                        </div>
                        <div className="character-selection">
                            <label htmlFor="character">{t("select_character")}:</label>
                            <select className='character-selector' id="character" value={selectedCharacter} onChange={handleCharacterChange}>
                                <option value="">-- {t("select")} --</option>
                                {characters.map((character) => (
                                    <option key={character.guid} value={character.guid}>
                                        {character.name} ({t("level")} {character.level})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className='payButton' onClick={handleBuyItem} disabled={!selectedCharacter}>{t("pay")}</button>
                        <br />
                        <br />
                        <Link className='backButton' to="/shopScreen">{t("back_shop")}</Link>
                    </div>
                </div>
            </div>
                  <Popup
                          open={popupOpen}
                          onClose={() => setPopupOpen(false)}
                          modal
                          closeOnDocumentClick
                        >
                          <div className="pwrs-popup-content">
                            <p>{popupMessage}</p>
                            <button onClick={() => setPopupOpen(false)}>{t("close")}</button>
                          </div>
                        </Popup>
        </main>
    );
};

export default ShoppingCartScreen;