const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');

async function testAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@jansetu.gov.in').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || 'Admin@123').trim();

    console.log('Env Admin Email:', adminEmail);
    console.log('Env Admin Password:', adminPassword);

    const user = await User.findOne({ email: adminEmail });
    if (!user) {
      console.log('❌ Admin user NOT FOUND in database!');
    } else {
      console.log('✅ Admin user found in DB:');
      console.log('   ID:', user._id);
      console.log('   Email:', user.email);
      console.log('   Role:', user.role);
      console.log('   Stored Hash:', user.passwordHash);

      const isMatch = await user.comparePassword(adminPassword);
      console.log('   Compare with Env Password:', isMatch ? '✅ MATCH!' : '❌ MISMATCH!');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error testing admin:', err);
    process.exit(1);
  }
}

testAdmin();
