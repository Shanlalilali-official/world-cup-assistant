import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import TeamFlag from '../common/TeamFlag';
import Loading from '../common/Loading';
import ErrorBanner from '../common/ErrorBanner';
import { getTeamFlag, getTeamName } from '../../utils/helpers';

// Bilingual data for the historical page
const LABELS = {
  champions: { zh: '👑 历届冠军', en: '👑 Past Champions' },
  records: { zh: '📊 历史纪录', en: '📊 All-Time Records' },
  trivia: { zh: '💡 世界杯趣闻', en: '💡 Did You Know?' },
  countrySearch: { zh: '🔍 查询国家队世界杯历史', en: '🔍 Country World Cup History' },
  searchPlaceholder: { zh: '输入国家代码 (如 BRA, GER, ARG)', en: 'Enter country code (e.g. BRA, GER, ARG)' },
  search: { zh: '查询', en: 'Search' },
  appearances: { zh: '参赛次数', en: 'Appearances' },
  titles: { zh: '冠军次数', en: 'Titles' },
  bestResult: { zh: '最佳战绩', en: 'Best Result' },
  totalWins: { zh: '总胜场', en: 'Total Wins' },
  totalGoals: { zh: '总进球', en: 'Total Goals' },
  topScorer: { zh: '历史最佳射手', en: 'Top Scorer' },
  host: { zh: '主办国', en: 'Host' },
  runnerUp: { zh: '亚军', en: 'Runner-up' },
  score: { zh: '比分', en: 'Score' },
  notFound: { zh: '未找到该国家队数据', en: 'Country not found' },
  mostTitles: { zh: '最多冠军', en: 'Most Titles' },
  mostGoalsPlayer: { zh: '进球最多(球员)', en: 'Most Goals (Player)' },
  mostGoalsTournament: { zh: '单届进球最多', en: 'Most Goals (Tournament)' },
  fastestGoal: { zh: '最快进球', en: 'Fastest Goal' },
  biggestWin: { zh: '最大分差', en: 'Biggest Win' },
  highestScoring: { zh: '最高比分比赛', en: 'Highest Scoring Match' },
  youngestPlayer: { zh: '最年轻球员', en: 'Youngest Player' },
  oldestPlayer: { zh: '最年长球员', en: 'Oldest Player' },
  totalTournaments: { zh: '历届总数', en: 'Total Tournaments' },
  totalGoalsAll: { zh: '历史总进球', en: 'Total Goals' },
  totalMatches: { zh: '历史总场次', en: 'Total Matches' },
};

const COUNTRY_ZH = {
  Argentina: '阿根廷',
  Austria: '奥地利',
  Belgium: '比利时',
  Brazil: '巴西',
  Chile: '智利',
  Croatia: '克罗地亚',
  Czechoslovakia: '捷克斯洛伐克',
  Egypt: '埃及',
  England: '英格兰',
  France: '法国',
  Germany: '德国',
  Hungary: '匈牙利',
  Italy: '意大利',
  Japan: '日本',
  'Korea/Japan': '韩国/日本',
  Mexico: '墨西哥',
  Netherlands: '荷兰',
  Portugal: '葡萄牙',
  Qatar: '卡塔尔',
  Russia: '俄罗斯',
  'South Africa': '南非',
  'South Korea': '韩国',
  Spain: '西班牙',
  Sweden: '瑞典',
  Switzerland: '瑞士',
  Turkey: '土耳其',
  Uruguay: '乌拉圭',
  USA: '美国',
  'United States': '美国',
  'West Germany': '西德',
};

const PHRASE_ZH = [
  [/Champion/g, '冠军'],
  [/Runner-up/g, '亚军'],
  [/Third place/g, '季军'],
  [/Fourth place/g, '第四名'],
  [/Quarter-finals/g, '四分之一决赛'],
  [/Round of 16/g, '16强'],
  [/goals/g, '球'],
  [/goal/g, '球'],
  [/seconds/g, '秒'],
  [/years old/g, '岁'],
];

function localizeCountry(value, isZh) {
  if (!isZh || !value) return value;
  return COUNTRY_ZH[value] || value;
}

function localizeText(value, isZh) {
  if (!isZh || value == null) return value;
  let output = String(value);
  Object.entries(COUNTRY_ZH).forEach(([en, zh]) => {
    output = output.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), zh);
  });
  PHRASE_ZH.forEach(([pattern, replacement]) => {
    output = output.replace(pattern, replacement);
  });
  return output
    .replace(/\(aet\)/g, '（加时）')
    .replace(/pens/g, '点球')
    .replace(/vs/g, 'vs');
}

