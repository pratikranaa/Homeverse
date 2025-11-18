const cors = require('cors');
const logger = require('../helpers/logger');

/**
 * CORS middleware configuration
 * Requirements: 17.1, 17.2
 * 
 * Configures Cross-Origin Resource Sharing (CORS):
 * - Allowed origins from environment variables
 * - Allows GET and POST methods
 * - Supports credentials
 * - Configurable headers
 */

/**
 * Parse allowed origins from environment variable
 * @returns {Array|string} Array of allowed origins or '*' for all
 */
const getAllowedOrigins = () => {
  const originsEnv = process.env.ALLOWED_ORIGINS;

  if (!originsEnv || originsEnv === '*') {
    logger.warn('CORS: Allowing all origins (not recommended for production)');
    return '*';
  }

  // Split comma-separated origins and trim whitespace
  const origins = originsEnv.split(',').map(origin => origin.trim());

  logger.info('CORS: Configured allowed origins', { origins });

  return origins;
};

/**
 * CORS options configuration
 */
const corsOptions = {
  // Origin validation
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    // Allow all origins if configured with '*'
    if (allowedOrigins === '*') {
      return callback(null, true);
    }

    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS: Blocked request from unauthorized origin', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },

  // Allowed HTTP methods
  methods: ['GET', 'POST'],

  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],

  // Exposed headers (headers that browser can access)
  exposedHeaders: [
    'Content-Length',
    'Content-Type',
    'X-Request-Id'
  ],

  // Allow credentials (cookies, authorization headers)
  credentials: true,

  // Cache preflight requests for 1 hour
  maxAge: 3600,

  // Pass the CORS preflight response to the next handler
  preflightContinue: false,

  // Provide a status code to use for successful OPTIONS requests
  optionsSuccessStatus: 204
};

/**
 * Create CORS middleware with configuration
 */
const corsMiddleware = cors(corsOptions);

/**
 * Simple CORS middleware for development (allows all origins)
 */
const devCorsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
});

module.exports = {
  corsMiddleware,
  devCorsMiddleware,
  corsOptions,
  getAllowedOrigins
};
