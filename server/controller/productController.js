import Product from '../models/product.js';
import { error, success } from '../utils/responseWrapper.js';

export const createProduct = async (req, res) => {
  try {
    const { name, descriptions, category, price, sizes, image } = req.body;
    if (!name || !descriptions || !category || !price || !sizes || !image) {
      return res.json(error(400, 'All fields are required'));
    }

    // const cloud = await cloudinary.uploader.upload(image, {
    //   folder: 'productImg',
    // });

    const newProduct = await Product.create({
      createdBy: req.user._id,
      name,
      descriptions,
      category,
      price,
      sizes,
      image,
    });

    return res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    return res.json(error(500, 'Server error'));
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const products = Product.find({ isAvailable: true })
      .populate('createdBy', 'name phone')
      .populate('rating');
    return res.json(success(200, products));
  } catch (err) {
    return res.json(error(500, 'Server error'));
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id })
      .populate('createdBy', 'name phone')
      .populate('rating');

    if (!product) {
      return res.json(error(404, 'Product not found'));
    }
    return res.json(success(200, product));
  } catch (err) {
    return res.json(error(500, 'server error'));
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json(error(404, 'Product not found'));
    }

    // Authorization check
    if (
      product.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json(error(403, 'Not authorized to update this product'));
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, //If the update data does not meet the model’s validation rules, it throws an error.
    });
    if (!updatedProduct) {
      return res.status(404).json(error(404, 'Failed to update product'));
    }
    return res.json(success(200, updateProduct));
  } catch (err) {
    return res.json(error(500, 'server error'));
  }
};

export const deletProduct = async (req, res) => {
  try {
    const product = Product.findById(req.params.id);
    if (!product) {
      return res.json(error(404, 'Product not found'));
    }
    if (
      product.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.json(error(403, 'Not authorized to delete this product'));
    }
    await product.remove();
    return res.json(success(200, 'Product deleted successfully'));
  } catch (err) {
    return res.json(error(500, 'server error'));
  }
};
