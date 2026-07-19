import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/talentsphere_db', {
      serverSelectionTimeoutMS: 3000 // 3-second timeout to avoid long hangs
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.isMongoConnected = true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('----------------------------------------------------------------------');
    console.warn(' WARNING: Local MongoDB is NOT running.                                ');
    console.warn(' TalentSphere will run in MEMORY-FALLBACK mode for testing/demo purposes.   ');
    console.warn(' All data changes will persist in memory.                             ');
    console.warn('----------------------------------------------------------------------');
    global.isMongoConnected = false;
  }
};

export default connectDB;
