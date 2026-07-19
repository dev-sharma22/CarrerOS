import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  // If no MONGO_URI is set, run in High-Speed Memory Database Mode immediately (0ms timeout)
  if (!mongoUri) {
    console.log('CareerOS Engine: Running in High-Speed Memory Database Mode.');
    global.isMongoConnected = false;
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`CareerOS Engine: MongoDB Atlas Connected -> ${conn.connection.host}`);
    global.isMongoConnected = true;
  } catch (error) {
    console.log('CareerOS Engine: Could not connect to MONGO_URI. Fallback to Memory Database Mode.');
    global.isMongoConnected = false;
  }
};

export default connectDB;
