import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';

const Cart = ({
  isDarkMode,
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  activeCheckOut,
  removeToCart,
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div
        className={`w-full max-w-md h-full ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        } shadow-2xl overflow-y-auto`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 p-4 border-b ${
            isDarkMode
              ? 'border-gray-700 bg-gray-900'
              : 'border-gray-200 bg-white'
          } flex items-center justify-between`}
        >
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold">Cart ({totalItems} items)</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p
                className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Your cart is empty
              </p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}
              >
                {/* Image Fix: auto handles string OR object */}
                <img
                  src={item?.image?.url || item?.image || '/placeholder.png'}
                  alt={item?.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {item.isVeg && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        🌱 VEG
                      </span>
                    )}

                    <span className="text-orange-600 font-bold">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="p-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      disabled={removeToCart}
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Section */}
        {cartItems.length > 0 && (
          <div
            className={`sticky bottom-0 p-4 border-t ${
              isDarkMode
                ? 'border-gray-700 bg-gray-900'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-orange-600">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              disabled={activeCheckOut}
              onClick={onCheckout}
              className="w-full cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
