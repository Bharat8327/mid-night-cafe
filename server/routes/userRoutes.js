import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateUserProfile,
  getMyOrders,
  getMyOrderById,
} from '../controller/userController.js';
const routes = express.Router();

routes.get('/profile', protect, getProfile);
routes.put('/profile', protect, updateUserProfile);
routes.get('/orders', protect, getMyOrders);
routes.get('/order/:id', protect, getMyOrderById);

export default routes;

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get product details by id
 *     tags:
 *       - ProductDetails
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The product ID
 *                 name:
 *                   type: string
 *                   description: The name of the product
 *                 description:
 *                   type: string
 *                   description: The product description
 *                 price:
 *                   type: number
 *                   format: float
 *                   description: The price of the product
 *                 category:
 *                   type: string
 *                   description: The product category
 *                 stock:
 *                   type: integer
 *                   description: Number of items in stock
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: URLs of product images
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Product creation date
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Product last update date
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
