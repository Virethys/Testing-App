const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama produk is required'],
    trim: true,
  },
  deskripsi: {
    type: String,
    required: [true, 'Deskripsi produk is required'],
    maxlength: 500,
  },
  harga: {
    type: Number,
    required: [true, 'Harga is required'],
    min: 0,
  },
  kategori: {
    type: String,
    required: [true, 'Kategori is required'],
    enum: [
      'Makanan & Minuman',
      'Fashion & Pakaian',
      'Kerajinan Tangan',
      'Jasa',
      'Pertanian',
      'Teknologi',
      'Lainnya'
    ],
  },
  foto: {
    type: String,
    default: '/placeholder.svg',
  },
  umkmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UMKM',
    required: true,
  },
  stok: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
