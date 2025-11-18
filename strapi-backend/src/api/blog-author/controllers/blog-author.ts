/**
 * blog-author controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::blog-author.blog-author', ({ strapi }) => ({
  // Override find method to populate avatar
  async find(ctx) {
    // Populate avatar relation
    ctx.query = {
      ...ctx.query,
      populate: {
        avatar: true
      }
    };

    // Call the default core action with populated relations
    const { data, meta } = await super.find(ctx);
    
    return { data, meta };
  }
}));
