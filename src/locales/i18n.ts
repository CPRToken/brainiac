// src/locales/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './translations/en';
import { es } from './translations/es';

// ✅ Don’t touch localStorage here (breaks on SSR)
// Just initialize with English, fallback is English
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: 'en',          // default start
  fallbackLng: 'en',  // fallback if missing
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
