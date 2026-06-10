export default function InstaCard({ post }) {
  if (!post) return null;

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-800/60 transition-colors">
      {post.mediaUrl ? (
        <img
          src={post.mediaUrl}
          alt={post.caption || 'Instagram post'}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-32 bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
          <span className="text-3xl">📷</span>
        </div>
      )}
      <div className="p-3">
        <p className="text-xs text-gray-400 mb-1">@{post.username || 'instagram'}</p>
        {post.caption && (
          <p className="text-sm text-gray-200 line-clamp-3">{post.caption}</p>
        )}
        {post.likes != null && (
          <p className="text-xs text-gray-500 mt-1">❤️ {post.likes} likes</p>
        )}
      </div>
    </div>
  );
}
