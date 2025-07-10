import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../config/config.js';
import { errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';

const Protect = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    errorResponse(res, Status.UNAUTHORIZED, 'Authorization token are required');
  }
  const token = req.headers.authorization.split(' ')[1];
  // If token is available, proceed to verify it in the try-catch block below
  try {
    const decode = jwt.verify(token, config.jwt.secret);
    req.user = await User.findById(decode.id).select('-password');
    console.log('goes next', req.params);

    next();
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export default Protect;