const TRIVIA_ZH = {
  'The 2026 World Cup is the first to feature 48 teams, up from 32.': '2026年世界杯首次扩军至48支球队，此前为32支。',
  'The first World Cup was held in Uruguay in 1930 with only 13 teams.': '首届世界杯于1930年在乌拉圭举行，当时只有13支球队参赛。',
  'Brazil is the only country to have played in every World Cup tournament.': '巴西是唯一参加过每一届世界杯的国家。',
  'The World Cup trophy weighs 6.175 kg and is made of 18-carat gold.': '世界杯奖杯重6.175公斤，由18K金制成。',
  'The fastest World Cup goal was scored by Hakan Şükür in 11 seconds (2002).': '世界杯最快进球由哈坎·许库尔在2002年打进，仅用11秒。',
  'In 2026, 16 host cities across 3 countries will stage matches.': '2026年世界杯将在3个国家的16座主办城市举行。',
  'The 2026 World Cup will feature 104 matches, up from 64 in 2022.': '2026年世界杯共有104场比赛，多于2022年的64场。',
  'No country has won the World Cup three times in a row.': '还没有国家连续三届赢得世界杯冠军。',
  '4 nations make their World Cup debut in 2026: Cape Verde, Curaçao, Jordan, Uzbekistan.': '佛得角、库拉索、约旦、乌兹别克斯坦将在2026年首次亮相世界杯。',
  'Estadio Azteca will become the first stadium to host World Cup matches in three tournaments.': '阿兹特克体育场将成为首座三次承办世界杯比赛的球场。',
};

function L({ id, isZh }) {
  return LABELS[id]?.[isZh ? 'zh' : 'en'] || id;
}

function WinnerCard({ w, isZh }) {
  const winCode = w.winner === 'Brazil' ? 'BRA' : w.winner === 'Argentina' ? 'ARG'
    : w.winner === 'Germany' || w.winner === 'West Germany' ? 'GER'
    : w.winner === 'France' ? 'FRA' : w.winner === 'Italy' ? 'ITA'
    : w.winner === 'Spain' ? 'ESP' : w.winner === 'England' ? 'ENG'
    : w.winner === 'Uruguay' ? 'URU' : w.winner === 'Netherlands' ? 'NED' : '';

  const runCode = w.runnerUp === 'Brazil' ? 'BRA' : w.runnerUp === 'Argentina' ? 'ARG'
    : w.runnerUp === 'Germany' || w.runnerUp === 'West Germany' ? 'GER'
    : w.runnerUp === 'France' ? 'FRA' : w.runnerUp === 'Italy' ? 'ITA'
    : w.runnerUp === 'Spain' ? 'ESP' : w.runnerUp === 'England' ? 'ENG'
    : w.runnerUp === 'Uruguay' ? 'URU' : w.runnerUp === 'Netherlands' ? 'NED'
    : w.runnerUp === 'Croatia' ? 'CRO' : w.runnerUp === 'Czechoslovakia' ? 'CZE'
    : w.runnerUp === 'Hungary' ? 'HUN' : w.runnerUp === 'Sweden' ? 'SWE' : '';

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800/30 border border-gray-700/50 rounded-lg hover:bg-gray-800/50">
      <span className="text-sm font-mono text-gray-500 w-10 flex-shrink-0">{w.year}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {winCode && <TeamFlag code={winCode} name={w.winner} size="sm" />}
          <span className="text-sm text-white font-medium truncate">
            {getTeamName(winCode, isZh) || localizeCountry(w.winner, isZh)}
          </span>
          <span className="text-xs text-accent-400 font-mono ml-1">{localizeText(w.score, isZh)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
          vs {runCode && <TeamFlag code={runCode} name={w.runnerUp} size="sm" />}
          <span>{getTeamName(runCode, isZh) || localizeCountry(w.runnerUp, isZh)}</span>
          <span className="mx-1">·</span>
          <span>{L({ id: 'host', isZh })}: {localizeCountry(w.host, isZh)}</span>
        </p>
      </div>
    </div>
  );
}

function RecordCard({ icon, labelId, value, isZh }) {
  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-3">
      <span className="text-lg">{icon}</span>
      <p className="text-[11px] text-gray-500 mt-0.5">{L({ id: labelId, isZh })}</p>
      <p className="text-xs text-white font-bold mt-0.5">{value}</p>
    </div>
  );
}

