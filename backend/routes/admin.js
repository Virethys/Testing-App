const express = require('express');
const router = express.Router();
const {
  getPendingUMKM,
  getAllUMKMAdmin,
  approveUMKM,
  rejectUMKM,
  getStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/umkm/pending', getPendingUMKM);
router.get('/umkm', getAllUMKMAdmin);
router.put('/umkm/:id/approve', approveUMKM);
router.put('/umkm/:id/reject', rejectUMKM);
router.get('/stats', getStats);

module.exports = router;
