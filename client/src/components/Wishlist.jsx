import { Heart, X, ShoppingCart, Calendar } from 'lucide-react';

const Wishlist = ({
  isDarkMode,
  isOpen,
  onClose,
  wishlistItems,
  onRemoveItem,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return `${diffDays} days ago`;
  };

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
            <Heart className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold">
              Wishlist ({wishlistItems.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="p-4 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p
                className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Your wishlist is empty
              </p>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg shadow-md ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      {item.isVeg && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          🌱 VEG
                        </span>
                      )}
                      <span className="text-orange-600 font-bold text-lg">
                        ${item.price}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Added {formatDate(item.addedDate)}</span>
                    </div>
                    <button
                      onClick={() => onAddToCart(item.id)}
                      className="mt-3 w-full cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
