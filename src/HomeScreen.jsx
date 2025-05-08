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

    const [selectedVersion, setSelectedVersion] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState('');



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
//AQUIIIII parte mortal!!

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (versionName.trim() !== "" && route.trim() !== "") {
          try {
            //AQUI SE OBTIENE LA EXPANSION
            const result = await invoke("get_version", { path: route });
            console.log("Resultado del backend:", result); 

            const expansion = result.expansion;

            const newVersion = {
              name: versionName,
              path: route,
              version: expansion,
            };
      
            console.log("Versión final a guardar:", newVersion);
      
            try {
                await invoke("save_version_to_file", { version: newVersion });
                console.log("Versión guardada en JSON.");
              } catch (error) {
                console.error("Error al guardar versión:", error);
              }

      
            setVersionName("");
            setRoute("");
            setIsEditing(false);
            setEditingIndex(null);
            toggleModal();
          } catch (error) {
            console.error("Error al obtener la versión:", error);
          }

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
        }
      };

    // QUIII
      
    
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

    // useEffect(() => {
    //     invoke("fetch_changelog")
    //         .then((data) => {
    //             setChangelog(data);
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             console.error("Error invoking fetch_changelog:", error);
    //             setLoading(false);
    //         });
    // }, []);

    useEffect(() => {
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

  // Función para llamar a la función fetch_coins de Tauri
//   async function obtenerMonedas(token) {
//     try {
//         // Llamar al comando Tauri fetch_coins
//         const response = await invoke('fetch_coins', { token });

//         // Mostrar las monedas y los puntos
//         console.log(`Monedas: ${response.coins}`);
//         console.log(`Puntos: ${response.points}`);

//         // Mostrar las monedas en la UI
//         const coinsElement = document.getElementById('coins-display');
//         coinsElement.innerHTML = `Monedas: ${response.coins}, Puntos: ${response.points}`;

//     } catch (error) {
//         console.error("Error al obtener las monedas:", error);
//     }
// }

// const [coins, setCoins] = useState(0);
// const [points, setPoints] = useState(0);

// useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (token && token.trim() !== "") {
//     obtenerMonedas(token);
// }

// }, []);

// async function obtenerMonedas(token) {
//   try {
//       const response = await invoke('fetch_coins', { token });
//       setCoins(response.coins);
//       setPoints(response.points);
//   } catch (error) {
//       console.error("Error al obtener las monedas:", error);
//   }
// }



// BUENA AQUI FUNCIONA!!!!
// async function obtenerMonedas(token) {
//   try {
//       // Llamar al comando Tauri fetch_coins
//       const response = await invoke('fetch_coins', { token });

//       // Mostrar las monedas y los puntos
//       console.log(`Monedas: ${response.coins}`);
//       console.log(`Puntos: ${response.points}`);

//       // Mostrar las monedas en la UI
//       const coinsElement = document.getElementById('coins-display');
//       coinsElement.innerHTML = `Monedas: ${response.coins}, Puntos: ${response.points}`;

//   } catch (error) {
//       console.error("Error al obtener las monedas:", error);
//   }
// }

// Ejemplo de uso
//const token = "your_token_here";  // Sustituir con el token real
//obtenerMonedas(token);




// Ejemplo de uso
// const token = "your_token_here";  // Sustituir con el token real
//  const token = localStorage.getItem("token");
//  obtenerMonedas(token);


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
  switch (versionCode) {
    case 'VA':
      return 'classic.webp';
    case 'TBC':
      return 'tbc.webp';
    case 'LK':
      return 'wotlk_wallpaper.png';
    case 'CATA':
      return 'cata.webp';
    case 'MOP':
      return 'mop.webp';
    case 'WOD':
      return 'wod.webp';
    case 'LG':
      return 'legion.webp';
    case 'BFA':
      return 'bfa.webp';
    case 'SL':
      return 'shadowlands.webp';
    case 'DF':
      return 'df.webp';
    case 'TWW':
      return 'tww.webp';
    default:
      return 'classic.webp'; // fondo por defecto
  }
};

const handleVersionSelect = (version) => {
  setSelectedVersion(version.name);
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
                            {/*<button className='versionButton'>
                                <img className='versionLogo' src="icons/classic.webp" alt="Classic logo" />Classic
                            </button>
                             <button className='versionButton'>
                                <img className='versionLogo' src="tbc.png" alt="TBC logo" />TBC
                            </button>
                            <button className='versionButton'>
                                <img className='versionLogo' src="wotlk.png" alt="WotLK logo" />WotLK
                                <button className="editButton" onClick={() => openEditModal(0)}>E</button>
                            </button> */}

                            {/* Para añadir nuevas versiones */}
                            {/* {customVersions.map((version, index) => (
                                <div key={index} className='versionContainer'>
                                    <button className='versionButton'>
                                        <img className='versionLogo' src={version.image} alt="Custom logo" />
                                        {version.name}
                                      
                                        <button className="editButton" onClick={() => openEditModal(index)}><i class="fa-solid fa-screwdriver-wrench"></i></button>
                                    </button>
                                </div>
                            ))} */}

{/* {customVersions.map((version, index) => (
  <div
    key={index}
    className={`versionContainer ${selectedVersion === version.name ? 'selected' : ''}`}
    onClick={() => setSelectedVersion(version.name)}
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
))} */}

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



                        {/* {customVersions.map((version, index) => (
                                  <div key={index} className='versionContainer'>
                                    <button className='versionButton'>
                                      <img className='versionLogo' src={version.image} alt={`${version.name} logo`} />
                                      {version.name}
                                      <button className="editButton" onClick={() => openEditModal(index)}><i className="fa-solid fa-screwdriver-wrench"></i></button>
                                    </button>
                                  </div>
                                ))} */}


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
                            {/* AQUI SE GUARDA ¡¡BIEN!! RUTA */}
                            {/* {isModalVisible && (
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
      )} */}
                            

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
                            <p id='circuloVerde'></p><p id='estadoActualServer'>Online</p>
                        </div>
                        <div className='button_container'>
                            <button className='play_button' onClick={() => handlePlay(selectedVersion)}>{t("play")}</button>
                            <button className='settings_button'><i className="fa-solid fa-gear"></i></button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default HomeScreen;
