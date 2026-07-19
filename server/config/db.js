import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  // On Cloud (Render/Railway/Vercel) without MONGO_URI, use Memory Database instantly
  if (!mongoUri && (process.env.RENDER || process.env.NODE_ENV === 'production')) {
    console.log('No MONGO_URI configured in Cloud Environment. Running in Memory Database Mode.');
    global.isMongoConnected = false;
    return;
  }

  const targetUri = mongoUri || 'mongodb://127.0.0.1:27017/talentsphere_db';

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 2000 // Fast 2-second timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.isMongoConnected = true;
  } catch (error) {
    console.warn(`MongoDB Notice: Could not connect to (${targetUri}).`);
    console.log('Running CareerOS in Memory-Database Mode.');
    global.isMongoConnected = false;
  }
};

export default connectDB;
