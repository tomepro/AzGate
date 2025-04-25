import React, { useEffect, useState } from 'react';
import './HomeScreen.css';
import { useTranslation } from "react-i18next";
import { invoke } from '@tauri-apps/api/core';
import { Link } from 'react-router-dom';
import Titlebar from "./components/Titlebar";
import NavBar from './components/navBar';
import { motion } from "framer-motion";

function HomeScreen() {
    const { t } = useTranslation("common");
    
    const [customVersions, setCustomVersions] = useState([]);
    const [newVersionName, setNewVersionName] = useState("");

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [versionName, setVersionName] = useState('');
    const [route, setRoute] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const openEditModal = (index) => {
        const versionToEdit = customVersions[index];
        setVersionName(versionToEdit.name);
        setRoute(versionToEdit.route);
        setEditingIndex(index);
        setIsEditing(true);
        toggleModal();
    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleDeleteVersion = () => {
        if (editingIndex !== null) {
            const updatedVersions = customVersions.filter((_, index) => index !== editingIndex);
            setCustomVersions(updatedVersions);
        }

        setVersionName("");
        setRoute("");
        setIsEditing(false);
        setEditingIndex(null);
        toggleModal();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (versionName.trim() !== "" && route.trim() !== "") {
            const newVersion = {
                name: versionName,
                route: route,
                image: "default.png"
            };

            if (isEditing && editingIndex !== null) {
                const updatedVersions = [...customVersions];
                updatedVersions[editingIndex] = newVersion;
                setCustomVersions(updatedVersions);
            } else {
                setCustomVersions([...customVersions, newVersion]);
            }

            setVersionName("");
            setRoute("");
            setIsEditing(false);
            setEditingIndex(null);
            toggleModal();
        }
    };

    const [changelog, setChangelog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        invoke("fetch_changelog")
            .then((data) => {
                setChangelog(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error invoking fetch_changelog:", error);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const getShortText = (text) => {
        if (!text) return '';
        return text.slice(0, 30);
    };

    const [realms, setRealms] = useState(null);

    useEffect(() => {
        invoke("fetch_realms")
            .then((data) => {
                console.log("Realms data:", data); // data es un array de objetos
                setRealms(data); // Guarda los datos JSON directamente
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error invoking fetch_realms:", error);
                setLoading(false);
            });
    }, []);
    

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!changelog) {
        return <p>No changelog data available.</p>;
    }

    if (!realms) {
        return <p>No realms data available.</p>;
    }

    return (
        <main className='containerHomeScreen'>
            <Titlebar />
            <div className='launcherBackground'>
                {/* NAV */}
                {/* <div id='homeNavBar'>
                    <div id='botonUser'>
                        <div id='imagenesUser'>
                            <img id='userIcon' src="/races/6/0.webp" alt="User Icon" />
                            <img id='classIcon' src="/classes/11.webp" alt="Class Icon" />
                        </div>
                        <div id='nombreUser'>
                            <p id='userName'>{t("Popy")}</p>
                            <p id='userID'>{t("tomepro")}</p>
                        </div>
                    </div> */}

                    {/* BOTONES NAV*/}
                    {/* <button><Link className='navButton' to="/home">{t("home")}</Link></button>
                    <button>{t("news")}</button>
                    <button>{t("shop")}</button>
                    <button><Link className='navButton' to="/rankingScreen">{t("ranking")}</Link></button>
                    <button><Link className='navButton' to="/armoryScreen">{t("armory")}</Link></button>
                    <button>{t("addons")}</button>
                    <button id='changelogButton'>{t("changelog")}</button>
                    <button><Link className='navButton' to="/">{t("Macros")}</Link></button>
                </div>



                {/* CONTENIDO DE LA PAGINA */}
                <div className='contentArea'>
                    {/* BARRA IZQUIERDA */}
                    <aside className='sidebar'>
                        <h3 id="tituloVersiones">{t("versions")}</h3>
                        <div className='versions'>
                            <button className='versionButton'>
                                <img className='versionLogo' src="icons/classic.webp" alt="Classic logo" />Classic
                            </button>
                            {/* <button className='versionButton'>
                                <img className='versionLogo' src="tbc.png" alt="TBC logo" />TBC
                            </button>
                            <button className='versionButton'>
                                <img className='versionLogo' src="wotlk.png" alt="WotLK logo" />WotLK
                                <button className="editButton" onClick={() => openEditModal(0)}>E</button>
                            </button> */}

                            {/* Para añadir nuevas versiones */}
                            {customVersions.map((version, index) => (
                                <div key={index} className='versionContainer'>
                                    <button className='versionButton'>
                                        <img className='versionLogo' src={version.image} alt="Custom logo" />
                                        {version.name}
                                        {/* Botón de editar */}
                                        <button className="editButton" onClick={() => openEditModal(index)}><i class="fa-solid fa-screwdriver-wrench"></i></button>
                                    </button>
                                </div>
                            ))}

                            {/* Botón para abrir el modal */}
                            <div className='addVersion'>
                                <button id="nuevaEntrada" onClick={toggleModal}>{"+"}</button>
                            </div>
                        </div>
                        {/* REINOS */}
                        <div id='realms'>
                            <h3 id="tituloVersiones">{t("realms")}</h3>
                            {/* <div className='realmItem'>Thalassa<span className='online'>100</span></div>
                            <div className='realmItem'>Andromeda<span className='offline'>-</span></div>
                            <div className='realmItem'>Aegwynn <span className='offline'>0</span></div> */}
                            <div id="reinos">
                            {realms.map((realm, index) => (
                                <div key={index} className="realm-row">
                                <span className="realm-name">{realm.realm}</span>
                                
                                <span className="realm-online">{realm.online}</span>
                                <span className='realm-status'>
                                    <i className={`fa-solid fa-circle ${realm.flag === 2 ? 'red-circle' : realm.flag === 0 ? 'green-circle' : ''}`}></i>
                                </span>
                                </div>
                            ))}
                            </div>
                            
                        </div>
                    </aside>


                    <div id='mainContent'>
                        {/* Modal */}
                        {isModalVisible && (
                            <div id="modal">
                                <div id="modalContent">
                                    <h3>Ruta de la versión</h3>
                                    <form onSubmit={handleSubmit}>
                                        <label>
                                            <p>Nombre</p>
                                            <input
                                                type="text"
                                                value={versionName}
                                                onChange={(e) => setVersionName(e.target.value)}
                                                required
                                            />
                                        </label>
                                        {/* <label className='inputGroup'>
                                            <p>Ruta</p>
                                            <input className='inputVersionWow'
                                                type="file"
                                                accept=".exe"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setRoute(file.name); // Usar file.name o file en sí si quieres subirlo
                                                    }
                                                }}
                                                required
                                            />
                                        </label> */}
                                        <label className='inputGroup'>
                                            <p>Ruta</p>
                                            <input
                                                id="hiddenFileInput"
                                                className='inputVersionWow'
                                                type="file"
                                                accept=".exe"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setRoute(file.name);
                                                    }
                                                }}
                                                style={{ display: 'none' }}
                                            />
                                            <button
                                                id='selecionarExe'
                                                type="button"
                                                onClick={() => document.getElementById('hiddenFileInput').click()}
                                            >
                                                
                                                Pulsa para seleccionar el ejecutable
                                            </button>
                                            <p id='exeSelecionado'>{route && `${route}`}</p>
                                        </label>

                                        <button className="modelButtonA" type="button" onClick={toggleModal}>Cancelar</button>
                                        <button className="modelButton" type="submit">Añadir</button>
                                        <button className="modelButtonDelete" type="button" onClick={handleDeleteVersion}>Eliminar</button>
                                    </form>
                                </div>
                            </div>
                        )}
                        <div className='newsArea'>
                            <div className='mainNewsArea'>
                                <img className='mainNew' src='patch_image.jpg' alt="Patch" />
                                <button className='mainNewText'><h2>{t("last_news")}</h2></button>
                            </div>
                            <div className='microNewArea'>
                                <div className='new1'>
                                    <img className='microNew' src='music_image.jpg' alt="Music" />
                                    <button className='microNewText'><p>La blizzcon vuelve con mucho más</p></button>
                                </div>
                                <div className='new2'>
                                    <img className='microNew' src='news_image.jpg' alt="News" />
                                    <button className='microNewText'><p>Correcciones en vivo del 12 de Marzo 2025</p></button>
                                </div>
                                <div className='new3'>
                                    <img className='microNew' src='blizzcon_image.jpg' alt="Blizzcon" />
                                    <button className='microNewText'><p>Llega la banda sonora de Minahonda</p></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <aside className='rightSidebar'>
                        <div className='changelog'>
                            <h3 className='changelog_title'>{t("changelog")}</h3>
                            {/* <p>Última Actualización - Version 2.3.1</p> */}
                            {/* CHANGELOG ACTUAL */}
                            <div id='headChange'>
                                <span id='numChangelog'>Changelog: {changelog.id}</span>
                                <span>{formatDate(changelog.created_at)}</span>
                            </div>
                            
                            {getShortText(changelog.text)}

                            <button className='readMore'>{t("read_more")}</button>
                        </div>
                        <div id="tiendaMonedas">
                            <h3 className='shop_title'>Tienda</h3>
                            <img className='monedaDona' src='/moneda_donacion.png' alt="Donación" />
                            <img className='monedaVota' src='/moneda_votacion.png' alt="Votación" />
                            <p id='donacionMoneda'>100</p><p id='puntosDonacion'>P.D</p>
                            <p id='votacionMoneda'>100</p><p id='puntosVotacion'>P.V</p>
                            <button className='verTienda'>{t("read_more")}</button>
                        </div>
                        <div id="estadoServer">
                            <p id='circuloVerde'></p><p id='estadoActualServer'>Online</p>
                        </div>
                        <div className='button_container'>
                            <button className='play_button'>{t("play")}</button>
                            <button className='settings_button'><i className="fa-solid fa-gear"></i></button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default HomeScreen;
