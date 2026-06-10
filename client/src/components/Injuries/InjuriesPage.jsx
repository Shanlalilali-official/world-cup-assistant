import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import InjuryCard from './InjuryCard';
import Loading from '../common/Loading';
import ErrorBanner from '../common/ErrorBanner';
import EmptyState from '../common/EmptyState';

export default function InjuriesPage() {
  const { t } = useTranslation();
  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getInjuries();
      const list = data?.injuries || data || [];
      setInjuries(Array.isArray(list) ? list : []);
      setLastUpdated(data?.lastUpdated || new Date().toISOString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1800000); // 30 min refresh
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">🏥 {t('injuries.title')}</h1>
        {lastUpdated && (
          <span className="text-xs text-gray-500">
            Updated: {new Date(lastUpdated).toLocaleString()}
          </span>
        )}
      </div>

      {error && <ErrorBanner message={error} onRetry={fetchData} />}

      {loading ? (
        <Loading />
      ) : injuries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {injuries.map((injury, idx) => (
            <InjuryCard key={injury.id || idx} injury={injury} />
          ))}
        </div>
      ) : (
        <EmptyState icon="🏥" message={t('injuries.noInjuries')} />
      )}
    </div>
  );
}
