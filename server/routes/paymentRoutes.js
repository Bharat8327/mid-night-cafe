import express from 'express';
import Protect from '../middleware/authMiddleware.js';
import {
  payrazorPay,
  paymentValidate,
  razorpayWebhook,
} from '../controller/paymentController.js';

const route = express.Router();

route.post('/pay', Protect, payrazorPay);

route.post('/validate', Protect, paymentValidate);

route.post(
  '/payment/webhook',
  express.raw({ type: 'application/json' }),
  razorpayWebhook,
);

export default route;
