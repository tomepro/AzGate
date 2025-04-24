// import React, { useState } from 'react';
// import './ChangelogScreen.css';  // Asegúrate de tener la ruta correcta
// import Titlebar from "./components/Titlebar";
// import NavBar from './components/navBar';

// function ChangelogScreen() {
//   return (
//     <div className="changelog-container">
//         <Titlebar />
//         <NavBar />
//       <div id='changelog-content'></div>
//     </div>
//   );
// }

// export default ChangelogScreen;
import React, { useEffect, useState } from 'react';
import './ChangelogScreen.css';
import Titlebar from "./components/Titlebar";
import NavBar from './components/navBar';
import { invoke } from '@tauri-apps/api/core';

function ChangelogScreen() {
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
    if (!dateString) return ''; // Manejo de fechas vacías o nulas

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Si no es una fecha válida, retornar vacío

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year}      ${hours}:${minutes}`;
  };

  return (
    <div className="changelog-container">
      <Titlebar />
      <NavBar />
      <div id="changelog-content">
        {loading ? (
          <p>Loading changelog...</p>
        ) : changelog ? (
          <div className="changelog-entry">
            <div className="changelog-header">
              <span id='numChangelog'>Changelog: {changelog.id}</span>
              <span>{formatDate(changelog.created_at)}</span>
            </div>
            <div className="changelog-text">
              {changelog.text}
            </div>
          </div>
        ) : (
          <p>No changelog data available.</p> 
        )}
      </div>
    </div>
  );
}

export default ChangelogScreen;
