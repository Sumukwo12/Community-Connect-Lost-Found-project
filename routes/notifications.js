const express = require('express');
const router = express.Router();
const { Notification, User, Organization } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type
    } = req.query;

    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (type) where.type = type;

    const offset = (page - 1) * limit;

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await notification.update({
      status: 'read',
      readAt: new Date()
    });

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
});

// Mark all notifications as read
router.patch('/read-all', auth, async (req, res) => {
  try {
    await Notification.update(
      {
        status: 'read',
        readAt: new Date()
      },
      {
        where: {
          userId: req.user.id,
          status: 'unread'
        }
      }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Error marking all notifications as read' });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await notification.destroy();
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
});

// Get unread count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        userId: req.user.id,
        status: 'unread'
      }
    });

    res.json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Error getting unread count' });
  }
});

// Create notification (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const {
      type,
      title,
      message,
      userId,
      priority = 'medium',
      actionUrl,
      metadata = {},
      expiresAt
    } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const notification = await Notification.create({
      type,
      title,
      message,
      userId,
      priority,
      actionUrl,
      metadata,
      expiresAt,
      organizationId: req.user.organizationId
    });

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Error creating notification' });
  }
});

// Create bulk notifications (admin only)
router.post('/bulk', auth, async (req, res) => {
  try {
    const { notifications } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const createdNotifications = await Notification.bulkCreate(
      notifications.map(notification => ({
        ...notification,
        organizationId: req.user.organizationId
      }))
    );

    res.status(201).json({
      message: 'Notifications created successfully',
      count: createdNotifications.length
    });
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    res.status(500).json({ message: 'Error creating bulk notifications' });
  }
});

module.exports = router; 