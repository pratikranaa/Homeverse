/**
 * Retry Helper
 * Provides exponential backoff retry logic for external API calls
 */

const logger = require('./logger');

/**
 * Default retry configuration
 */
const DEFAULT_CONFIG = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  factor: 2 // Exponential factor
};

/**
 * Calculate exponential backoff delay
 * @param {number} attempt - Current attempt number (0-indexed)
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} factor - Exponential factor
 * @param {number} maxDelay - Maximum delay in milliseconds
 * @returns {number} Delay in milliseconds
 */
const calculateDelay = (attempt, baseDelay = DEFAULT_CONFIG.baseDelay, factor = DEFAULT_CONFIG.factor, maxDelay = DEFAULT_CONFIG.maxDelay) => {
  const delay = baseDelay * Math.pow(factor, attempt);
  return Math.min(delay, maxDelay);
};

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Execute function with retry logic and exponential backoff
 * @param {Function} fn - Async function to execute
 * @param {Object} options - Retry options
 * @param {number} options.maxAttempts - Maximum number of attempts
 * @param {number} options.baseDelay - Base delay in milliseconds
 * @param {number} options.factor - Exponential factor
 * @param {number} options.maxDelay - Maximum delay in milliseconds
 * @param {Function} options.onRetry - Callback function called on each retry
 * @param {Function} options.shouldRetry - Function to determine if error should trigger retry
 * @returns {Promise<*>} Result of the function
 * @throws {Error} Last error if all attempts fail
 */
const withRetry = async (fn, options = {}) => {
  const config = { ...DEFAULT_CONFIG, ...options };
  const { maxAttempts, baseDelay, factor, maxDelay, onRetry, shouldRetry } = config;

  let lastError;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      logger.debug(`Attempt ${attempt + 1}/${maxAttempts}`);
      const result = await fn();
      
      if (attempt > 0) {
        logger.info(`Success on attempt ${attempt + 1}/${maxAttempts}`);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      
      // Check if we should retry this error
      if (shouldRetry && !shouldRetry(error)) {
        logger.warn(`Error not retryable: ${error.message}`);
        throw error;
      }

      // Check if we have more attempts
      if (attempt < maxAttempts - 1) {
        const delay = calculateDelay(attempt, baseDelay, factor, maxDelay);
        logger.warn(`Attempt ${attempt + 1}/${maxAttempts} failed: ${error.message}. Retrying in ${delay}ms...`);
        
        // Call onRetry callback if provided
        if (onRetry) {
          await onRetry(attempt + 1, error, delay);
        }
        
        await sleep(delay);
      } else {
        logger.error(`All ${maxAttempts} attempts failed. Last error: ${error.message}`);
      }
    }
  }

  // All attempts failed
  throw lastError;
};

/**
 * Create a retry wrapper for a function
 * @param {Function} fn - Function to wrap
 * @param {Object} options - Retry options
 * @returns {Function} Wrapped function with retry logic
 */
const createRetryWrapper = (fn, options = {}) => {
  return async (...args) => {
    return withRetry(() => fn(...args), options);
  };
};

/**
 * Check if error is retryable (network errors, timeouts, 5xx errors)
 * @param {Error} error - Error to check
 * @returns {boolean} True if error should trigger retry
 */
const isRetryableError = (error) => {
  // Network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
    return true;
  }

  // HTTP 5xx errors
  if (error.response && error.response.status >= 500 && error.response.status < 600) {
    return true;
  }

  // HTTP 429 (rate limit)
  if (error.response && error.response.status === 429) {
    return true;
  }

  return false;
};

module.exports = {
  calculateDelay,
  sleep,
  withRetry,
  createRetryWrapper,
  isRetryableError,
  DEFAULT_CONFIG
};
