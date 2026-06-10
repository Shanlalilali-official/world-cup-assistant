import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSocialFeed } from '../../hooks/useSocialFeed';
import TweetCard from './TweetCard';
import InstaCard from './InstaCard';
import Loading from '../common/Loading';
import ErrorBanner from '../common/ErrorBanner';
import EmptyState from '../common/EmptyState';

export default function SocialWall() {
  const { t } = useTranslation();
  const [hashtag, setHashtag] = useState('FIFAWorldCup');
  const [tagInput, setTagInput] = useState('FIFAWorldCup');
  const { tweets, instagram, loading, error, refetch } = useSocialFeed(hashtag);

  const handleSearch = (e) => {
    e.preventDefault();
    setHashtag(tagInput || 'FIFAWorldCup');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">💬 {t('social.title')}</h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Hashtag..."
            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none w-40"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-sm rounded-lg transition-colors"
          >
            🔍
          </button>
        </form>
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* X (Twitter) column */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              🐦 {t('social.twitterFeed')}
              <span className="text-xs text-gray-500">#{hashtag}</span>
            </h2>

            {tweets?.source === 'twitter-embed' ? (
              <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-3">{tweets.note}</p>
                <div
                  className="twitter-embed-container"
                  dangerouslySetInnerHTML={{ __html: tweets.embedHtml }}
                />
              </div>
            ) : tweets?.posts?.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {tweets.posts.map((post) => (
                  <TweetCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState icon="🐦" message={t('social.noPosts')} />
            )}
          </div>

          {/* Instagram column */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              📷 {t('social.instagramFeed')}
              <span className="text-xs text-gray-500">#{hashtag}</span>
            </h2>

            {instagram?.source === 'instagram-embed' ? (
              <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-3">{instagram.note}</p>
                <a
                  href={instagram.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 text-sm hover:underline"
                >
                  View on Instagram →
                </a>
              </div>
            ) : instagram?.posts?.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                {instagram.posts.map((post, idx) => (
                  <InstaCard key={post.id || idx} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState icon="📷" message={t('social.noPosts')} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
