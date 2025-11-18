const { ContentPage, ContentSection } = require('../models');

class ContentRepository {
  /**
   * Get a content page by its unique key with all sections
   * @param {string} pageKey - The unique page key
   * @returns {Promise<Object|null>} Page with sections or null
   */
  async getPageByKey(pageKey) {
    try {
      const page = await ContentPage.findOne({
        where: { 
          page_key: pageKey,
          is_active: true 
        },
        include: [{
          model: ContentSection,
          as: 'sections',
          where: { is_active: true },
          required: false,
          order: [['sort_order', 'ASC']]
        }]
      });
      
      return page;
    } catch (error) {
      throw new Error(`Failed to fetch page by key: ${error.message}`);
    }
  }

  /**
   * Get all sections for a specific page ID
   * @param {string} pageId - The page UUID
   * @returns {Promise<Array>} Array of sections
   */
  async getSectionsByPageId(pageId) {
    try {
      const sections = await ContentSection.findAll({
        where: { 
          page_id: pageId,
          is_active: true 
        },
        order: [['sort_order', 'ASC']]
      });
      
      return sections;
    } catch (error) {
      throw new Error(`Failed to fetch sections by page ID: ${error.message}`);
    }
  }

  /**
   * Get all active sections across all pages
   * @returns {Promise<Array>} Array of all sections
   */
  async getAllSections() {
    try {
      const sections = await ContentSection.findAll({
        where: { is_active: true },
        include: [{
          model: ContentPage,
          as: 'page',
          where: { is_active: true },
          attributes: ['id', 'page_key', 'title']
        }],
        order: [['page_id', 'ASC'], ['sort_order', 'ASC']]
      });
      
      return sections;
    } catch (error) {
      throw new Error(`Failed to fetch all sections: ${error.message}`);
    }
  }
}

module.exports = new ContentRepository();
