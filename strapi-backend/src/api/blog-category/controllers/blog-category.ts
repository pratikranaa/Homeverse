/**
 * blog-category controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::blog-category.blog-category', ({ strapi }) => ({
  // Override find method to support filtering
  async find(ctx) {
    // Call the default core action
    const { data, meta } = await super.find(ctx);
    
    return { data, meta };
  }
}));
