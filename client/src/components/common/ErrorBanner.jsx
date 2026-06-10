import { useTranslation } from 'react-i18next';

export default function ErrorBanner({ message, onRetry }) {
  const { t } = useTranslation();
  return (
    <div className="my-2 rounded-xl border border-red-400/30 bg-red-950/40 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-red-400 text-lg">⚠️</span>
          <p className="text-red-300 text-sm">{message || t('common.error')}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-500"
          >
            {t('common.retry')}
          </button>
        )}
      </div>
    </div>
  );
}
