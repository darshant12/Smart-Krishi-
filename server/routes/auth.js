const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'smartkrishi_dev_secret';
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set in environment. Using a development fallback secret.');
}

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email: rawEmail, password, phone = '', village = '' } = req.body;
    const email = rawEmail?.toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone, village });
    res.status(201).json({ message: 'User registered', user: { id: user._id, name: user.name, email: user.email, phone: user.phone, village: user.village, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail?.toLowerCase().trim();
    console.log('Login attempt for email:', email);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone || '', village: user.village || '' } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;
