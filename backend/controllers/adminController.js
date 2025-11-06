const UMKM = require('../models/UMKM');
const User = require('../models/User');

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

    res.status(200).json({
      success: true,
      data: {
        totalUMKM,
        approvedUMKM,
        pendingUMKM,
        rejectedUMKM,
        totalUsers,
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
