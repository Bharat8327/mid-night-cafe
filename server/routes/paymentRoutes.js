import express from 'express';
import Protect from '../middleware/authMiddleware.js';
import {
  payrazorPay,
  paymentValidate,
  razorpayWebhook,
} from '../controller/paymentController.js';

const route = express.Router();

// Authenticated user can create payment
route.post('/pay', Protect, payrazorPay);

// Authenticated user can validate payment (manual validation)
route.post('/validate', Protect, paymentValidate);

// Razorpay Webhook (public, raw body, signature validated inside controller)
route.post(
  '/payment/webhook',
  express.raw({ type: 'application/json' }),
  razorpayWebhook,
);

export default route;
