const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InviteCode = sequelize.define('InviteCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'used', 'expired'),
    defaultValue: 'active'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  usedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  maxUses: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  currentUses: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'invite_codes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['status']
    },
    {
      fields: ['type']
    },
    {
      fields: ['organizationId']
    },
    {
      fields: ['createdById']
    }
  ]
});

module.exports = InviteCode; 