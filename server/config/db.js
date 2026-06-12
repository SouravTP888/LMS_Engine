const mongoose = require('mongoose');

global.useJsonDb = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms_automation';
  try {
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('MongoDB connected successfully.');
    global.useJsonDb = false;
  } catch (err) {
    console.warn('\n==================================================');
    console.warn('WARNING: Failed to connect to MongoDB!');
    console.warn(`Reason: ${err.message}`);
    console.warn('FALLING BACK TO LOCAL FILE-BASED DATABASE (server/data/db.json)');
    console.warn('This is expected if you do not have MongoDB running locally.');
    console.warn('==================================================\n');
    global.useJsonDb = true;
  }
};

module.exports = connectDB;
