const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const IntegrationConfig = sequelize.define('IntegrationConfig', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  config_key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  config_value: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'integration_config',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['config_key']
    }
  ]
});

module.exports = IntegrationConfig;
