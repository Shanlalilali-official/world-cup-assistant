import { useTranslation } from 'react-i18next';
import { useLiveScores } from '../../hooks/useLiveScores';
import { useLanguage } from '../../context/LanguageContext';
import { TOURNAMENT, VENUES } from '../../utils/constants';
import { formatMatchTime, getTeamName, getVenueDisplay } from '../../utils/helpers';
import LiveScoreCard from './LiveScoreCard';
import CountdownBanner from './CountdownBanner';
import Loading from '../common/Loading';
import ErrorBanner from '../common/ErrorBanner';
import EmptyState from '../common/EmptyState';

export default function Dashboard() {
  const { t } = useTranslation();
  const { isZh } = useLanguage();
  const { liveMatches, todayMatches, loading, error, refetch } = useLiveScores();

  if (loading) return <Loading />;

  const tournamentStart = new Date(`${TOURNAMENT.startDate}T00:00:00-06:00`);
  const tournamentEnd = new Date(`${TOURNAMENT.endDate}T23:59:59-04:00`);
  const now = new Date();
  const progress = Math.max(0, Math.min(100, ((now - tournamentStart) / (tournamentEnd - tournamentStart)) * 100));
  const upcomingMatches = todayMatches
    .filter((match) => match.startTime && new Date(match.startTime) >= now)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const nextMatch = upcomingMatches[0] || todayMatches[0];
  const completedToday = todayMatches.filter((match) => match.status === 'FINISHED' || match.status === 'FT').length;
  const hostNations = isZh ? TOURNAMENT.hostNationsZh : TOURNAMENT.hostNations;

  const statCards = [
    { label: isZh ? '参赛球队' : 'Teams', value: TOURNAMENT.totalTeams, hint: isZh ? '12 个小组' : '12 groups' },
    { label: isZh ? '全部比赛' : 'Matches', value: TOURNAMENT.totalMatches, hint: isZh ? '39 天赛程' : '39 match days' },
    { label: isZh ? '今日比赛' : 'Today', value: todayMatches.length, hint: isZh ? `${completedToday} 场已完赛` : `${completedToday} finished` },
    { label: isZh ? '正在直播' : 'Live', value: liveMatches.length, hint: liveMatches.length > 0 ? 'On air' : (isZh ? '等待开球' : 'Awaiting kickoff') },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/30">
          <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200/80">
              FIFA World Cup 2026
            </p>
            <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="max-w-2xl text-3xl font-black leading-tight text-white md:text-5xl">
                  {isZh ? '赛事中枢' : 'Matchday Command'}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                  {isZh
                    ? '实时比分、赛程节奏、积分形势与新闻线索集中在一个界面。'
                    : 'Live scores, schedule rhythm, standings context, and storylines in one operating view.'}
                </p>
              </div>
              <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-amber-200/80">{isZh ? '主办国' : 'Hosts'}</p>
                <p className="mt-1 text-sm font-semibold text-amber-50">{hostNations.join(' / ')}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <div key={card.label} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{card.label}</p>
                  <p className="mt-2 text-3xl font-black text-white">{card.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-emerald-950/45 p-4">
              <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
                <span>{TOURNAMENT.startDate}</span>
                <span className="font-semibold text-emerald-200">{isZh ? '赛事进度' : 'Tournament progress'}</span>
                <span>{TOURNAMENT.endDate}</span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        <CountdownBanner nextMatch={nextMatch} />
      </section>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <span className="h-2 w-2 rounded-full bg-red-400 shadow-lg shadow-red-500/60 animate-pulse" />
              {t('dashboard.liveNow')}
              <span className="text-sm font-normal text-slate-400">({liveMatches.length})</span>
            </h2>
          </div>

          {liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveMatches.map((match) => (
                <LiveScoreCard key={match.id} match={match} featured />
              ))}
            </div>
          ) : (
            <EmptyState icon="⚽" message={t('dashboard.noLiveMatches')} />
          )}

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">
              {t('dashboard.todayMatches')}
              {todayMatches.length > 0 && (
                <span className="text-sm font-normal text-slate-400 ml-2">({todayMatches.length})</span>
              )}
            </h2>

            {todayMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todayMatches.map((match) => (
                  <LiveScoreCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <EmptyState icon="📅" message={t('schedule.noMatches')} />
            )}
          </section>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">
              {isZh ? '下一场' : 'Next up'}
            </h3>
            {nextMatch ? (
              <div className="mt-4">
                <p className="text-xs text-slate-400">
                  {formatMatchTime(nextMatch.startTime)} · {getVenueDisplay(nextMatch.venue, isZh)}
                </p>
                <p className="mt-3 text-xl font-black text-white">
                  {getTeamName(nextMatch.homeTeam?.code, isZh) || nextMatch.homeTeam?.name}
                </p>
                <p className="text-sm font-semibold text-emerald-200">vs</p>
                <p className="text-xl font-black text-white">
                  {getTeamName(nextMatch.awayTeam?.code, isZh) || nextMatch.awayTeam?.name}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">{t('schedule.noMatches')}</p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">
              {isZh ? '主办城市' : 'Host cities'}
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {VENUES.slice(0, 8).map((venue) => (
                <div key={`${venue.stadium}-${venue.city}`} className="rounded-lg border border-white/10 bg-slate-900/55 px-3 py-2">
                  <p className="truncate text-sm font-semibold text-white">{isZh ? venue.cityZh : venue.city}</p>
                  <p className="truncate text-xs text-slate-500">{isZh ? venue.countryZh : venue.country}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
