import Wishlist from '../models/wishlist.js';
import Product from '../models/product.js';
import { successResponse, errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import message from '../utils/message.js';
import wishlist from '../models/wishlist.js';

export const addaddToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return errorResponse(res, Status.BAD_REQUEST, 'Product id is Required');
    }
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, Status.NOT_FOUND, 'Product Not Found');
    }

    const wishlistItem = await Wishlist.findOneAndUpdate(
      { user: userId, product: productId },
      { user: userId, product: productId }, // upsert keeps it idempotent
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).populate('product');
    return successResponse(res, Status.OK, 'Added to wishlist', wishlistItem);
  } catch (error) {
    console.log(error.message);
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = await wishlist.find({ user: userId }).populate('product');
    return successResponse(res, Status.OK, 'Wishlist fetched', items);
  } catch (error) {
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, error.message);
  }
};
export const removeFromWishList = async (req, res) => {
  try {
    const { id } = req.params; // product id
    const userId = req.user._id;

    const deleted = await Wishlist.findOneAndDelete({
      product: id,
      user: userId,
    });

    if (!deleted) {
      return errorResponse(res, Status.NOT_FOUND, 'Wishlist item not found');
    }

    return successResponse(res, Status.OK, 'Removed from wishlist', {
      removed: true,
    });
  } catch (error) {
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, error.message);
  }
};
