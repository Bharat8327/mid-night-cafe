import Product from '../models/product.js';
import { successResponse, errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import message from '../utils/message.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.API_SECRET,
});
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      sizes,
      image,
      rating,
      isAvailable,
      isVeg,
      ingredients,
      nutritionInfo,
      images,
    } = req.body;

    // Robust validation
    if (
      !name ||
      !description ||
      !category ||
      !price ||
      !sizes ||
      !Array.isArray(sizes) ||
      sizes.length === 0 ||
      !image ||
      !image.url ||
      !ingredients ||
      !Array.isArray(ingredients) ||
      !nutritionInfo ||
      typeof nutritionInfo !== 'object' ||
      !images ||
      !Array.isArray(images)
    ) {
      return errorResponse(res, Status.BAD_REQUEST, message[400]);
    }

    // Main image upload
    const cloud = await cloudinary.uploader.upload(image.url, {
      folder: 'ProductImg',
    });

    // Additional images upload
    const cloudImages = [];
    for (let img of images) {
      if (img?.url) {
        const cimg = await cloudinary.uploader.upload(img.url, {
          folder: 'ProductImg',
        });
        cloudImages.push({
          publicId: cimg.public_id,
          url: cimg.secure_url,
        });
      }
    }

    const product = await Product.create({
      createdBy: req.user._id,
      name,
      description,
      category,
      price,
      sizes,
      image: {
        publicId: cloud.public_id,
        url: cloud.secure_url,
      },
      images: cloudImages,
      rating: 1,
      isAvailable,
      isVeg,
      ingredients,
      nutritionInfo,
    });
    successResponse(res, Status.CREATED, message[200], product);
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, Status.NOT_FOUND, 'Product not found');
    }

    // Auth check
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

    // --- MAIN IMAGE ---
    if (
      updates.image &&
      typeof updates.image.url === 'string' &&
      updates.image.url.startsWith('data:image')
    ) {
      // Upload new main image to Cloudinary
      const cloud = await cloudinary.uploader.upload(updates.image.url, {
        folder: 'ProductImg',
      });
      // Optionally, delete old image from Cloudinary if changed
      if (
        product.image?.publicId &&
        product.image.publicId !== cloud.public_id
      ) {
        await cloudinary.uploader.destroy(product.image.publicId, {
          invalidate: true,
        });
      }
      updates.image = { publicId: cloud.public_id, url: cloud.secure_url };
    }

    // --- MULTIPLE IMAGES ---
    const currentImages = product.images || [];
    const incomingImages = updates.images || [];

    // 1. DELETE images removed by user
    const imagesToDelete = currentImages.filter(
      (img) =>
        !incomingImages.some((newImg) => newImg.publicId === img.publicId),
    );
    for (const img of imagesToDelete) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId, { invalidate: true });
      }
    }

    // 2. PROCESS incoming images for upload or retention
    const processedImages = [];
    for (const img of incomingImages) {
      // If image already exists on Cloudinary, keep it as is
      if (
        img.publicId &&
        currentImages.some((cur) => cur.publicId === img.publicId)
      ) {
        processedImages.push(img);
      }
      // Upload new base64 images to Cloudinary
      else if (img.url && img.url.startsWith('data:image')) {
        const cloud = await cloudinary.uploader.upload(img.url, {
          folder: 'ProductImg',
        });
        processedImages.push({
          publicId: cloud.public_id,
          url: cloud.secure_url,
        });
      }
      // If URL present but not on Cloudinary, push as is
      else if (img.url) {
        processedImages.push(img);
      }
    }
    updates.images = processedImages;

    // --- UPDATE PRODUCT IN DB ---
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return errorResponse(
        res,
        Status.INTERNAL_SERVER_ERROR,
        'Failed to update product',
      );
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

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id });

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
