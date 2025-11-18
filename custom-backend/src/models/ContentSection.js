const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const ContentSection = sequelize.define('ContentSection', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  page_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'content_pages',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  section_key: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  section_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'content_sections',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['page_id', 'section_key']
    },
    {
      fields: ['page_id']
    }
  ]
});

module.exports = ContentSection;
