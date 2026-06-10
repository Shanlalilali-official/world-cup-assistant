import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import TeamFlag from '../common/TeamFlag';
import { isLive, getMatchStatusDisplay, getTeamName, getStageName, formatMatchTime } from '../../utils/helpers';

export default function MatchCard({ match }) {
  const { t } = useTranslation();
  const { isZh } = useLanguage();
  const live = isLive(match);

  const homeName = getTeamName(match.homeTeam?.code, isZh) || match.homeTeam?.name;
  const awayName = getTeamName(match.awayTeam?.code, isZh) || match.awayTeam?.name;
  const groupLabel = match.group ? getStageName(match.group, isZh) || match.group : '';

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
        live
          ? 'bg-gray-800/80 border-red-500/50'
          : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50'
      }`}
    >
      <div className="w-16 text-center flex-shrink-0">
        {live ? (
          <span className="text-xs font-bold text-red-400 animate-pulse">LIVE</span>
        ) : (
          <span className="text-xs text-gray-400">{formatMatchTime(match.startTime)}</span>
        )}
        {groupLabel && <p className="text-xs text-gray-600 mt-0.5">{groupLabel}</p>}
      </div>

      <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
        <span className="text-sm text-gray-200 truncate">{homeName}</span>
        <TeamFlag code={match.homeTeam?.code} name={homeName} size="sm" />
      </div>

      <div className="flex items-center gap-2 px-2">
        <span className={`text-xl font-mono font-bold ${live ? 'text-white' : 'text-gray-300'}`}>
          {match.homeTeam?.score ?? 0}
        </span>
        <span className="text-gray-600">:</span>
        <span className={`text-xl font-mono font-bold ${live ? 'text-white' : 'text-gray-300'}`}>
          {match.awayTeam?.score ?? 0}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <TeamFlag code={match.awayTeam?.code} name={awayName} size="sm" />
        <span className="text-sm text-gray-200 truncate">{awayName}</span>
      </div>

      <div className="w-20 text-right flex-shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          live ? 'bg-red-600/30 text-red-400' : 'bg-gray-700 text-gray-400'
        }`}>
          {getMatchStatusDisplay(match, t)}
        </span>
      </div>
    </div>
  );
}
