require('dotenv').config();
const { sequelize, testConnection } = require('./config');
const logger = require('../helpers/logger');
const models = require('../models');

const verify = async () => {
  try {
    logger.info('Verifying database setup...');
    
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Check all tables exist
    const tables = [
      'content_pages',
      'content_sections',
      'cta_callback_requests',
      'cta_broker_requests',
      'integration_logs',
      'response_logs',
      'error_logs',
      'submission_status',
      'integration_config'
    ];

    logger.info('Checking tables...');
    for (const table of tables) {
      const [results] = await sequelize.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        );`
      );
      
      if (results[0].exists) {
        logger.info(`✓ Table '${table}' exists`);
      } else {
        logger.error(`✗ Table '${table}' does not exist`);
      }
    }

    // Check indexes
    logger.info('\nChecking indexes...');
    const [indexes] = await sequelize.query(`
      SELECT tablename, indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      ORDER BY tablename, indexname;
    `);
    
    logger.info(`Found ${indexes.length} indexes`);
    indexes.forEach(idx => {
      logger.info(`  - ${idx.tablename}.${idx.indexname}`);
    });

    // Check data counts
    logger.info('\nChecking data...');
    const pageCount = await models.ContentPage.count();
    const sectionCount = await models.ContentSection.count();
    
    logger.info(`Content Pages: ${pageCount}`);
    logger.info(`Content Sections: ${sectionCount}`);

    logger.info('\n✓ Database verification completed successfully');
    
  } catch (error) {
    logger.error('Verification failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run verification if called directly
if (require.main === module) {
  verify()
    .then(() => {
      logger.info('Verification script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Verification script failed:', error);
      process.exit(1);
    });
}

module.exports = { verify };
