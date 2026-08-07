const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Complaint = require('./models/Complaint');
const Feedback = require('./models/Feedback');
const Notification = require('./models/Notification');
const User = require('./models/User');

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📡 Connected to MongoDB to clean fake sample data...');

    await Complaint.deleteMany({});
    await Feedback.deleteMany({});
    await Notification.deleteMany({});
    await User.deleteMany({ role: { $ne: 'ADMIN' } });

    console.log('✨ All fake complaints, sample users, and timelines removed!');
    console.log('👑 Admin user & Categories kept intact.');
    console.log('🚀 Your database is now 100% clean and ready for REAL complaints!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Clear failed:', error);
    process.exit(1);
  }
};

clearDatabase();
