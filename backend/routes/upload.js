const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const UMKM = require('../models/UMKM');
const Product = require('../models/Product');

// @desc    Upload UMKM profile picture or banner
// @route   POST /api/upload/umkm/:id/:type
// @access  Private (UMKM owner or admin)
router.post('/umkm/:id/:type', protect, authorize('umkm', 'admin'), upload.single('file'), async (req, res) => {
  try {
    const { id, type } = req.params;

    if (!['foto', 'banner'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid upload type. Use "foto" or "banner"',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const umkm = await UMKM.findById(id);

    if (!umkm) {
      return res.status(404).json({
        success: false,
        message: 'UMKM not found',
      });
    }

    // Check authorization
    if (umkm.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to upload files for this UMKM',
      });
    }

    // Construct file URL with full domain
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    // Update UMKM with new file URL
    umkm[type] = fileUrl;
    await umkm.save();

    res.status(200).json({
      success: true,
      data: {
        url: fileUrl,
        umkm: umkm,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message,
    });
  }
});

// @desc    Upload product photo
// @route   POST /api/upload/product/:id
// @access  Private (UMKM owner or admin)
router.post('/product/:id', protect, authorize('umkm', 'admin'), upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const product = await Product.findById(id).populate('umkmId');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check authorization
    if (product.umkmId.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to upload files for this product',
      });
    }

    // Construct file URL with full domain
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    // Update product with new file URL
    product.foto = fileUrl;
    await product.save();

    res.status(200).json({
      success: true,
      data: {
        url: fileUrl,
        product: product,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message,
    });
  }
});

module.exports = router;
