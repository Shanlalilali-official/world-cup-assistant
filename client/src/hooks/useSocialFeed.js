import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useSocialFeed(hashtag = 'FIFAWorldCup') {
  const [tweets, setTweets] = useState(null);
  const [instagram, setInstagram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [tweetData, instaData] = await Promise.all([
        api.getTweets(hashtag).catch(() => null),
        api.getInstagramPosts(hashtag).catch(() => null),
      ]);
      setTweets(tweetData);
      setInstagram(instaData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [hashtag]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 120000); // Refresh every 2 min
    return () => clearInterval(interval);
  }, [fetchData]);

  return { tweets, instagram, loading, error, refetch: fetchData };
}
