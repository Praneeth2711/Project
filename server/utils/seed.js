require('dotenv').config();
const connectDB = require('../config/db');
const seedData = require('./seedRunner');
const mongoose = require('mongoose');

const run = async () => {
  try {
    await connectDB();
    await seedData();
    console.log('Seeding finished successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

run();
