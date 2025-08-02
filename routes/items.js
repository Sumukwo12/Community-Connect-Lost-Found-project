const express = require('express');
const router = express.Router();
const { Item, User, Organization } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all items with filtering, pagination, and search
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      category,
      search,
      organizationId
    } = req.query;

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (category) where.category = category;
    if (organizationId) where.organizationId = organizationId;
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: items } = await Item.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'code']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

// Get single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'code']
        },
        {
          model: User,
          as: 'resolvedBy',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Error fetching item' });
  }
});

// Create new item
router.post('/', auth, async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      location,
      reward = 0,
      images = [],
      category = 'other',
      color,
      brand,
      contactName,
      contactEmail,
      contactPhone,
      tags = []
    } = req.body;

    const item = await Item.create({
      type,
      title,
      description,
      location,
      reward,
      images,
      category,
      color,
      brand,
      contactName,
      contactEmail,
      contactPhone,
      tags,
      reporterId: req.user.id,
      organizationId: req.user.organizationId
    });

    const createdItem = await Item.findByPk(item.id, {
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    res.status(201).json({
      message: 'Item created successfully',
      item: createdItem
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Error creating item' });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user can update this item
    if (item.reporterId !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await item.update(req.body);

    const updatedItem = await Item.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    res.json({
      message: 'Item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user can delete this item
    if (item.reporterId !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await item.destroy();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Error deleting item' });
  }
});

// Mark item as resolved
router.patch('/:id/resolve', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.update({
      status: 'resolved',
      resolvedById: req.user.id,
      resolvedAt: new Date(),
      notes: req.body.notes
    });

    res.json({
      message: 'Item marked as resolved',
      item
    });
  } catch (error) {
    console.error('Error resolving item:', error);
    res.status(500).json({ message: 'Error resolving item' });
  }
});

// Get items by user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { reporterId: req.params.userId },
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'code']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(items);
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ message: 'Error fetching user items' });
  }
});

// Get items by organization
router.get('/organization/:orgId', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      category,
      search
    } = req.query;

    const where = { organizationId: req.params.orgId };
    if (type) where.type = type;
    if (status) where.status = status;
    if (category) where.category = category;
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: items } = await Item.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching organization items:', error);
    res.status(500).json({ message: 'Error fetching organization items' });
  }
});

module.exports = router; 