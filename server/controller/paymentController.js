import User from '../models/user.js';
import config from '../config/config.js';
import { successResponse, errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import Razorpay from 'razorpay';
import message from '../utils/message.js';
import crypto from 'crypto';

export const payrazorPay = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZOR_PAY_SECRET,
  });
  const options = req.body;
  console.log('comes here');
  console.log(options);

  try {
    const order = await razorpay.orders.create(options);
    if (!order) {
      errorResponse(res, Status.INTERNAL_SERVER_ERROR, message[500]);
    }

    successResponse(res, Status.OK, message[200], order);
  } catch (error) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, message[500]);
  }
};

export const paymentValidate = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return errorResponse(res, Status.BAD_REQUEST, 'Missing payment details');
    }

    // Generate expected signature
    const sha = crypto.createHmac('sha256', process.env.RAZOR_PAY_TEST_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest('hex');

    // Compare signatures
    if (digest !== razorpay_signature) {
      return errorResponse(res, Status.BAD_REQUEST, 'Invalid signature');
    }

    // ✅ Update order in DB as paid (if needed)
    // await OrderModel.findOneAndUpdate({ orderId: razorpay_order_id }, { status: 'PAID', paymentId: razorpay_payment_id });

    return successResponse(res, Status.OK, 'Payment verified successfully', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Payment validation error:', error);
    return errorResponse(
      res,
      Status.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
    );
  }
};
