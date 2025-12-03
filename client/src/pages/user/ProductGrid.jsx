import { useEffect, useMemo, useState, useCallback } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct } from '../../redux/userFeatures/UserProfileSlice.js';

const ProductGrid = ({
  isDarkMode,
  onAddToCart,
  onAddToWishlist,
  wishlistItems,
  activeCart,
  activeWish,
}) => {
  //  Redux State
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.profile.product);
  const loading = useSelector((state) => state.profile.isLoading);

  //  Component States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [filterVeg, setFilterVeg] = useState(false);
  const [priceRange, setPriceRange] = useState([1, 50]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  //  Debounce Search (0.4s)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Convert API data → UI data
  const products = useMemo(() => {
    if (!Array.isArray(productData)) return [];

    return productData.map((item) => ({
      id: item._id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice || null,
      rating: item.rating || 0,
      reviews: item.reviews || 0,
      image: item.image?.url || '/placeholder.jpg',
      images: [item.image, ...(item.images || [])],
      category: item.category || 'Other',
      isVeg: item.isVeg ?? true,
      description: item.description || 'No description provided.',
      ingredients: item.ingredients || [],
      nutritionInfo: item.nutritionInfo || {},
      isAvailable: item.isAvailable,
      sizes: item.sizes,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }, [productData]);

  // Auto Categories
  const categories = useMemo(() => {
    const unique = ['All', ...new Set(products.map((p) => p.category))];
    return unique;
  }, [products]);

  // Wishlist Helper
  const isInWishlist = useCallback(
    (id) => wishlistItems.some((item) => item.id === id),
    [wishlistItems],
  );

  // Filter Logic (Memoized)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filterVeg && !p.isVeg) return false;

      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;

      if (
        debouncedSearch &&
        !p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
        !p.category.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
        return false;

      if (categoryFilter !== 'All' && p.category !== categoryFilter)
        return false;

      return true;
    });
  }, [products, filterVeg, priceRange, debouncedSearch, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Auto reset page on filters/search
  useEffect(
    () => setCurrentPage(1),
    [debouncedSearch, filterVeg, priceRange, itemsPerPage, categoryFilter],
  );

  // Fetch products
  useEffect(() => {
    dispatch(getAllProduct());
  }, []);

  // Auto scroll on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleAddToWishlist = (p) => {
    onAddToWishlist(p.id, p.name, p.price, p.image, p.isVeg);
  };

  const handleAddToCart = (p) => {
    onAddToCart(p.id, p.name, p.price, p.image, p.isVeg);
  };

  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-80"></div>
  );

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any product..."
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-100 border-gray-300'
              }`}
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Veg Filter */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filterVeg}
                onChange={(e) => setFilterVeg(e.target.checked)}
                className="text-green-500"
              />
              <span className="text-green-600">Veg Only</span>
            </label>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <span className="text-sm">
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </span>
              <input
                type="range"
                min="1"
                max="50"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
              />
            </div>
          </div>

          {/* Right Filters */}
          <div className="flex items-center gap-4">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className={`px-3 py-2 rounded-lg border text-sm ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option>8</option>
              <option>12</option>
              <option>15</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center border rounded-lg overflow-hidden hidden sm:flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' && 'bg-orange-500 text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list' && 'bg-orange-500 text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LOADING SKELETONS */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className={`group rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-52 object-cover group-hover:scale-110 transition-transform"
                    loading="lazy"
                    onError={(e) => (e.target.src = '/placeholder.jpg')}
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.isVeg && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        Veg
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Icons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                      disabled={activeWish}
                      onClick={() => handleAddToWishlist(product)}
                      className={`p-2 rounded-full ${
                        isInWishlist(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/80 text-gray-600'
                      }`}
                    >
                      <Heart
                        className={`${
                          isInWishlist(product.id) && 'fill-current'
                        } w-4 h-4`}
                      />
                    </button>

                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg">{product.name}</h3>

                  <p
                    className={`text-sm line-clamp-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price + Cart */}
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="font-bold text-xl text-orange-600">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      disabled={activeCart}
                      onClick={() => handleAddToCart(product)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/*  Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-orange-500 text-white'
              }`}
            >
              <CircleArrowLeft />
            </button>

            {/* Numbers */}
            {Array.from({ length: totalPages })
              .slice(0, 5)
              .map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-500'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-orange-500 text-white'
              }`}
            >
              <CircleArrowRight />
            </button>
          </div>
        </>
      )}

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
        activeCart={activeCart}
        activeWish={activeWish}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default ProductGrid;
