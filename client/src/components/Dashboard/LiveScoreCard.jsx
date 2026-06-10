import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import TeamFlag from '../common/TeamFlag';
import { isLive, getMatchStatusDisplay, getTeamName, getStageName, getVenueDisplay } from '../../utils/helpers';

export default function LiveScoreCard({ match, featured = false }) {
  const { t } = useTranslation();
  const { isZh } = useLanguage();
  const live = isLive(match);

  const homeName = getTeamName(match.homeTeam?.code, isZh) || match.homeTeam?.name;
  const awayName = getTeamName(match.awayTeam?.code, isZh) || match.awayTeam?.name;
  const groupLabel = match.group ? getStageName(match.group, isZh) || match.group : '';
  const venueLabel = match.venue ? getVenueDisplay(match.venue, isZh) || match.venue : '';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 border transition-all ${
        live
          ? 'bg-red-950/35 border-red-400/45 shadow-lg shadow-red-500/10'
          : featured
          ? 'bg-emerald-950/35 border-emerald-300/30'
          : 'bg-white/[0.06] border-white/10 hover:border-white/20'
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400 opacity-70" />
      <div className="flex items-center justify-between mb-3">
        <span className="truncate text-xs text-slate-400">{groupLabel || venueLabel}</span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            live
              ? 'bg-red-600 text-white animate-pulse-live'
            : match.status === 'FINISHED' || match.status === 'FT'
              ? 'bg-slate-700 text-slate-300'
              : 'bg-emerald-500/15 text-emerald-200'
          }`}
        >
          {live && <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mr-1 align-middle" />}
          {getMatchStatusDisplay(match, t)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col items-center flex-1 min-w-0">
          <TeamFlag code={match.homeTeam?.code} name={homeName} size="lg" />
          <span className="text-xs text-slate-300 mt-1 text-center truncate w-full">{homeName}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2">
          <span className={`text-3xl font-mono font-bold ${live ? 'text-white' : 'text-gray-300'}`}>
            {match.homeTeam?.score ?? 0}
          </span>
          <span className="text-slate-600 text-lg">-</span>
          <span className={`text-3xl font-mono font-bold ${live ? 'text-white' : 'text-gray-300'}`}>
            {match.awayTeam?.score ?? 0}
          </span>
        </div>
        <div className="flex flex-col items-center flex-1 min-w-0">
          <TeamFlag code={match.awayTeam?.code} name={awayName} size="lg" />
          <span className="text-xs text-slate-300 mt-1 text-center truncate w-full">{awayName}</span>
        </div>
      </div>

      {match.startTime && !live && (
        <p className="text-center text-xs text-slate-500 mt-3">
          {new Date(match.startTime).toLocaleString(isZh ? 'zh-CN' : 'en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}
    </div>
  );
}
