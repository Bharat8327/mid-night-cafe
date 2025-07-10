import { useState, useEffect } from 'react';
import { Edit, Trash2, X, Upload, Plus, Star } from 'lucide-react';
import {
  fetchAllProducts,
  addNewItems,
  updateProduct,
  deleteProduct,
  toggleAvailability,
} from '../../redux/features/ProductSlice.js';
import { useDispatch, useSelector } from 'react-redux';
const MenuManagement = () => {
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  useEffect(() => {
    setItems(product);
  }, [product]);

  const [items, setItems] = useState(product);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    image: '/placeholder.svg',
    rating: 0,
  });
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getCategoryConfig = (category) => {
    switch (category) {
      case 'coffee':
        return {
          color: 'bg-gradient-to-r from-orange-500 to-red-500',
          icon: '☕',
        };
      case 'tea':
        return {
          color: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: '🍵',
        };
      case 'pastry':
        return {
          color: 'bg-gradient-to-r from-purple-500 to-pink-500',
          icon: '🥐',
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 to-slate-500',
          icon: '🍽️',
        };
    }
  };

  const productAvailability = (prod) => {
    console.log(prod);
    dispatch(
      toggleAvailability({ id: prod._id, isAvailable: !prod.isAvailable }),
    );
  };

  const deleteItem = (id) => {
    dispatch(deleteProduct(id));
  };

  const addItem = () => {
    if (newItem.name && newItem.description && newItem.price) {
      const item = {
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category: newItem.category,
        isAvailable: true,
        // image: newItem.image,
        image: 'dnsjan',
        rating: 0,
        size: 'small',
      };
      console.log(item);
      dispatch(addNewItems(item));
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: 'coffee',
        image: '/placeholder.svg',
        rating: 0,
      });
      setShowAddForm(false);
    }
  };

  const updateItem = () => {
    if (
      editingItem &&
      editingItem.name &&
      editingItem.description &&
      editingItem.price
    ) {
      console.log(editingItem);

      dispatch(updateProduct(editingItem));
      setEditingItem(null);
    }
  };

  const handleImageUpload = (e, isEditing = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result;
        if (isEditing && editingItem) {
          setEditingItem({ ...editingItem, image: imageUrl });
        } else {
          setNewItem({ ...newItem, image: imageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 px-2 pt-2 min-h-screen bg-[#020817] sm:px-9 ">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
            Menu Management
          </h2>
          <p className="text-slate-400">Manage your cafe menu items</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer"
        >
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {/* Add/Edit Item Modal */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xl font-bold">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Product Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-slate-700 rounded-lg overflow-hidden">
                    <img
                      src={editingItem ? editingItem.image : newItem.image}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="flex-1 bg-slate-700 text-slate-300 px-4 py-3 rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors cursor-pointer flex items-center space-x-2">
                    <Upload size={16} />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, !!editingItem)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    value={editingItem ? editingItem.name : newItem.name}
                    onChange={(e) => {
                      if (editingItem) {
                        setEditingItem({
                          ...editingItem,
                          name: e.target.value,
                        });
                      } else {
                        setNewItem({ ...newItem, name: e.target.value });
                      }
                    }}
                    className="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={editingItem ? editingItem.price : newItem.price}
                    onChange={(e) => {
                      if (editingItem) {
                        setEditingItem({
                          ...editingItem,
                          price: e.target.value,
                        });
                      } else {
                        setNewItem({ ...newItem, price: e.target.value });
                      }
                    }}
                    className="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter item description"
                    value={
                      editingItem
                        ? editingItem.description
                        : newItem.description
                    }
                    onChange={(e) => {
                      if (editingItem) {
                        setEditingItem({
                          ...editingItem,
                          description: e.target.value,
                        });
                      } else {
                        setNewItem({ ...newItem, description: e.target.value });
                      }
                    }}
                    rows={3}
                    className="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={
                      editingItem ? editingItem.category : newItem.category
                    }
                    onChange={(e) => {
                      if (editingItem) {
                        setEditingItem({
                          ...editingItem,
                          category: e.target.value,
                        });
                      } else {
                        setNewItem({ ...newItem, category: e.target.value });
                      }
                    }}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                  >
                    <option value="coffee">Coffee</option>
                    <option value="tea">Tea</option>
                    <option value="pastry">Pastry</option>
                  </select>
                </div>

                {editingItem && (
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="0.0"
                      value={editingItem.rating}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          rating: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={editingItem ? updateItem : addItem}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium cursor-pointer"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const categoryConfig = getCategoryConfig(item.category);

          return (
            <div
              key={item._id}
              className="bg-slate-800 rounded-xl border border-slate-700 hover:border-orange-500 transition-all duration-200 overflow-hidden group hover:shadow-lg hover:shadow-orange-500/10 transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium text-white ${categoryConfig.color}`}
                  >
                    {categoryConfig.icon} {item.category}
                  </span>
                </div>
                {item.rating > 0 && (
                  <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black bg-opacity-50 px-2 py-1 rounded-full">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    <span className="text-white text-xs font-medium">
                      {item.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-bold text-lg">{item.name}</h3>
                  <span className="text-orange-400 font-bold text-xl">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-slate-400 mb-4 text-sm line-clamp-2">
                  {item.description}
                </p>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between mb-4 ">
                  <button
                    onClick={() => productAvailability(item)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm cursor-pointer ${
                      item.isAvailable
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm cursor-pointer"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuManagement;
