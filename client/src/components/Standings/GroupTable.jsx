import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import TeamFlag from '../common/TeamFlag';
import { getTeamName } from '../../utils/helpers';

export default function GroupTable({ group }) {
  const { t } = useTranslation();
  const { isZh } = useLanguage();

  if (!group?.teams || group.teams.length === 0) {
    return null;
  }

  const groupName = group.name || group.group;

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <h3 className="text-lg font-bold text-white">
          {groupName}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs uppercase border-b border-gray-700">
              <th className="text-left py-2 px-4 w-8">#</th>
              <th className="text-left py-2 px-2">{t('standings.team')}</th>
              <th className="text-center py-2 px-2">{t('standings.played')}</th>
              <th className="text-center py-2 px-2">{t('standings.won')}</th>
              <th className="text-center py-2 px-2">{t('standings.drawn')}</th>
              <th className="text-center py-2 px-2">{t('standings.lost')}</th>
              <th className="text-center py-2 px-2">{t('standings.goalDiff')}</th>
              <th className="text-center py-2 px-3 font-bold">{t('standings.points')}</th>
            </tr>
          </thead>
          <tbody>
            {group.teams.map((team, idx) => {
              const displayName = getTeamName(team.code, isZh) || team.name;
              return (
                <tr
                  key={team.code || team.id || idx}
                  className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                    idx < 2 ? 'bg-primary-600/5' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <TeamFlag code={team.code} name={displayName} size="sm" />
                      <span className="text-white font-medium">{displayName}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 text-gray-300">{team.played ?? 0}</td>
                  <td className="text-center py-3 px-2 text-gray-300">{team.won ?? 0}</td>
                  <td className="text-center py-3 px-2 text-gray-300">{team.drawn ?? 0}</td>
                  <td className="text-center py-3 px-2 text-gray-300">{team.lost ?? 0}</td>
                  <td className="text-center py-3 px-2 text-gray-300">
                    {team.goalDiff ?? 0}
                  </td>
                  <td className="text-center py-3 px-3 font-bold text-white">{team.points ?? 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
