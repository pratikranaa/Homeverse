const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const SubmissionStatus = sequelize.define('SubmissionStatus', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  submission_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  submission_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  processed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'submission_status',
  timestamps: true,
  indexes: [
    {
      fields: ['submission_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['submission_type']
    }
  ]
});

module.exports = SubmissionStatus;
