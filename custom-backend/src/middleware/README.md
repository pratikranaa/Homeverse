# Middleware Documentation

This directory contains all middleware modules for the Custom Backend application.

## Middleware Modules

### 1. Error Handler (`errorHandler.js`)
**Requirements: 1.1, 2.1, 3.2**

Provides global error handling for the application with:
- Custom error classes: `ValidationError`, `NotFoundError`, `IntegrationError`, `InternalServerError`
- Automatic error type to HTTP status code mapping (400, 404, 502, 500)
- Standardized error response formatting
- Integration with LoggingService for error logging
- Stack trace inclusion in development mode

**Usage:**
```javascript
const { errorHandler, ValidationError, NotFoundError } = require('./middleware');

// Throw custom errors in controllers
throw new NotFoundError('Resource not found');
throw new ValidationError('Invalid input', { field: 'email' });

// Apply as last middleware in Express app
app.use(errorHandler);
```

### 2. Request Logger (`requestLogger.js`)
**Requirements: 9.1**

Logs all incoming HTTP requests with:
- HTTP method and path
- Request timestamp
- Response status code
- Response duration in milliseconds
- Client IP address and user agent

**Usage:**
```javascript
const { requestLogger } = require('./middleware');

// Apply early in middleware chain
app.use(requestLogger);
```

### 3. Validator (`validator.js`)
**Requirements: 1.1, 2.1**

Schema validation middleware wrapper for Joi schemas:
- Validates request body, query parameters, or route parameters
- Returns 400 errors with detailed validation messages
- Strips unknown fields from validated data
- Replaces request data with sanitized values

**Usage:**
```javascript
const { validateBody, validateQuery, validateParams } = require('./middleware');
const { callbackFormSchema } = require('../validators/formSchemas');

// Validate request body
router.post('/callback', validateBody(callbackFormSchema), controller.submit);

// Validate query parameters
router.get('/search', validateQuery(searchSchema), controller.search);

// Validate route parameters
router.get('/user/:id', validateParams(idSchema), controller.getUser);
```

### 4. Rate Limiter (`rateLimiter.js`)
**Requirements: 17.1, 17.2**

Rate limiting protection with two configurations:
- **Standard Rate Limiter**: 100 requests per minute per IP (configurable via env)
- **Strict Rate Limiter**: 20 requests per minute per IP (for form submissions)
- Returns 429 (Too Many Requests) when limit exceeded
- Automatically skips health check endpoints
- Includes rate limit info in response headers

**Configuration:**
```env
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

**Usage:**
```javascript
const { rateLimiter, strictRateLimiter } = require('./middleware');

// Apply standard rate limiting globally
app.use(rateLimiter);

// Apply strict rate limiting to specific routes
router.use('/forms', strictRateLimiter);
```

### 5. CORS Config (`corsConfig.js`)
**Requirements: 17.1, 17.2**

Cross-Origin Resource Sharing (CORS) configuration:
- Configurable allowed origins from environment variables
- Supports GET and POST methods
- Allows credentials (cookies, authorization headers)
- Validates origin against whitelist
- Includes development mode with permissive settings

**Configuration:**
```env
ALLOWED_ORIGINS=http://localhost:3001,https://yourdomain.com
```

**Usage:**
```javascript
const { corsMiddleware, devCorsMiddleware } = require('./middleware');

// Production CORS with origin validation
app.use(corsMiddleware);

// Development CORS (allows all origins)
if (process.env.NODE_ENV === 'development') {
  app.use(devCorsMiddleware);
}
```

## Middleware Order

The middleware should be applied in the following order in `src/index.js`:

1. **CORS** - Must be first to handle preflight requests
2. **Body Parsers** - Parse JSON and URL-encoded bodies
3. **Request Logger** - Log all incoming requests
4. **Rate Limiter** - Apply rate limiting protection
5. **Routes** - Application routes
6. **404 Handler** - Catch unmatched routes
7. **Error Handler** - Must be last to catch all errors

```javascript
app.use(corsMiddleware);
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);
app.use('/api/v1', routes);
app.use((req, res, next) => next(new NotFoundError()));
app.use(errorHandler);
```

## Error Response Format

All errors follow a standardized format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

## Testing

To test middleware functionality:

1. **Error Handling**: Throw errors in controllers and verify proper formatting
2. **Request Logging**: Check logs for incoming requests and responses
3. **Validation**: Send invalid data and verify 400 responses
4. **Rate Limiting**: Send multiple requests and verify 429 responses
5. **CORS**: Send requests from different origins and verify headers

## Integration with Controllers

Controllers should use the error classes and pass errors to the error handler:

```javascript
const { NotFoundError, IntegrationError } = require('../middleware/errorHandler');

async function getResource(req, res, next) {
  try {
    const resource = await findResource(req.params.id);
    
    if (!resource) {
      throw new NotFoundError('Resource not found');
    }
    
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error); // Pass to error handler
  }
}
```
