const FormProcessor = require('../services/FormProcessor');
const ExponentiaAdapter = require('../services/ExponentiaAdapter');
const RetryQueue = require('../services/RetryQueue');
const LoggingService = require('../services/LoggingService');
const FormRepository = require('../repositories/FormRepository');
const WhatsAppRedirect = require('../services/WhatsAppRedirect');
const logger = require('../helpers/logger');
const { IntegrationError, InternalServerError } = require('../middleware/errorHandler');

/**
 * Controller for broker form submissions
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
class BrokerFormController {
  /**
   * Handle POST /api/v1/forms/broker
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async submitBroker(req, res, next) {
    try {
      logger.info('Received broker form submission', { body: req.body });

      // Validation is now handled by middleware (Requirement 2.1)
      const validatedData = req.body;

      // Call FormProcessor to process submission (Requirement 2.5)
      const { brokerRequest, submissionStatus } = await FormProcessor.processBrokerSubmission(validatedData);

      // Call ExponentiaAdapter to send data with retry logic (Requirements 2.2, 2.3)
      const retryResult = await RetryQueue.retryBrokerRequest(
        (data) => ExponentiaAdapter.sendBrokerRequest(data),
        validatedData
      );

      // Log all interactions (Requirement 2.4)
      if (retryResult.success) {
        // Log successful interaction
        await LoggingService.logInteraction({
          requestType: 'broker',
          requestPayload: validatedData,
          endpoint: `${process.env.EXPONENTIA_API_URL}/api/v1/leads/broker`,
          httpMethod: 'POST',
          statusCode: retryResult.result.statusCode,
          responsePayload: retryResult.result.data,
          responseTimeMs: retryResult.result.responseTime
        });

        // Trigger WhatsApp redirect on success (Requirement 2.5)
        const redirectUrl = WhatsAppRedirect.generateRedirectUrl(validatedData);

        // Update broker request with Exponentia response and redirect URL
        await FormRepository.updateBrokerRequest(brokerRequest.id, {
          status: 'completed',
          exponentia_response: retryResult.result.data,
          whatsapp_redirect_url: redirectUrl
        });

        // Update submission status
        await FormRepository.updateSubmissionStatus(brokerRequest.id, {
          status: 'completed',
          processed_at: new Date()
        });

        logger.info('Broker form submission completed successfully', {
          submissionId: brokerRequest.id,
          attempts: retryResult.attempts,
          redirectUrl
        });

        // Return success response with submission_id and redirect_url (Requirement 2.5)
        return res.status(200).json({
          success: true,
          data: {
            submission_id: brokerRequest.id,
            status: 'completed',
            redirect_url: redirectUrl,
            message: 'Submission successful. Redirecting to WhatsApp...'
          }
        });
      } else {
        // Log failed interaction
        await LoggingService.logFailedInteraction({
          requestType: 'broker',
          requestPayload: validatedData,
          endpoint: `${process.env.EXPONENTIA_API_URL}/api/v1/leads/broker`,
          httpMethod: 'POST',
          errorMessage: retryResult.error || 'Failed after all retry attempts',
          errorStack: null,
          retryCount: retryResult.attempts
        });

        // Update broker request with failure status
        await FormRepository.updateBrokerRequest(brokerRequest.id, {
          status: 'failed',
          exponentia_response: retryResult.result
        });

        // Update submission status
        await FormRepository.updateSubmissionStatus(brokerRequest.id, {
          status: 'failed',
          processed_at: new Date()
        });

        logger.error('Broker form submission failed after retries', {
          submissionId: brokerRequest.id,
          attempts: retryResult.attempts,
          error: retryResult.error
        });

        // Throw integration error to be handled by error middleware
        const error = new IntegrationError('Failed to process your request. Please try again later.');
        error.details = {
          submission_id: brokerRequest.id,
          attempts: retryResult.attempts
        };
        throw error;
      }
    } catch (error) {
      logger.error('Error in broker form submission', {
        error: error.message,
        stack: error.stack
      });

      // Pass error to error handling middleware
      next(error);
    }
  }
}

module.exports = new BrokerFormController();
