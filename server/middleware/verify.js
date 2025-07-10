import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import message from '../utils/message.js';

const verify = (req, res, next) => {
  console.log('comes ', req.body);

  const myCookieValue = req.cookies.myCookie;
  console.log('token ', myCookieValue);

  if (!myCookieValue) {
    return res.status(401).json({
      authenticated: false,
      message: 'No token found',
    });
    errorResponse(res, Status.UNAUTHORIZED, message[401]);
  }
  try {
    const decoded = jwt.verify(myCookieValue, process.env.JWT_SECRET);
    console.log('decoded token', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    errorResponse(res, Status.UNAUTHORIZED);
    return res.status(401).json({
      authenticated: false,
      message: 'Invalid or expired token',
    });
  }
};

export default verify;
