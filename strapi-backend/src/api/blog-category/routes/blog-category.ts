/**
 * blog-category router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::blog-category.blog-category', {
  config: {
    find: {
      middlewares: [],
    },
    findOne: {
      middlewares: [],
    }
  }
});
