import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const navItems = [
  { to: '/', icon: '🏠', labelKey: 'nav.dashboard', exact: true },
  { to: '/schedule', icon: '📅', labelKey: 'nav.schedule' },
  { to: '/standings', icon: '📊', labelKey: 'nav.standings' },
  { to: '/stats', icon: '📈', labelKey: 'nav.stats' },
  { to: '/injuries', icon: '🏥', labelKey: 'nav.injuries' },
  { to: '/social', icon: '💬', labelKey: 'nav.social' },
  { to: '/predictions', icon: '🤖', labelKey: 'nav.predictions' },
  { to: '/videos', icon: '🎬', labelKey: 'nav.videos' },
  { to: '/news', icon: '📰', labelKey: 'nav.news' },
  { to: '/history', icon: '🏆', labelKey: 'nav.history' },
];

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="hidden md:flex md:flex-col w-60 border-r border-white/10 bg-slate-950/75 min-h-[calc(100vh-4rem)] sticky top-16 backdrop-blur-xl">
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-400/12 text-emerald-200 border border-emerald-300/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-xs text-slate-500">
          FIFA World Cup 2026™
        </div>
      </div>
    </aside>
  );
}
