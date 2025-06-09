import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, "Rating can't exceed 5"],
    required: true,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [400, "can't exeed 400 character"],
  },
});

const Rating = mongoose.model('Rating', ratingSchema);
