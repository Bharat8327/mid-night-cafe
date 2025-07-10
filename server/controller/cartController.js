import Product from '../models/product.js';
import Cart from '../models/cart.js';

export const addToCartController = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    errorResponse(res, Status.BAD_REQUEST, message[400]);
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [], totalPrice: 0 });
  }

  const existingItem = cart.items.find((item) => {
    return item.productId.toString() === productId;
  });
};
