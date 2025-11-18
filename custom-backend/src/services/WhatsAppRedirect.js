const logger = require('../helpers/logger');

/**
 * Service for generating WhatsApp redirect URLs
 * Requirements: 2.5
 */
class WhatsAppRedirect {
  constructor() {
    this.whatsappBotPhone = process.env.WHATSAPP_BOT_PHONE;
    
    if (!this.whatsappBotPhone) {
      logger.warn('WhatsApp bot phone number not configured');
    }
  }

  /**
   * Format phone number for WhatsApp (remove + and spaces)
   * @param {string} phone - Phone number in E.164 format
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phone) {
    return phone.replace(/\+/g, '').replace(/\s/g, '');
  }

  /**
   * Generate WhatsApp redirect URL with pre-filled message
   * @param {Object} data - Broker request data
   * @returns {string} WhatsApp redirect URL
   */
  generateRedirectUrl(data) {
    try {
      if (!this.whatsappBotPhone) {
        throw new Error('WhatsApp bot phone number is not configured. Please set WHATSAPP_BOT_PHONE environment variable.');
      }

      const formattedPhone = this.formatPhoneNumber(this.whatsappBotPhone);
      
      // Create pre-filled message with submission details
      const message = this.createPrefilledMessage(data);
      
      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);
      
      // Generate WhatsApp URL
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
      
      logger.info('Generated WhatsApp redirect URL', {
        name: data.name,
        phone: data.phone
      });
      
      return whatsappUrl;
    } catch (error) {
      logger.error('Error generating WhatsApp redirect URL', {
        error: error.message,
        data
      });
      throw error;
    }
  }

  /**
   * Create pre-filled message for WhatsApp
   * @param {Object} data - Broker request data
   * @returns {string} Pre-filled message
   */
  createPrefilledMessage(data) {
    let message = `Hi! I'm ${data.name} and I'm interested in connecting with a broker.\n\n`;
    
    if (data.property_type) {
      message += `Property Type: ${data.property_type}\n`;
    }
    
    if (data.location) {
      message += `Location: ${data.location}\n`;
    }
    
    if (data.budget) {
      message += `Budget: ${data.budget}\n`;
    }
    
    message += `\nPhone: ${data.phone}`;
    
    if (data.email) {
      message += `\nEmail: ${data.email}`;
    }
    
    return message;
  }
}

module.exports = new WhatsAppRedirect();
