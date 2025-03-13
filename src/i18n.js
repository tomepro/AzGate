import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enCommon from "../locales/en/common.json";
import esCommon from "../locales/es/common.json";
import zhCommon from "../locales/zh/common.json";
import caCommon from "../locales/ca/common.json";

// Initialize i18next
i18n
  .use(LanguageDetector) // Automatically detects the user's language
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      es: { common: esCommon },
      zh: { common: zhCommon },
      ca: { common: caCommon },
    },
    fallbackLng: "es",
    debug: true, // Set false in production
    lng: localStorage.getItem("language") || "en", // Load saved language or default to English
    interpolation: { escapeValue: false },
  });

export default i18n;
