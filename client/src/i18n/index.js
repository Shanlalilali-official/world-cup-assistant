import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zh from '../../public/locales/zh.json';
import en from '../../public/locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
  },
  lng: 'zh', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
