const logger = require('../helpers/logger');

/**
 * Request logging middleware
 * Requirements: 9.1
 * 
 * Logs incoming requests with:
 * - HTTP method
 * - Request path
 * - Timestamp
 * - Response status code
 * - Response duration
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Log incoming request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    url: req.url,
    timestamp: timestamp,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent')
  });

  // Capture response finish event
  res.on('finish', () => {
    const duration = Date.now() - start;

    // Log response details
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: timestamp,
      completedAt: new Date().toISOString()
    });
  });

  next();
};

module.exports = requestLogger;
