const { ValidationError } = require('./errorHandler');

/**
 * Schema validation middleware wrapper
 * Requirements: 1.1, 2.1
 * 
 * Creates a middleware function that validates request body against a Joi schema
 * Returns 400 errors for validation failures with detailed error information
 * 
 * @param {Object} schema - Joi validation schema
 * @param {string} source - Source of data to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    // Get data from specified source
    const dataToValidate = req[source];

    // Validate data against schema
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      // Extract validation error details
      const details = {};
      error.details.forEach((detail) => {
        const field = detail.path.join('.');
        details[field] = detail.message;
      });

      // Create validation error with details
      const validationError = new ValidationError(
        'Validation failed',
        details
      );

      // Pass error to error handler
      return next(validationError);
    }

    // Replace request data with validated and sanitized value
    req[source] = value;

    next();
  };
};

/**
 * Convenience function for validating request body
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateBody = (schema) => {
  return validate(schema, 'body');
};

/**
 * Convenience function for validating query parameters
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => {
  return validate(schema, 'query');
};

/**
 * Convenience function for validating route parameters
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => {
  return validate(schema, 'params');
};

module.exports = {
  validate,
  validateBody,
  validateQuery,
  validateParams
};
