import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    orderTotal: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'preparing', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unPaid', 'faild'],
      default: 'unPaid',
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'DEBIT CARD', 'CASH'],
      default: 'cash',
    },
    placedAt: {
      type: Date,
      default: Date.now(),
    },
    note: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Order', orderSchema);
