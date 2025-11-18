const FormRepository = require('../repositories/FormRepository');
const logger = require('../helpers/logger');
const { NotFoundError } = require('../middleware/errorHandler');

/**
 * Controller for submission status queries
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */
class StatusController {
  /**
   * Handle GET /api/v1/forms/broker/status/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getSubmissionStatus(req, res, next) {
    try {
      const { id } = req.params;

      logger.info('Received submission status request', { submissionId: id });

      // Retrieve submission status from database (Requirement 3.1)
      const submission = await FormRepository.getSubmissionById(id);

      // Return 404 if submission not found (Requirement 3.2)
      if (!submission) {
        logger.warn('Submission not found', { submissionId: id });
        throw new NotFoundError('Submission not found');
      }

      logger.info('Submission status retrieved successfully', {
        submissionId: id,
        status: submission.status
      });

      // Return status, submitted_at, and processed_at timestamps (Requirements 3.3, 3.4)
      return res.status(200).json({
        success: true,
        data: {
          submission_id: submission.submission_id,
          submission_type: submission.submission_type,
          status: submission.status,
          submitted_at: submission.submitted_at,
          processed_at: submission.processed_at,
          metadata: submission.metadata
        }
      });
    } catch (error) {
      logger.error('Error retrieving submission status', {
        error: error.message,
        stack: error.stack,
        submissionId: req.params.id
      });

      // Pass error to error handling middleware
      next(error);
    }
  }
}

module.exports = new StatusController();
