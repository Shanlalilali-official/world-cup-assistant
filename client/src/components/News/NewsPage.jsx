import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import Loading from '../common/Loading';
import ErrorBanner from '../common/ErrorBanner';
import EmptyState from '../common/EmptyState';

export default function NewsPage() {
  const { t } = useTranslation();
  const { isZh } = useLanguage();
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (withAI = false) => {
    try {
      if (withAI) setSummarizing(true);
      else setLoading(true);
      setError(null);

      const data = await api.getNews({
        summarize: isZh || withAI,
        lang: isZh ? 'zh' : 'en',
      });

      setSources(data.sources || []);
      setAiEnabled(data.summarized === 'ai');
      // If translated (not AI), still mark as having summaries
      if (data.summarized === 'translate') {
        setAiEnabled('translate');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setSummarizing(false);
    }
  }, [isZh]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSummarize = () => fetchData(true);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          {isZh ? '📰 世界杯新闻' : '📰 World Cup News'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleSummarize}
            disabled={summarizing}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors border ${
              summarizing
                ? 'bg-purple-800 text-purple-300 border-purple-700'
                : 'bg-purple-900/40 text-purple-400 border-purple-700/50 hover:bg-purple-800/50'
            }`}
          >
            {summarizing ? (isZh ? '🤖 摘要生成中...' : '🤖 Summarizing...') : (isZh ? '🤖 重新生成摘要' : '🤖 Summarize')}
          </button>
          <button
            onClick={() => fetchData(false)}
            className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
          >
            🔄 {isZh ? '刷新' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => fetchData(false)} />}
      {aiEnabled && (
        <div className={`rounded-lg p-2 mb-4 text-center border ${aiEnabled === 'translate' ? 'bg-blue-900/20 border-blue-700/30' : 'bg-purple-900/20 border-purple-700/30'}`}>
          <span className={`text-xs ${aiEnabled === 'translate' ? 'text-blue-400' : 'text-purple-400'}`}>
            {aiEnabled === 'translate'
              ? (isZh ? '🌐 直译摘要（免费）— 配置AI_API_KEY可获得更高质量摘要' : '🌐 Direct translation (free) — Set AI_API_KEY for better summaries')
              : (isZh ? '🤖 AI摘要已启用' : '🤖 AI summaries enabled')}
          </span>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : sources.length > 0 ? (
        <div className="space-y-6">
          {sources.map((source, sIdx) => (
            <div key={sIdx}>
              <h2 className="text-lg font-semibold text-primary-400 mb-3 flex items-center gap-2">
                📡 {source.source}
                <span className="text-xs text-gray-500 font-normal">
                  ({source.articles.length} {isZh ? '篇' : 'articles'})
                </span>
              </h2>
              <div className="space-y-3">
                {source.articles.map((article, aIdx) => (
                  <a
                    key={aIdx}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-800/40 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/60 hover:border-gray-600 transition-colors"
                  >
                    <h3 className="text-sm font-medium text-white mb-1">
                      {isZh ? article.titleZh || article.displayTitle || article.title : article.title}
                    </h3>

                    {/* AI Summary (highlighted) */}
                    {article.aiSummary ? (
                      <div className="bg-purple-900/20 border-l-2 border-purple-500 pl-3 py-1 my-2 rounded-r">
                        <p className="text-xs text-purple-300 leading-relaxed">{article.aiSummary}</p>
                      </div>
                    ) : article.description ? (
                      <p className="text-xs text-gray-400 line-clamp-3 mb-2">
                        {isZh ? article.descriptionZh || article.displayDescription || article.description : article.description}
                      </p>
                    ) : null}

                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                      {article.pubDate && <span>📅 {new Date(article.pubDate).toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}</span>}
                      {article.source && <span>🏷️ {article.source}</span>}
                      <span className="text-primary-500 hover:underline ml-auto">
                        {isZh ? '阅读原文 →' : 'Read more →'}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="📰" message={isZh ? '暂无新闻' : 'No news articles available.'} />
      )}
    </div>
  );
}
