import Product from '../models/product.js';
import { successResponse, errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import message from '../utils/message.js';

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, size, image, rating } =
      req.body;
    if (!name || !description || !category || !price || !size || !image) {
      return errorResponse(res, Status.BAD_REQUEST, message[400]);
    }

    // const cloud = await cloudinary.uploader.upload(image, {
    //   folder: 'productImg',
    // });

    const product = await Product.create({
      createdBy: req.user._id,
      name,
      description,
      category,
      price,
      sizes: {
        size,
        price,
      },
      image,
      rating,
    });
    successResponse(res, Status.CREATED, message[200], product);
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'name phone');
    console.log(products);

    successResponse(res, Status.OK, message[200], products);
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id })
      .populate('createdBy', 'name phone')
      .populate('rating');

    if (!product) {
      errorResponse(res, Status.NOT_FOUND, 'Product Not Found');
    }
    successResponse(res, Status.OK, message[200], product);
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const isAvailable = req.body;
    console.log(isAvailable);

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, Status.NOT_FOUND, 'Product not found');
    }

    // Authorization check: allow Admin or the creator to update
    if (
      product.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return errorResponse(
        res,
        Status.FORBIDDEN,
        'Not authorized to update this product',
      );
    }

    // Perform update
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return errorResponse(res, Status.NOT_FOUND, 'Failed to update product');
    }

    return successResponse(
      res,
      Status.OK,
      'Product updated successfully',
      updatedProduct,
    );
  } catch (err) {
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    if (req.user.role !== 'Admin' && !product.createdBy.equals(req.user._id)) {
      return errorResponse(res, 403, 'Not authorized to delete this product');
    }

    await product.deleteOne();

    return successResponse(
      res,
      200,
      'Product deleted successfully',
      'Prodcut delted successfully',
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const { id } = req.params;

    if (!id || typeof isAvailable !== 'boolean') {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true },
    );

    if (!updatedProduct) {
      return errorResponse(res, Status.NOT_FOUND, 'Product not found');
    }

    return successResponse(
      res,
      Status.OK,
      'Product availability updated successfully',
      updatedProduct,
    );
  } catch (error) {
    console.error('Error updating availability:', error);
    return errorResponse(res, 500, error.message);
  }
};
