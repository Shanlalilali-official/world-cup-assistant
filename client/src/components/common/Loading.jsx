import { useTranslation } from 'react-i18next';

export default function Loading({ text }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-400 text-sm">{text || t('common.loading')}</p>
    </div>
  );
}
