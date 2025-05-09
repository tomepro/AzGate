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

    // Estados para la configuración
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const [configSettings, setConfigSettings] = useState({
        locale: "esES",
        gxRefresh: "60",
        Gamma: "1.000000",
        Sound_MusicVolume: "0.40000000596046",
        Sound_AmbienceVolume: "0.60000002384186",
        groundEffectDensity: "64",
        projectedTextures: "1",
        gxResolution: "1920x1080",
        shadowLevel: "0",
        groundEffectDist: "140",
        environmentDetail: "1.5",
        extShadowQuality: "5",
        weatherDensity: "3",
    });

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
                console.log("Realms data:", data);
                setRealms(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error invoking fetch_realms:", error);
                setLoading(false);
            });
    }, []);

    const openSettingsModal = () => {
        setIsSettingsModalVisible(true);
    };

    const closeSettingsModal = () => {
        setIsSettingsModalVisible(false);
    };

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setConfigSettings(prevSettings => ({
            ...prevSettings,
            [name]: value
        }));
    };

    const saveConfigSettings = () => {
        console.log("Configuración guardada:", configSettings);
        closeSettingsModal();
        alert("Configuración guardada");
    };

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
            <NavBar />
            <div className='launcherBackground'>
                {/* CONTENIDO DE LA PAGINA */}
                <div className='contentArea'>
                    {/* BARRA IZQUIERDA */}
                    <aside className='sidebar'>
                        <h3 id="tituloVersiones">{t("versions")}</h3>
                        <div className='versions'>
                            <button className='versionButton'>
                                <img className='versionLogo' src="icons/classic.webp" alt="Classic logo" />Classic
                            </button>
                            {customVersions.map((version, index) => (
                                <div key={index} className='versionContainer'>
                                    <button className='versionButton'>
                                        <img className='versionLogo' src={version.image} alt="Custom logo" />
                                        {version.name}
                                        {/* Botón de editar */}
                                        <button className="editButton" onClick={() => openEditModal(index)}><i className="fa-solid fa-screwdriver-wrench"></i></button>
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
                        {/* Modal para añadir/editar versiones */}
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

                        {/* Modal de configuración */}
                        {isSettingsModalVisible && (
                            <div id="modal">
                                <div id="modalContent">
                                    <h3>Configuración</h3>
                                    <div className="config-options-container">
                                        <form>
                                            {Object.entries(configSettings).map(([key, value]) => (
                                                <div key={key}>
                                                    <label>
                                                        <p>{key}</p>
                                                        <input
                                                            type="text"
                                                            name={key}
                                                            value={value}
                                                            onChange={handleConfigChange}
                                                        />
                                                    </label>
                                                </div>
                                            ))}
                                            <button type="button" onClick={closeSettingsModal}>Cancelar</button>
                                            <button type="button" onClick={saveConfigSettings}>Guardar</button>
                                        </form>
                                    </div>
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
                            <div id='headChange'>
                                <span id='numChangelog'>Changelog: {changelog.id}</span>
                                <span>{formatDate(changelog.created_at)}</span>
                            </div>
                            {getShortText(changelog.text)}
                            <button className='readMore'><Link to="/changelogScreen">{t("read_more")}</Link></button>
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
                            <p id='estadoActualServer'>Online</p>
                        </div>
                        <div className='button_container'>
                            <button className='play_button'>{t("play")}</button>
                            <button className='settings_button' onClick={openSettingsModal}><i className="fa-solid fa-gear"></i></button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default HomeScreen;