import { createContext, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'zh');

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  }, [language, i18n]);

  const value = {
    language,
    setLanguage: (lang) => {
      i18n.changeLanguage(lang);
      setLanguage(lang);
    },
    toggleLanguage,
    isZh: language === 'zh',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
}
