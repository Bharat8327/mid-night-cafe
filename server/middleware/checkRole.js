import { errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (allowedRoles.includes(req.user.role)) {
      console.log('inside rolle check');

      next();
    } else {
      errorResponse(
        res,
        Status.FORBIDDEN,
        'Access denied: insufficient permissions',
      );
    }
  };
};

export default checkRole;
