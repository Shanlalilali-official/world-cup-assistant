import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSchedule } from '../../hooks/useSchedule';
import { getToday } from '../../utils/helpers';
import DateFilter from './DateFilter';
import MatchCard from './MatchCard';
import Loading from '../common/Loading';
import ErrorBanner from '../common/ErrorBanner';
import EmptyState from '../common/EmptyState';

export default function SchedulePage() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const { matches, loading, error, refetch } = useSchedule(selectedDate);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">📅 {t('schedule.title')}</h1>

      <DateFilter selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <Loading />
      ) : matches.length > 0 ? (
        <div className="space-y-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <EmptyState icon="📅" message={t('schedule.noMatches')} />
      )}
    </div>
  );
}
