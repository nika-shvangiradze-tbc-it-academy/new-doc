// src/i18n.js
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en.json";
import kaTranslation from "./locales/ka.json";
import grTranslation from "./locales/gr.json";

const HTML_LANG = { en: "en", gr: "de", ka: "ka" };

i18next.on("languageChanged", (lng) => {
  document.documentElement.lang = HTML_LANG[lng] ?? "en";
});

i18next.use(initReactI18next).init({
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language if translation is missing
  resources: {
    en: { translation: enTranslation },
    ka: { translation: kaTranslation },
    gr: { translation: grTranslation },
  },
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18next;
