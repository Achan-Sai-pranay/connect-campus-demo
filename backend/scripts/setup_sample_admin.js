// Optional: create a sample admin user
// Run with: node scripts/setup_sample_admin.js (with NODE options for ESM environment if needed)

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const exists = await User.findOne({ email: 'admin@example.com' });
    if (!exists) {
      const u = new User({ name: 'Admin', email: 'admin@example.com', password: 'password', role: 'admin' });
      await u.save();
      console.log('Admin created: admin@example.com / password');
    } else {
      console.log('Admin already exists');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
