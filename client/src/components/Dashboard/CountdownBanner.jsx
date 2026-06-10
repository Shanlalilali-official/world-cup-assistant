import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TOURNAMENT } from '../../utils/constants';
import { formatMatchTime } from '../../utils/helpers';

export default function CountdownBanner({ nextMatch }) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const target = new Date(TOURNAMENT.startDate + 'T00:00:00-06:00'); // Mexico City time (UTC-6)

    function update() {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, started: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        started: false,
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  if (timeLeft.started) {
    return (
      <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-5">
        <p className="text-white text-lg font-bold">
          🏆 {t('dashboard.countdown')}: <span className="text-emerald-300">NOW</span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/80">Kickoff</p>
          <h3 className="mt-2 text-2xl font-black text-white">{t('dashboard.countdown')}</h3>
        </div>
        <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
          {TOURNAMENT.startDate}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {[
          { value: timeLeft.days, label: t('dashboard.days') },
          { value: timeLeft.hours, label: t('dashboard.hours') },
          { value: timeLeft.minutes, label: t('dashboard.minutes') },
          { value: timeLeft.seconds, label: t('dashboard.seconds') },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="grid aspect-square place-items-center rounded-xl border border-white/10 bg-black/25">
              <span className="text-xl font-mono font-bold text-amber-300 md:text-2xl">
                {String(item.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-1 block">{item.label}</span>
          </div>
        ))}
      </div>

      {nextMatch && (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Next scheduled</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {formatMatchTime(nextMatch.startTime)} · {nextMatch.homeTeam?.name} vs {nextMatch.awayTeam?.name}
          </p>
        </div>
      )}
    </div>
  );
}
