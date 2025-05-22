import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import styles from './TicketsScreen.module.css';
import Titlebar from './components/Titlebar';
import NavBar from './components/NavBar';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function TicketsScreen() {
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [tickets, setTickets] = useState([]);
    const [isGM, setIsGM] = useState(false);
    const [ticketResponses, setTicketResponses] = useState({});
    const token = localStorage.getItem("token");
    const { t } = useTranslation("common");

    
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

    useEffect(() => {
        if (token) {
            fetchTickets(token);
        }
    }, [token]);

    useEffect(() => {
        const initialResponses = {};
        tickets.forEach(ticket => {
            initialResponses[ticket.id] = ticket.response || "";
        });
        setTicketResponses(initialResponses);
    }, [tickets]);

    async function fetchTickets(token) {
        try {
            const response = await invoke('fetch_tickets', { token });
            console.log('test')
            setTickets(response.tickets || []);
            setIsGM(response.gm);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    }

    function handleResponseChange(ticketId, value) {
        setTicketResponses(prev => ({
            ...prev,
            [ticketId]: value
        }));
    }

    async function handleRespond(ticketId) {
        try {
            const responseText = ticketResponses[ticketId];
            await invoke('update_ticket_response', { ticketId: ticketId, responseMsg: responseText, token: token });
            fetchTickets(token);
            setPopupMessage(t("response_success"));
            setPopupOpen(true);
        } catch (error) {
            console.error("Failed to respond to ticket:", error);
            setPopupMessage(t("response_error"));
            setPopupOpen(true);
        }
    }

    async function handleClose(ticketId) {
        try {
            await invoke('complete_ticket', { ticketId:ticketId, token });
            fetchTickets(token);
            setPopupMessage(t("closed_success"));
            setPopupOpen(true);
        } catch (error) {
            console.error("Failed to close ticket:", error);
            setPopupMessage(t("closed_error"));
            setPopupOpen(true);
        }
    }

    async function handleDelete(ticketId) {
        try {
            console.log(ticketId)
            await invoke('delete_ticket', {ticketId:ticketId, token:token});
            fetchTickets(token);
            setPopupMessage(t("deleted_success"));
            setPopupOpen(true);
        } catch (error) {
            console.error("Failed to delete ticket:", error);
            setPopupMessage(t("deleted_error"));
            setPopupOpen(true);
        }
    }

    return (
        <div className={styles.ticketsContainer} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Titlebar />
            <NavBar />

            <div className={styles.ticketsContent}>
                <div className={styles.ticketsList}>
                    {tickets.length === 0 ? (
                        <p className={styles.notickets}>{t("no_tickets")}</p>
                    ) : (
                        tickets.map((ticket) => (
                            <div className={styles.ticketCard} key={ticket.id}>
                                <img
                                    className={styles.playerImage}
                                    src={`/races/${ticket.race}/${ticket.gender}.webp`}
                                    alt={`${ticket.race} ${ticket.gender}`}
                                />

                                <div className={styles.ticketDetails}>
                                    <div className={styles.ticketMeta}>
                                        <div className={styles.ticketName}>{ticket.name}</div>
                                        <div>{new Date(ticket.createTime * 1000).toLocaleDateString()}</div>
                                        <div>{new Date(ticket.createTime * 1000).toLocaleTimeString([], { [t("hour")]: '2-digit', [t("minute")]: '2-digit' })}</div>
                                        <div className={ticket.completed ? styles.completed : styles.notCompleted}>
                                            {ticket.completed ? t("complete_status") : t("pending_status")}
                                        </div>
                                    </div>

                                    <div className={styles.ticketInfo}>
                                        <label className={styles.label}>{t("description")}:</label>
                                        <textarea
                                            className={styles.descriptionBox}
                                            value={ticket.description}
                                            disabled
                                        />

                                        <label className={styles.label}>{t("response")}:</label>
                                        <textarea
                                            className={styles.responseBox}
                                            value={ticketResponses[ticket.id] || ""}
                                            onChange={(e) => handleResponseChange(ticket.id, e.target.value)}
                                            disabled={!isGM || ticket.completed}
                                            placeholder=""
                                        />

                                        <div className={styles.buttonRow}>
                                            {isGM && !ticket.completed && (
                                                <button className={styles.respondButton} onClick={() => handleRespond(ticket.id)}>{t("answer")}</button>
                                            )}
                                            {isGM && !ticket.completed && (
                                                <button className={styles.closeButton} onClick={() => handleClose(ticket.id)}>{t("complete")}</button>
                                            )}
                                            <button className={styles.deleteButton} onClick={() => handleDelete(ticket.id)}>{t("delete")}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))
                    )}
                </div>
            </div>
            <Popup
                                      open={popupOpen}
                                      onClose={() => setPopupOpen(false)}
                                      modal
                                      closeOnDocumentClick
                                    >
                                      <div className="pwrs-popup-content">
                                        <p>{popupMessage}</p>
                                        <button onClick={() => setPopupOpen(false)}>{t("close")}</button>
                                      </div>
                                    </Popup>
        </div>
    );
}

export default TicketsScreen;
