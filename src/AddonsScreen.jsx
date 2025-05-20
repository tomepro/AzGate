import React, { useState, useEffect, useCallback } from 'react';

import { join } from '@tauri-apps/api/path';


import styles from './AddonsScreen.module.css';
import Titlebar from "./components/Titlebar";
import NavBar from './components/NavBar';
import { invoke } from '@tauri-apps/api/core';


function AddonsScreen() {
  const [addons, setAddons] = useState([]);
  const [error, setError] = useState(null);

  const storedPath = localStorage.getItem("nameAddons");
  const path = localStorage.getItem("nameAddons");

  const version = localStorage.getItem("versionSelected");

  console.log(version)

    const getImageForVersion = (version) => {
    switch (version.toUpperCase()) {
    case 'VA':
      return 'classic.webp';
    case 'TBC':
      return 'tbc.webp';
    case 'LK':
      return 'wotlk_wallpaper.webp';
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

  const backgroundImage = getImageForVersion(version);




  const handleOpenFolder = () => {
  if (path) {
    invoke("open_folder", { path })
      .then(() => console.log("Carpeta abierta"))
      .catch((err) => console.error("Error al abrir carpeta:", err));
  } else {
    console.error("No hay una ruta guardada en localStorage.");
  }
};

const onDrop = useCallback(async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length === 0) return;

    const file = files[0];

    if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
      console.error('Por favor, arrastra un archivo ZIP.');
      return;
    }

    // Leer el archivo como arraybuffer para enviarlo al backend
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    try {
      // Invocar comando Rust pasando el archivo como bytes y el path
      await invoke('unzip_and_move', {
        zipBytes: uint8Array,
        destPath: path,
      });
      console.log('ZIP descomprimido correctamente!');
      invoke("list_addons", { path: storedPath })
      .then((result) => {
        setAddons(result);
      })
      .catch((err) => {
        setError("Error al invocar comando: " + err.toString());
      });
    } catch (error) {
      console.error('Error al descomprimir: ' + error);
      invoke("list_addons", { path: storedPath })
      .then((result) => {
        setAddons(result);
      })
      .catch((err) => {
        setError("Error al invocar comando: " + err.toString());
      });
    }
  }, [path]);

  const onDragOver = (e) => e.preventDefault();

    useEffect(() => {
    

      console.log(storedPath)

    if (!storedPath) {
      setError("No se encontró la ruta en localStorage.");
      return;
    }

    invoke("list_addons", { path: storedPath })
      .then((result) => {
        setAddons(result);
      })
      .catch((err) => {
        setError("Error al invocar comando: " + err.toString());
      });
  }, []);


  return (

    <div className={styles.addonsContainer} style={{ backgroundImage: `url(${backgroundImage})` }}>
        {/* Llamada a los componentes */}
        <Titlebar />
        <NavBar />

        {/* Contenido de la seccion */}
        <div className={styles.addonsContent}>
            <div className={styles.addonsUnzip}>
              <h1 className={styles.titlezip}>¡Arrastra tu addon aquí!</h1>
              <div className={styles.addonsUnzipBox} onDrop={onDrop} onDragOver={onDragOver}><i class="fa-solid fa-arrow-up-from-bracket fa-2x"></i></div>
              <h1 className={styles.usezip}>(.zip)</h1>
            </div>
            

            {/* Boton carpeta addons */}
            <div>
              <button className={styles.addonsFolder} onClick={handleOpenFolder}><i className="fa-solid fa-folder-open fa-3x"></i></button>
            </div>

            {/* Lista de Addons */}
            <div className={styles.addonsList}>
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              <ul>
                
                {/* {addons.map((addon, index) => (
                  <li key={index} className={styles.addon}>{addon}{index}</li>     
                ))} */}

                {addons.map((addon, index) => (
                  <li key={index} className={styles.addon}>
                    <span className={styles.left}>{addon}</span>
                    <span className={styles.right}>{index}</span>
                  </li>

                ))}
              </ul>
            </div>
        </div>
    </div>
  );
}

export default AddonsScreen;