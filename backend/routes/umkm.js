const express = require('express');
const router = express.Router();
const {
  getAllUMKM,
  getUMKM,
  updateUMKM,
  deleteUMKM,
  getMyUMKM,
} = require('../controllers/umkmController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllUMKM);
router.get('/my/profile', protect, authorize('umkm'), getMyUMKM);
router.get('/:id', getUMKM);
router.put('/:id', protect, authorize('umkm', 'admin'), updateUMKM);
router.delete('/:id', protect, authorize('umkm', 'admin'), deleteUMKM);

module.exports = router;
