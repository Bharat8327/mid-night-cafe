import User from '../models/user.js';
import Order from '../models/order.js';
import { success, error } from '../utils/responseWrapper.js';
import order from '../models/order.js';

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.json(success(200, user));
  } catch (err) {
    return res.json(error(500, err.message));
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

    return res.json(success(200, updatUser));
  } catch (err) {
    return res.json(error(500, err.message));
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      'products.product',
      'name price',
    );
    return res.json(success(200, orders));
  } catch (err) {
    return res.json(error(500, err.message));
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

    return res.json(success(200, order));
  } catch (err) {
    return res.json(error(500, err.message));
  }
};
