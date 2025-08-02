const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all users (admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      status,
      organization,
      search
    } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (organization) filter.organization = organization;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .populate('organization', 'name code')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('organization', 'name code')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user can view this profile
    if (req.user.id !== req.params.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Create new user (admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { name, email, password, role, organization } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'user',
      organization: organization || req.user.organization
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Update user
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user can edit this profile
    if (req.user.id !== req.params.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only admins can change role and organization
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      delete req.body.role;
      delete req.body.organization;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('organization', 'name code')
    .select('-password');

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting super admin
    if (user.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot delete super admin' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Get users by organization
router.get('/organization/:orgId', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      status,
      search
    } = req.query;

    const filter = { organization: req.params.orgId };
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .populate('organization', 'name code')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching organization users:', error);
    res.status(500).json({ message: 'Error fetching organization users' });
  }
});

// Update user status (admin only)
router.patch('/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json({
      message: 'User status updated successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Get user statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user can view this profile
    if (req.user.id !== req.params.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get user's items count
    const Item = require('../models/Item');
    const totalItems = await Item.countDocuments({ reporter: req.params.id });
    const activeItems = await Item.countDocuments({ 
      reporter: req.params.id, 
      status: 'active' 
    });
    const resolvedItems = await Item.countDocuments({ 
      reporter: req.params.id, 
      status: 'resolved' 
    });

    res.json({
      totalItems,
      activeItems,
      resolvedItems,
      resolutionRate: totalItems > 0 ? (resolvedItems / totalItems * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
});

module.exports = router; 