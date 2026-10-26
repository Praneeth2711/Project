const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostelhub';
  
  try {
    console.log(`Attempting to connect to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(` MongoDB Connected Successfully: ${mongoose.connection.host}`);
    return;
  } catch (err) {
    console.warn(`⚠️ Could not connect to local/configured MongoDB (${err.message}).`);
    console.log('🔄 Initializing embedded in-memory MongoDB server for seamless zero-setup demo...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      
      await mongoose.connect(memoryUri);
      console.log(` Connected to Embedded In-Memory MongoDB: ${memoryUri}`);
      
      // Auto-seed if database is empty
      const User = require('../models/User');
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('🌱 Populating database with demo records...');
        const seedData = require('../utils/seedRunner');
        await seedData();
      }
    } catch (memErr) {
      console.error('❌ Failed to start embedded in-memory MongoDB:', memErr.message);
      console.error('Please ensure MongoDB is running or provide a valid MONGO_URI in .env');
      throw memErr;
    }
  }
};

module.exports = connectDB;
