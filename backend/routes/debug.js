const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UMKM = require('../models/UMKM');

// @desc    Get all users (for debugging)
// @route   GET /api/debug/users
// @access  Public (should be removed in production)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('umkmId').select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
});

// @desc    Get all admin users (for debugging)
// @route   GET /api/debug/admins
// @access  Public (should be removed in production)
router.get('/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin users',
      error: error.message,
    });
  }
});

// @desc    Get all UMKMs (for debugging)
// @route   GET /api/debug/umkms
// @access  Public (should be removed in production)
router.get('/umkms', async (req, res) => {
  try {
    const umkms = await UMKM.find().populate('userId');
    res.json({
      success: true,
      count: umkms.length,
      data: umkms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching UMKMs',
      error: error.message,
    });
  }
});

// @desc    Delete user by email (for debugging)
// @route   DELETE /api/debug/user/:email
// @access  Public (should be removed in production)
router.delete('/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete associated UMKM if exists
    if (user.umkmId) {
      await UMKM.findByIdAndDelete(user.umkmId);
    }

    // Delete user
    await User.findByIdAndDelete(user._id);

    res.json({
      success: true,
      message: 'User and associated UMKM deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
});

// @desc    Clear all users and UMKMs (for debugging)
// @route   DELETE /api/debug/clear-all
// @access  Public (should be removed in production)
router.delete('/clear-all', async (req, res) => {
  try {
    await User.deleteMany({});
    await UMKM.deleteMany({});
    
    res.json({
      success: true,
      message: 'All users and UMKMs cleared successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing data',
      error: error.message,
    });
  }
});

module.exports = router;
