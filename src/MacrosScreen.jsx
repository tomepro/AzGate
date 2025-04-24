import React, { useState } from 'react';
import './MacrosScreen.css';  // Asegúrate de tener la ruta correcta
import Titlebar from "./components/Titlebar";
import NavBar from './components/navBar';

function MacrosScreen() {
  const [fileContent, setFileContent] = useState('');

  // Verificar si se está renderizando
  console.log('Componente MacrosScreen renderizado');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    console.log('Archivo seleccionado:', file);  // Verifica si el archivo se selecciona correctamente

    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);  // Establece el contenido del archivo en el estado
      };
      reader.readAsText(file);
    } else {
      alert("Por favor selecciona un archivo .txt válido.");
    }
  };

  return (
    <div className="macros-container">
        <Titlebar />
        <NavBar />
      <h1 className="macros-title">Selecciona tu archivo de macros</h1>
      
      {/* Verificar que el input sea visible */}
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="macros-input"
      />

      {fileContent && (
        <div className="macros-content">
          <strong>Contenido del archivo:</strong>
          <pre>{fileContent}</pre>
        </div>
      )}
    </div>
  );
}

export default MacrosScreen;
