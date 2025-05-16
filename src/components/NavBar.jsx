import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import styles from './styles/NavBar.module.css';
import { useTranslation } from 'react-i18next';
import { invoke } from '@tauri-apps/api/core';

const NavBar = () => {
  const { t } = useTranslation("common");

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const [status, setStatus] = useState('');

  

  // Estado para almacenar los datos del perfil
  const [profile, setProfile] = useState({
    name: '',
    race: 0,
    gender: 0,
    class: 0,
    totalTime: 0
  });

  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch the profile data once the component mounts
    invoke("fetch_profile", { token })
      .then(data => {
        console.log("Perfil recibido:", data);

        // Encuentra el personaje con más horas de juego
        const maxHoursCharacter = data.reduce((prev, current) => {
          return (prev.totaltime > current.totaltime) ? prev : current;
        });

        // Actualiza el estado con los datos del personaje con más horas
        setProfile({
          name: maxHoursCharacter.name,
          race: maxHoursCharacter.race,
          gender: maxHoursCharacter.gender,
          class: maxHoursCharacter.class,
          totalTime: maxHoursCharacter.totaltime
        });
      })
      .catch(error => {
        console.error("Error al obtener perfil:", error);
      });
  }, [token]);

  // Función para obtener la imagen de la raza
  const getRaceImage = (race, gender) => {
    return `/races/${race}/${gender}.webp`; // Puedes adaptar esta lógica si necesitas más condiciones según el género
  };

  // Función para obtener la imagen de la clase
  const getClassImage = (classId) => {
    return `/classes/${classId}.webp`;
  };

  // Función para abrir y cerrar el modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = async () => {
    try {
      await invoke('delete_jwt');
      setStatus('Token eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el token:', error);
      setStatus('Error al eliminar el token.');
    }
  };

  return (
    <div className={styles.homeNavBar}>
      <div className={styles.botonUser} onClick={toggleModal}>
        <div className={styles.imagenesUser}>
          {/* Mostrar imagen de la raza y clase con los datos recibidos */}
          <img className={styles.userIcon} src={getRaceImage(profile.race, profile.gender)} alt="User Icon" />
          <img className={styles.classIcon} src={getClassImage(profile.class)} alt="Class Icon" />
        </div>
        <div className={styles.nombreUser}>
          {/* Mostrar el nombre del personaje con más horas */}
          <p className={styles.userName}>{profile.name}</p>
          <p className={styles.userID}>{username}</p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={toggleModal}>&times;</span>
            <h2>Perfil de Usuario</h2>
            <p><strong>Nombre:</strong> {profile.name}</p>
            <button onClick={handleDelete}><Link to="/">{t("Cerrar Sesion")}</Link></button>
            
          </div>
        </div>
      )}

      <button><Link className={styles.navButton} to="/home">{t("home")}</Link></button>
      <button><Link className={styles.navButton} to="/newsScreen">{t("news")}</Link></button>
      <button><Link className={styles.navButton} to="/shopScreen">{t("shop")}</Link></button>
      <button><Link className={styles.navButton} to="/rankingScreen">{t("ranking")}</Link></button>
      <button><Link className={styles.navButton} to="/armoryScreen">{t("armory")}</Link></button>
      <button>{t("addons")}</button>
      <button><Link className={styles.navButton} to="/changelogScreen">{t("changelog")}</Link></button>
      <button><Link className={styles.macrosButton} to="/macrosScreen">{t("Macros")}</Link></button>
    </div>
  );
};

export default NavBar;
