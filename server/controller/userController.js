import User from '../models/user.js';
import Order from '../models/order.js';
import { successResponse, errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import message from '../utils/message.js';
import Product from '../models/product.js';

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    successResponse(res, Status.OK, message[200], user);
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    console.log(name);

    console.log(req.user._id);

    const updatUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, isActive },
      {
        new: true,
      },
    );
    console.log(updatUser);

    successResponse(res, Status.OK, message[200], updatUser);
  } catch (err) {
    successResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      'products.product',
      'name price',
    );
    successResponse(res, Status.OK, message[200], orders);
  } catch (err) {
    errorResponse(res, Status.OK, err.message);
  }
};

export const getMyOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params._id,
      user: req.user._id,
    }).populate('products.product', 'name price');

    if (!order) {
      return res.json(error(404, 'product not found'));
    }

    successResponse(res, Status.OK, message[200], order);
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find();
    console.log(req.user);
    successResponse(res, Status.OK, message[200], product);
  } catch (error) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const addToCartController = async (req, res) => {
  console.log(req.user);
  const  data  = req.body;
  console.log(data);
};
