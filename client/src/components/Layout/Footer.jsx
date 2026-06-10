import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950/90 py-4">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs text-gray-500">{t('footer.disclaimer')}</p>
        <p className="text-xs text-gray-600 mt-1">
          {t('footer.madeWith')} · Data from{' '}
          <a className="font-semibold text-emerald-300 hover:text-emerald-200" href="https://sportscore.com/" rel="dofollow">
            SportScore
          </a>
        </p>
      </div>
    </footer>
  );
}
