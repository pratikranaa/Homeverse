const express = require('express');
const router = express.Router();
const CallbackFormController = require('../controllers/CallbackFormController');
const BrokerFormController = require('../controllers/BrokerFormController');
const StatusController = require('../controllers/StatusController');
const { callbackFormSchema, brokerFormSchema } = require('../validators/formSchemas');
const { validateBody } = require('../middleware/validator');
const { strictRateLimiter } = require('../middleware/rateLimiter');

/**
 * Form submission routes
 * Requirements: 18.1
 */

// Apply stricter rate limiting to form submission endpoints
router.use(strictRateLimiter);

// POST /api/v1/forms/callback - Submit callback request form
router.post(
  '/callback',
  validateBody(callbackFormSchema),
  CallbackFormController.submitCallback.bind(CallbackFormController)
);

// POST /api/v1/forms/broker - Submit broker request form
router.post(
  '/broker',
  validateBody(brokerFormSchema),
  BrokerFormController.submitBroker.bind(BrokerFormController)
);

// GET /api/v1/forms/broker/status/:id - Get submission status
router.get('/broker/status/:id', StatusController.getSubmissionStatus.bind(StatusController));

module.exports = router;
