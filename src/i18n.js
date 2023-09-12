// i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translations from where you store them (policy.json in this case)
import translations_az from './services/policy.json';

const resources = {
  az: {
    translation: translations_az,
  },
  // Add other language translations here if needed
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'az', // Set the default language here
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
