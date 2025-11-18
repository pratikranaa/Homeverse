const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const BrokerRequest = sequelize.define('BrokerRequest', {
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
  property_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  },
  exponentia_response: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  whatsapp_redirect_url: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'cta_broker_requests',
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

module.exports = BrokerRequest;
