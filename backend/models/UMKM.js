const mongoose = require('mongoose');

const umkmSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama UMKM is required'],
    trim: true,
  },
  nib: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  operator: {
    type: String,
    required: [true, 'Operator is required'],
    enum: [
      'Dinas Provinsi Sumatera Selatan',
      'Kabupaten/Kota Wilayah Sumatera Selatan',
      'Stakeholder (Binaan Perusahaan/Lembaga)',
      'Perseorangan (Usia 17-40 Tahun)'
    ],
  },
  dinas: {
    type: String,
    enum: [
      'Dinas Koperasi dan UKM',
      'Dinas Pertanian',
      'Dinas Perkebunan',
      'Dinas Perikanan dan Kelautan',
      'Dinas Pendidikan',
      'Dinas Perindustrian',
      'Dinas Kebudayaan dan Pariwisata',
      'Dinas Perdagangan',
      'Dinas Pemuda dan Olahraga',
      'Dinas PPA',
      'DPMPTSP Sumsel',
      'OPD Kabupaten/Kota di Wilayah Sumsel',
      'Perguruan Tinggi di Wilayah Sumsel'
    ],
  },
  deskripsi: {
    type: String,
    required: [true, 'Deskripsi is required'],
    maxlength: 1000,
  },
  alamat: {
    type: String,
    required: [true, 'Alamat is required'],
  },
  kota: {
    type: String,
    required: [true, 'Kota is required'],
  },
  kontak: {
    telepon: String,
    email: String,
    whatsapp: String,
    instagram: String,
    facebook: String,
  },
  foto: {
    type: String,
    default: '/placeholder.svg',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
umkmSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UMKM', umkmSchema);
