import { useState } from 'react';
import {
  Heart,
  ShoppingCart,
  Star,
  Search,
  Grid,
  List,
  Eye,
  CircleArrowLeft,
  CircleArrowRight,
} from 'lucide-react';
import ProductDetailsModal from './ProductDetailsModel.jsx';

const ProductGrid = ({
  isDarkMode,
  onAddToCart,
  onAddToWishlist,
  wishlistItems,
}) => {
  const [products] = useState([
    {
      id: 1,
      name: 'Premium Espresso',
      price: 4.99,
      originalPrice: 6.99,
      rating: 4.8,
      reviews: 124,
      image: '/lovable-uploads/aac122fa-a5f7-4c6b-83fb-ae354309542d.png',
      images: ['/lovable-uploads/aac122fa-a5f7-4c6b-83fb-ae354309542d.png'],
      category: 'Coffee',
      isVeg: true,
      description:
        'Rich and bold espresso made from premium arabica beans sourced from the highlands of Colombia.',
      ingredients: ['Arabica Coffee Beans', 'Water'],
      nutritionInfo: {
        calories: 5,
        protein: '0.3g',
        carbs: '0g',
        fat: '0g',
      },
    },
    {
      id: 2,
      name: 'Cappuccino Deluxe',
      price: 5.99,
      rating: 4.7,
      reviews: 89,
      image: '/lovable-uploads/aac122fa-a5f7-4c6b-83fb-ae354309542d.png',
      images: ['/lovable-uploads/aac122fa-a5f7-4c6b-83fb-ae354309542d.png'],
      category: 'Coffee',
      isVeg: true,
      description: 'Creamy cappuccino with perfect foam art.',
      ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'],
      nutritionInfo: {
        calories: 60,
        protein: '3g',
        carbs: '5g',
        fat: '3g',
      },
    },
    {
      id: 3,
      name: 'Chocolate Croissant',
      price: 3.49,
      rating: 4.6,
      reviews: 67,
      image: '/lovable-uploads/aac122fa-a5f7-4c6b-83fb-ae354309542d.png',
      images: ['/lovable-uploads/aac122fa-a5f7-4c6b-83fb-ae354309542d.png'],
      category: 'Pastry',
      isVeg: true,
      description: 'Buttery croissant filled with rich chocolate.',
      ingredients: ['Flour', 'Butter', 'Chocolate', 'Sugar', 'Eggs'],
      nutritionInfo: {
        calories: 280,
        protein: '4g',
        carbs: '30g',
        fat: '16g',
      },
    },
    {
      id: 4,
      name: 'Blueberry Muffin',
      price: 2.99,
      rating: 4.5,
      reviews: 45,
      image: '/lovable-uploads/aac122fa-a5f7-4c6b-83fb-ae354309542d.png',
      images: ['/lovable-uploads/aac122fa-a5f7-4c6b-83fb-ae354309542d.png'],
      category: 'Pastry',
      isVeg: true,
      description: 'Fresh blueberry muffin with a tender crumb.',
      ingredients: ['Flour', 'Blueberries', 'Sugar', 'Butter', 'Eggs'],
      nutritionInfo: {
        calories: 220,
        protein: '3g',
        carbs: '28g',
        fat: '12g',
      },
    },
    {
      id: 5,
      name: 'Latte Supreme',
      price: 5.49,
      rating: 4.9,
      reviews: 78,
      image: '/lovable-uploads/aac122fa-a5f7-4c6b-83fb-ae354309542d.png',
      images: ['/lovable-uploads/aac122fa-a5f7-4c6b-83fb-ae354309542d.png'],
      category: 'Coffee',
      isVeg: true,
      description: 'Smooth latte with house-made vanilla syrup.',
      ingredients: ['Espresso', 'Steamed Milk', 'Vanilla Syrup'],
      nutritionInfo: {
        calories: 80,
        protein: '3g',
        carbs: '8g',
        fat: '3g',
      },
    },
    {
      id: 6,
      name: 'Avocado Toast',
      price: 8.99,
      rating: 4.4,
      reviews: 92,
      image: '/lovable-uploads/aac122fa-a5f7-4c6b-83fb-ae354309542d.png',
      images: ['/lovable-uploads/aac122fa-a5f7-4c6b-83fb-ae354309542d.png'],
      category: 'Food',
      isVeg: true,
      description: 'Fresh avocado on artisan sourdough with lime.',
      ingredients: ['Avocado', 'Sourdough Bread', 'Lime', 'Sea Salt'],
      nutritionInfo: {
        calories: 320,
        protein: '8g',
        carbs: '25g',
        fat: '20g',
      },
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterVeg, setFilterVeg] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item.id === productId);

  const handleAddToWishlist = (product) => {
    onAddToWishlist(
      product.id,
      product.name,
      product.price,
      product.image,
      product.isVeg,
    );
  };

  const handleAddToCart = (product) => {
    onAddToCart(
      product.id,
      product.name,
      product.price,
      product.image,
      product.isVeg,
    );
  };

  const filteredProducts = products.filter((product) => {
    if (filterVeg && !product.isVeg) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1])
      return false;
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'
              } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filterVeg}
                onChange={(e) => setFilterVeg(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-green-600">🌱 Veg Only</span>
            </label>

            <div className="flex items-center space-x-2">
              <span className="text-sm">
                Price: ${priceRange[0]} - ${priceRange[1]}
              </span>
              <input
                type="range"
                min="0"
                max="20"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              className={`px-3 py-2 rounded-lg border text-sm cursor-pointer ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option>Selct pages </option>
              <option value={15}>10 </option>
              <option value={20}>15 </option>
              <option value={20}>20 </option>
            </select>

            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl cursor-pointer ${
                  viewMode === 'grid' ? 'bg-orange-500 text-white' : ''
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl cursor-pointer ${
                  viewMode === 'list' ? 'bg-orange-500 text-white' : ''
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={`grid gap-4 sm:gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}
      >
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className={`group rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                {product.isVeg && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    🌱 VEG
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    SALE
                  </span>
                )}
              </div>
              <div className="absolute top-3 right-3 flex flex-col space-y-2">
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isInWishlist(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 cursor-pointer ${
                      isInWishlist(product.id) ? 'fill-current' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-200"
                >
                  <Eye name="view-details" className="w-4 h-4 cursor-pointer" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <p
                className={`text-sm mb-3 line-clamp-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {product.description}
              </p>

              <div className="flex items-center mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : ''
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-orange-600">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline ">Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-8">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            currentPage === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          <CircleArrowLeft />
        </button>

        <div className="flex space-x-1">
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-orange-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          <CircleArrowRight />
        </button>
      </div>
      {/* Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        isInWishlist={
          selectedProduct ? isInWishlist(selectedProduct.id) : false
        }
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default ProductGrid;
