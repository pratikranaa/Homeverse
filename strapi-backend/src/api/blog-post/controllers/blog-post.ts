/**
 * blog-post controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::blog-post.blog-post', ({ strapi }) => ({
  // Override find method to populate relations and configure pagination
  async find(ctx) {
    // Populate category and author relations
    ctx.query = {
      ...ctx.query,
      populate: {
        category: true,
        author: {
          populate: ['avatar']
        },
        featured_image: true
      }
    };

    // Call the default core action with populated relations
    const { data, meta } = await super.find(ctx);
    
    return { data, meta };
  },

  // Override findOne method to find by slug and populate relations
  async findOne(ctx) {
    const { id: slug } = ctx.params;

    // Find by slug instead of id
    const entity = await strapi.db.query('api::blog-post.blog-post').findOne({
      where: { slug },
      populate: {
        category: true,
        author: {
          populate: ['avatar']
        },
        featured_image: true
      }
    });

    if (!entity) {
      return ctx.notFound('Blog post not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  }
}));
