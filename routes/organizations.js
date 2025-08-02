const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all organizations (super admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      search
    } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const organizations = await Organization.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Organization.countDocuments(filter);

    res.json({
      organizations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ message: 'Error fetching organizations' });
  }
});

// Get organization by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check if user can view this organization
    if (req.user.organization.toString() !== req.params.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(organization);
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ message: 'Error fetching organization' });
  }
});

// Create new organization (super admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const {
      name,
      code,
      type,
      description,
      location,
      contact,
      settings
    } = req.body;

    // Check if organization code already exists
    const existingOrg = await Organization.findOne({ code });
    if (existingOrg) {
      return res.status(400).json({ message: 'Organization code already exists' });
    }

    const organization = new Organization({
      name,
      code: code.toUpperCase(),
      type,
      description,
      location,
      contact,
      settings,
      createdBy: req.user.id
    });

    await organization.save();

    res.status(201).json({
      message: 'Organization created successfully',
      organization
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ message: 'Error creating organization' });
  }
});

// Update organization
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Only super admin can update all organizations
    if (req.user.role !== 'super_admin' && req.user.organization.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedOrganization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'name email');

    res.json({
      message: 'Organization updated successfully',
      organization: updatedOrganization
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ message: 'Error updating organization' });
  }
});

// Delete organization (super admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check if organization has users
    const userCount = await User.countDocuments({ organization: req.params.id });
    if (userCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete organization with existing users' 
      });
    }

    await Organization.findByIdAndDelete(req.params.id);
    res.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ message: 'Error deleting organization' });
  }
});

// Get organization statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check if user can view this organization
    if (req.user.organization.toString() !== req.params.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get organization statistics
    const userCount = await User.countDocuments({ organization: req.params.id });
    const Item = require('../models/Item');
    const totalItems = await Item.countDocuments({ organization: req.params.id });
    const activeItems = await Item.countDocuments({ 
      organization: req.params.id, 
      status: 'active' 
    });
    const resolvedItems = await Item.countDocuments({ 
      organization: req.params.id, 
      status: 'resolved' 
    });

    // Update organization statistics
    organization.statistics = {
      totalUsers: userCount,
      totalItems,
      resolvedItems
    };
    await organization.save();

    res.json({
      totalUsers: userCount,
      totalItems,
      activeItems,
      resolvedItems,
      resolutionRate: totalItems > 0 ? (resolvedItems / totalItems * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error('Error fetching organization stats:', error);
    res.status(500).json({ message: 'Error fetching organization statistics' });
  }
});

// Get organization by code
router.get('/code/:code', async (req, res) => {
  try {
    const organization = await Organization.findOne({ 
      code: req.params.code.toUpperCase() 
    });

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Only return public information
    res.json({
      id: organization._id,
      name: organization.name,
      code: organization.code,
      type: organization.type,
      description: organization.description,
      settings: {
        allowPublicRegistration: organization.settings.allowPublicRegistration
      }
    });
  } catch (error) {
    console.error('Error fetching organization by code:', error);
    res.status(500).json({ message: 'Error fetching organization' });
  }
});

// Update organization settings
router.patch('/:id/settings', auth, admin, async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Only super admin or organization admin can update settings
    if (req.user.role !== 'super_admin' && req.user.organization.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    organization.settings = { ...organization.settings, ...req.body };
    await organization.save();

    res.json({
      message: 'Organization settings updated successfully',
      settings: organization.settings
    });
  } catch (error) {
    console.error('Error updating organization settings:', error);
    res.status(500).json({ message: 'Error updating organization settings' });
  }
});

module.exports = router; 