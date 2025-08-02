const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
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
    type: DataTypes.ENUM('school', 'university', 'company', 'community', 'other'),
    defaultValue: 'other'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  allowPublicRegistration: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  requireEmailVerification: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allowAnonymousReports: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  maxRewardAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 1000
  },
  autoArchiveDays: {
    type: DataTypes.INTEGER,
    defaultValue: 90
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active'
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  primaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#3B82F6'
  },
  secondaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#1F2937'
  },
  totalUsers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalItems: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  resolvedItems: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'organizations',
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
    }
  ]
});

module.exports = Organization; 