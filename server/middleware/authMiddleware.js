import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../config/config.js';
import { success, error } from '../utils/responseWrapper.js';

const Protect = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    return res.send(error(401, 'Authorization token are required'));
  }
  const token = req.headers.authorization.split(' ')[1];
  // If token is available, proceed to verify it in the try-catch block below
  try {
    const decode = jwt.verify(token, config.jwt.secret);
    req.user = await User.findById(decode._id).select('-password');
    next();
  } catch (err) {
    return res.json(error(401, err.message));
  }
};

export default Protect;
