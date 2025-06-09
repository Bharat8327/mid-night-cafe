import { error } from '../utils/responseWrapper.js';

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res.json(error(403, 'Access denied: insufficient permissions'));
    }
  };
};

export default checkRole;
