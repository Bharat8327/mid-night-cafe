import express from 'express';
import Protect from '../middleware/authMiddleware.js';
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  updateAvailability,
} from '../controller/productController.js';
import checkRole from '../middleware/checkRole.js';

const routes = express.Router();

routes.post('/products', Protect, checkRole('Admin', 'seller'), createProduct);
routes.get('/products', getAllProduct);
routes.get('/products/:id', getProductById);
routes.put(
  '/products/:id',
  Protect,
  checkRole('Admin', 'seller'),
  updateProduct,
);
routes.put(
  '/availability/:id',
  Protect,
  checkRole('Admin'),
  updateAvailability,
);
routes.delete(
  '/products/:id',
  Protect,
  checkRole('Admin', 'seller'),
  deleteProduct,
);

export default routes;
