import React, { useState } from 'react';
import './HomeScreen.css';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

function HomeScreen() {
    const { t } = useTranslation("common");
    const [customVersions, setCustomVersions] = useState([]);
    const [newVersionName, setNewVersionName] = useState("");

    const handleAddVersion = () => {
        if (newVersionName.trim() !== "") {
            const newVersion = {
                name: newVersionName,
                image: "default.png" // Ruta de la imagen
            };
            setCustomVersions([...customVersions, newVersion]);
            setNewVersionName("");
        }
    };

    return (
        <main className='containerHomeScreen'>
            <div className='launcherBackground'>
                <div className='homeNavBar'>
                    <img className='userIcon' src="user_icon.png" alt="User Icon" />
                    <button className='userButton'>{t("nameUser")}<p>{t("IDuser")}</p></button>
                    <button><Link className='navButton' to="/home">{t("home")}</Link></button>
                    <button>{t("news")}</button>
                    <button>{t("shop")}</button>
                    <button><Link className='navButton' to="/">{t("ranking")}</Link></button>
                    <button><Link className='navButton' to="/armoryScreen">{t("armory")}</Link></button>
                    <button>{t("addons")}</button>
                    <button className='changelogButton'>{t("changelog")}</button>
                </div>
                <div className='contentArea'>
                    <aside className='sidebar'>
                        <div className='versions'>
                            <h3>{t("versions")}</h3>
                            <button className='versionButton'><img className='versionLogo' src="classic.png" alt="Classic logo" />Classic</button>
                            <button className='versionButton'><img className='versionLogo' src="tbc.png" alt="Classic logo" />TBC</button>
                            <button className='versionButton'><img className='versionLogo' src="wotlk.png" alt="Classic logo" />WotLK</button>

                            <div className='customVersionsContainer'>
                                {customVersions.map((version, index) => (
                                    <button key={index} className='versionButton'>
                                        <img className='versionLogo' src={version.image} alt={`${version.name} logo`} />
                                        {version.name}
                                    </button>
                                ))}
                            </div>

                            <div className='addVersion'>
                                <input className='addVersionInput'
                                    value={newVersionName}
                                    onChange={(e) => setNewVersionName(e.target.value)}
                                    placeholder={t("new_version_name")}
                                />
                                <button onClick={handleAddVersion}>{"+"}</button>
                            </div>
                        </div>
                        <div className='realms'>
                            <h3>{t("realms")}</h3>
                            <div className='realmItem'>Thalassa<span className='online'>100</span></div>
                            <div className='realmItem'>Andromeda<span className='offline'>-</span></div>
                            <div className='realmItem'>Aegwynn <span className='offline'>0</span></div>
                        </div>
                    </aside>
                    <div className='mainContent'>
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
                            <p>Última Actualización (18/03/2025) - Versión 2.3.1</p>
                            <ul>
                                <li>Optimización del servidor</li>
                                <li>Equilibrio de clases</li>
                                <li>Mazmorras y bandas</li>
                                <li>JcJ y Arenas</li>
                                <li>Economía y tienda</li>
                                <li>Corrección de bugs</li>
                            </ul>
                            <p>Consulta el changelog completo en la sección de actualizaciones.</p>
                            <button className='readMore'>{t("read_more")}</button>
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