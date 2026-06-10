import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import SchedulePage from './components/Schedule/SchedulePage';
import StandingsPage from './components/Standings/StandingsPage';
import StatsPage from './components/Stats/StatsPage';
import InjuriesPage from './components/Injuries/InjuriesPage';
import SocialWall from './components/Social/SocialWall';
import MatchDetailPage from './components/MatchDetail/MatchDetailPage';
import VideosPage from './components/Videos/VideosPage';
import NewsPage from './components/News/NewsPage';
import HistoricalPage from './components/Historical/HistoricalPage';
import PredictionsPage from './components/Predictions/PredictionsPage';

export default function App() {
  return (
    <LanguageProvider>
      <Router basename="/world-cup-assistant">
        <div className="min-h-screen flex flex-col bg-slate-950 text-white">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="relative flex-1 overflow-auto">
              <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,0.16),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(245,158,11,0.12),transparent_26%),linear-gradient(135deg,#020617_0%,#07111f_48%,#052e16_100%)]" />
              <div className="p-4 md:p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/standings" element={<StandingsPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/injuries" element={<InjuriesPage />} />
                <Route path="/social" element={<SocialWall />} />
                <Route path="/match/:matchId" element={<MatchDetailPage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/history" element={<HistoricalPage />} />
                <Route path="/predictions" element={<PredictionsPage />} />
              </Routes>
              </div>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}
