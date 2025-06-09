import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MONGODB CONNECTED SUCCESSFULLY ');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
  }
};

export default dbConnect;
