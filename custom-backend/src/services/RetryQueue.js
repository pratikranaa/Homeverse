const logger = require('../helpers/logger');

/**
 * Service for handling retry logic with exponential backoff
 * Requirements: 1.3, 2.3
 */
class RetryQueue {
  constructor() {
    this.maxAttempts = 3;
    this.baseDelay = 1000; // 1 second
  }

  /**
   * Calculate exponential backoff delay
   * @param {number} attempt - Current attempt number (0-indexed)
   * @returns {number} Delay in milliseconds
   */
  calculateDelay(attempt) {
    // Exponential backoff: 1s, 2s, 4s
    return this.baseDelay * Math.pow(2, attempt);
  }

  /**
   * Sleep for specified duration
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Execute operation with retry logic
   * @param {Function} operation - Async function to execute
   * @param {Object} context - Context information for logging
   * @returns {Promise<Object>} Operation result
   */
  async executeWithRetry(operation, context = {}) {
    let lastError = null;
    let lastResult = null;

    for (let attempt = 0; attempt < this.maxAttempts; attempt++) {
      try {
        logger.info('Executing operation', {
          ...context,
          attempt: attempt + 1,
          maxAttempts: this.maxAttempts
        });

        const result = await operation();

        // Check if operation was successful
        if (result.success) {
          if (attempt > 0) {
            logger.info('Operation succeeded after retry', {
              ...context,
              attempt: attempt + 1,
              totalAttempts: attempt + 1
            });
          }
          return {
            success: true,
            result,
            attempts: attempt + 1
          };
        }

        // Operation returned failure, prepare for retry
        lastResult = result;
        lastError = result.error || 'Operation returned failure';

        logger.warn('Operation failed, will retry', {
          ...context,
          attempt: attempt + 1,
          maxAttempts: this.maxAttempts,
          error: lastError,
          statusCode: result.statusCode
        });

        // Don't sleep after the last attempt
        if (attempt < this.maxAttempts - 1) {
          const delay = this.calculateDelay(attempt);
          logger.info('Waiting before retry', {
            ...context,
            attempt: attempt + 1,
            delayMs: delay
          });
          await this.sleep(delay);
        }
      } catch (error) {
        lastError = error.message;
        lastResult = { error: error.message };

        logger.error('Operation threw exception', {
          ...context,
          attempt: attempt + 1,
          maxAttempts: this.maxAttempts,
          error: error.message,
          stack: error.stack
        });

        // Don't sleep after the last attempt
        if (attempt < this.maxAttempts - 1) {
          const delay = this.calculateDelay(attempt);
          logger.info('Waiting before retry after exception', {
            ...context,
            attempt: attempt + 1,
            delayMs: delay
          });
          await this.sleep(delay);
        }
      }
    }

    // All attempts failed
    logger.error('Operation failed after all retry attempts', {
      ...context,
      totalAttempts: this.maxAttempts,
      lastError
    });

    return {
      success: false,
      result: lastResult,
      attempts: this.maxAttempts,
      error: lastError
    };
  }

  /**
   * Execute callback request with retry logic
   * @param {Function} sendFunction - Function to send callback request
   * @param {Object} data - Request data
   * @returns {Promise<Object>} Result with retry information
   */
  async retryCallbackRequest(sendFunction, data) {
    return this.executeWithRetry(
      () => sendFunction(data),
      {
        requestType: 'callback',
        name: data.name,
        phone: data.phone
      }
    );
  }

  /**
   * Execute broker request with retry logic
   * @param {Function} sendFunction - Function to send broker request
   * @param {Object} data - Request data
   * @returns {Promise<Object>} Result with retry information
   */
  async retryBrokerRequest(sendFunction, data) {
    return this.executeWithRetry(
      () => sendFunction(data),
      {
        requestType: 'broker',
        name: data.name,
        phone: data.phone,
        property_type: data.property_type
      }
    );
  }
}

module.exports = new RetryQueue();
