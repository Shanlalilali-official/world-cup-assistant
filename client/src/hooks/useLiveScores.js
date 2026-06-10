import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { subscribeToLiveScores } from '../services/websocket';

export function useLiveScores() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getTodayMatches();
      setMatches(data.matches || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Subscribe to real-time score updates via WebSocket
    const unsubscribe = subscribeToLiveScores((data) => {
      if (data.matches) {
        setMatches((prev) => {
          const updated = [...prev];
          for (const liveMatch of data.matches) {
            const idx = updated.findIndex((m) => m.id === liveMatch.id);
            if (idx >= 0) {
              updated[idx] = { ...updated[idx], ...liveMatch };
            } else {
              updated.push(liveMatch);
            }
          }
          return updated;
        });
      }
    });

    // Fallback: poll every 60 seconds if WebSocket not available
    const pollInterval = setInterval(fetchData, 60000);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [fetchData]);

  const liveMatches = matches.filter(
    (m) => m.status === 'LIVE' || m.status === 'IN_PLAY' || m.status === 'HALFTIME'
  );
  const todayMatches = matches;

  return { liveMatches, todayMatches, loading, error, refetch: fetchData };
}
