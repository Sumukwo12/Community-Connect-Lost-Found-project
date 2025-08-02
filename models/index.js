const sequelize = require('../config/database');
const Organization = require('./Organization');
const User = require('./User');
const Item = require('./Item');
const InviteCode = require('./InviteCode');
const Report = require('./Report');
const Notification = require('./Notification');

// Define associations
Organization.hasMany(User, {
  foreignKey: 'organizationId',
  as: 'users',
  onDelete: 'CASCADE'
});

User.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization'
});

Organization.hasMany(Item, {
  foreignKey: 'organizationId',
  as: 'items',
  onDelete: 'CASCADE'
});

Item.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization'
});

User.hasMany(Item, {
  foreignKey: 'reporterId',
  as: 'reportedItems'
});

Item.belongsTo(User, {
  foreignKey: 'reporterId',
  as: 'reporter'
});

User.hasMany(Item, {
  foreignKey: 'resolvedById',
  as: 'resolvedItems'
});

Item.belongsTo(User, {
  foreignKey: 'resolvedById',
  as: 'resolvedBy'
});

// InviteCode associations
Organization.hasMany(InviteCode, {
  foreignKey: 'organizationId',
  as: 'inviteCodes',
  onDelete: 'CASCADE'
});

InviteCode.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization'
});

User.hasMany(InviteCode, {
  foreignKey: 'createdById',
  as: 'createdInviteCodes'
});

InviteCode.belongsTo(User, {
  foreignKey: 'createdById',
  as: 'createdBy'
});

User.hasMany(InviteCode, {
  foreignKey: 'usedBy',
  as: 'usedInviteCodes'
});

InviteCode.belongsTo(User, {
  foreignKey: 'usedBy',
  as: 'usedByUser'
});

// Report associations
Organization.hasMany(Report, {
  foreignKey: 'organizationId',
  as: 'reports',
  onDelete: 'CASCADE'
});

Report.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization'
});

User.hasMany(Report, {
  foreignKey: 'reporterId',
  as: 'reportedIssues'
});

Report.belongsTo(User, {
  foreignKey: 'reporterId',
  as: 'reporter'
});

User.hasMany(Report, {
  foreignKey: 'assignedTo',
  as: 'assignedReports'
});

Report.belongsTo(User, {
  foreignKey: 'assignedTo',
  as: 'assignedToUser'
});

Item.hasMany(Report, {
  foreignKey: 'itemId',
  as: 'reports'
});

Report.belongsTo(Item, {
  foreignKey: 'itemId',
  as: 'item'
});

// Notification associations
Organization.hasMany(Notification, {
  foreignKey: 'organizationId',
  as: 'notifications',
  onDelete: 'CASCADE'
});

Notification.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization'
});

User.hasMany(Notification, {
  foreignKey: 'userId',
  as: 'notifications'
});

Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Database initialization
const initializeDatabase = async () => {
  try {
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    // Create default organization if none exists
    const organizationCount = await Organization.count();
    if (organizationCount === 0) {
      await Organization.create({
        name: 'Default Organization',
        code: 'DEFAULT',
        type: 'community',
        description: 'Default organization for the lost and found system',
        status: 'active'
      });
      console.log('Default organization created.');
    }

    // Create super admin user if none exists
    const superAdminCount = await User.count({
      where: { role: 'super_admin' }
    });
    
    if (superAdminCount === 0) {
      const defaultOrg = await Organization.findOne({
        where: { code: 'DEFAULT' }
      });
      
      if (defaultOrg) {
        await User.create({
          name: 'Super Admin',
          email: 'admin@lostfound.com',
          password: 'admin123',
          role: 'super_admin',
          organizationId: defaultOrg.id,
          status: 'active',
          emailVerified: true
        });
        console.log('Super admin user created.');
      }
    }

    // Create some sample items if none exist
    const itemCount = await Item.count();
    if (itemCount === 0) {
      const defaultOrg = await Organization.findOne({
        where: { code: 'DEFAULT' }
      });
      const adminUser = await User.findOne({
        where: { email: 'admin@lostfound.com' }
      });

      if (defaultOrg && adminUser) {
        await Item.create({
          type: 'lost',
          title: 'Lost iPhone 13',
          description: 'Lost my iPhone 13 at the library. It has a black case and is locked.',
          location: 'University Library',
          reward: 100,
          category: 'electronics',
          color: 'Black',
          brand: 'Apple',
          contactName: 'John Doe',
          contactEmail: 'john@example.com',
          contactPhone: '555-0123',
          tags: ['phone', 'electronics', 'library'],
          reporterId: adminUser.id,
          organizationId: defaultOrg.id
        });

        await Item.create({
          type: 'found',
          title: 'Found Keys',
          description: 'Found a set of keys with a red keychain near the cafeteria.',
          location: 'Student Cafeteria',
          reward: 0,
          category: 'keys',
          color: 'Silver',
          contactName: 'Security Office',
          contactEmail: 'security@example.com',
          contactPhone: '555-0456',
          tags: ['keys', 'cafeteria'],
          reporterId: adminUser.id,
          organizationId: defaultOrg.id
        });

        await Item.create({
          type: 'lost',
          title: 'Lost Wallet',
          description: 'Lost my brown leather wallet with my student ID and some cash.',
          location: 'Parking Lot A',
          reward: 50,
          category: 'other',
          color: 'Brown',
          brand: 'Leather',
          contactName: 'Jane Smith',
          contactEmail: 'jane@example.com',
          contactPhone: '555-0789',
          tags: ['wallet', 'student-id', 'cash'],
          reporterId: adminUser.id,
          organizationId: defaultOrg.id
        });

        console.log('Sample items created.');
      }
    }

  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = {
  sequelize,
  Organization,
  User,
  Item,
  InviteCode,
  Report,
  Notification,
  initializeDatabase
}; 