import { useTranslation } from 'react-i18next';
import TopScorers from './TopScorers';
import PlayerRatings from './PlayerRatings';

export default function StatsPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">📈 {t('stats.title')}</h1>
      <div className="space-y-6">
        <TopScorers />
        <PlayerRatings />
      </div>
    </div>
  );
}
