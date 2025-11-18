const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const IntegrationLog = sequelize.define('IntegrationLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  request_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  request_payload: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  endpoint: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  http_method: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
}, {
  tableName: 'integration_logs',
  timestamps: true,
  updatedAt: false,
  indexes: [
    {
      fields: ['request_type']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = IntegrationLog;
