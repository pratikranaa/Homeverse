const CallbackRequest = require('../models/CallbackRequest');
const BrokerRequest = require('../models/BrokerRequest');
const SubmissionStatus = require('../models/SubmissionStatus');
const logger = require('../helpers/logger');

/**
 * Repository for form submission database operations
 * Requirements: 1.5, 2.5, 3.1
 */
class FormRepository {
  /**
   * Create a new callback request record
   * @param {Object} data - Callback request data
   * @returns {Promise<Object>} Created callback request
   */
  async createCallbackRequest(data) {
    try {
      const callbackRequest = await CallbackRequest.create({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        preferred_time: data.preferred_time || null,
        status: 'pending'
      });

      logger.info('Callback request created', { 
        id: callbackRequest.id,
        name: data.name 
      });

      return callbackRequest;
    } catch (error) {
      logger.error('Error creating callback request', { 
        error: error.message,
        data 
      });
      throw error;
    }
  }

  /**
   * Create a new broker request record
   * @param {Object} data - Broker request data
   * @returns {Promise<Object>} Created broker request
   */
  async createBrokerRequest(data) {
    try {
      const brokerRequest = await BrokerRequest.create({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        property_type: data.property_type || null,
        location: data.location || null,
        status: 'pending'
      });

      logger.info('Broker request created', { 
        id: brokerRequest.id,
        name: data.name 
      });

      return brokerRequest;
    } catch (error) {
      logger.error('Error creating broker request', { 
        error: error.message,
        data 
      });
      throw error;
    }
  }

  /**
   * Update submission status record
   * @param {string} submissionId - Submission UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated submission status
   */
  async updateSubmissionStatus(submissionId, updates) {
    try {
      const submissionStatus = await SubmissionStatus.findOne({
        where: { submission_id: submissionId }
      });

      if (!submissionStatus) {
        throw new Error(`Submission status not found for ID: ${submissionId}`);
      }

      await submissionStatus.update(updates);

      logger.info('Submission status updated', { 
        submissionId,
        updates 
      });

      return submissionStatus;
    } catch (error) {
      logger.error('Error updating submission status', { 
        error: error.message,
        submissionId,
        updates 
      });
      throw error;
    }
  }

  /**
   * Get submission by ID
   * @param {string} submissionId - Submission UUID
   * @returns {Promise<Object|null>} Submission status record or null
   */
  async getSubmissionById(submissionId) {
    try {
      const submissionStatus = await SubmissionStatus.findOne({
        where: { submission_id: submissionId }
      });

      if (!submissionStatus) {
        logger.warn('Submission not found', { submissionId });
        return null;
      }

      logger.info('Submission retrieved', { submissionId });

      return submissionStatus;
    } catch (error) {
      logger.error('Error retrieving submission', { 
        error: error.message,
        submissionId 
      });
      throw error;
    }
  }

  /**
   * Create submission status record
   * @param {Object} data - Submission status data
   * @returns {Promise<Object>} Created submission status
   */
  async createSubmissionStatus(data) {
    try {
      const submissionStatus = await SubmissionStatus.create({
        submission_id: data.submission_id,
        submission_type: data.submission_type,
        status: data.status,
        submitted_at: data.submitted_at || new Date(),
        processed_at: data.processed_at || null,
        metadata: data.metadata || null
      });

      logger.info('Submission status created', { 
        submissionId: data.submission_id,
        type: data.submission_type 
      });

      return submissionStatus;
    } catch (error) {
      logger.error('Error creating submission status', { 
        error: error.message,
        data 
      });
      throw error;
    }
  }

  /**
   * Update callback request
   * @param {string} id - Callback request UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated callback request
   */
  async updateCallbackRequest(id, updates) {
    try {
      const callbackRequest = await CallbackRequest.findByPk(id);

      if (!callbackRequest) {
        throw new Error(`Callback request not found for ID: ${id}`);
      }

      await callbackRequest.update(updates);

      logger.info('Callback request updated', { id, updates });

      return callbackRequest;
    } catch (error) {
      logger.error('Error updating callback request', { 
        error: error.message,
        id,
        updates 
      });
      throw error;
    }
  }

  /**
   * Update broker request
   * @param {string} id - Broker request UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated broker request
   */
  async updateBrokerRequest(id, updates) {
    try {
      const brokerRequest = await BrokerRequest.findByPk(id);

      if (!brokerRequest) {
        throw new Error(`Broker request not found for ID: ${id}`);
      }

      await brokerRequest.update(updates);

      logger.info('Broker request updated', { id, updates });

      return brokerRequest;
    } catch (error) {
      logger.error('Error updating broker request', { 
        error: error.message,
        id,
        updates 
      });
      throw error;
    }
  }
}

module.exports = new FormRepository();
