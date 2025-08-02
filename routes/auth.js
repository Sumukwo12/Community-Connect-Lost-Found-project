const express = require('express');
const router = express.Router();
const { User, Organization } = require('../models');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User registration
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      organizationCode,
      phone,
      address
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Find organization by code
    const organization = await Organization.findOne({
      where: { code: organizationCode.toUpperCase() }
    });

    if (!organization) {
      return res.status(400).json({ message: 'Invalid organization code' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      organizationId: organization.id,
      phone,
      street: address?.street,
      city: address?.city,
      state: address?.state,
      zipCode: address?.zipCode,
      country: address?.country
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(400).json({ message: 'Account is not active' });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    res.json(user.toPublicJSON());
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      name,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      emailNotifications,
      pushNotifications,
      showContact,
      showLocation
    } = req.body;

    const user = await User.findByPk(req.user.id);
    
    await user.update({
      name,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      emailNotifications,
      pushNotifications,
      showContact,
      showLocation
    });

    const updatedUser = await User.findByPk(req.user.id, {
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser.toPublicJSON()
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    await user.update({ password: newPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Update user with reset token
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hour
    });

    // In a real application, send email here
    res.json({ 
      message: 'Password reset email sent',
      resetToken // Remove this in production
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Error processing forgot password' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findOne({
      where: {
        id: decoded.userId,
        resetPasswordToken: token,
        resetPasswordExpires: { [require('sequelize').Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    await user.update({
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

module.exports = router; 