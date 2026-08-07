const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

dotenv.config({ path: path.resolve(__dirname, '.env') });
console.log('Loaded env from', path.resolve(__dirname, '.env'));

const app = express();
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not defined in server/.env or environment variables. Using fallback secret for development only.');
}

const authRoutes = require('./routes/auth');
const equipmentRoutes = require('./routes/equipment');
const bookingRoutes = require('./routes/bookings');
const mandiRoutes = require('./routes/mandi');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartkrishi';

// Connect to MongoDB Atlas (or local fallback)
console.log(`Connecting to MongoDB: ${MONGO_URI.replace(/:([^@]+)@/, ':****@')}`);

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  })
  .then(async () => {
    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host:     ${mongoose.connection.host}`);
    // Seed a default admin user if collection is empty
    const User = require('./models/User');
    const existing = await User.findOne({ email: 'admin@example.com' });
    if (!existing) {
      const bcrypt = require('bcryptjs');
      const hashed = await bcrypt.hash('admin123', 10);
      await User.create({ name: 'Admin', email: 'admin@example.com', password: hashed, role: 'admin' });
      console.log('🔧 Seeded default admin user (admin@example.com / admin123)');
    }
  })
    console.log('✅ MongoDB Atlas connected successfully');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host:     ${mongoose.connection.host}`);
  })
  .catch((err) => {
    // Log but don't exit — API routes like /api/mandi don't need MongoDB
    console.error('❌ MongoDB connection error:', err.message);
    console.warn('⚠️  Server will continue without DB — non-DB routes still available');
  });

// Log any post-startup connection issues
mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
mongoose.connection.on('reconnected', () => console.log('🔄 MongoDB reconnected'));

app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/mandi', mandiRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'SmartKrishi Share API is running',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
