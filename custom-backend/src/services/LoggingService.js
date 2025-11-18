const IntegrationLog = require('../models/IntegrationLog');
const ResponseLog = require('../models/ResponseLog');
const ErrorLog = require('../models/ErrorLog');
const logger = require('../helpers/logger');
const { v4: uuidv4 } = require('crypto');

/**
 * Service for logging API interactions to database
 * Requirements: 1.4, 2.4, 9.1, 9.2, 9.3, 9.4
 */
class LoggingService {
  /**
   * Generate correlation ID for tracking related logs
   * @returns {string} UUID correlation ID
   */
  generateCorrelationId() {
    // Use crypto.randomUUID if available, otherwise generate manually
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback: generate UUID v4 manually
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Log API request to database
   * @param {Object} params - Request parameters
   * @param {string} params.requestType - Type of request (callback, broker)
   * @param {Object} params.requestPayload - Request payload
   * @param {string} params.endpoint - API endpoint
   * @param {string} params.httpMethod - HTTP method (POST, GET, etc.)
   * @param {string} params.correlationId - Optional correlation ID
   * @returns {Promise<Object>} Created integration log with correlation ID
   */
  async logRequest({ requestType, requestPayload, endpoint, httpMethod, correlationId }) {
    try {
      const correlation = correlationId || this.generateCorrelationId();

      const integrationLog = await IntegrationLog.create({
        request_type: requestType,
        request_payload: requestPayload,
        endpoint: endpoint,
        http_method: httpMethod
      });

      logger.info('API request logged to database', {
        integrationLogId: integrationLog.id,
        requestType,
        endpoint,
        correlationId: correlation
      });

      return {
        integrationLog,
        correlationId: correlation
      };
    } catch (error) {
      logger.error('Failed to log API request to database', {
        error: error.message,
        requestType,
        endpoint
      });
      throw error;
    }
  }

  /**
   * Log API response to database
   * @param {Object} params - Response parameters
   * @param {string} params.integrationLogId - ID of related integration log
   * @param {number} params.statusCode - HTTP status code
   * @param {Object} params.responsePayload - Response payload
   * @param {number} params.responseTimeMs - Response time in milliseconds
   * @param {string} params.correlationId - Correlation ID for tracking
   * @returns {Promise<Object>} Created response log
   */
  async logResponse({ integrationLogId, statusCode, responsePayload, responseTimeMs, correlationId }) {
    try {
      const responseLog = await ResponseLog.create({
        integration_log_id: integrationLogId,
        status_code: statusCode,
        response_payload: responsePayload,
        response_time_ms: responseTimeMs
      });

      logger.info('API response logged to database', {
        responseLogId: responseLog.id,
        integrationLogId,
        statusCode,
        responseTimeMs,
        correlationId
      });

      return responseLog;
    } catch (error) {
      logger.error('Failed to log API response to database', {
        error: error.message,
        integrationLogId,
        statusCode
      });
      throw error;
    }
  }

  /**
   * Log API error to database
   * @param {Object} params - Error parameters
   * @param {string} params.integrationLogId - ID of related integration log
   * @param {string} params.errorMessage - Error message
   * @param {string} params.errorStack - Error stack trace
   * @param {number} params.retryCount - Number of retry attempts
   * @param {string} params.correlationId - Correlation ID for tracking
   * @returns {Promise<Object>} Created error log
   */
  async logError({ integrationLogId, errorMessage, errorStack, retryCount, correlationId }) {
    try {
      const errorLog = await ErrorLog.create({
        integration_log_id: integrationLogId,
        error_message: errorMessage,
        error_stack: errorStack || null,
        retry_count: retryCount || 0
      });

      logger.error('API error logged to database', {
        errorLogId: errorLog.id,
        integrationLogId,
        errorMessage,
        retryCount,
        correlationId
      });

      return errorLog;
    } catch (error) {
      logger.error('Failed to log API error to database', {
        error: error.message,
        integrationLogId
      });
      throw error;
    }
  }

  /**
   * Log complete API interaction (request + response)
   * @param {Object} params - Interaction parameters
   * @param {string} params.requestType - Type of request
   * @param {Object} params.requestPayload - Request payload
   * @param {string} params.endpoint - API endpoint
   * @param {string} params.httpMethod - HTTP method
   * @param {number} params.statusCode - Response status code
   * @param {Object} params.responsePayload - Response payload
   * @param {number} params.responseTimeMs - Response time
   * @returns {Promise<Object>} Logged interaction with correlation ID
   */
  async logInteraction({
    requestType,
    requestPayload,
    endpoint,
    httpMethod,
    statusCode,
    responsePayload,
    responseTimeMs
  }) {
    try {
      const correlationId = this.generateCorrelationId();

      // Log request
      const { integrationLog } = await this.logRequest({
        requestType,
        requestPayload,
        endpoint,
        httpMethod,
        correlationId
      });

      // Log response
      const responseLog = await this.logResponse({
        integrationLogId: integrationLog.id,
        statusCode,
        responsePayload,
        responseTimeMs,
        correlationId
      });

      return {
        integrationLog,
        responseLog,
        correlationId
      };
    } catch (error) {
      logger.error('Failed to log complete API interaction', {
        error: error.message,
        requestType
      });
      throw error;
    }
  }

  /**
   * Log complete API interaction with error
   * @param {Object} params - Interaction parameters
   * @param {string} params.requestType - Type of request
   * @param {Object} params.requestPayload - Request payload
   * @param {string} params.endpoint - API endpoint
   * @param {string} params.httpMethod - HTTP method
   * @param {string} params.errorMessage - Error message
   * @param {string} params.errorStack - Error stack trace
   * @param {number} params.retryCount - Retry attempts
   * @returns {Promise<Object>} Logged interaction with correlation ID
   */
  async logFailedInteraction({
    requestType,
    requestPayload,
    endpoint,
    httpMethod,
    errorMessage,
    errorStack,
    retryCount
  }) {
    try {
      const correlationId = this.generateCorrelationId();

      // Log request
      const { integrationLog } = await this.logRequest({
        requestType,
        requestPayload,
        endpoint,
        httpMethod,
        correlationId
      });

      // Log error
      const errorLog = await this.logError({
        integrationLogId: integrationLog.id,
        errorMessage,
        errorStack,
        retryCount,
        correlationId
      });

      return {
        integrationLog,
        errorLog,
        correlationId
      };
    } catch (error) {
      logger.error('Failed to log failed API interaction', {
        error: error.message,
        requestType
      });
      throw error;
    }
  }
}

module.exports = new LoggingService();