export default function HistoricalPage() {
  const { t } = useTranslation();
  const { isZh } = useLanguage();
  const [winners, setWinners] = useState([]);
  const [records, setRecords] = useState(null);
  const [trivia, setTrivia] = useState([]);
  const [countryCode, setCountryCode] = useState('');
  const [countryHistory, setCountryHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [w, r, tData] = await Promise.all([
        api.getHistoricalWinners(),
        api.getHistoricalRecords(),
        api.getHistoricalTrivia(),
      ]);
      setWinners(w.winners || []);
      setRecords(r);
      setTrivia(tData.facts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCountrySearch = async (e) => {
    e.preventDefault();
    if (!countryCode.trim()) return;
    setSearching(true);
    try {
      const data = await api.getCountryHistory(countryCode.trim().toUpperCase());
      setCountryHistory(data);
    } catch {
      setCountryHistory({ error: true });
    } finally {
      setSearching(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorBanner message={error} onRetry={fetchData} />;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">
        {isZh ? '🏆 世界杯历史数据' : '🏆 World Cup History'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Winners */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
            <h2 className="text-lg font-bold text-white mb-3">{L({ id: 'champions', isZh })}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {winners.map((w, i) => <WinnerCard key={w.year} w={w} isZh={isZh} />)}
            </div>
          </div>

          {/* Country search */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
            <h2 className="text-lg font-bold text-white mb-3">{L({ id: 'countrySearch', isZh })}</h2>
            <form onSubmit={handleCountrySearch} className="flex gap-2 mb-3">
              <input
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder={L({ id: 'searchPlaceholder', isZh })}
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              />
              <button type="submit" disabled={searching}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors">
                {searching ? '...' : L({ id: 'search', isZh })}
              </button>
            </form>
            {countryHistory && (
              <div className="bg-gray-900/50 rounded-lg p-3">
                {countryHistory.error ? (
                  <p className="text-sm text-red-400">{L({ id: 'notFound', isZh })}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-400">{L({ id: 'appearances', isZh })}:</span> <span className="text-white font-mono">{countryHistory.appearances}</span></div>
                    <div><span className="text-gray-400">{L({ id: 'titles', isZh })}:</span> <span className="text-accent-400 font-bold font-mono">{countryHistory.titles}</span></div>
                    <div className="col-span-2"><span className="text-gray-400">{L({ id: 'bestResult', isZh })}:</span> <span className="text-white">{localizeText(countryHistory.bestResult, isZh)}</span></div>
                    <div><span className="text-gray-400">{L({ id: 'totalWins', isZh })}:</span> <span className="text-white font-mono">{countryHistory.totalWins}</span></div>
                    <div><span className="text-gray-400">{L({ id: 'totalGoals', isZh })}:</span> <span className="text-white font-mono">{countryHistory.totalGoals}</span></div>
                    <div className="col-span-2"><span className="text-gray-400">{L({ id: 'topScorer', isZh })}:</span> <span className="text-white">{localizeText(countryHistory.topScorer, isZh)}</span></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Records + Trivia */}
        <div className="space-y-6">
          {records && (
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
              <h2 className="text-lg font-bold text-white mb-3">{L({ id: 'records', isZh })}</h2>
              <div className="space-y-2">
                <RecordCard icon="👑" labelId="mostTitles" value={`${localizeCountry(records.mostTitles?.team, isZh)} (${records.mostTitles?.count})`} isZh={isZh} />
                <RecordCard icon="⚽" labelId="mostGoalsPlayer" value={`${records.mostGoalsPlayer?.player} (${records.mostGoalsPlayer?.goals})`} isZh={isZh} />
                <RecordCard icon="🔥" labelId="mostGoalsTournament" value={`${records.mostGoalsTournament?.player} · ${records.mostGoalsTournament?.goals}${isZh ? '球' : ' goals'} (${records.mostGoalsTournament?.year})`} isZh={isZh} />
                <RecordCard icon="⚡" labelId="fastestGoal" value={`${records.fastestGoal?.player} — ${localizeText(records.fastestGoal?.time, isZh)}`} isZh={isZh} />
                <RecordCard icon="📊" labelId="highestScoring" value={localizeText(records.mostGoalsMatch?.score, isZh)} isZh={isZh} />
                <RecordCard icon="👶" labelId="youngestPlayer" value={`${records.youngestPlayer?.player} (${records.youngestPlayer?.age}${isZh ? '岁' : ''})`} isZh={isZh} />
                <RecordCard icon="👴" labelId="oldestPlayer" value={`${records.oldestPlayer?.player} (${records.oldestPlayer?.age}${isZh ? '岁' : ''})`} isZh={isZh} />
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-gray-700">
                  <div className="text-center"><div className="text-lg font-mono font-bold text-white">{records.totalTournaments}</div><div className="text-[10px] text-gray-500">{L({ id: 'totalTournaments', isZh })}</div></div>
                  <div className="text-center"><div className="text-lg font-mono font-bold text-white">{records.totalGoals}</div><div className="text-[10px] text-gray-500">{L({ id: 'totalGoalsAll', isZh })}</div></div>
                  <div className="text-center"><div className="text-lg font-mono font-bold text-white">{records.totalMatches}</div><div className="text-[10px] text-gray-500">{L({ id: 'totalMatches', isZh })}</div></div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
            <h2 className="text-lg font-bold text-white mb-3">{L({ id: 'trivia', isZh })}</h2>
            <div className="space-y-2">
              {trivia.slice(0, 6).map((t, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-gray-900/30 rounded-lg">
                  <span className="text-lg flex-shrink-0">{t.icon}</span>
                  <p className="text-xs text-gray-300">{isZh ? TRIVIA_ZH[t.fact] || t.fact : t.fact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
