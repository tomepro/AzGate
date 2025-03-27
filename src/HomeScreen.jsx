import React from 'react';
import './HomeScreen.css';
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

function HomeScreen() {
    const { t } = useTranslation("common");

    useEffect(() => {
        return () => {
            window.location.reload();
        };
    }, []);

    return (
        <main className='containerHomeScreen'>
            <div className='launcherBackground'>
                <div className='homeNavBar'>
                    <button className='userButton'>
                        {t("nameUser")}
                        <p>{t("IDuser")}</p>
                    </button>
                    <button>{t("news")}</button>
                    <button>{t("shop")}</button>
                    <button>{t("ranking")}</button>
                    <button>{t("armory")}</button>
                    <button>{t("addons")}</button>
                    <button>{t("changelog")}</button>
                </div>
                <div className='contentArea'>
                    <aside className='sidebar'>
                        <div className='versions'>
                            <h3>{t("versions")}</h3>
                            <button className='versionButton'>Classic</button>
                            <button className='versionButton'>TBC</button>
                            <button className='versionButton'>WotLK</button>
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
                            <img className='mainNew' src='patch_image.jpg'/>
                            <button className='mainNewText'><h2>{t("last_news")}</h2></button>
                          </div>
                          <div className='microNewArea'>
                                <div className='new1'>
                                    <img className='microNew' src='music_image.jpg'/>
                                    <button className='microNewText'><p>La blizzcon vuelve con mucho más</p></button>
                                </div>
                                <div className='new2'>
                                    <img className='microNew'  src='news_image.jpg'/>
                                    <button className='microNewText'><p>Correcciones en vivo del 12 de Marzo 2025</p></button>
                                </div>
                                <div className='new3'>
                                    <img className='microNew' src='blizzcon_image.jpg'/>
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
                          <button className='settings_button'><i class="fa-solid fa-gear"></i></button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default HomeScreen;