import { useState } from 'react';
import Navbar from './Navbar.jsx';
import ProductGrid from './ProductGrid.jsx';
import Chatbot from './Chatbot.jsx';
import Cart from './Cart.jsx';
import Wishlist from './Wishlist.jsx';
import UserProfile from './UserProfile.jsx';

const UserDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addToCart = (
    productId,
    productName,
    productPrice,
    productImage,
    isVeg,
  ) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productId);
      if (existingItem) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1,
          isVeg,
        },
      ];
    });
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addToWishlist = (
    productId,
    productName,
    productPrice,
    productImage,
    isVeg,
  ) => {
    const exists = wishlistItems.find((item) => item.id === productId);
    if (!exists) {
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
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addWishlistItemToCart = (id) => {
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

  const handleCheckout = () => {
    alert(
      'Checkout functionality would be implemented here with payment integration',
    );
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
