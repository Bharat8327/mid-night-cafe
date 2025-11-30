import Wishlist from '../models/wishlist.js';
import Product from '../models/product.js';
import { successResponse, errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import message from '../utils/message.js';
import wishlist from '../models/wishlist.js';

export const addaddToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return errorResponse(res, Status.NOT_FOUND, 'User ID not found');
    }

    if (!productId) {
      return errorResponse(res, Status.BAD_REQUEST, 'Product ID is required');
    }

    const product = await Product.findById(productId);

    if (!product) {
      return errorResponse(res, Status.NOT_FOUND, 'Product not found');
    }

    // Check if already exists
    const existing = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    if (existing) {
      // Remove from wishlist
      await Wishlist.findByIdAndDelete(existing._id);
      return successResponse(res, Status.OK, 'Removed from wishlist', {
        status: 'removed',
        productId,
      });
    }

    // Add new wishlist item
    const newItem = await Wishlist.create({
      user: userId,
      product: productId,
    });

    // Populate product
    const populatedItem = await Wishlist.findById(newItem._id).populate(
      'product',
    );

    return successResponse(res, Status.OK, 'Added to wishlist', {
      status: 'added',
      item: populatedItem,
    });
  } catch (error) {
    console.log('Wishlist Error:', error.message);
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return errorResponse(res, Status.NOT_FOUND, 'User ID not found');
    }

    const items = await Wishlist.find({ user: userId }).populate('product');

    return successResponse(
      res,
      Status.OK,
      'Wishlist fetched successfully',
      items,
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const removeFromWishList = async (req, res) => {
  try {
    const { id } = req.params; // product id
    const userId = req.user._id;

    const deleted = await Wishlist.findOneAndDelete({
      product: id,
      user: userId.toString(),
    });
    if (!deleted) {
      return errorResponse(res, Status.NOT_FOUND, 'Wishlist item not found');
    }
    return successResponse(res, Status.OK, 'Removed from wishlist', {
      removed: true,
      productId: id,
    });
  } catch (error) {
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, error.message);
  }
};
