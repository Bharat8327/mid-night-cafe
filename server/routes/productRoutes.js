import express from 'express';
import Protect from '../middleware/authMiddleware.js';
import {
  createProduct,
  deletProduct,
  getAllProduct,
  getProductById,
  updateProduct,
} from '../controller/productController.js';
import checkRole from '../middleware/checkRole.js';

const routes = express.Router();

routes.post('/products', Protect, checkRole('admin', 'seller'), createProduct);
routes.get('/products', getAllProduct);
routes.get('/products/:id', getProductById);
routes.put(
  '/products/:id',
  Protect,
  checkRole('admin', 'seller'),
  updateProduct,
);
routes.delete(
  'products/:id',
  Protect,
  checkRole('admin', 'seller'),
  deletProduct,
);

export default routes;
