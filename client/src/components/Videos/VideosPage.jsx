import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import Loading from '../common/Loading';
import ErrorBanner from '../common/ErrorBanner';
import EmptyState from '../common/EmptyState';

export default function VideosPage() {
  const { t } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVideos(query);
      setVideos(data.videos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData('FIFA World Cup 2026'); }, [fetchData]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">🎬 Match Highlights</h1>
        <div className="flex gap-2">
          {['FIFA World Cup 2026 highlights', 'World Cup 2026 goals', 'World Cup 2026 best moments'].map((q) => (
            <button
              key={q}
              onClick={() => fetchData(q)}
              className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
            >
              {q.split(' ').slice(2, 4).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => fetchData()} />}

      {loading ? (
        <Loading />
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-colors">
              <div className="aspect-video">
                {video.embedUrl ? (
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : video.thumbnail && (
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-white line-clamp-2">{video.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">{video.channelTitle}</span>
                  {video.publishedAt && (
                    <span className="text-xs text-gray-500">{new Date(video.publishedAt).toLocaleDateString()}</span>
                  )}
                </div>
                {video.isFallback && (
                  <p className="text-xs text-yellow-500 mt-1">⚠️ Using official FIFA channel (API key not configured)</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="🎬" message="No videos found. Try a different search." />
      )}
    </div>
  );
}
