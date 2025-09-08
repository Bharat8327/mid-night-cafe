import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['coffee', 'tea', 'snacks', 'beverages', 'accessories'],
    },
    price: {
      type: Number,
    },
    sizes: [
      {
        size: {
          type: String,
          enum: ['small', 'medium', 'large'],
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    image: {
      publicId: { type: String, required: true },
      url: { type: String, required: true },
    },

    images: [
      {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, trim: true },
      },
    ],

    ingredients: {
      type: [String],
      default: [],
    },

    nutritionInfo: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', productSchema);
export default Product;
