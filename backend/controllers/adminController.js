const UMKM = require('../models/UMKM');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// @desc    Get all pending UMKMs
// @route   GET /api/admin/umkm/pending
// @access  Private (Admin only)
exports.getPendingUMKM = async (req, res) => {
  try {
    const umkms = await UMKM.find({ status: 'pending' })
      .populate('userId', 'email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: umkms.length,
      data: umkms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending UMKMs',
      error: error.message,
    });
  }
};

// @desc    Get all UMKMs (approved, pending, rejected)
// @route   GET /api/admin/umkm
// @access  Private (Admin only)
exports.getAllUMKMAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = status ? { status } : {};

    const umkms = await UMKM.find(query)
      .populate('userId', 'email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await UMKM.countDocuments(query);

    res.status(200).json({
      success: true,
      data: umkms,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching UMKMs',
      error: error.message,
    });
  }
};

// @desc    Approve UMKM
// @route   PUT /api/admin/umkm/:id/approve
// @access  Private (Admin only)
exports.approveUMKM = async (req, res) => {
  try {
    const umkm = await UMKM.findById(req.params.id);

    if (!umkm) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found',
      });
    }

    umkm.status = 'approved';
    await umkm.save();

    // Create audit log
    await AuditLog.create({
      action: 'approve',
      adminId: req.user._id,
      adminEmail: req.user.email,
      umkmId: umkm._id,
      umkmName: umkm.nama,
    });

    res.status(200).json({
      success: true,
      data: umkm,
      message: 'UMKM approved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving UMKM',
      error: error.message,
    });
  }
};

// @desc    Reject UMKM
// @route   PUT /api/admin/umkm/:id/reject
// @access  Private (Admin only)
exports.rejectUMKM = async (req, res) => {
  try {
    const umkm = await UMKM.findById(req.params.id);

    if (!umkm) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found',
      });
    }

    umkm.status = 'rejected';
    await umkm.save();

    // Create audit log
    await AuditLog.create({
      action: 'reject',
      adminId: req.user._id,
      adminEmail: req.user.email,
      umkmId: umkm._id,
      umkmName: umkm.nama,
    });

    res.status(200).json({
      success: true,
      data: umkm,
      message: 'UMKM rejected',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting UMKM',
      error: error.message,
    });
  }
};

// @desc    Get statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res) => {
  try {
    const totalUMKM = await UMKM.countDocuments();
    const approvedUMKM = await UMKM.countDocuments({ status: 'approved' });
    const pendingUMKM = await UMKM.countDocuments({ status: 'pending' });
    const rejectedUMKM = await UMKM.countDocuments({ status: 'rejected' });
    const totalUsers = await User.countDocuments({ role: 'umkm' });

    // Get category statistics
    const categoryStats = await UMKM.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$kategori', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUMKM,
        approvedUMKM,
        pendingUMKM,
        rejectedUMKM,
        totalUsers,
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

// @desc    Get operator statistics
// @route   GET /api/admin/operator-stats
// @access  Private (Admin only)
exports.getOperatorStats = async (req, res) => {
  try {
    const { operator } = req.query;

    // Get operator statistics (global)
    const operatorStats = await UMKM.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$operator', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    let detailStats = null;
    
    // If operator is specified, get detail stats by dinas
    if (operator) {
      detailStats = await UMKM.aggregate([
        { 
          $match: { 
            status: 'approved',
            operator: operator 
          } 
        },
        { $group: { _id: '$dinas', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
    }

    res.status(200).json({
      success: true,
      data: {
        operatorStats,
        detailStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching operator statistics',
      error: error.message,
    });
  }
};

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin only)
exports.getAuditLogs = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .exec();

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs',
      error: error.message,
    });
  }
};
