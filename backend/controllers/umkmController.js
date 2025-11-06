const UMKM = require('../models/UMKM');
const Product = require('../models/Product');

// @desc    Get all approved UMKMs
// @route   GET /api/umkm
// @access  Public
exports.getAllUMKM = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = '', kota = '' } = req.query;

    const query = { status: 'approved' };

    if (search) {
      query.$or = [
        { nama: { $regex: search, $options: 'i' } },
        { deskripsi: { $regex: search, $options: 'i' } },
      ];
    }

    if (kota) {
      query.kota = kota;
    }

    const umkms = await UMKM.find(query)
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

// @desc    Get single UMKM
// @route   GET /api/umkm/:id
// @access  Public
exports.getUMKM = async (req, res) => {
  try {
    const umkm = await UMKM.findById(req.params.id);

    if (!umkm) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found',
      });
    }

    // Get products for this UMKM
    const products = await Product.find({ umkmId: umkm._id });

    res.status(200).json({
      success: true,
      data: {
        ...umkm.toObject(),
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching UMKM',
      error: error.message,
    });
  }
};

// @desc    Update UMKM
// @route   PUT /api/umkm/:id
// @access  Private (UMKM owner only)
exports.updateUMKM = async (req, res) => {
  try {
    let umkm = await UMKM.findById(req.params.id);

    if (!umkm) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found',
      });
    }

    // Make sure user is UMKM owner
    if (umkm.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this UMKM',
      });
    }

    umkm = await UMKM.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: umkm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating UMKM',
      error: error.message,
    });
  }
};

// @desc    Delete UMKM
// @route   DELETE /api/umkm/:id
// @access  Private (UMKM owner or admin)
exports.deleteUMKM = async (req, res) => {
  try {
    const umkm = await UMKM.findById(req.params.id);

    if (!umkm) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found',
      });
    }

    // Make sure user is UMKM owner or admin
    if (umkm.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this UMKM',
      });
    }

    // Delete all products associated with this UMKM
    await Product.deleteMany({ umkmId: umkm._id });

    await umkm.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting UMKM',
      error: error.message,
    });
  }
};

// @desc    Get my UMKM
// @route   GET /api/umkm/my/profile
// @access  Private
exports.getMyUMKM = async (req, res) => {
  try {
    const umkm = await UMKM.findOne({ userId: req.user.id });

    if (!umkm) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found',
      });
    }

    const products = await Product.find({ umkmId: umkm._id });

    res.status(200).json({
      success: true,
      data: {
        ...umkm.toObject(),
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching UMKM',
      error: error.message,
    });
  }
};
