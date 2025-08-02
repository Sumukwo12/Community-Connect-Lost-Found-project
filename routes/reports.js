const express = require('express');
const router = express.Router();
const { Report, User, Item, Organization } = require('../models');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Op } = require('sequelize');

// Get all reports (admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      priority,
      search
    } = req.query;

    const where = { organizationId: req.user.organizationId };
    if (type) where.type = type;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    
    if (search) {
      where[Op.or] = [
        { reason: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: reports } = await Report.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedToUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'title', 'type']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

// Get single report
router.get('/:id', auth, admin, async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedToUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'title', 'type', 'description']
        }
      ]
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Error fetching report' });
  }
});

// Create new report
router.post('/', auth, async (req, res) => {
  try {
    const {
      type,
      reason,
      description,
      itemId,
      priority = 'medium',
      evidence = []
    } = req.body;

    const report = await Report.create({
      type,
      reason,
      description,
      itemId,
      priority,
      evidence,
      reporterId: req.user.id,
      organizationId: req.user.organizationId
    });

    const createdReport = await Report.findByPk(report.id, {
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'title', 'type']
        }
      ]
    });

    res.status(201).json({
      message: 'Report created successfully',
      report: createdReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Error creating report' });
  }
});

// Update report (admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.organizationId !== req.user.organizationId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await report.update(req.body);

    const updatedReport = await Report.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedToUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'title', 'type']
        }
      ]
    });

    res.json({
      message: 'Report updated successfully',
      report: updatedReport
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Error updating report' });
  }
});

// Assign report to admin
router.patch('/:id/assign', auth, admin, async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const report = await Report.findByPk(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.update({
      assignedTo,
      assignedAt: new Date(),
      status: 'investigating'
    });

    res.json({
      message: 'Report assigned successfully',
      report
    });
  } catch (error) {
    console.error('Error assigning report:', error);
    res.status(500).json({ message: 'Error assigning report' });
  }
});

// Resolve report
router.patch('/:id/resolve', auth, admin, async (req, res) => {
  try {
    const { resolution, actionTaken } = req.body;
    const report = await Report.findByPk(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.update({
      status: 'resolved',
      resolution,
      actionTaken,
      resolvedAt: new Date()
    });

    res.json({
      message: 'Report resolved successfully',
      report
    });
  } catch (error) {
    console.error('Error resolving report:', error);
    res.status(500).json({ message: 'Error resolving report' });
  }
});

// Delete report
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.organizationId !== req.user.organizationId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await report.destroy();
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Error deleting report' });
  }
});

module.exports = router; 