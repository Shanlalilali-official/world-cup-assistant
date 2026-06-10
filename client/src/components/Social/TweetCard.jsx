export default function TweetCard({ post }) {
  if (!post) return null;

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/60 transition-colors">
      {/* Author */}
      <div className="flex items-center gap-2 mb-2">
        {post.author?.avatar ? (
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-8 h-8 rounded-full"
            loading="lazy"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">
            🐦
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-white">{post.author?.name || 'Unknown'}</p>
          <p className="text-xs text-gray-500">@{post.author?.username || 'unknown'}</p>
        </div>
        {post.createdAt && (
          <span className="text-xs text-gray-500 ml-auto">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-gray-200 whitespace-pre-wrap break-words">{post.text}</p>

      {/* Metrics */}
      {post.metrics && (
        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-700/50 text-xs text-gray-500">
          <span>💬 {post.metrics.reply_count || 0}</span>
          <span>🔁 {post.metrics.retweet_count || 0}</span>
          <span>❤️ {post.metrics.like_count || 0}</span>
        </div>
      )}
    </div>
  );
}
