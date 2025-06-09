import mongoose, { mongo } from 'mongoose';

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
      type: String,
      url: String,
      default: null,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating',
      },
    ],
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', productSchema);
export default Product;
