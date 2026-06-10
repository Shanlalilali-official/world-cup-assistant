import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import TeamFlag from '../common/TeamFlag';
import Loading from '../common/Loading';
import ErrorBanner from '../common/ErrorBanner';
import { getTeamName } from '../../utils/helpers';

export default function TopScorers() {
  const { t } = useTranslation();
  const { isZh } = useLanguage();
  const [scorers, setScorers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getTopScorers();
      const list = data?.scorers || data || [];
      setScorers(Array.isArray(list) ? list.slice(0, 20) : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loading />;
  if (error) return <ErrorBanner message={error} onRetry={fetchData} />;

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <h3 className="text-lg font-bold text-white">⚽ {t('stats.topScorers')}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs uppercase border-b border-gray-700">
              <th className="text-left py-2 px-4 w-8">#</th>
              <th className="text-left py-2 px-2">{t('stats.player')}</th>
              <th className="text-left py-2 px-2">{t('stats.team')}</th>
              <th className="text-center py-2 px-2">{t('stats.goals')}</th>
              <th className="text-center py-2 px-2">{t('stats.assists')}</th>
              <th className="text-center py-2 px-2">{t('stats.matches')}</th>
            </tr>
          </thead>
          <tbody>
            {scorers.map((s, idx) => (
              <tr key={s.id || idx} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="py-3 px-4 text-gray-500">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                </td>
                <td className="py-3 px-2 text-white font-medium">{s.player || s.name}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1.5">
                    <TeamFlag code={s.teamCode || s.team_code} name={getTeamName(s.teamCode || s.team_code, isZh) || s.team || s.team_name} size="sm" />
                    <span className="text-gray-300">{getTeamName(s.teamCode || s.team_code, isZh) || s.team || s.team_name}</span>
                  </div>
                </td>
                <td className="text-center py-3 px-2 text-accent-400 font-bold">{s.goals ?? 0}</td>
                <td className="text-center py-3 px-2 text-gray-300">{s.assists ?? 0}</td>
                <td className="text-center py-3 px-2 text-gray-400">{s.matches ?? s.appearances ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
