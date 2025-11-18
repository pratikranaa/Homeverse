/**
 * Response Formatter Helper
 * Provides standardized success response formatting for API endpoints
 */

/**
 * Format a successful API response
 * @param {*} data - The data to return in the response
 * @param {string} message - Optional success message
 * @param {Object} meta - Optional metadata (pagination, etc.)
 * @returns {Object} Standardized success response
 */
const formatSuccess = (data, message = null, meta = null) => {
  const response = {
    success: true,
    data
  };

  if (message) {
    response.message = message;
  }

  if (meta) {
    response.meta = meta;
  }

  return response;
};

/**
 * Format a paginated response
 * @param {Array} data - The data array
 * @param {number} page - Current page number
 * @param {number} pageSize - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} Standardized paginated response
 */
const formatPaginated = (data, page, pageSize, total) => {
  return formatSuccess(data, null, {
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  });
};

/**
 * Format a submission response
 * @param {string} submissionId - The submission ID
 * @param {string} status - The submission status
 * @param {Object} additionalData - Any additional data to include
 * @returns {Object} Standardized submission response
 */
const formatSubmission = (submissionId, status, additionalData = {}) => {
  return formatSuccess({
    submission_id: submissionId,
    status,
    ...additionalData
  });
};

module.exports = {
  formatSuccess,
  formatPaginated,
  formatSubmission
};
