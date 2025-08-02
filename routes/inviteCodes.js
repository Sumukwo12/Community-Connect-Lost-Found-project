const express = require('express');
const router = express.Router();
const { InviteCode, User, Organization } = require('../models');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Op } = require('sequelize');
const crypto = require('crypto');

// Generate invite code
router.post('/generate', auth, admin, async (req, res) => {
  try {
    const {
      type = 'user',
      email,
      maxUses = 1,
      expiresInDays = 7,
      notes
    } = req.body;

    // Generate unique code
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Set expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const inviteCode = await InviteCode.create({
      code,
      type,
      email,
      maxUses,
      expiresAt,
      notes,
      organizationId: req.user.organizationId,
      createdById: req.user.id
    });

    res.status(201).json({
      message: 'Invite code generated successfully',
      inviteCode
    });
  } catch (error) {
    console.error('Error generating invite code:', error);
    res.status(500).json({ message: 'Error generating invite code' });
  }
});

// Get all invite codes (admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      search
    } = req.query;

    const where = { organizationId: req.user.organizationId };
    if (type) where.type = type;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { code: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: inviteCodes } = await InviteCode.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'usedByUser',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      inviteCodes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching invite codes:', error);
    res.status(500).json({ message: 'Error fetching invite codes' });
  }
});

// Validate invite code
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;

    const inviteCode = await InviteCode.findOne({
      where: { code: code.toUpperCase() },
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    if (!inviteCode) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    if (inviteCode.status !== 'active') {
      return res.status(400).json({ message: 'Invite code is not active' });
    }

    if (inviteCode.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invite code has expired' });
    }

    if (inviteCode.currentUses >= inviteCode.maxUses) {
      return res.status(400).json({ message: 'Invite code has reached maximum uses' });
    }

    res.json({
      message: 'Invite code is valid',
      inviteCode
    });
  } catch (error) {
    console.error('Error validating invite code:', error);
    res.status(500).json({ message: 'Error validating invite code' });
  }
});

// Use invite code
router.post('/use', async (req, res) => {
  try {
    const { code, userId } = req.body;

    const inviteCode = await InviteCode.findOne({
      where: { code: code.toUpperCase() }
    });

    if (!inviteCode) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    if (inviteCode.status !== 'active') {
      return res.status(400).json({ message: 'Invite code is not active' });
    }

    if (inviteCode.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invite code has expired' });
    }

    if (inviteCode.currentUses >= inviteCode.maxUses) {
      return res.status(400).json({ message: 'Invite code has reached maximum uses' });
    }

    // Update invite code usage
    await inviteCode.update({
      currentUses: inviteCode.currentUses + 1,
      usedAt: new Date(),
      usedBy: userId,
      status: inviteCode.currentUses + 1 >= inviteCode.maxUses ? 'used' : 'active'
    });

    res.json({
      message: 'Invite code used successfully',
      inviteCode
    });
  } catch (error) {
    console.error('Error using invite code:', error);
    res.status(500).json({ message: 'Error using invite code' });
  }
});

// Delete invite code
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const inviteCode = await InviteCode.findByPk(req.params.id);
    
    if (!inviteCode) {
      return res.status(404).json({ message: 'Invite code not found' });
    }

    if (inviteCode.organizationId !== req.user.organizationId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await inviteCode.destroy();
    res.json({ message: 'Invite code deleted successfully' });
  } catch (error) {
    console.error('Error deleting invite code:', error);
    res.status(500).json({ message: 'Error deleting invite code' });
  }
});

module.exports = router; 