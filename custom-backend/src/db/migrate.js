require('dotenv').config();
const { sequelize, testConnection } = require('./config');
const logger = require('../helpers/logger');
const models = require('../models');

const migrate = async () => {
  try {
    logger.info('Starting database migration...');
    
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    
    logger.info('Database migration completed successfully');
    logger.info('All tables created/updated');
    
    return true;
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
};

// Run migration if called directly
if (require.main === module) {
  migrate()
    .then(() => {
      logger.info('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrate };
