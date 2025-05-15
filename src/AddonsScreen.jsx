import React, { useState } from 'react';
import styles from './AddonsScreen.module.css';
import Titlebar from "./components/Titlebar";
import NavBar from './components/NavBar';


function MacrosScreen() {

  return (

    <div className={styles.addonsContainer}>
        {/* Llamada a los componentes */}
        <Titlebar />
        <NavBar />

        {/* Contenido de la seccion */}
        <div className={styles.addonsContent}>
            {/* Lista de Addons */}
            <div className={styles.addonsList}>


            </div>
            {/* Descompresor de Addons */}
            <div className={styles.addonsUnzip}>

            </div>

        </div>

    </div>

    
  );
}

export default MacrosScreen;



// FUNCIONA PERO SIN PERMISOS
// import React, { useEffect, useState } from "react";
// import { readDir } from "@tauri-apps/plugin-fs";
// import { appConfigDir } from "@tauri-apps/api/path";

// function AddonsScreen() {
//   const [addons, setAddons] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const cargarArchivos = async () => {
//       try {
//         // Obtén la ruta del directorio de configuración
//         const configPath = await appConfigDir();
//         const versionesPath = `${configPath}/versiones_wow.json`;

//         // Intenta cargar el archivo JSON
//         const response = await fetch(`file://${versionesPath}`);
//         const data = await response.json();

//         const wowPath = data.path.replace(/\\Wow\.exe$/, "\\Interface\\Addons");

//         // Lee los archivos del directorio Addons
//         const archivos = await readDir(wowPath);
//         if (archivos) {
//           setAddons(archivos.map(f => f.name));
//         } else {
//           setError("La carpeta Addons no existe o no se puede acceder.");
//         }
//       } catch (err) {
//         console.error("Error al cargar los archivos:", err);
//         setError("No se pudo leer la carpeta Addons.");
//       }
//     };

//     cargarArchivos();
//   }, []);

//   return (
//     <div>
//       <h2>Lista de Addons:</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <ul>
//         {addons.map((addon, index) => (
//           <li key={index}>{addon}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default AddonsScreen;