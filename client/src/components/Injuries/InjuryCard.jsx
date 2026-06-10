import { useTranslation } from 'react-i18next';
import TeamFlag from '../common/TeamFlag';

const statusStyles = {
  out: 'bg-red-600/20 text-red-400 border-red-600/30',
  doubtful: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  returned: 'bg-green-600/20 text-green-400 border-green-600/30',
};

const statusKeys = {
  out: 'injuries.out',
  doubtful: 'injuries.doubtful',
  returned: 'injuries.returned',
};

export default function InjuryCard({ injury }) {
  const { t } = useTranslation();
  const status = injury.status?.toLowerCase() || 'out';
  const style = statusStyles[status] || statusStyles.out;

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/60 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <TeamFlag code={injury.teamCode || injury.team?.code} name={injury.team || injury.team?.name} size="sm" />
          <span className="text-xs text-gray-400">{injury.team || injury.team?.name}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${style}`}>
          {t(statusKeys[status] || 'injuries.out')}
        </span>
      </div>

      <h4 className="text-white font-medium mb-1">{injury.player || injury.playerName}</h4>

      <div className="space-y-1 text-xs text-gray-400">
        {injury.injury && (
          <p>
            <span className="text-gray-500">{t('injuries.injury')}: </span>
            {injury.injury}
          </p>
        )}
        {injury.expectedReturn && (
          <p>
            <span className="text-gray-500">{t('injuries.expectedReturn')}: </span>
            {injury.expectedReturn}
          </p>
        )}
      </div>
    </div>
  );
}
