const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('lost', 'found', 'suspicious', 'inappropriate'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'investigating', 'resolved', 'dismissed'),
    defaultValue: 'pending'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  investigationNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolution: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  actionTaken: {
    type: DataTypes.ENUM('warning', 'suspension', 'ban', 'none'),
    defaultValue: 'none'
  },
  evidence: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('evidence');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('evidence', JSON.stringify(value));
    }
  }
}, {
  tableName: 'reports',
  timestamps: true,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['organizationId']
    },
    {
      fields: ['reporterId']
    },
    {
      fields: ['assignedTo']
    },
    {
      fields: ['itemId']
    }
  ]
});

module.exports = Report; 