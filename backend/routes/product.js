const express = require('express');
const router = express.Router();
const {
  getProductsByUMKM,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/umkm/:umkmId', getProductsByUMKM);
router.get('/:id', getProduct);
router.post('/', protect, authorize('umkm'), createProduct);
router.put('/:id', protect, authorize('umkm', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('umkm', 'admin'), deleteProduct);

module.exports = router;
