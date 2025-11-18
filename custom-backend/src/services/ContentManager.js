const ContentRepository = require('../repositories/ContentRepository');
const logger = require('../helpers/logger');

class ContentManager {
  constructor() {
    // In-memory cache
    this.cache = new Map();
    this.cacheTTL = process.env.CONTENT_CACHE_TTL || 300000; // 5 minutes default
  }

  /**
   * Get content for a specific page with cache-first strategy
   * @param {string} pageKey - The unique page key
   * @returns {Promise<Object>} Page content with sections
   */
  async getPageContent(pageKey) {
    try {
      // Check cache first
      const cached = this.getFromCache(pageKey);
      if (cached) {
        logger.debug(`Cache hit for page: ${pageKey}`);
        return cached;
      }

      // Cache miss - fetch from database
      logger.debug(`Cache miss for page: ${pageKey}`);
      const page = await ContentRepository.getPageByKey(pageKey);
      
      if (!page) {
        return null;
      }

      // Transform to response format
      const content = this.transformPageContent(page);
      
      // Store in cache
      this.setCache(pageKey, content);
      
      return content;
    } catch (error) {
      logger.error(`Error fetching page content for ${pageKey}:`, error);
      throw error;
    }
  }

  /**
   * Transform page data to API response format
   * @param {Object} page - Sequelize page model instance
   * @returns {Object} Transformed content
   */
  transformPageContent(page) {
    return {
      page: page.page_key,
      title: page.title,
      description: page.description,
      sections: page.sections ? page.sections.map(section => ({
        id: section.section_key,
        type: section.section_type,
        ...section.content
      })) : []
    };
  }

  /**
   * Get item from cache
   * @param {string} key - Cache key
   * @returns {Object|null} Cached data or null
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // Check if cache entry has expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Set item in cache
   * @param {string} key - Cache key
   * @param {Object} data - Data to cache
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.cacheTTL
    });
    
    logger.debug(`Cached content for key: ${key}`);
  }

  /**
   * Invalidate cache for a specific key
   * @param {string} key - Cache key to invalidate
   */
  invalidateCache(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.info(`Cache invalidated for key: ${key}`);
    }
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clearCache() {
    const size = this.cache.size;
    this.cache.clear();
    logger.info(`Cache cleared. Removed ${size} entries`);
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      ttl: this.cacheTTL,
      keys: Array.from(this.cache.keys())
    };
  }
}

module.exports = new ContentManager();
