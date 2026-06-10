import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import TeamFlag from '../common/TeamFlag';
import Loading from '../common/Loading';
import ErrorBanner from '../common/ErrorBanner';

function StatBar({ label, homeValue, awayValue, max }) {
  const total = (homeValue + awayValue) || 1;
  const homePct = (homeValue / total) * 100;
  const awayPct = (awayValue / total) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span className="font-mono">{homeValue}</span>
        <span>{label}</span>
        <span className="font-mono">{awayValue}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-700">
        <div className="bg-blue-500 transition-all" style={{ width: `${homePct}%` }} />
        <div className="w-1 bg-gray-800" />
        <div className="bg-red-500 transition-all" style={{ width: `${awayPct}%` }} />
      </div>
    </div>
  );
}

function EventIcon({ type }) {
  const icons = {
    goal: '⚽', penalty: '🥅', own_goal: '😵', yellow_card: '🟨',
    red_card: '🟥', substitution: '🔄', var: '📺', whistle: '⏱️',
  };
  return <span className="text-sm">{icons[type] || '📌'}</span>;
}

export default function MatchDetailPage() {
  const { t } = useTranslation();
  const { matchId } = useParams();
  const [detail, setDetail] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [detailData, timelineData] = await Promise.all([
        api.getMatchDetail(matchId).catch(() => null),
        api.getMatchTimeline(matchId).catch(() => null),
      ]);
      setDetail(detailData);
      setTimeline(timelineData?.events || []);

      if (detailData?.venue) {
        const city = detailData.venue.split(',')[0]?.trim();
        try {
          const w = await api.getCityWeather(city);
          setWeather(w);
        } catch { /* weather is optional */ }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <Loading />;
  if (error) return <ErrorBanner message={error} onRetry={fetchData} />;
  if (!detail) return <ErrorBanner message="Match not found" />;

  const { homeTeam, awayTeam, stats } = detail;
  const isLive = detail.status === 'LIVE' || detail.status === 'IN_PLAY';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Match header */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6 text-center">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center flex-1">
            <TeamFlag code={homeTeam?.code} name={homeTeam?.name} size="xl" />
            <h3 className="text-sm text-gray-300 mt-2">{homeTeam?.name}</h3>
            {homeTeam?.formation && <span className="text-xs text-gray-500">{homeTeam.formation}</span>}
          </div>
          <div>
            <div className="text-5xl font-mono font-bold text-white mb-1">
              {homeTeam?.score ?? 0} - {awayTeam?.score ?? 0}
            </div>
            <span className={`text-sm px-2 py-0.5 rounded-full ${isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-700 text-gray-300'}`}>
              {isLive ? `${detail.minute || 'LIVE'}'` : detail.status}
            </span>
            <p className="text-xs text-gray-500 mt-2">{detail.venue} · {detail.referee}</p>
          </div>
          <div className="flex flex-col items-center flex-1">
            <TeamFlag code={awayTeam?.code} name={awayTeam?.name} size="xl" />
            <h3 className="text-sm text-gray-300 mt-2">{awayTeam?.name}</h3>
            {awayTeam?.formation && <span className="text-xs text-gray-500">{awayTeam.formation}</span>}
          </div>
        </div>
      </div>

      {/* Weather (if available) */}
      {weather && (
        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-3 mb-6 flex items-center gap-3">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="w-10 h-10"
          />
          <div>
            <span className="text-white font-bold">{weather.temp}°C</span>
            <span className="text-gray-400 text-sm ml-2 capitalize">{weather.description}</span>
            <span className="text-gray-500 text-xs ml-2">Humidity: {weather.humidity}%</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Stats */}
        <div className="lg:col-span-2 space-y-6">
          {stats && (
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-4">📊 Match Statistics</h3>
              <StatBar label="xG (Expected Goals)" homeValue={stats.xG?.home ?? 0} awayValue={stats.xG?.away ?? 0} />
              <StatBar label="Possession %" homeValue={stats.possession?.home ?? 50} awayValue={stats.possession?.away ?? 50} />
              <StatBar label="Shots" homeValue={stats.shots?.home ?? 0} awayValue={stats.shots?.away ?? 0} />
              <StatBar label="Shots on Target" homeValue={stats.shotsOnTarget?.home ?? 0} awayValue={stats.shotsOnTarget?.away ?? 0} />
              <StatBar label="Corners" homeValue={stats.corners?.home ?? 0} awayValue={stats.corners?.away ?? 0} />
              <StatBar label="Pass Accuracy %" homeValue={stats.passAccuracy?.home ?? 0} awayValue={stats.passAccuracy?.away ?? 0} />
              <StatBar label="Fouls" homeValue={stats.fouls?.home ?? 0} awayValue={stats.fouls?.away ?? 0} />

              <div className="flex justify-between mt-4 pt-3 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">🟨 Yellows</span>
                  <span className="font-mono text-white">{stats.yellowCards?.home ?? 0} - {stats.yellowCards?.away ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">🟥 Reds</span>
                  <span className="font-mono text-white">{stats.redCards?.home ?? 0} - {stats.redCards?.away ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">👥 Attendance</span>
                  <span className="font-mono text-white">{detail.attendance?.toLocaleString() || '—'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Lineups */}
          {(homeTeam?.lineup?.length > 0 || awayTeam?.lineup?.length > 0) && (
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-4">👥 Lineups</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">{homeTeam?.name}</h4>
                  <ul className="space-y-1">
                    {(homeTeam?.lineup || []).map((p, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-center gap-1">
                        <span className="text-gray-600 w-5">{p.number || i + 1}</span>
                        {p.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-400 mb-2">{awayTeam?.name}</h4>
                  <ul className="space-y-1">
                    {(awayTeam?.lineup || []).map((p, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-center gap-1">
                        <span className="text-gray-600 w-5">{p.number || i + 1}</span>
                        {p.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timeline sidebar */}
        <div className="space-y-4">
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-3">⏱️ Timeline</h3>
            {timeline.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {timeline.map((event, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm py-1 border-b border-gray-700/50 last:border-0">
                    <EventIcon type={event.type} />
                    <span className="font-mono text-gray-500 text-xs w-8">{event.minute}'</span>
                    <span className="text-gray-300 flex-1">{event.player || event.description}</span>
                    {event.team && (
                      <span className={`text-xs ${event.team === 'home' ? 'text-blue-400' : 'text-red-400'}`}>
                        {event.team === 'home' ? homeTeam?.code : awayTeam?.code}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No events recorded yet.</p>
            )}
          </div>

          {/* Prediction box */}
          {detail.prediction && (
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-xl p-4">
              <h3 className="text-sm font-bold text-purple-300 mb-2">🤖 ML Prediction</h3>
              <div className="flex justify-between text-white text-sm">
                <span>{homeTeam?.name}: {detail.prediction.homeWin}%</span>
                <span>Draw: {detail.prediction.draw}%</span>
                <span>{awayTeam?.name}: {detail.prediction.awayWin}%</span>
              </div>
              <div className="flex h-2 mt-2 rounded-full overflow-hidden bg-gray-700">
                <div className="bg-blue-500" style={{ width: `${detail.prediction.homeWin || 33}%` }} />
                <div className="bg-gray-500" style={{ width: `${detail.prediction.draw || 34}%` }} />
                <div className="bg-red-500" style={{ width: `${detail.prediction.awayWin || 33}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
