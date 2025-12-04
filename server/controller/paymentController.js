import { successResponse, errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import Razorpay from 'razorpay';
import message from '../utils/message.js';
import crypto from 'crypto';
import Cart from '../models/cart.js';
import Order from '../models/order.js';

export const payrazorPay = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_TEST_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return errorResponse(res, Status.BAD_REQUEST, 'Cart is empty');
    }

    let totalAmount = 0;
    const cartItems = cart.items.map((item) => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price, // snapshot of price
      };
    });

    const options = {
      amount: totalAmount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      errorResponse(
        res,
        Status.INTERNAL_SERVER_ERROR,
        'Razorpay order creation failed',
      );
    }
    const newOrder = await Order.create({
      user: userId,
      cartItems,
      totalAmount,
      razorpayOrderId: order.id,
      status: 'PENDING',
    });
    console.log(newOrder);

    successResponse(res, Status.OK, message[200], {
      ...order,
      dbOrderId: newOrder._id.toString(),
    });
  } catch (error) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const paymentValidate = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body;

    console.log(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    );

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !dbOrderId
    ) {
      return errorResponse(res, Status.BAD_REQUEST, 'Missing payment details');
    }

    // Generate expected signature
    const sha = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest('hex');

    // Compare signatures
    if (digest !== razorpay_signature) {
      return errorResponse(res, Status.BAD_REQUEST, 'Invalid signature');
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      dbOrderId,
      {
        status: 'PAID',
        razorpayPaymentId: razorpay_payment_id,
        $push: {
          paymentLogs: {
            razorpayPaymentId: razorpay_payment_id,
            status: 'success',
          },
        },
      },
      { new: true },
    ).populate('cartItems.product');

    if (!updatedOrder) {
      return errorResponse(res, Status.NOT_FOUND, 'Order not found');
    }

    await Cart.findOneAndUpdate(
      { user: updatedOrder.user },
      { items: [], totalPrice: 0 },
    );

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

export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZOR_PAY_WEBHOOK_SECRET; // must match Razorpay Dashboard

    // Compute signature on RAW body
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(req.rawBody); // raw buffer
    const digest = shasum.digest('hex');

    const signature = req.headers['x-razorpay-signature'];

    if (digest !== signature) {
      console.error('⚠️ Invalid webhook signature');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = JSON.parse(req.rawBody.toString());

    const payment = event.payload?.payment?.entity;
    if (!payment) {
      console.error('⚠️ Payment entity missing in webhook');
      return res.status(400).json({ message: 'Payment entity missing' });
    }

    let status = 'PAID1';
    console.log('hello bharat', event.event);

    // if (event.event === 'payment.captured') status = 'PAID';
    // else if (event.event === 'payment.failed') status = 'FAILED';
    // else return res.json({ status: 'ignored' }); // other events

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: payment.order_id },
      {
        status,
        razorpayPaymentId: payment.id,
        razorpaySignature: signature,
      },
      { new: true },
    );

    if (order) {
      console.log(`✅ Payment ${status} via webhook:`, order.razorpayOrderId);

      // Notify user via Socket.IO
      notifyUser(order.user.toString(), 'paymentStatus', {
        orderId: order._id,
        status,
      });
    }

    return res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Webhook handling failed' });
  }
};
