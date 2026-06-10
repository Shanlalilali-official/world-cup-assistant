const NodeCache = require('node-cache');
const config = require('../config');

// In-memory cache with TTL per data type
const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 30,
  useClones: false,
});

const cacheService = {
  /**
   * Get a cached value
   * @param {string} key - Cache key
   * @returns {*} Cached value or null
   */
  get(key) {
    const value = cache.get(key);
    if (value !== undefined) {
      console.log(`[Cache] HIT: ${key}`);
      return value;
    }
    console.log(`[Cache] MISS: ${key}`);
    return null;
  },

  /**
   * Set a cached value with type-specific TTL
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {string} type - Data type (liveMatch, finishedMatch, standings, etc.)
   */
  set(key, value, type = 'finishedMatch') {
    const ttl = config.cache[type] || 60;
    cache.set(key, value, ttl);
    console.log(`[Cache] SET: ${key} (TTL: ${ttl}s)`);
  },

  /**
   * Delete a cached value
   * @param {string} key - Cache key
   */
  del(key) {
    cache.del(key);
  },

  /**
   * Flush all cache
   */
  flush() {
    cache.flushAll();
    console.log('[Cache] All cache flushed');
  },

  /**
   * Get cache statistics
   */
  getStats() {
    return cache.getStats();
  },

  /**
   * Generate a standardized cache key
   * @param {string} type - Data type
   * @param {string} id - Optional identifier
   */
  key(type, id = '') {
    return id ? `${type}:${id}` : type;
  },
};

module.exports = cacheService;
