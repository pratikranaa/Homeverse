/**
 * Middleware exports
 * Centralized export for all middleware modules
 */

const { errorHandler, ValidationError, NotFoundError, IntegrationError, InternalServerError } = require('./errorHandler');
const requestLogger = require('./requestLogger');
const { validate, validateBody, validateQuery, validateParams } = require('./validator');
const { rateLimiter, strictRateLimiter, createRateLimiter, createStrictRateLimiter } = require('./rateLimiter');
const { corsMiddleware, devCorsMiddleware, corsOptions, getAllowedOrigins } = require('./corsConfig');

module.exports = {
  // Error handling
  errorHandler,
  ValidationError,
  NotFoundError,
  IntegrationError,
  InternalServerError,

  // Request logging
  requestLogger,

  // Validation
  validate,
  validateBody,
  validateQuery,
  validateParams,

  // Rate limiting
  rateLimiter,
  strictRateLimiter,
  createRateLimiter,
  createStrictRateLimiter,

  // CORS
  corsMiddleware,
  devCorsMiddleware,
  corsOptions,
  getAllowedOrigins
};
