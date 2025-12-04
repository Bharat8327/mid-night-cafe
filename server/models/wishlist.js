import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    // optional fields for future flexibility
    note: { type: String, maxlength: 200 },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  { timestamps: true },
);

// Prevent duplicate wishlist items for same user & product
wishlistItemSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model('WishlistItem', wishlistItemSchema);
