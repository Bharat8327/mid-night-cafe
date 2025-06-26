import mongoose from 'mongoose';
import config from './config.js';

const dbConnect = async () => {
  try {
    await mongoose.connect(config.db.MONOGODB_URI);
    console.log('MONGODB CONNECTED SUCCESSFULLY ');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
  }
};

export default dbConnect;
