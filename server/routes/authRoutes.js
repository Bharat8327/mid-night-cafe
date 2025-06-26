import express from 'express';
import { signup, login, authWithGoogle ,authWithgit } from '../controller/authController.js';
const routes = express.Router();

routes.post('/login', login);
routes.post('/signup', signup);
routes.post('/verify', authWithGoogle);
routes.post('/gitverify',authWithgit);

export default routes;
// this is for create new user
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User signup
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: number
 *                 example: 919349343543
 *               role:
 *                 type: string
 *                 enum: [customer, admin]
 *                 default: customer
 *     responses:
 *       201:
 *         description: Signup successful
 *       400:
 *         description: Bad request
 */

// this is for login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: ram12@gmail.com
 *               password:
 *                 type: string
 *                 example: ram12@gmail.com
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

// /**
//  * @swagger
//  * /details:
//  *   get:
//  *     summary: Returns all User details
//  *     tags:
//  *       - Auth
//  *     responses:
//  *       200:
//  *         description: The list of all user details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                     example: "493048823887489"
//  *                   name:
//  *                     type: string
//  *                     example: "John Doe"
//  *                   email:
//  *                     type: string
//  *                     example: "user@example.com"
//  *                   phone:
//  *                     type: number
//  *                     example: 9193534534
//  *                   role:
//  *                     type: string
//  *                     example: customer
//  */
