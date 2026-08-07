const express = require('express');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.post('/', async (req, res) => {
  try {
    const { equipmentId, hours, requesterContact, requesterEmail, bookingLocation } = req.body;
    if (!equipmentId) {
      return res.status(400).json({ message: 'Equipment ID is required' });
    }

    if (!requesterContact || !requesterEmail || !bookingLocation || !hours) {
      return res.status(400).json({ message: 'Hours, contact number, email, and place are required' });
    }

    const equipment = await Equipment.findById(equipmentId).populate('owner', 'name phone email village');
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    if (equipment.owner._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot request booking for your own equipment' });
    }

    const booking = await Booking.create({
      equipment: equipment._id,
      equipmentName: equipment.name,
      rate: equipment.rate,
      owner: equipment.owner._id,
      ownerName: equipment.owner.name,
      ownerEmail: equipment.owner.email,
      ownerContact: equipment.owner.phone || equipment.contact,
      ownerLocation: equipment.owner.village || equipment.location,
      requester: req.user.id,
      requesterName: req.user.name || 'Requester',
      requesterEmail: (requesterEmail || req.user.email || '').toLowerCase().trim(),
      requesterContact: requesterContact?.trim() || '',
      bookingLocation: bookingLocation?.trim() || '',
      hours: Number(hours) || 1,
      ownerMessage: 'New booking request received.',
      requesterMessage: 'Your booking request has been sent to the owner.',
    });

    res.status(201).json({ booking });
  } catch (error) {
    console.error('Failed to create booking:', error);
    res.status(500).json({ message: 'Unable to request booking' });
  }
});

router.get('/requester', async (req, res) => {
  try {
    const sentRequests = await Booking.find({ requester: req.user.id }).sort({ createdAt: -1 });
    res.json(sentRequests);
  } catch (error) {
    console.error('Failed to load requester bookings:', error);
    res.status(500).json({ message: 'Unable to load your booking requests' });
  }
});

router.get('/owner', async (req, res) => {
  try {
    const incomingRequests = await Booking.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(incomingRequests);
  } catch (error) {
    console.error('Failed to load owner bookings:', error);
    res.status(500).json({ message: 'Unable to load incoming booking requests' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;
    const validStatuses = ['Confirmed', 'Rejected', 'Completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the equipment owner can update the booking status' });
    }

    booking.status = status;
    booking.updatedAt = new Date();
    booking.ownerMessage =
      status === 'Confirmed'
        ? 'You have confirmed this booking request.'
        : status === 'Rejected'
        ? 'You have rejected this booking request.'
        : booking.ownerMessage;
    booking.requesterMessage =
      status === 'Confirmed'
        ? 'Your booking request has been accepted by the owner.'
        : status === 'Rejected'
        ? 'Your booking request has been rejected by the owner.'
        : booking.requesterMessage;

    await booking.save();
    res.json({ booking });
  } catch (error) {
    console.error('Failed to update booking status:', error);
    res.status(500).json({ message: 'Unable to update booking status' });
  }
});

module.exports = router;
