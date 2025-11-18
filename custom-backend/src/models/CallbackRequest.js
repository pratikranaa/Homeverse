const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const CallbackRequest = sequelize.define('CallbackRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  preferred_time: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  },
  exponentia_response: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'cta_callback_requests',
  timestamps: true,
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = CallbackRequest;
