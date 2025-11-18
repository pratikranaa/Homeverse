/**
 * Error Formatter Helper
 * Provides standardized error response formatting for API endpoints
 */

/**
 * Error codes mapping
 */
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INTEGRATION_ERROR: 'INTEGRATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  DATABASE_ERROR: 'DATABASE_ERROR'
};

/**
 * HTTP status codes mapping
 */
const HTTP_STATUS = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  INTEGRATION_ERROR: 502,
  SERVER_ERROR: 500,
  RATE_LIMIT_EXCEEDED: 429,
  DATABASE_ERROR: 500
};

/**
 * Format an error response
 * @param {string} code - Error code from ERROR_CODES
 * @param {string} message - Error message
 * @param {Object} details - Optional error details
 * @returns {Object} Standardized error response
 */
const formatError = (code, message, details = null) => {
  const response = {
    success: false,
    error: {
      code,
      message
    }
  };

  if (details) {
    response.error.details = details;
  }

  return response;
};

/**
 * Format a validation error
 * @param {string} message - Error message
 * @param {Object} details - Validation error details (field, constraint, etc.)
 * @returns {Object} Standardized validation error response
 */
const formatValidationError = (message, details = null) => {
  return formatError(ERROR_CODES.VALIDATION_ERROR, message, details);
};

/**
 * Format a not found error
 * @param {string} resource - The resource that was not found
 * @param {string} identifier - Optional identifier that was searched
 * @returns {Object} Standardized not found error response
 */
const formatNotFoundError = (resource, identifier = null) => {
  const message = identifier 
    ? `${resource} with identifier '${identifier}' not found`
    : `${resource} not found`;
  
  return formatError(ERROR_CODES.NOT_FOUND, message);
};

/**
 * Format an integration error
 * @param {string} service - The external service name
 * @param {string} message - Error message
 * @param {Object} details - Optional error details
 * @returns {Object} Standardized integration error response
 */
const formatIntegrationError = (service, message, details = null) => {
  return formatError(
    ERROR_CODES.INTEGRATION_ERROR,
    `Integration error with ${service}: ${message}`,
    details
  );
};

/**
 * Format a server error
 * @param {string} message - Error message
 * @param {Object} details - Optional error details
 * @returns {Object} Standardized server error response
 */
const formatServerError = (message = 'Internal server error', details = null) => {
  return formatError(ERROR_CODES.SERVER_ERROR, message, details);
};

/**
 * Get HTTP status code for error code
 * @param {string} errorCode - Error code from ERROR_CODES
 * @returns {number} HTTP status code
 */
const getHttpStatus = (errorCode) => {
  return HTTP_STATUS[errorCode] || 500;
};

module.exports = {
  ERROR_CODES,
  HTTP_STATUS,
  formatError,
  formatValidationError,
  formatNotFoundError,
  formatIntegrationError,
  formatServerError,
  getHttpStatus
};
