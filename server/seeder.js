const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();

    const adminUser = {
      email: 'admin@test.com',
      password: 'Admin@123',
      role: 'admin',
    };

    await User.create(adminUser);

    console.log('Admin user seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
