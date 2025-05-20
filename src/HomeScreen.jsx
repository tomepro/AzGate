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
    const version = customVersions[index];
    setVersionName(version.name);
    setRoute(version.path);
    setIsEditing(true);
    setEditingIndex(index);
    setSelectedVersion(version);
    setOriginalName(version.name); // aquí está el truco
    toggleModal();
    // };

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
      // refreshVersions();
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
        // OBTENER EXPANSIÓN DESDE EL BACKEND
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
          // ESTÁS EDITANDO UNA VERSIÓN EXISTENTE
          try {
            await invoke("update_version", {
              oldName: originalName,  // nombre original antes de editar
              newVersion: newVersion, // nueva versión a guardar
            });
            console.log("Versión actualizada correctamente.");
          } catch (error) {
            console.error("Error al actualizar versión:", error);
          }
        } else {
          // ESTÁS AÑADIENDO UNA NUEVA VERSIÓN
          try {
            await invoke("save_version_to_file", { version: newVersion });
            console.log("Versión guardada en JSON.");
          } catch (error) {
            console.error("Error al guardar versión:", error);
          }
        }

      // LIMPIAR Y CERRAR MODAL
      setVersionName("");
      setRoute("");
      setAddonsPath("");
      setIsEditing(false);
      setEditingIndex(null);
      setSelectedVersion(null);
      setOriginalName(null); // Limpiamos el originalName también
      toggleModal();

        // RECARGAR VERSIONES
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
    readNews()
    // Cargar el changelog
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

    // Cargar versiones desde el JSON
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


  const getImageForVersion = (version) => {
    console.log(version)
    switch (version.toUpperCase()) {
      case "VA":
        return "icons/classic.webp";
      case "TBC":
        return "icons/tbc.webp";
      case "LK":
        return "icons/lk.webp";
      case "CATA":
        return "icons/cata.webp";
      case "MOP":
        return "icons/mop.webp";
      case "WOD":
        return "icons/wod.webp";
      case "LG":
        return "icons/lg.webp";
      case "BFA":
        return "icons/bfa.webp";
      case "SL":
        return "icons/sl.webp";
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
        return 'classic.webp'; // fondo por defecto
    }
  };

const handleVersionSelect = (version) => {
  setSelectedVersion(version.name);
  localStorage.setItem("nameAddons", version.addons_path);
  localStorage.setItem("versionSelected", version.version);
  const bg = getBackgroundByVersion(version.version);
  setBackgroundImage(bg);
};

    //PARTE GUARDAR DATOS EN EL JS
    // Función para crear el archivo JSON vacío si no existe
const crearJsonVacio = async () => {
    try {
      await invoke("crear_json_vacio");
      console.log("JSON vacío creado con éxito.");
    } catch (error) {
      console.error("Error al crear JSON vacío:", error);
    }
  };

  // Función para agregar una nueva versión
  const addVersion = async (name, path) => {
    const newVersion = { name, path };

    try {
      const response = await invoke("save_version_to_file", { version: newVersion });
      console.log(response);  // Mensaje de éxito
    } catch (error) {
      console.error("Error al añadir versión:", error);
    }
  };

  const handleAddonsFileSelect = async () => {
  // Reemplaza esto con la lógica adecuada si usas Electron o input type="file"
  const path = await selectAddonsFolder(); // Esto depende de tu implementación
  if (path) setAddonsRoute(path);
  };



  async function readNews() {
    try {
      const response = await invoke('fetch_news');
      const mainNew = response.find(item => item.type === 1)
      if (mainNew) {
        setMainNew(mainNew)
      }
      const firstThreeTypeZero = response.filter(item => item.type === 2).slice(0, 3);
      setFirstNew(firstThreeTypeZero[0])
      setSecondNew(firstThreeTypeZero[1])
      setThirdNew(firstThreeTypeZero[2])
      console.log("MAIN NEW:" + mainNew.title)
    } catch (error) {
      console.error("Error fetching news")
    }
  }

    return (
        <main className='containerHomeScreen'>
            
            <div className='launcherBackground' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Titlebar version={loading}/>
            <NavBar />
                {/* CONTENIDO DE LA PAGINA */}
                <div className='contentArea'>
                    {/* BARRA IZQUIERDA */}
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
                                  e.stopPropagation(); // evita que se seleccione cuando editas
                                  openEditModal(index);
                                }}
                              >
                                <i className="fa-solid fa-screwdriver-wrench"></i>
                              </button>
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

                                    <label className="inputGroup">
                                      <p>Ruta</p>
                                      <button
                                        id="seleccionarExe"
                                        type="button"
                                        onClick={handleFileSelect}
                                      >
                                        Pulsa para seleccionar el ejecutable
                                      </button>
                                      <p id="exeSeleccionado">
                                        {route && `Seleccionado: ${route.split("\\").pop()}`}
                                      </p>
                                    </label>

                                  {/* Parte de los addons */}
                                    <label className="inputGroup">
                                      <p>Ruta de Addons</p>
                                      <button
                                        id="seleccionarAddons"
                                        type="button"
                                        onClick={handleAddonSelect}
                                      >
                                        Pulsa para seleccionar la carpeta de addons
                                      </button>
                                      <p id="addonsSeleccionado">
                                        {addonsPath && `Seleccionado: ${addonsPath}`}
                                      </p>
                                    </label>


                                    <button className="modelButtonA" type="button" onClick={toggleModal}>
                                      Cancelar
                                    </button>
                                    <button className="modelButton" type="submit">
                                      Añadir
                                    </button>
                                    <button
                                      className="modelButtonDelete"
                                      type="button"
                                      onClick={handleDeleteVersion}
                                    >
                                      Eliminar
                                    </button>
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
              <p id='donacionMoneda'>{coins}</p><p id='puntosDonacion'>P.D</p>
              <p id='votacionMoneda'>{points}</p><p id='puntosVotacion'>P.V</p>
              <button className='verTienda'>{t("read_more")}</button>
            </div>
            <div id="estadoServer">
              <i className="fa-solid fa-circle green"></i>
              <p id='estadoActualServer'>Online</p>
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