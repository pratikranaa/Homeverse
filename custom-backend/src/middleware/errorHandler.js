const logger = require('../helpers/logger');
const LoggingService = require('../services/LoggingService');

/**
 * Custom error classes for different error types
 */
class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.code = 'VALIDATION_ERROR';
    this.details = details;
  }
}

class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.code = 'NOT_FOUND';
  }
}

class IntegrationError extends Error {
  constructor(message = 'External API integration failed') {
    super(message);
    this.name = 'IntegrationError';
    this.statusCode = 502;
    this.code = 'INTEGRATION_ERROR';
  }
}

class InternalServerError extends Error {
  constructor(message = 'An unexpected error occurred') {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
    this.code = 'INTERNAL_SERVER_ERROR';
  }
}

/**
 * Map error types to HTTP status codes
 * Requirements: 1.1, 2.1, 3.2
 */
const mapErrorToStatusCode = (error) => {
  // Check for custom error classes
  if (error.statusCode) {
    return error.statusCode;
  }

  // Map common error types
  switch (error.name) {
    case 'ValidationError':
      return 400;
    case 'NotFoundError':
      return 404;
    case 'IntegrationError':
      return 502;
    default:
      return 500;
  }
};

/**
 * Map error types to error codes
 */
const mapErrorToCode = (error) => {
  if (error.code) {
    return error.code;
  }

  switch (error.name) {
    case 'ValidationError':
      return 'VALIDATION_ERROR';
    case 'NotFoundError':
      return 'NOT_FOUND';
    case 'IntegrationError':
      return 'INTEGRATION_ERROR';
    default:
      return 'INTERNAL_SERVER_ERROR';
  }
};

/**
 * Format error response according to standardized structure
 * Requirements: 1.1, 2.1, 3.2
 */
const formatErrorResponse = (error) => {
  const statusCode = mapErrorToStatusCode(error);
  const code = mapErrorToCode(error);

  const response = {
    success: false,
    error: {
      code: code,
      message: error.message || 'An unexpected error occurred'
    }
  };

  // Include details for validation errors
  if (error.details && Object.keys(error.details).length > 0) {
    response.error.details = error.details;
  }

  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development' && error.stack) {
    response.error.stack = error.stack;
  }

  return { statusCode, response };
};

/**
 * Global error handling middleware
 * Requirements: 1.1, 2.1, 3.2
 * 
 * Handles all errors thrown in the application:
 * - Validation errors (400)
 * - Not found errors (404)
 * - Integration errors (502)
 * - Internal server errors (500)
 * 
 * Logs errors using LoggingService and returns standardized error responses
 */
const errorHandler = async (err, req, res, next) => {
  try {
    // Format error response
    const { statusCode, response } = formatErrorResponse(err);

    // Log error using LoggingService
    try {
      await LoggingService.logError({
        integrationLogId: null, // No integration log for general errors
        errorMessage: err.message,
        errorStack: err.stack,
        retryCount: 0,
        correlationId: req.correlationId || LoggingService.generateCorrelationId()
      });
    } catch (loggingError) {
      // If logging fails, just log to console/file
      logger.error('Failed to log error to database', {
        originalError: err.message,
        loggingError: loggingError.message
      });
    }

    // Log error details
    logger.error('Error handled by global error handler', {
      statusCode,
      code: response.error.code,
      message: err.message,
      path: req.path,
      method: req.method,
      stack: err.stack
    });

    // Send error response
    res.status(statusCode).json(response);
  } catch (handlerError) {
    // Fallback error response if error handler itself fails
    logger.error('Error handler failed', {
      error: handlerError.message,
      originalError: err.message
    });

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};

module.exports = {
  errorHandler,
  ValidationError,
  NotFoundError,
  IntegrationError,
  InternalServerError
};
