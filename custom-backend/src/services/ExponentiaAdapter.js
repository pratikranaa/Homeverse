const axios = require('axios');
const logger = require('../helpers/logger');

/**
 * Service for integrating with Exponentia API
 * Requirements: 1.2, 2.2
 */
class ExponentiaAdapter {
  constructor() {
    this.apiUrl = process.env.EXPONENTIA_API_URL;
    this.apiKey = process.env.EXPONENTIA_API_KEY;

    if (!this.apiUrl || !this.apiKey) {
      logger.warn('Exponentia API configuration missing', {
        hasUrl: !!this.apiUrl,
        hasKey: !!this.apiKey
      });
    }

    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
  }

  /**
   * Transform callback request data for Exponentia API
   * @param {Object} data - Callback request data
   * @returns {Object} Transformed data for API
   */
  transformCallbackRequest(data) {
    return {
      type: 'callback_request',
      customer: {
        name: data.name,
        phone: data.phone,
        email: data.email || null
      },
      preferences: {
        preferred_time: data.preferred_time || null
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Transform broker request data for Exponentia API
   * @param {Object} data - Broker request data
   * @returns {Object} Transformed data for API
   */
  transformBrokerRequest(data) {
    return {
      type: 'broker_request',
      customer: {
        name: data.name,
        phone: data.phone,
        email: data.email || null
      },
      requirements: {
        property_type: data.property_type || null,
        location: data.location || null,
        budget: data.budget || null
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Send callback request to Exponentia API
   * @param {Object} data - Callback request data
   * @returns {Promise<Object>} API response
   */
  async sendCallbackRequest(data) {
    try {
      const transformedData = this.transformCallbackRequest(data);

      logger.info('Sending callback request to Exponentia API', {
        name: data.name,
        phone: data.phone
      });

      const startTime = Date.now();
      const response = await this.client.post('/api/v1/leads/callback', transformedData);
      const responseTime = Date.now() - startTime;

      logger.info('Callback request sent successfully', {
        statusCode: response.status,
        responseTime: `${responseTime}ms`
      });

      return {
        success: true,
        statusCode: response.status,
        data: response.data,
        responseTime
      };
    } catch (error) {
      logger.error('Failed to send callback request to Exponentia API', {
        error: error.message,
        statusCode: error.response?.status,
        responseData: error.response?.data
      });

      return {
        success: false,
        statusCode: error.response?.status || 500,
        error: error.message,
        errorData: error.response?.data || null,
        responseTime: null
      };
    }
  }

  /**
   * Send broker request to Exponentia API
   * @param {Object} data - Broker request data
   * @returns {Promise<Object>} API response
   */
  async sendBrokerRequest(data) {
    try {
      const transformedData = this.transformBrokerRequest(data);

      logger.info('Sending broker request to Exponentia API', {
        name: data.name,
        phone: data.phone,
        property_type: data.property_type
      });

      const startTime = Date.now();
      const response = await this.client.post('/api/v1/leads/broker', transformedData);
      const responseTime = Date.now() - startTime;

      logger.info('Broker request sent successfully', {
        statusCode: response.status,
        responseTime: `${responseTime}ms`
      });

      return {
        success: true,
        statusCode: response.status,
        data: response.data,
        responseTime
      };
    } catch (error) {
      logger.error('Failed to send broker request to Exponentia API', {
        error: error.message,
        statusCode: error.response?.status,
        responseData: error.response?.data
      });

      return {
        success: false,
        statusCode: error.response?.status || 500,
        error: error.message,
        errorData: error.response?.data || null,
        responseTime: null
      };
    }
  }
}

module.exports = new ExponentiaAdapter();
