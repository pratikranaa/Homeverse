/**
 * Cache Manager Helper
 * Provides in-memory caching logic for content management
 * Implements cache-first strategy with TTL and invalidation support
 */

const logger = require('./logger');

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttlMap = new Map();
    this.defaultTTL = parseInt(process.env.CACHE_TTL || '3600', 10) * 1000; // Default 1 hour in ms
  }

  /**
   * Generate cache key
   * @param {string} prefix - Cache key prefix
   * @param {string} identifier - Cache key identifier
   * @returns {string} Cache key
   */
  generateKey(prefix, identifier) {
    return `${prefix}:${identifier}`;
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null if not found or expired
   */
  get(key) {
    // Check if key exists
    if (!this.cache.has(key)) {
      logger.debug(`Cache miss: ${key}`);
      return null;
    }

    // Check if expired
    const expiresAt = this.ttlMap.get(key);
    if (expiresAt && Date.now() > expiresAt) {
      logger.debug(`Cache expired: ${key}`);
      this.delete(key);
      return null;
    }

    logger.debug(`Cache hit: ${key}`);
    return this.cache.get(key);
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in seconds (optional)
   */
  set(key, value, ttl = null) {
    this.cache.set(key, value);
    
    const ttlMs = (ttl || this.defaultTTL / 1000) * 1000;
    const expiresAt = Date.now() + ttlMs;
    this.ttlMap.set(key, expiresAt);

    logger.debug(`Cache set: ${key} (TTL: ${ttlMs}ms)`);
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
    this.ttlMap.delete(key);
    logger.debug(`Cache deleted: ${key}`);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    this.ttlMap.clear();
    logger.info('Cache cleared');
  }

  /**
   * Invalidate cache by prefix
   * @param {string} prefix - Cache key prefix to invalidate
   */
  invalidateByPrefix(prefix) {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.delete(key);
        count++;
      }
    }
    logger.info(`Cache invalidated by prefix: ${prefix} (${count} entries)`);
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Get or set pattern - retrieve from cache or execute function and cache result
   * @param {string} key - Cache key
   * @param {Function} fn - Async function to execute if cache miss
   * @param {number} ttl - Time to live in seconds (optional)
   * @returns {Promise<*>} Cached or fresh value
   */
  async getOrSet(key, fn, ttl = null) {
    // Try to get from cache
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    try {
      const value = await fn();
      this.set(key, value, ttl);
      return value;
    } catch (error) {
      logger.error(`Error in getOrSet for key ${key}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
const cacheManager = new CacheManager();

module.exports = cacheManager;
