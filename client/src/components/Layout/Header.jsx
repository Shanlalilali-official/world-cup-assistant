import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';

export default function Header() {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-emerald-400/25 bg-emerald-400/10 text-2xl">⚽</span>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              {t('app.title')}
            </h1>
            <p className="text-xs text-emerald-100/65">{t('app.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Switch language"
          >
            <span>{language === 'zh' ? '🌐 中' : '🌐 EN'}</span>
            <span className="text-xs text-gray-500">|</span>
            <span className={language === 'zh' ? 'text-emerald-300' : 'text-gray-500'}>中文</span>
            <span className="text-xs text-gray-500">/</span>
            <span className={language === 'en' ? 'text-emerald-300' : 'text-gray-500'}>EN</span>
          </button>
        </div>
      </div>
    </header>
  );
}
