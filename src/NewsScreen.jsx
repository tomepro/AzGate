import React, { useEffect, useState } from 'react';
import './NewsScreen.css';
import Titlebar from "./components/Titlebar";
import NavBar from './components/NavBar';
import { invoke } from '@tauri-apps/api/core';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

function NewsScreen() {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { t } = useTranslation("common");
  

  useEffect(() => {
    invoke("fetch_news")
      .then((data) => {
        setNews(data);
        setLoading(false);
        console.log("News data:", data);
      })
      .catch((error) => {
        console.error("Error invoking fetch_news:", error);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleNewsClick = (item) => {
    setScrollPosition(document.getElementById('news-content').scrollTop);
    setSelectedNews(item);
  };

  const handleGoBack = () => {
    setSelectedNews(null);
    document.getElementById('news-content').scrollTo({ top: scrollPosition, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="news-container">
        <Titlebar />
        <NavBar />
        <div id="news-content">
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (selectedNews) {
    return (
      <div className="news-container expanded">
        <Titlebar />
        <NavBar />
        <div id="expanded-news-content">
          <div className="expanded-news-header">
            <h2 className="expanded-news-title">{selectedNews.title}</h2>
            <span className="expanded-news-date">{formatDate(selectedNews.created_at)}</span>
            <span className="expanded-news-author">{t("by")}: {selectedNews.author}</span>
          </div>
          {selectedNews.image && <img src={selectedNews.image} alt={selectedNews.title} className="expanded-news-image" />}
          <div className="expanded-news-text">{selectedNews.text}</div>
          <button className="go-back-button" onClick={handleGoBack}>{t("back")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-container">
      <Titlebar />
      <NavBar />
      
      <div id="news-content">
        {news && Array.isArray(news) ? (
          news.map((item) => (
            <div key={item.id} className="news-item-preview" onClick={() => handleNewsClick(item)}>
              <h3 className="news-item-preview-title">{item.title}</h3>
              {item.image && <img src={item.image} alt={item.title} className="news-item-preview-image" />}
            </div>
          ))
        ) : (
          <p className='errorMessage'>{t("no_newsdata")}</p>
        )}
      </div>
    </div>
  );
}

export default NewsScreen;