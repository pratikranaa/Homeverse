import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Configure permissions for blog content types
    await configureBlogPermissions(strapi);
  },
};

/**
 * Configure permissions for blog content types
 * - Public role: find and findOne permissions on all blog content types
 * - Authenticated role: full CRUD permissions on all blog content types
 */
async function configureBlogPermissions(strapi: Core.Strapi) {
  const contentTypes = ['blog-post', 'blog-category', 'blog-author'];
  
  // Get public role
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  // Get authenticated role
  const authenticatedRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'authenticated' } });

  if (!publicRole || !authenticatedRole) {
    strapi.log.warn('Could not find public or authenticated role');
    return;
  }

  // Configure permissions for each content type
  for (const contentType of contentTypes) {
    const apiName = `api::${contentType}.${contentType}`;
    
    // Public role: find and findOne permissions
    const publicPermissions = ['find', 'findOne'];
    for (const action of publicPermissions) {
      await strapi.query('plugin::users-permissions.permission').findOne({
        where: {
          role: publicRole.id,
          action: `${apiName}.${action}`,
        },
      }).then(async (permission) => {
        if (permission) {
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: permission.id },
            data: { enabled: true },
          });
        } else {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              role: publicRole.id,
              action: `${apiName}.${action}`,
              enabled: true,
            },
          });
        }
      });
    }

    // Authenticated role: full CRUD permissions
    const authenticatedPermissions = ['find', 'findOne', 'create', 'update', 'delete'];
    for (const action of authenticatedPermissions) {
      await strapi.query('plugin::users-permissions.permission').findOne({
        where: {
          role: authenticatedRole.id,
          action: `${apiName}.${action}`,
        },
      }).then(async (permission) => {
        if (permission) {
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: permission.id },
            data: { enabled: true },
          });
        } else {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              role: authenticatedRole.id,
              action: `${apiName}.${action}`,
              enabled: true,
            },
          });
        }
      });
    }
  }

  strapi.log.info('Blog content type permissions configured successfully');
}
