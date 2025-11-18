require('dotenv').config();
const express = require('express');
const logger = require('./helpers/logger');
const healthRoutes = require('./routes/health.routes');
const contentRoutes = require('./routes/content.routes');
const formsRoutes = require('./routes/forms.routes');

// Import middleware
const {
  errorHandler,
  NotFoundError,
  requestLogger,
  rateLimiter,
  corsMiddleware
} = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware - must be first
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Rate limiting middleware - apply to all routes except health
app.use(rateLimiter);

// Routes
app.use('/health', healthRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/forms', formsRoutes);

// 404 handler - must be after all routes
app.use((req, res, next) => {
  next(new NotFoundError('Endpoint not found'));
});

// Global error handler - must be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Custom Backend server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
