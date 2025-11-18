const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const ContentPage = sequelize.define('ContentPage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  page_key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'content_pages',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['page_key']
    }
  ]
});

module.exports = ContentPage;
