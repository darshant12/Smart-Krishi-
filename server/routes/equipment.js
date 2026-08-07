const express = require('express');
const multer = require('multer');
const path = require('path');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const authenticate = require('../middleware/auth');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext).replace(/\s+/g, '_').toLowerCase();
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
});

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find().populate('owner', 'name email phone village');
    const items = equipment.map((item) => ({
      id: item._id,
      name: item.name,
      type: item.type,
      rate: item.rate,
      contact: item.contact,
      location: item.location,
      description: item.description,
      status: item.status,
      ownerId: item.owner?._id,
      ownerName: item.owner?.name,
      ownerEmail: item.owner?.email,
      ownerContact: item.owner?.phone || item.contact,
      ownerVillage: item.owner?.village,
      photoUrl: item.photoUrl || '',
    }));
    res.json(items);
  } catch (error) {
    console.error('Failed to fetch equipment:', error);
    res.status(500).json({ message: 'Unable to load equipment' });
  }
});

router.post('/', authenticate, upload.single('photo'), async (req, res) => {
  try {
    const { name, type, rate, contact, location, description } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (!name || !type || !rate || !contact || !location) {
      return res.status(400).json({ message: 'Name, type, rate, contact, and location are required' });
    }

    const owner = await User.findById(req.user.id);
    if (!owner) {
      return res.status(404).json({ message: 'Owner user not found' });
    }

    const equipment = await Equipment.create({
      name: name.trim(),
      type: type.trim(),
      rate: rate.trim(),
      contact: contact.trim(),
      location: location.trim(),
      description: description?.trim() || '',
      photoUrl,
      owner: owner._id,
    });

    res.status(201).json({
      id: equipment._id,
      name: equipment.name,
      type: equipment.type,
      rate: equipment.rate,
      contact: equipment.contact,
      location: equipment.location,
      description: equipment.description,
      photoUrl: equipment.photoUrl,
      status: equipment.status,
      ownerId: owner._id,
      ownerName: owner.name,
      ownerEmail: owner.email,
      ownerContact: owner.phone || equipment.contact,
      ownerVillage: owner.village,
    });
  } catch (error) {
    console.error('Failed to create equipment:', error);
    res.status(500).json({ message: 'Unable to add equipment' });
  }
});

module.exports = router;
