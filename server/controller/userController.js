import User from '../models/user.js';
import Order from '../models/order.js';
import { successResponse, errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import message from '../utils/message.js';
import Product from '../models/product.js';

export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    const data = {
      address: user.locationDefault,
      mobile: user.mobile,
      name: user.name,
      email: user.email,
    };
    successResponse(res, Status.OK, message[200], data);
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, mobile } = req.body;
    mobile === undefined && req.user.mobile;
    name === undefined && req.user.name;
    const updatUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, mobile },
      {
        new: true,
      },
    );

    successResponse(res, Status.OK, message[200], updatUser);
  } catch (err) {
    successResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const addNewLocationController = async (req, res) => {
  const { label, street, city, state, country, postalCode, isDefault } =
    req.body;

  try {
    if (!label || !street || !city || !state || !country || !postalCode) {
      return errorResponse(res, Status.BAD_REQUEST, message[400]);
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, Status.NOT_FOUND, message[404]);
    }
    if (isDefault) {
      user.location.forEach((addr) => (addr.isDefault = false));
    }

    user.defaultLocation = user.location.push({
      label,
      street,
      city,
      state,
      country,
      postalCode,
      isDefault: isDefault || user.location.length === 0,
    });
    const location1 = `  ${street}, ${city}, ${state} ${postalCode}, ${country}`;
    user.locationDefault = location1;
    await user.save();
    return successResponse(
      res,
      Status.OK,
      message[200],
      'new address add successfully',
    );
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllLocation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('location');

    if (!user) {
      return errorResponse(res, Status.NOT_FOUND, 'User not found');
    }

    if (!user.location || user.location.length === 0) {
      return successResponse(res, Status.OK, 'No addresses found', []);
    }

    return successResponse(
      res,
      Status.OK,
      'Addresses fetched successfully',
      user.location,
    );
  } catch (error) {
    console.error('Get All Location Error:', error.message);
    return errorResponse(res, Status.INTERNAL_ERROR, 'Something went wrong');
  }
};

export const updateDefaultAddress = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return errorResponse(res, Status.NOT_FOUND, 'User not found');

    const addressIndex = user.location.findIndex(
      (loc) => loc._id.toString() === id.toString(),
    );

    if (addressIndex === -1) {
      return errorResponse(res, Status.NOT_FOUND, 'Address not found');
    }

    user.location.forEach((loc) => {
      loc.isDefault = false;
    });
    // Set the selected one as default
    user.location[addressIndex].isDefault = true;
    const location = user.location[addressIndex];
    user.locationDefault = ` ${location.street}, ${location.city}, ${location.state} ${location.postalCode}, ${location.country}`;

    await user.save();

    return successResponse(
      res,
      Status.OK,
      'Default address updated successfully',
      user.location[addressIndex],
    );
  } catch (error) {}
};

export const updateExistingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id, label, street, city, state, country, postalCode, isDefault } =
      req.body;

    const user = await User.findById(userId);
    if (!user) return errorResponse(res, Status.NOT_FOUND, 'User not found');

    const locationIndex = user.location.findIndex(
      (loc) => loc._id.toString() === id,
    );
    if (locationIndex === -1) {
      return errorResponse(res, Status.NOT_FOUND, 'Address not found');
    }

    const currentLocation = user.location[locationIndex];

    const hasChanged =
      currentLocation.label !== label ||
      currentLocation.street !== street ||
      currentLocation.city !== city ||
      currentLocation.state !== state ||
      currentLocation.country !== country ||
      currentLocation.postalCode !== postalCode ||
      currentLocation.isDefault !== isDefault;

    if (!hasChanged) {
      return successResponse(
        res,
        Status.OK,
        'No changes detected',
        currentLocation,
      );
    }

    if (isDefault) {
      user.location.forEach((loc) => {
        if (loc.isDefault) loc.isDefault = false;
      });
    }

    user.location[locationIndex] = {
      ...currentLocation._doc, // keep _id and old fields
      label,
      street,
      city,
      state,
      country,
      postalCode,
      isDefault,
    };
    const location = `${street}, ${city}, ${state} ${postalCode}, ${country}`;
    user.locationDefault = location;
    await user.save();

    return successResponse(
      res,
      Status.OK,
      'Address updated successfully',
      user.location[locationIndex],
    );
  } catch (error) {
    console.error('Update location error:', error);
    return errorResponse(res, Status.INTERNAL_ERROR, error.message);
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
    successResponse(res, Status.OK, message[200], product);
  } catch (error) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};
