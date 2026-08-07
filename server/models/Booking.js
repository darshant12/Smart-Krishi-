const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  equipmentName: { type: String, required: true },
  rate: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String, required: true },
  ownerEmail: { type: String, default: '' },
  ownerContact: { type: String, default: '' },
  ownerLocation: { type: String, default: '' },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requesterName: { type: String, required: true },
  requesterEmail: { type: String, default: '' },
  requesterContact: { type: String, default: '' },
  bookingLocation: { type: String, default: '' },
  hours: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['Requested', 'Confirmed', 'Rejected', 'Completed'],
    default: 'Requested',
  },
  ownerMessage: { type: String, default: '' },
  requesterMessage: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
