const Joi = require('joi');

/**
 * Validation schema for callback form submissions
 * Requirements: 1.1
 */
const callbackFormSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 255 characters',
      'any.required': 'Name is required'
    }),
  
  phone: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be in E.164 format (e.g., +1234567890)',
      'any.required': 'Phone number is required'
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .allow('')
    .messages({
      'string.email': 'Email must be a valid email address'
    }),
  
  preferred_time: Joi.string()
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Preferred time must not exceed 50 characters'
    })
});

/**
 * Validation schema for broker form submissions
 * Requirements: 2.1
 */
const brokerFormSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 255 characters',
      'any.required': 'Name is required'
    }),
  
  phone: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be in E.164 format (e.g., +1234567890)',
      'any.required': 'Phone number is required'
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .allow('')
    .messages({
      'string.email': 'Email must be a valid email address'
    }),
  
  budget: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Budget must not exceed 100 characters'
    }),
  
  property_type: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Property type must not exceed 100 characters'
    }),
  
  location: Joi.string()
    .max(255)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Location must not exceed 255 characters'
    })
});

module.exports = {
  callbackFormSchema,
  brokerFormSchema
};
