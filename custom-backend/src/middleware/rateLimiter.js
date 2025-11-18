const rateLimit = require('express-rate-limit');
const logger = require('../helpers/logger');

/**
 * Rate limiting middleware
 * Requirements: 17.1, 17.2
 * 
 * Implements rate limiting to protect API endpoints:
 * - 100 requests per minute per IP address
 * - Returns 429 (Too Many Requests) when limit exceeded
 * - Configurable via environment variables
 */

/**
 * Custom handler for rate limit exceeded
 */
const rateLimitHandler = (req, res) => {
  logger.warn('Rate limit exceeded', {
    ip: req.ip || req.connection.remoteAddress,
    path: req.path,
    method: req.method
  });

  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
      retryAfter: req.rateLimit?.resetTime || 'in a few moments'
    }
  });
};

/**
 * Create rate limiter with configuration from environment variables
 */
const createRateLimiter = () => {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000; // Default: 1 minute
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100; // Default: 100 requests

  return rateLimit({
    windowMs: windowMs,
    max: maxRequests,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    handler: rateLimitHandler,
    // Use IP address as key
    keyGenerator: (req) => {
      return req.ip || req.connection.remoteAddress || 'unknown';
    },
    // Skip rate limiting for health check endpoint
    skip: (req) => {
      return req.path === '/health' || req.path === '/health/';
    }
  });
};

/**
 * Stricter rate limiter for form submissions
 * 20 requests per minute per IP
 */
const createStrictRateLimiter = () => {
  const windowMs = 60000; // 1 minute
  const maxRequests = 20; // 20 requests per minute

  return rateLimit({
    windowMs: windowMs,
    max: maxRequests,
    message: 'Too many form submissions, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    keyGenerator: (req) => {
      return req.ip || req.connection.remoteAddress || 'unknown';
    }
  });
};

// Export configured rate limiters
const rateLimiter = createRateLimiter();
const strictRateLimiter = createStrictRateLimiter();

module.exports = {
  rateLimiter,
  strictRateLimiter,
  createRateLimiter,
  createStrictRateLimiter
};
