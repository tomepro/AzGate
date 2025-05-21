import React, { useEffect, useState } from 'react';
import './HomeScreen.css';
import { useTranslation } from "react-i18next";
import { invoke } from '@tauri-apps/api/core';
import { Link } from 'react-router-dom';
import Titlebar from "./components/Titlebar";
import NavBar from './components/NavBar';
import { motion } from "framer-motion";
import { open } from '@tauri-apps/plugin-dialog';

function HomeScreen() {
  const { t } = useTranslation("common");

  const [customVersions, setCustomVersions] = useState([]);
  const [newVersionName, setNewVersionName] = useState("");
  const [coins, setCoins] = useState(0);
  const [points, setPoints] = useState(0);
  const [addonsPath, setAddonsPath] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [mainNew, setMainNew] = useState('Last News');
  const [firstNew, setFirstNew] = useState('Last News');
  const [secondNew, setSecondNew] = useState('Last News');
  const [thirdNew, setThirdNew] = useState('Last News');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [route, setRoute] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [originalName, setOriginalName] = useState(null);

  // Estado para la configuración (del Código 1)
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [configSettings, setConfigSettings] = useState({}); // Objeto vacío como en Código 1
  const [selectedVersionPath, setSelectedVersionPath] = useState('');

  // Función para obtener la imagen de la versión (del Código 2)
  const getImageForVersion = (version) => {
    console.log(version);
    switch (version.toUpperCase()) {
      case "VA":
        return "icons/classic.webp";
      case "TBC":
        return "icons/tbc.webp";
      case "LK":
        return "icons/lk.webp"; // Cambiado de wotlk_wallpaper.webp
      case "CATA":
        return "icons/cata.webp";
      case "MOP":
        return "icons/mop.webp";
      case "WOD":
        return "icons/wod.webp";
      case "LG":
        return "icons/lg.webp"; // Cambiado de legion.webp
      case "BFA":
        return "icons/bfa.webp";
      case "SL":
        return "icons/sl.webp"; // Cambiado de shadowlands.webp
      case "DF":
        return "icons/df.webp";
      case "TWW":
        return "icons/tww.webp";
      case "DEFAULT":
        return "icons/default.webp";
      default:
        return "icons/default.webp"; // imagen genérica si no coincide
    }
  };

  // Función para abrir el modal de configuración y leer Config.wtf (del Código 1)
  const openSettingsModal = async () => {
    if (selectedVersionPath) {
      try {
        // Llamar a la función Rust para leer el Config.wtf
        const configContent = await invoke("read_config_wtf", { gamePath: selectedVersionPath });
        console.log("Contenido de Config.wtf:", configContent);

        // Parsear el contenido para llenar los estados
        const parsedConfig = {};
        configContent.split('\n').forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('SET')) { // Solo procesar líneas que empiezan con SET
            const parts = trimmedLine.split(' ');
            if (parts.length >= 2) {
              const key = parts[1].trim(); // El segundo elemento es la clave (ej. "locale")
              const value = parts.slice(2).join(' ').replace(/"/g, '').trim(); // El resto es el valor
              parsedConfig[key] = value;
            }
          }
        });
        // Seteamos el estado con todas las opciones encontradas en el archivo
        setConfigSettings(parsedConfig);
        setIsSettingsModalVisible(true);
      } catch (error) {
        console.error("Error al leer Config.wtf:", error);
        alert("No se pudo leer el archivo Config.wtf. Asegúrate de que la ruta de la versión es correcta y la carpeta WTF existe.");
        // Si hay un error, inicializamos con un objeto vacío
        setConfigSettings({});
        setIsSettingsModalVisible(true);
      }
    } else {
      alert("Por favor, selecciona una versión del juego primero.");
    }
  };

  // Resto de las funciones y estados (sin cambios, como en Código 1)
  const openEditModal = (index) => {
    const version = customVersions[index];
    setVersionName(version.name);
    setRoute(version.path);
    setIsEditing(true);
    setEditingIndex(index);
    setSelectedVersion(version);
    setOriginalName(version.name);
    toggleModal();
  };

  const handlePlay = () => {
    if (selectedVersion) {
      invoke("launch_version", { name: selectedVersion })
        .then(() => console.log("Juego lanzado"))
        .catch((err) => console.error("Error al lanzar versión:", err));
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleDeleteVersion = async () => {
    try {
      await invoke('delete_version', { name: selectedVersion.name });
      toggleModal();
      invoke("get_all_versions")
        .then((loadedVersions) => {
          const versionsWithImages = loadedVersions.map((v) => ({
            ...v,
            image: getImageForVersion(v.version),
          }));
          setCustomVersions(versionsWithImages);
        })
        .catch((error) => {
          console.error("Error al cargar versiones:", error);
        });
    } catch (error) {
      console.error("Error al eliminar la versión:", error);
    }
  };

  const handleAddonSelect = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
    });
    if (selected) {
      setAddonsPath(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (versionName.trim() !== "" && route.trim() !== "") {
      try {
        const result = await invoke("get_version", { path: route });
        console.log("Resultado del backend:", result);
        const expansion = result.expansion;
        const newVersion = {
          name: versionName,
          path: route,
          version: expansion,
          addons_path: addonsPath,
        };
        console.log("Versión final a guardar:", newVersion);
        if (isEditing && originalName) {
          try {
            await invoke("update_version", {
              oldName: originalName,
              newVersion: newVersion,
            });
            console.log("Versión actualizada correctamente.");
          } catch (error) {
            console.error("Error al actualizar versión:", error);
          }
        } else {
          try {
            await invoke("save_version_to_file", { version: newVersion });
            console.log("Versión guardada en JSON.");
          } catch (error) {
            console.error("Error al guardar versión:", error);
          }
        }
        setVersionName("");
        setRoute("");
        setAddonsPath("");
        setIsEditing(false);
        setEditingIndex(null);
        setSelectedVersion(null);
        setOriginalName(null);
        toggleModal();
        invoke("get_all_versions")
          .then((loadedVersions) => {
            const versionsWithImages = loadedVersions.map((v) => ({
              ...v,
              image: getImageForVersion(v.version),
            }));
            setCustomVersions(versionsWithImages);
          })
          .catch((error) => {
            console.error("Error al cargar versiones:", error);
          });
      } catch (error) {
        console.error("Error al obtener la versión:", error);
      }
    }
  };

  const handleFileSelect = async () => {
    const filePath = await open({
      multiple: false,
      filters: [{ name: "Ejecutables", extensions: ["exe"] }],
    });
    if (filePath) {
      setRoute(filePath);
    }
  };

  const [changelog, setChangelog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    readNews();
    invoke("fetch_changelog")
      .then((data) => {
        setChangelog(data);
      })
      .catch((error) => {
        console.error("Error al cargar changelog:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    invoke("get_all_versions")
      .then((loadedVersions) => {
        const versionsWithImages = loadedVersions.map((v) => ({
          ...v,
          image: getImageForVersion(v.version),
        }));
        setCustomVersions(versionsWithImages);
      })
      .catch((error) => {
        console.error("Error al cargar versiones:", error);
      });
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && storedToken.trim() !== "") {
      obtenerMonedas(storedToken);
    }
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

  const saveConfigSettings = async () => {
    if (selectedVersionPath) {
      try {
        let configString = '';
        for (const key in configSettings) {
          configString += `SET ${key} "${configSettings[key]}"\n`;
        }
        await invoke("write_config_wtf", { gamePath: selectedVersionPath, content: configString });
        console.log("Configuración guardada:", configSettings);
        closeSettingsModal();
        alert("Configuración guardada correctamente.");
      } catch (error) {
        console.error("Error al guardar la configuración de Config.wtf:", error);
        alert("Error al guardar la configuración. Asegúrate de que la ruta de la versión es correcta y tienes permisos de escritura.");
      }
    } else {
      alert("No hay una versión seleccionada para guardar la configuración.");
    }
  };

  async function obtenerMonedas(token) {
    try {
      const response = await invoke('fetch_coins', { token });
      console.log(`Monedas: ${response.coins}`);
      console.log(`Puntos: ${response.points}`);
      setCoins(response.coins);
      setPoints(response.points);
    } catch (error) {
      console.error("Error al obtener las monedas:", error);
    }
  }

  const launchVersion = async (name) => {
    try {
      await invoke("launch_version", { name });
      console.log(`Versión "${name}" ejecutada.`);
    } catch (error) {
      console.error("Error al ejecutar la versión:", error);
    }
  };

  const getBackgroundByVersion = (versionCode) => {
    const img = new Image();
    switch (versionCode) {
      case 'VA':
        img.src = 'classic.webp';
        return 'classic.webp';
      case 'TBC':
        img.src = 'tbc.webp';
        return 'tbc.webp';
      case 'LK':
        img.src = 'wotlk_wallpaper.webp';
        return 'wotlk_wallpaper.webp';
      case 'CATA':
        img.src = 'cata.webp';
        return 'cata.webp';
      case 'MOP':
        img.src = 'mop.webp';
        return 'mop.webp';
      case 'WOD':
        img.src = 'wod.webp';
        return 'wod.webp';
      case 'LG':
        img.src = 'legion.webp';
        return 'legion.webp';
      case 'BFA':
        img.src = 'bfa.webp';
        return 'bfa.webp';
      case 'SL':
        img.src = 'shadowlands.webp';
        return 'shadowlands.webp';
      case 'DF':
        img.src = 'df.webp';
        return 'df.webp';
      case 'TWW':
        img.src = 'tww.webp';
        return 'tww.webp';
      default:
        img.src = 'classic.webp';
        return 'classic.webp';
    }
  };

  const handleVersionSelect = async (version) => {
    setSelectedVersion(version.name);
    setSelectedVersionPath(version.path);
    localStorage.setItem("nameAddons", version.addons_path);
    localStorage.setItem("versionSelected", version.version);
    localStorage.setItem("config", version.addons_path);
  
  const bg = getBackgroundByVersion(version.version);
    setBackgroundImage(bg);
  
  // Call without blocking the UI
  updateDiscord(version.version);
};

function updateDiscord(version) {
  setTimeout(() => {
    invoke('update_presence', { version:version }).catch(console.error);
  }, 0);
}

  const crearJsonVacio = async () => {
    try {
      await invoke("crear_json_vacio");
      console.log("JSON vacío creado con éxito.");
    } catch (error) {
      console.error("Error al crear JSON vacío:", error);
    }
  };

  const addVersion = async (name, path) => {
    const newVersion = { name, path };
    try {
      const response = await invoke("save_version_to_file", { version: newVersion });
      console.log(response);
    } catch (error) {
      console.error("Error al añadir versión:", error);
    }
  };

  const handleAddonsFileSelect = async () => {
    const path = await selectAddonsFolder();
    if (path) setAddonsRoute(path);
  };

  async function readNews() {
    try {
      const response = await invoke('fetch_news');
      const mainNew = response.find(item => item.type === 1);
      if (mainNew) {
        setMainNew(mainNew);
      }
      const firstThreeTypeZero = response.filter(item => item.type === 2).slice(0, 3);
      setFirstNew(firstThreeTypeZero[0]);
      setSecondNew(firstThreeTypeZero[1]);
      setThirdNew(firstThreeTypeZero[2]);
      console.log("MAIN NEW:" + mainNew.title);
    } catch (error) {
      console.error("Error fetching news");
    }
  }

  if (loading) {
    return <p>{t("loading")}</p>;
  }

  if (!changelog) {
    return <p>{t("no_changelogdata")}</p>;
  }

  if (!realms) {
    return <p>{t("no_realmsdata")}</p>;
  }

  return (
    <main className='containerHomeScreen'>
      <div className='launcherBackground' style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Titlebar version={loading}/>
        <NavBar />
        <div className='contentArea'>
          <aside className='sidebar'>
            <h3 id="tituloVersiones">{t("versions")}</h3>
            <div className='versions'>
              {customVersions.map((version, index) => (
                <div
                  key={index}
                  className={`versionContainer ${selectedVersion === version.name ? 'selected' : ''}`}
                  onClick={() => handleVersionSelect(version)}
                >
                  <button className='versionButton'>
                    <img className='versionLogo' src={version.image} alt={`${version.name} logo`} />
                    {version.name}
                    <button
                      className="editButton"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(index);
                      }}
                    >
                      <i className="fa-solid fa-screwdriver-wrench"></i>
                    </button>
                  </button>
                </div>
              ))}
              <div className='addVersion'>
                <button id="nuevaEntrada" onClick={toggleModal}>{"+"}</button>
              </div>
            </div>
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
            {isModalVisible && (
              <div id="modal">
                <div id="modalContent">
                  <h3>{t("version_route")}</h3>
                  <form onSubmit={handleSubmit}>
                    <label>
                      <p>{t("name_version")}</p>
                      <input
                        type="text"
                        value={versionName}
                        onChange={(e) => setVersionName(e.target.value)}
                        required
                      />
                    </label>
                    <label className="inputGroup">
                      <p>{t("route")}</p>
                      <button
                        id="seleccionarExe"
                        type="button"
                        onClick={handleFileSelect}
                      >
                        {t("select_exe")}
                      </button>
                      <p id="exeSeleccionado">
                        {route && `Seleccionado: ${route.split("\\").pop()}`}
                      </p>
                    </label>
                    <label className="inputGroup">
                      <p>{t("addons_route")}</p>
                      <button
                        id="seleccionarAddons"
                        type="button"
                        onClick={handleAddonSelect}
                      >
                        {t("select_addons")}
                      </button>
                      <p id="addonsSeleccionado">
                        {addonsPath && `Seleccionado: ${addonsPath}`}
                      </p>
                    </label>
                    <button className="modelButtonA" type="button" onClick={toggleModal}>
                      {t("cancel")}
                    </button>
                    <button className="modelButton" type="submit">
                      {t("add")}
                    </button>
                    <button
                      className="modelButtonDelete"
                      type="button"
                      onClick={handleDeleteVersion}
                    >
                      {t("delete")}
                    </button>
                  </form>
                </div>
              </div>
            )}
            {isSettingsModalVisible && (
              <div id="modal">
                <div id="modalContent">
                  <h3>{t("config")}</h3>
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
                      <button type="button" onClick={closeSettingsModal}>{t("cancel")}</button>
                      <button type="button" onClick={saveConfigSettings}>{t("save")}</button>
                    </form>
                  </div>
                </div>
              </div>
            )}
            <div className='newsArea'>
              <div className='mainNewsArea' onClick={() => { window.location.href = '/newsScreen'; }}>
                <img className='mainNew' src={mainNew.image} alt="Patch" />
                <button className='mainNewText'><h2>{mainNew.title}</h2></button>
              </div>
              <div className='microNewArea'>
                <div className='new1' onClick={() => { window.location.href = '/newsScreen'; }}>
                  <img className='microNew' src={firstNew.image} alt="Music" />
                  <button className='microNewText'><p>{firstNew.title}</p></button>
                </div>
                <div className='new2' onClick={() => { window.location.href = '/newsScreen'; }}>
                  <img className='microNew' src={secondNew.image} alt="News" />
                  <button className='microNewText'><p>{secondNew.title}</p></button>
                </div>
                <div className='new3' onClick={() => { window.location.href = '/newsScreen'; }}>
                  <img className='microNew' src={thirdNew.image} alt="Blizzcon" />
                  <button className='microNewText'><p>{thirdNew.title}</p></button>
                </div>
              </div>
            </div>
          </div>
          <aside className='rightSidebar'>
            <div className='changelog'>
              <h3 className='changelog_title'>{t("changelog")}</h3>
              <div id='headChange'>
                <span id='numChangelog'>{t("changelog")}: {changelog.id}</span>
                <span>{formatDate(changelog.created_at)}</span>
              </div>
              {getShortText(changelog.text)}
              <button className='readMore'><Link to="/changelogScreen">{t("read_more")}</Link></button>
            </div>
            <div id="tiendaMonedas">
              <h3 className='shop_title'>{t("shop")}</h3>
              <img className='monedaDona' src='/moneda_donacion.png' alt="Donación" />
              <img className='monedaVota' src='/moneda_votacion.png' alt="Votación" />
              <p id='donacionMoneda'>{coins}</p><p id='puntosDonacion'>{t("pd")}</p>
              <p id='votacionMoneda'>{points}</p><p id='puntosVotacion'>{t("pv")}</p>
              <button className='verTienda'><Link to="/shopScreen">{t("shop")}</Link></button>
            </div>
            <div id="estadoServer">
              <i className="fa-solid fa-circle green"></i>
              <p id='estadoActualServer'>{t("online")}</p>
            </div>
            <div className='button_container'>
              <button className='play_button' onClick={() => handlePlay(selectedVersion)}>{t("play")}</button>
              <button className='settings_button' onClick={openSettingsModal}><i className="fa-solid fa-gear"></i></button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default HomeScreen;