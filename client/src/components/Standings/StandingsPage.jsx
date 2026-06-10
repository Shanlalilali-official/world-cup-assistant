import { useTranslation } from 'react-i18next';
import { useStandings } from '../../hooks/useStandings';
import GroupTable from './GroupTable';
import Loading from '../common/Loading';
import ErrorBanner from '../common/ErrorBanner';
import EmptyState from '../common/EmptyState';

export default function StandingsPage() {
  const { t } = useTranslation();
  const { standings, loading, error, refetch } = useStandings();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">📊 {t('standings.title')}</h1>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <Loading />
      ) : standings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {standings.map((group, idx) => (
            <GroupTable key={group.name || idx} group={group} />
          ))}
        </div>
      ) : (
        <EmptyState icon="📊" message={t('common.noData')} />
      )}
    </div>
  );
}
