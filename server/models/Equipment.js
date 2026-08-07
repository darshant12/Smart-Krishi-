const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  rate: { type: String, required: true },
  contact: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  status: { type: String, enum: ['Available', 'Rented'], default: 'Available' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
