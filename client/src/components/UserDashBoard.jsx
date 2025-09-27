import { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import ProductGrid from './ProductGrid.jsx';
import Chatbot from './Chatbot.jsx';
import Cart from './Cart.jsx';
import Wishlist from './Wishlist.jsx';
import UserProfile from './UserProfile.jsx';
import { getCookie } from '../utils/utils.js';
import axios from 'axios';

const UserDashboard = () => {
  const token = getCookie('token');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addToCart = async (
    productId,
    productName,
    productPrice,
    productImage,
    isVeg,
  ) => {
    let newItem;

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productId);
      if (existingItem) {
        newItem = { ...existingItem, quantity: existingItem.quantity + 1 };
        return prev.map((item) => (item.id === productId ? newItem : item));
      }
      newItem = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
        isVeg,
      };
      return [...prev, newItem];
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/u/system/crt`,
        { productId, quantity: 1 }, // <-- use function args directly
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log('Added to backend cart:', response.data);
    } catch (error) {
      console.error('Add to cart API error:', error.message);
    }
  };

  const updateCartQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(id);
    } else {
      try {
        const updateQunatityOfProduct = await axios.put(
          `${import.meta.env.VITE_API_URL}/u/product/${id}`,
          { quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {
        console.log(error.message);
      }
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    }
  };

  const addItemToCart = async () => {
    const data = cartItems.map((value) => ({
      id: value.id,
      quantity: value.quantity,
    }));
    try {
      const data1 = await axios.post(
        `${import.meta.env.VITE_API_URL}/u/system/crt`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const removeItem = await axios.delete(
        `${import.meta.env.VITE_API_URL}/u/system/ucart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const addToWishlist = async (
    productId,
    productName,
    productPrice,
    productImage,
    isVeg,
  ) => {
    const exists = wishlistItems.find((item) => item.id === productId);
    if (!exists) {
      try {
        const addToWishlist = await axios.post(
          `${import.meta.env.VITE_API_URL}/u/wish/add`,
          {
            productId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {}
      setWishlistItems((prev) => [
        ...prev,
        {
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          isVeg,
          addedDate: new Date().toISOString(),
        },
      ]);
    } else {
      removeFromWishlist(productId);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      const wishList = await axios.delete(
        `${import.meta.env.VITE_API_URL}/u/wish/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const getWishlist = async () => {
    try {
      const wishList = await axios.get(
        `${import.meta.env.VITE_API_URL}/u/wish`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  // useEffect(() => {
  //   getWishlist();
  // });

  const addWishlistItemToCart = async (id) => {
    const wishlistItem = wishlistItems.find((item) => item.id === id);
    if (wishlistItem) {
      addToCart(
        wishlistItem.id,
        wishlistItem.name,
        wishlistItem.price,
        wishlistItem.image,
        wishlistItem.isVeg,
      );
      removeFromWishlist(id);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const data = {
      amount: 1 * 100,
      currency: 'INR',
      receipt: `${import.meta.env.VITE_RECEIPT_ID}`,
    };
    console.log(data.amount);
    try {
      const response1 = await axios.post(
        'http://localhost:3000/user/products/pay',
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const options = {
        key: 'rzp_test_RERFcbJxWkDGqY', // Enter the Key ID generated from the Dashboard
        amount: 10000 * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: 'INR',
        name: 'Acme Corp',
        description: 'Test Transaction',
        image: 'https://example.com/your_logo',
        order_id: response1.data.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response) {
          const body = {
            ...response,
          };

          const validateRes = await axios.post(
            'http://localhost:3000/user/products/validate',
            { ...body, dbOrderId: response1?.data?.data?.dbOrderId },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          console.log('payment validation res ', validateRes);
        },
        prefill: {
          name: 'Patelji',
          email: 'patel@gmail.com',
          contact: '9873736545',
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        // alert(response.error.code);
        // alert(response.error.description);
        // alert(response.error.source);
        // alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
      e.preventDefault();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistItems.length}
        userName="John Doe"
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <h1
            className={`text-3xl lg:text-4xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Welcome to CafeHub
          </h1>
          <p
            className={`text-base lg:text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Discover our amazing collection of premium coffee and food items
          </p>
        </div>

        <ProductGrid
          isDarkMode={isDarkMode}
          onAddToCart={addToCart}
          onAddToWishlist={addToWishlist}
          wishlistItems={wishlistItems}
        />
      </main>

      <Cart
        isDarkMode={isDarkMode}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <Wishlist
        isDarkMode={isDarkMode}
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveItem={removeFromWishlist}
        onAddToCart={addWishlistItemToCart}
      />

      <UserProfile
        isDarkMode={isDarkMode}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName="John Doe"
        userEmail="john.doe@example.com"
      />

      <Chatbot isDarkMode={isDarkMode} />
    </div>
  );
};

export default UserDashboard;
