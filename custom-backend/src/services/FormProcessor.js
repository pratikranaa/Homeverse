const { callbackFormSchema, brokerFormSchema } = require('../validators/formSchemas');
const FormRepository = require('../repositories/FormRepository');
const logger = require('../helpers/logger');

/**
 * Service for processing form submissions
 * Requirements: 1.1, 2.1
 */
class FormProcessor {
  /**
   * Validate callback form data
   * @param {Object} data - Form data to validate
   * @returns {Object} Validation result { error, value }
   */
  validateCallbackForm(data) {
    try {
      const { error, value } = callbackFormSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        logger.warn('Callback form validation failed', {
          errors: error.details.map(d => ({
            field: d.path.join('.'),
            message: d.message
          }))
        });

        return {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Form validation failed',
            details: error.details.map(d => ({
              field: d.path.join('.'),
              message: d.message
            }))
          },
          value: null
        };
      }

      logger.info('Callback form validation successful');

      return { error: null, value };
    } catch (err) {
      logger.error('Error during callback form validation', { error: err.message });
      throw err;
    }
  }

  /**
   * Validate broker form data
   * @param {Object} data - Form data to validate
   * @returns {Object} Validation result { error, value }
   */
  validateBrokerForm(data) {
    try {
      const { error, value } = brokerFormSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        logger.warn('Broker form validation failed', {
          errors: error.details.map(d => ({
            field: d.path.join('.'),
            message: d.message
          }))
        });

        return {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Form validation failed',
            details: error.details.map(d => ({
              field: d.path.join('.'),
              message: d.message
            }))
          },
          value: null
        };
      }

      logger.info('Broker form validation successful');

      return { error: null, value };
    } catch (err) {
      logger.error('Error during broker form validation', { error: err.message });
      throw err;
    }
  }

  /**
   * Process callback form submission
   * @param {Object} data - Validated form data
   * @returns {Promise<Object>} Created callback request and submission status
   */
  async processCallbackSubmission(data) {
    try {
      logger.info('Processing callback submission', { name: data.name });

      // Create callback request record
      const callbackRequest = await FormRepository.createCallbackRequest(data);

      // Create submission status record
      const submissionStatus = await FormRepository.createSubmissionStatus({
        submission_id: callbackRequest.id,
        submission_type: 'callback',
        status: 'submitted',
        submitted_at: new Date(),
        metadata: {
          name: data.name,
          phone: data.phone
        }
      });

      logger.info('Callback submission processed successfully', {
        submissionId: callbackRequest.id
      });

      return {
        callbackRequest,
        submissionStatus
      };
    } catch (error) {
      logger.error('Error processing callback submission', {
        error: error.message,
        data
      });
      throw error;
    }
  }

  /**
   * Process broker form submission
   * @param {Object} data - Validated form data
   * @returns {Promise<Object>} Created broker request and submission status
   */
  async processBrokerSubmission(data) {
    try {
      logger.info('Processing broker submission', { name: data.name });

      // Create broker request record
      const brokerRequest = await FormRepository.createBrokerRequest(data);

      // Create submission status record
      const submissionStatus = await FormRepository.createSubmissionStatus({
        submission_id: brokerRequest.id,
        submission_type: 'broker',
        status: 'submitted',
        submitted_at: new Date(),
        metadata: {
          name: data.name,
          phone: data.phone,
          property_type: data.property_type,
          location: data.location
        }
      });

      logger.info('Broker submission processed successfully', {
        submissionId: brokerRequest.id
      });

      return {
        brokerRequest,
        submissionStatus
      };
    } catch (error) {
      logger.error('Error processing broker submission', {
        error: error.message,
        data
      });
      throw error;
    }
  }
}

module.exports = new FormProcessor();
