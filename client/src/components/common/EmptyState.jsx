import { useTranslation } from 'react-i18next';

export default function EmptyState({ icon = '📭', message }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] py-16 text-slate-500">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-sm">{message || t('common.noData')}</p>
    </div>
  );
}
