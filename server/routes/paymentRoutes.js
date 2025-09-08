import express from 'express';
import Protect from '../middleware/authMiddleware.js';
import { payrazorPay ,paymentValidate} from '../controller/paymentController.js';

const route = express.Router();

route.post('/pay', payrazorPay);
route.post('/validate',paymentValidate);

export default route;
