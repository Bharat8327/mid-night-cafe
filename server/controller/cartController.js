import Product from '../models/product.js';
import Cart from '../models/cart.js';
import { errorResponse, successResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import message from '../utils/message.js';
import mongoose from 'mongoose';
import User from '../models/user.js';

export const addToCartController = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    console.log(productId, quantity, userId);

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, Status.NOT_FOUND, 'Product not found');
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.totalPrice = 0;
    for (let item of cart.items) {
      const prod = await Product.findById(item.product);
      cart.totalPrice += prod.price * item.quantity;
    }
    await cart.save();

    return successResponse(res, Status.OK, 'Item added to cart', cart);
  } catch (error) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const removeFromCartController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id || !userId) {
      return errorResponse(res, Status.BAD_REQUEST, message[400]);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, Status.BAD_REQUEST, 'Invalid product ID');
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return errorResponse(res, Status.NOT_FOUND, 'Cart not found');

    cart.items = cart.items.filter((item) => item.product.toString() !== id);

    // recalc total
    cart.totalPrice = 0;
    for (let item of cart.items) {
      const prod = await Product.findById(item.product);
      cart.totalPrice += prod.price * item.quantity;
    }
    await cart.save();
    return successResponse(
      res,
      Status.OK,
      'Item removed from cart',
      'Item Remove From Cart',
    );
  } catch (error) {
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateQunantityContoller = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity < 1) {
      return errorResponse(
        res,
        Status.BAD_REQUEST,
        'Quantity must be at least 1',
      );
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return errorResponse(res, Status.NOT_FOUND, 'Cart Not Found');

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === id.toString(),
    );

    if (itemIndex === -1) {
      return errorResponse(res, Status.NOT_FOUND, 'Product not found in cart');
    }
    cart.items[itemIndex].quantity = quantity;

    const product = await Product.findById({ _id: id });

    if (!product) {
      return errorResponse(res, Status.NOT_FOUND, 'Product Not Found');
    }

    const price = product.price;
    if (price <= 0) {
      price = 1;
    }
    cart.totalPrice = quantity * price;
    cart.save();
    return successResponse(res, Status.OK, message[200]);
  } catch (error) {
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getCartItems = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate(
      'items.product',
      'name price image images category', // pick fields you need
    );

    if (!cart) {
      return errorResponse(res, Status.NOT_FOUND, 'Cart not found');
    }

    // Extract only required fields
    const formattedItems = cart.items.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image?.url || null,
      quantity: item.quantity,
      totalItemPrice: item.product.price * item.quantity,
    }));

    // Final response
    return successResponse(res, Status.OK, 'Cart fetched successfully', {
      items: formattedItems,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, error.message);
  }
};
