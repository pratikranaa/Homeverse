const ContentManager = require('../services/ContentManager');
const logger = require('../helpers/logger');
const { NotFoundError } = require('../middleware/errorHandler');

class ContentController {
  /**
   * Get buyer landing page content
   * GET /api/v1/content/buyer-landing
   */
  async getBuyerLanding(req, res, next) {
    try {
      const content = await ContentManager.getPageContent('buyer-landing');
      
      if (!content) {
        throw new NotFoundError('Buyer landing page content not found');
      }

      res.status(200).json({
        success: true,
        data: content
      });
    } catch (error) {
      logger.error('Error fetching buyer landing content:', error);
      next(error);
    }
  }

  /**
   * Get seller landing page content
   * GET /api/v1/content/seller-landing
   */
  async getSellerLanding(req, res, next) {
    try {
      const content = await ContentManager.getPageContent('seller-landing');
      
      if (!content) {
        throw new NotFoundError('Seller landing page content not found');
      }

      res.status(200).json({
        success: true,
        data: content
      });
    } catch (error) {
      logger.error('Error fetching seller landing content:', error);
      next(error);
    }
  }

  /**
   * Get about page content
   * GET /api/v1/content/about
   */
  async getAbout(req, res, next) {
    try {
      const content = await ContentManager.getPageContent('about');
      
      if (!content) {
        throw new NotFoundError('About page content not found');
      }

      res.status(200).json({
        success: true,
        data: content
      });
    } catch (error) {
      logger.error('Error fetching about page content:', error);
      next(error);
    }
  }

  /**
   * Get contact page content
   * GET /api/v1/content/contact
   */
  async getContact(req, res, next) {
    try {
      const content = await ContentManager.getPageContent('contact');
      
      if (!content) {
        throw new NotFoundError('Contact page content not found');
      }

      res.status(200).json({
        success: true,
        data: content
      });
    } catch (error) {
      logger.error('Error fetching contact page content:', error);
      next(error);
    }
  }

  /**
   * Get home page content
   * GET /api/v1/content/home
   */
  async getHome(req, res, next) {
    try {
      const content = await ContentManager.getPageContent('home');
      
      if (!content) {
        throw new NotFoundError('Home page content not found');
      }

      res.status(200).json({
        success: true,
        data: content
      });
    } catch (error) {
      logger.error('Error fetching home page content:', error);
      next(error);
    }
  }
}

module.exports = new ContentController();
