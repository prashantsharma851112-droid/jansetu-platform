const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Complaint = require('./models/Complaint');
const Feedback = require('./models/Feedback');
const Notification = require('./models/Notification');

const categoriesData = [
  { name: 'Road & Potholes', icon: 'HardHat', defaultDepartment: 'Roads & Infrastructure', colorCode: '#e11d48', description: 'Broken roads, deep potholes, damaged asphalt, missing curb stones.' },
  { name: 'Water Supply / Leakage', icon: 'Droplets', defaultDepartment: 'Water Works & Jal Board', colorCode: '#0284c7', description: 'Pipeline leaks, low pressure, dirty water supply, broken valves.' },
  { name: 'Drainage & Sewage', icon: 'Waves', defaultDepartment: 'Sewage Management', colorCode: '#7c3aed', description: 'Overflowing drains, blocked sewer lines, open manholes.' },
  { name: 'Streetlight / Electricity', icon: 'Zap', defaultDepartment: 'Electrical Division', colorCode: '#eab308', description: 'Non-functional streetlights, sparking wires, loose electric poles.' },
  { name: 'Garbage & Sanitation', icon: 'Trash2', defaultDepartment: 'Sanitation Department', colorCode: '#16a34a', description: 'Uncollected trash bins, open dumpyards, unhygienic streets.' },
  { name: 'Public Parks & Trees', icon: 'Trees', defaultDepartment: 'Horticulture Department', colorCode: '#059669', description: 'Fallen trees, overgrown grass, broken park benches or swings.' },
  { name: 'Illegal Construction', icon: 'Building2', defaultDepartment: 'Urban Enforcement', colorCode: '#ea580c', description: 'Encroachment on public walkways, unauthorized building work.' },
  { name: 'Stray Animals', icon: 'Dog', defaultDepartment: 'Veterinary Services', colorCode: '#d97706', description: 'Aggressive stray dogs, cattle causing traffic congestion.' },
  { name: 'Traffic Signal Issues', icon: 'TrafficCone', defaultDepartment: 'Traffic Police Liaison', colorCode: '#dc2626', description: 'Broken traffic signals, missing road signs, damaged barricades.' },
  { name: 'Public Health Hazard', icon: 'Activity', defaultDepartment: 'Health Department', colorCode: '#06b6d4', description: 'Stagnant water, mosquito breeding hazards, chemical spills.' },
  { name: 'Public School Maintenance', icon: 'School', defaultDepartment: 'Public Works Division', colorCode: '#6366f1', description: 'Damaged school walls, broken toilets or roofs in municipal schools.' },
  { name: 'Other Issue', icon: 'HelpCircle', defaultDepartment: 'General Governance', colorCode: '#64748b', description: 'Miscellaneous local issues requiring municipal attention.' },
];

const areasData = [
  'Central Connaught Ward',
  'South Lajpat Nagar',
  'North Model Town',
  'East Mayur Vihar',
  'West Janakpuri',
  'Rohini Sector 7',
  'Dwarka Sector 10',
  'Karol Bagh Zone',
  'Vasant Kunj Heights',
  'Chandni Chowk Old Ward',
];

const samplePhotos = {
  BEFORE: [
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1617886322168-72b886573c35?auto=format&fit=crop&w=600&q=80',
  ],
  PROGRESS: [
    'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
  ],
  AFTER: [
    'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=600&q=80',
  ],
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Complaint.deleteMany({});
    await Feedback.deleteMany({});
    await Notification.deleteMany({});

    console.log('🧹 Existing collections cleared.');

    // 1. Create Master Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@jansetu.gov.in').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || 'Admin@123').trim();
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({
      name: 'Municipal Admin Officer',
      email: adminEmail,
      passwordHash: hashedAdminPassword,
      role: 'ADMIN',
      phone: '+91 98765 00000',
      area: 'Headquarters',
      department: 'Central Municipal Administration',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    });

    console.log(`👑 Master Admin created: ${adminEmail}`);

    // 2. Create Categories
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`🏷️ ${createdCategories.length} Categories seeded.`);

    const isFullDemo = process.argv.includes('--full') || process.env.SEED_FULL === 'true';

    if (isFullDemo) {
      // 3. Create Workers
      const workerPasswordHash = await bcrypt.hash('Worker@123', 10);
      const workerNames = [
        { name: 'Rajesh Kumar', dept: 'Roads & Infrastructure', area: 'Central Connaught Ward' },
        { name: 'Suresh Sharma', dept: 'Water Works & Jal Board', area: 'South Lajpat Nagar' },
        { name: 'Amit Verma', dept: 'Sanitation Department', area: 'North Model Town' },
        { name: 'Vikram Singh', dept: 'Electrical Division', area: 'East Mayur Vihar' },
        { name: 'Sunil Yadav', dept: 'Sewage Management', area: 'West Janakpuri' },
      ];

      const workers = [];
      for (let i = 0; i < workerNames.length; i++) {
        const w = workerNames[i];
        const email = `worker${i + 1}@jansetu.gov.in`;
        const created = await User.create({
          name: w.name,
          email,
          passwordHash: workerPasswordHash,
          role: 'WORKER',
          phone: `+91 9810${i} ${1000 + i}`,
          department: w.dept,
          area: w.area,
          avatar: `https://i.pravatar.cc/150?u=${email}`,
        });
        workers.push(created);
      }
      console.log(`🛠️ ${workers.length} Sample Field Workers seeded.`);

      // 4. Create Citizens
      const citizenPasswordHash = await bcrypt.hash('Citizen@123', 10);
      const citizens = [];
      for (let i = 1; i <= 5; i++) {
        const email = `citizen${i}@gmail.com`;
        const c = await User.create({
          name: `Citizen User ${i}`,
          email,
          passwordHash: citizenPasswordHash,
          role: 'CITIZEN',
          phone: `+91 99900 ${5000 + i}`,
          address: `House #${10 + i}, Central Ward`,
          area: areasData[i % areasData.length],
          avatar: `https://i.pravatar.cc/150?u=${email}`,
        });
        citizens.push(c);
      }
      console.log(`👥 ${citizens.length} Sample Citizens seeded.`);
    } else {
      console.log('✨ Clean Production Mode: Zero fake users & Zero fake complaints created!');
    }

    console.log('🎉 DB Seeding completed! Ready for real platform usage.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
};

seed();
