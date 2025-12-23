import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import message from '../utils/message.js';

const verify = (req, res, next) => {
  const myCookieValue = req.cookies.myCookie;
  if (!myCookieValue) {
    errorResponse(res, Status.UNAUTHORIZED, message[401]);
  }
  try {
    const decoded = jwt.verify(myCookieValue, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    errorResponse(res, Status.UNAUTHORIZED, 'Invalid or expired token');
  }
};

export default verify;
