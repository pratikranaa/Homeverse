const FormProcessor = require('../services/FormProcessor');
const ExponentiaAdapter = require('../services/ExponentiaAdapter');
const RetryQueue = require('../services/RetryQueue');
const LoggingService = require('../services/LoggingService');
const FormRepository = require('../repositories/FormRepository');
const logger = require('../helpers/logger');
const { IntegrationError, InternalServerError } = require('../middleware/errorHandler');

/**
 * Controller for callback form submissions
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
class CallbackFormController {
  /**
   * Handle POST /api/v1/forms/callback
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async submitCallback(req, res, next) {
    try {
      logger.info('Received callback form submission', { body: req.body });

      // Validation is now handled by middleware (Requirement 1.1)
      const validatedData = req.body;

      // Call FormProcessor to process submission (Requirement 1.5)
      const { callbackRequest, submissionStatus } = await FormProcessor.processCallbackSubmission(validatedData);

      // Call ExponentiaAdapter to send data with retry logic (Requirements 1.2, 1.3)
      const retryResult = await RetryQueue.retryCallbackRequest(
        (data) => ExponentiaAdapter.sendCallbackRequest(data),
        validatedData
      );

      // Log all interactions (Requirement 1.4)
      if (retryResult.success) {
        // Log successful interaction
        await LoggingService.logInteraction({
          requestType: 'callback',
          requestPayload: validatedData,
          endpoint: `${process.env.EXPONENTIA_API_URL}/api/v1/leads/callback`,
          httpMethod: 'POST',
          statusCode: retryResult.result.statusCode,
          responsePayload: retryResult.result.data,
          responseTimeMs: retryResult.result.responseTime
        });

        // Update callback request with Exponentia response
        await FormRepository.updateCallbackRequest(callbackRequest.id, {
          status: 'completed',
          exponentia_response: retryResult.result.data
        });

        // Update submission status
        await FormRepository.updateSubmissionStatus(callbackRequest.id, {
          status: 'completed',
          processed_at: new Date()
        });

        logger.info('Callback form submission completed successfully', {
          submissionId: callbackRequest.id,
          attempts: retryResult.attempts
        });

        // Return success response with submission_id (Requirement 1.5)
        return res.status(200).json({
          success: true,
          data: {
            submission_id: callbackRequest.id,
            status: 'completed',
            message: "We'll call you back soon"
          }
        });
      } else {
        // Log failed interaction
        await LoggingService.logFailedInteraction({
          requestType: 'callback',
          requestPayload: validatedData,
          endpoint: `${process.env.EXPONENTIA_API_URL}/api/v1/leads/callback`,
          httpMethod: 'POST',
          errorMessage: retryResult.error || 'Failed after all retry attempts',
          errorStack: null,
          retryCount: retryResult.attempts
        });

        // Update callback request with failure status
        await FormRepository.updateCallbackRequest(callbackRequest.id, {
          status: 'failed',
          exponentia_response: retryResult.result
        });

        // Update submission status
        await FormRepository.updateSubmissionStatus(callbackRequest.id, {
          status: 'failed',
          processed_at: new Date()
        });

        logger.error('Callback form submission failed after retries', {
          submissionId: callbackRequest.id,
          attempts: retryResult.attempts,
          error: retryResult.error
        });

        // Throw integration error to be handled by error middleware
        const error = new IntegrationError('Failed to process your request. Please try again later.');
        error.details = {
          submission_id: callbackRequest.id,
          attempts: retryResult.attempts
        };
        throw error;
      }
    } catch (error) {
      logger.error('Error in callback form submission', {
        error: error.message,
        stack: error.stack
      });

      // Pass error to error handling middleware
      next(error);
    }
  }
}

module.exports = new CallbackFormController();
