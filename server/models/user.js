import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'UserName is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    phone: {
      type: Number,
      trim: true,
    },
    role: {
      type: String,
      enum: ['customer', 'seller', 'Admin'],
      default: 'customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastlogin: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
