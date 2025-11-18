const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const ResponseLog = sequelize.define('ResponseLog', {
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
  status_code: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  response_payload: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  response_time_ms: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'response_logs',
  timestamps: true,
  updatedAt: false,
  indexes: [
    {
      fields: ['integration_log_id']
    },
    {
      fields: ['status_code']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = ResponseLog;
