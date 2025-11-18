const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const ErrorLog = sequelize.define('ErrorLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  integration_log_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'integration_logs',
      key: 'id'
    }
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  error_stack: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  retry_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'error_logs',
  timestamps: true,
  updatedAt: false,
  indexes: [
    {
      fields: ['integration_log_id']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = ErrorLog;
