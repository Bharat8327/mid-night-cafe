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
import '../../index.css';

const MenuManagement = () => {
  const product = useSelector((state) => state.product.product || []);
  const dispatch = useDispatch();

  // States
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    image: { url: '/placeholder.svg', publicId: 'placeholder' },
    images: [],
    rating: 0,
    isAvailable: true,
    isVeg: true,
    sizes: [],
    ingredients: [],
    nutritionInfo: { calories: 0, protein: 0, fat: 0, carbs: 0 },
  });

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    setItems(product);
  }, [product]);

  // Filtering by search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const removeImage = (index) => {
    if (editingItem) {
      const updatedImages = [...(editingItem.images || [])];
      updatedImages.splice(index, 1);
      setEditingItem({ ...editingItem, images: updatedImages });
    } else {
      const updatedImages = [...(newItem.images || [])];
      updatedImages.splice(index, 1);
      setNewItem({ ...newItem, images: updatedImages });
    }
  };

  // Category config
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
      case 'snacks':
        return {
          color: 'bg-gradient-to-r from-yellow-500 to-amber-500',
          icon: '🍪',
        };
      case 'beverages':
        return {
          color: 'bg-gradient-to-r from-cyan-500 to-blue-500',
          icon: '🥤',
        };
      case 'accessories':
        return {
          color: 'bg-gradient-to-r from-gray-500 to-slate-500',
          icon: '🛍️',
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 to-slate-500',
          icon: '🍽️',
        };
    }
  };

  // Toggle availability dispatch
  const productAvailability = (prod) => {
    dispatch(
      toggleAvailability({ id: prod._id, isAvailable: !prod.isAvailable }),
    );
  };

  // Delete item dispatch
  const deleteItem = (id) => {
    dispatch(deleteProduct(id));
  };

  // Add new item dispatch and reset
  const addItem = () => {
    if (newItem.name && newItem.description && newItem.price) {
      const itemToAdd = {
        ...newItem,
        price: Number(newItem.price),
        rating: 0,
      };
      dispatch(addNewItems(itemToAdd));
      resetNewItem();
      setShowAddForm(false);
    }
  };

  // Handler to update an ingredient value
  const updateIngredient = (idx, value, isEditing = false) => {
    if (isEditing && editingItem) {
      const updatedIngredients = [...(editingItem.ingredients || [])];
      updatedIngredients[idx] = value;
      setEditingItem({ ...editingItem, ingredients: updatedIngredients });
    } else {
      const updatedIngredients = [...(newItem.ingredients || [])];
      updatedIngredients[idx] = value;
      setNewItem({ ...newItem, ingredients: updatedIngredients });
    }
  };

  // Handler to add new ingredient
  const addIngredient = (isEditing = false) => {
    if (isEditing && editingItem) {
      setEditingItem({
        ...editingItem,
        ingredients: [...(editingItem.ingredients || []), ''],
      });
    } else {
      setNewItem({
        ...newItem,
        ingredients: [...(newItem.ingredients || []), ''],
      });
    }
  };

  // Handler to remove an ingredient
  const removeIngredient = (idx, isEditing = false) => {
    if (isEditing && editingItem) {
      const updatedIngredients = [...(editingItem.ingredients || [])];
      updatedIngredients.splice(idx, 1);
      setEditingItem({ ...editingItem, ingredients: updatedIngredients });
    } else {
      const updatedIngredients = [...(newItem.ingredients || [])];
      updatedIngredients.splice(idx, 1);
      setNewItem({ ...newItem, ingredients: updatedIngredients });
    }
  };

  // Reset form for new item
  const resetNewItem = () => {
    // setNewItem({
    //   name: '',
    //   description: '',
    //   price: '',
    //   category: 'coffee',
    //   image: { url: '/placeholder.svg', publicId: 'placeholder' },
    //   images: [],
    //   rating: 0,
    //   isAvailable: true,
    //   isVeg: true,
    //   sizes: [],
    //   ingredients: [],
    //   nutritionInfo: { calories: 0, protein: 0, fat: 0, carbs: 0 },
    // });
  };

  // Update edited item dispatch
  const updateItem = () => {
    if (
      editingItem &&
      editingItem.name &&
      editingItem.description &&
      editingItem.price
    ) {
      dispatch(updateProduct(editingItem));
      setEditingItem(null);
      setShowAddForm(false);
    }
  };
  const handleImageUpload = (e, isEditing = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result;
        const imageObj = { url: imageUrl, publicId: file.name };
        if (isEditing && editingItem) {
          setEditingItem({ ...editingItem, image: imageObj });
        } else {
          setNewItem({ ...newItem, image: imageObj });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle multiple additional images upload
  const handleAdditionalImagesUpload = (e, isEditing = false) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      const readers = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({ url: event.target?.result, publicId: file.name });
          };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then((imagesData) => {
        if (isEditing && editingItem) {
          setEditingItem({
            ...editingItem,
            images: [...(editingItem.images || []), ...imagesData],
          });
        } else {
          setNewItem({
            ...newItem,
            images: [...(newItem.images || []), ...imagesData],
          });
        }
      });
    }
  };

  return (
    <div className="space-y-6 px-2 pt-2 min-h-screen bg-[#020817] sm:px-9">
      {/* Header & add button */}
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
          aria-label="Add new menu item"
        >
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>
      {/* Search bar */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
          aria-label="Search menu items"
        />
      </div>
      {/* Add/Edit Modal Form */}
      {(showAddForm || editingItem) && (
        <div
          className="fixed inset-0 bg-black h-full bg-opacity-80 flex items-center justify-center z-50 "
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-hidden  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 id="modal-title" className="text-white text-3xl font-bold">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>

              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close form"
              >
                <X size={28} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Single Main Image Upload */}
              <div>
                <label
                  className="block text-slate-300 text-sm font-semibold mb-2"
                  htmlFor="mainImageInput"
                >
                  Product Image (Required)
                </label>

                <div className="flex items-center space-x-6">
                  <div className="w-28 h-28 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        editingItem
                          ? editingItem.image?.url
                          : newItem.image?.url
                      }
                      alt={
                        editingItem
                          ? editingItem.image?.publicId || 'Main product image'
                          : newItem.image?.publicId || 'Main product image'
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <label
                    htmlFor="mainImageInput"
                    className="flex-1 bg-slate-700 text-slate-300 px-6 py-5 rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors cursor-pointer flex items-center space-x-4"
                  >
                    <Upload size={20} />
                    <span>Upload Main Image</span>
                    <input
                      type="file"
                      id="mainImageInput"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, !!editingItem)}
                      className="hidden"
                      required
                      aria-required="true"
                    />
                  </label>
                </div>
              </div>
              {/* Additional Images Upload with preview */}

              <div>
                <label
                  className="block text-slate-300 text-sm font-semibold mb-2"
                  htmlFor="additionalImagesInput"
                >
                  Additional Images
                </label>

                <div className="flex space-x-4 mb-4 overflow-x-auto pb-1 scrollbar-hidden">
                  {(editingItem
                    ? editingItem.images
                    : newItem.images || []
                  ).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-24 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0 "
                      title={img.publicId || `Image ${idx + 1}`}
                    >
                      <img
                        src={img.url}
                        alt={img.publicId || `Additional image ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-[7px] -right-[6px] bg-black bg-opacity-60 rounded-full px-2  hover:bg-red-600 text-white cursor-pointer"
                        aria-label={`Remove image ${idx + 1}`}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <label
                  htmlFor="additionalImagesInput"
                  className="inline-flex items-center bg-slate-700 text-slate-300 px-6 py-5 rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors cursor-pointer space-x-4 w-max"
                >
                  <Upload size={20} />
                  <span>Upload More Images</span>
                  <input
                    type="file"
                    id="additionalImagesInput"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      handleAdditionalImagesUpload(e, !!editingItem)
                    }
                    className="hidden"
                    aria-describedby="additionalImagesHelp"
                  />
                </label>

                <p
                  id="additionalImagesHelp"
                  className="text-slate-500 text-xs mt-1"
                >
                  You can add multiple images here.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div>
                  <label
                    htmlFor="itemName"
                    className="block text-slate-300 text-sm font-semibold mb-2"
                  >
                    Item Name
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    id="itemName"
                    placeholder="Enter product name"
                    value={editingItem ? editingItem.name : newItem.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (editingItem) {
                        setEditingItem({ ...editingItem, name: val });
                      } else {
                        setNewItem({ ...newItem, name: val });
                      }
                    }}
                    className="w-full bg-slate-700 text-white placeholder-slate-400 px-6 py-5 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                    required
                    aria-required="true"
                    autoFocus
                    spellCheck={false}
                  />
                </div>
                {/* Category */}
                <div>
                  <label
                    htmlFor="categorySelect"
                    className="block text-slate-300 text-sm font-semibold mb-2"
                  >
                    Category
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="categorySelect"
                    value={
                      editingItem ? editingItem.category : newItem.category
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (editingItem) {
                        setEditingItem({ ...editingItem, category: val });
                      } else {
                        setNewItem({ ...newItem, category: val });
                      }
                    }}
                    className="w-full bg-slate-700 text-white px-6 py-5 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                    required
                    aria-required="true"
                  >
                    <option value="">Select category</option>
                    <option value="coffee">Coffee</option>
                    <option value="tea">Tea</option>
                    <option value="snacks">Snacks</option>
                    <option value="beverages">Beverages</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                {/* Price */}
                <div>
                  <label
                    htmlFor="priceInput"
                    className="block text-slate-300 text-sm font-semibold mb-2"
                  >
                    Price ($)
                  </label>

                  <input
                    type="text"
                    inputMode="decimal"
                    id="priceInput"
                    placeholder="Enter base price e.g. 12.99"
                    value={
                      editingItem
                        ? editingItem.price?.toString() || ''
                        : newItem.price?.toString() || ''
                    }
                    onChange={(e) => {
                      let val = e.target.value; // Remove leading zeros but allow decimal inputs like "0."

                      val = val.replace(/^0+(\d)/, '$1'); // Validate to only allow numbers and decimal point

                      if (/^(\d+(\.\d{0,2})?)?$/.test(val)) {
                        if (editingItem) {
                          setEditingItem({
                            ...editingItem,
                            price: val === '' ? undefined : Number(val),
                          });
                        } else {
                          setNewItem({
                            ...newItem,
                            price: val === '' ? undefined : Number(val),
                          });
                        }
                      }
                    }}
                    className="w-full bg-slate-700 text-white placeholder-slate-400 px-6 py-5 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                    aria-describedby="priceHelp"
                    spellCheck={false}
                  />

                  <p id="priceHelp" className="text-slate-500 text-xs mt-1">
                    Enter price in dollars and cents.
                  </p>
                </div>
                {/* Sizes */}
                <div className="md:col-span-2">
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Sizes (price required)
                  </label>

                  {(editingItem ? editingItem.sizes : newItem.sizes || []).map(
                    (sizeObj, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-4 mb-4"
                      >
                        <select
                          value={sizeObj.size}
                          onChange={(e) => {
                            const sizes = editingItem
                              ? [...editingItem.sizes]
                              : [...newItem.sizes];
                            sizes[idx].size = e.target.value;
                            if (editingItem) {
                              setEditingItem({ ...editingItem, sizes });
                            } else {
                              setNewItem({ ...newItem, sizes });
                            }
                          }}
                          className="bg-slate-700 text-white px-5 py-4 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer flex-1"
                          required
                        >
                          <option value="">Select size</option>
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>

                          <option value="large">Large</option>
                        </select>

                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="Price (e.g. 5.99)"
                          value={sizeObj.price?.toString() || ''}
                          onChange={(e) => {
                            let val = e.target.value;
                            val = val.replace(/^0+(\d)/, '$1');

                            if (/^(\d+(\.\d{0,2})?)?$/.test(val)) {
                              const sizes = editingItem
                                ? editingItem.sizes.map((s, i) =>
                                    i === idx
                                      ? {
                                          ...s,
                                          price:
                                            val === ''
                                              ? undefined
                                              : Number(val),
                                        }
                                      : s,
                                  )
                                : newItem.sizes.map((s, i) =>
                                    i === idx
                                      ? {
                                          ...s,
                                          price:
                                            val === ''
                                              ? undefined
                                              : Number(val),
                                        }
                                      : s,
                                  );

                              if (editingItem) {
                                setEditingItem({ ...editingItem, sizes });
                              } else {
                                setNewItem({ ...newItem, sizes });
                              }
                            }
                          }}
                          className="bg-slate-700 text-white placeholder-slate-400 px-5 py-4 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors flex-1"
                          required
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const sizes = editingItem
                              ? [...editingItem.sizes]
                              : [...newItem.sizes];
                            sizes.splice(idx, 1);
                            if (editingItem) {
                              setEditingItem({ ...editingItem, sizes });
                            } else {
                              setNewItem({ ...newItem, sizes });
                            }
                          }}
                          className="text-red-500 hover:text-red-600 cursor-pointer select-none px-3"
                          aria-label={`Remove size option ${
                            sizeObj.size || idx + 1
                          }`}
                        >
                          &times;
                        </button>
                      </div>
                    ),
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const newSize = { size: '', price: 0 };
                      if (editingItem) {
                        setEditingItem({
                          ...editingItem,
                          sizes: [...(editingItem.sizes || []), newSize],
                        });
                      } else {
                        setNewItem({
                          ...newItem,
                          sizes: [...(newItem.sizes || []), newSize],
                        });
                      }
                    }}
                    className="bg-slate-700 text-slate-300 px-6 py-4 rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors"
                  >
                    Add Size
                  </button>
                </div>
                {/* Description */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="descriptionInput"
                    className="block text-slate-300 text-sm font-semibold mb-2"
                  >
                    Description (max 500 chars)
                  </label>

                  <textarea
                    id="descriptionInput"
                    placeholder="Enter product description"
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
                    rows={5}
                    maxLength={500}
                    spellCheck={false}
                    className="w-full bg-slate-700 text-white placeholder-slate-400 px-6 py-5 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>
                {/* Checkboxes */}
                <div>
                  <label
                    className="inline-flex items-center text-sm text-slate-300 select-none"
                    htmlFor="availabilityCheckbox"
                  >
                    <input
                      type="checkbox"
                      id="availabilityCheckbox"
                      checked={
                        editingItem
                          ? editingItem.isAvailable
                          : newItem.isAvailable
                      }
                      onChange={(e) => {
                        if (editingItem) {
                          setEditingItem({
                            ...editingItem,
                            isAvailable: e.target.checked,
                          });
                        } else {
                          setNewItem({
                            ...newItem,
                            isAvailable: e.target.checked,
                          });
                        }
                      }}
                      className="form-checkbox h-5 w-5 text-orange-500 rounded"
                    />
                    <span className="ml-2">Available</span>
                  </label>
                </div>

                <div>
                  <label
                    className="inline-flex items-center text-sm text-slate-300 select-none"
                    htmlFor="vegCheckbox"
                  >
                    <input
                      type="checkbox"
                      id="vegCheckbox"
                      checked={editingItem ? editingItem.isVeg : newItem.isVeg}
                      onChange={(e) => {
                        if (editingItem) {
                          setEditingItem({
                            ...editingItem,
                            isVeg: e.target.checked,
                          });
                        } else {
                          setNewItem({ ...newItem, isVeg: e.target.checked });
                        }
                      }}
                      className="form-checkbox h-5 w-5 text-orange-500 rounded"
                    />
                    <span className="ml-2">Vegetarian</span>
                  </label>
                </div>
                {/* Ingredients */}
                <div className="md:col-span-2">
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Ingredients
                  </label>

                  {(editingItem
                    ? editingItem.ingredients
                    : newItem.ingredients || []
                  ).map((ingredient, idx) => (
                    <div key={idx} className="flex items-center space-x-4 mb-4">
                      <input
                        type="text"
                        placeholder="Enter ingredient"
                        value={ingredient}
                        onChange={(e) =>
                          updateIngredient(
                            idx,
                            e.target.value,
                            Boolean(editingItem),
                          )
                        }
                        className="bg-slate-700 text-white placeholder-slate-400 px-5 py-4 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors flex-1"
                        spellCheck={false}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeIngredient(idx, Boolean(editingItem))
                        }
                        className="text-red-500 hover:text-red-600 cursor-pointer select-none px-3 rounded"
                        aria-label={`Remove ingredient ${
                          ingredient || idx + 1
                        }`}
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addIngredient(Boolean(editingItem))}
                    className="bg-slate-700 text-slate-300 px-6 py-4 rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors"
                  >
                    Add Ingredient
                  </button>
                </div>
                {/* Nutrition Info */}
                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8">
                  {['calories', 'protein', 'fat', 'carbs'].map((key) => (
                    <div key={key}>
                      <label
                        htmlFor={`nutrition-${key}`}
                        className="block text-slate-300 text-sm font-semibold mb-2 capitalize"
                      >
                        {key}
                      </label>

                      <input
                        type="number"
                        id={`nutrition-${key}`}
                        min="0"
                        placeholder={`Enter ${key}`}
                        value={
                          editingItem
                            ? (editingItem.nutritionInfo &&
                                editingItem.nutritionInfo[key]) ||
                              0
                            : (newItem.nutritionInfo &&
                                newItem.nutritionInfo[key]) ||
                              0
                        }
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const nutritionInfo = editingItem
                            ? { ...editingItem.nutritionInfo, [key]: val }
                            : { ...newItem.nutritionInfo, [key]: val };
                          if (editingItem) {
                            setEditingItem({ ...editingItem, nutritionInfo });
                          } else {
                            setNewItem({ ...newItem, nutritionInfo });
                          }
                        }}
                        className="w-full bg-slate-700 text-white placeholder-slate-400 px-6 py-5 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  ))}
                </div>
                {/* Rating (only if editing) */}
                {editingItem && (
                  <div>
                    <label
                      htmlFor="ratingInput"
                      className="block text-slate-300 text-sm font-semibold mb-2"
                    >
                      Rating (1–5)
                    </label>

                    <input
                      type="number"
                      id="ratingInput"
                      step="0.1"
                      min="1"
                      max="5"
                      placeholder="Enter product rating"
                      value={editingItem.rating}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          rating: Math.min(
                            5,
                            Math.max(1, parseFloat(e.target.value) || 1),
                          ),
                        })
                      }
                      className="w-full bg-slate-700 text-white placeholder-slate-400 px-6 py-5 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                )}
              </div>
              {/* Action Buttons */}
              <div className="flex  md:flex-row gap-2 sm:gap-6 pt-8">
                {' '}
                {/*flex  md:flex-row gap-2*/}
                <button
                  onClick={editingItem ? updateItem : addItem}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-5 rounded-xl transition-all duration-250 font-semibold cursor-pointer"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-10 py-5 rounded-xl transition-colors font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const categoryConfig = getCategoryConfig(item.category);
          return (
            <div
              key={item._id}
              className="bg-slate-800 rounded-xl border border-slate-700 hover:border-orange-500 transition-all duration-200 overflow-hidden group hover:shadow-lg hover:shadow-orange-500/10 transform hover:-translate-y-1"
              role="group"
              aria-label={`${item.name} product card`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image?.url || '/placeholder.svg'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium text-white ${categoryConfig.color}`}
                    aria-label={`Category: ${item.category}`}
                  >
                    {categoryConfig.icon} {item.category}
                  </span>
                </div>
                {item.rating > 0 && (
                  <div
                    className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black bg-opacity-50 px-2 py-1 rounded-full"
                    aria-label={`Rating: ${item.rating} out of 5`}
                  >
                    <Star
                      size={12}
                      className="text-yellow-400 fill-current"
                      aria-hidden="true"
                    />
                    <span className="text-white text-xs font-medium">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-bold text-lg">{item.name}</h3>
                  <span
                    className="text-orange-400 font-bold text-xl"
                    aria-label={`Price $${item.price.toFixed(2)}`}
                  >
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <p
                  className="text-slate-400 mb-4 text-sm line-clamp-2"
                  aria-label={`Description: ${item.description}`}
                >
                  {item.description}
                </p>

                {/* Availability */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => productAvailability(item)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm cursor-pointer ${
                      item.isAvailable
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                    aria-pressed={item.isAvailable}
                    aria-label={
                      item.isAvailable
                        ? 'Mark as unavailable'
                        : 'Mark as available'
                    }
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm cursor-pointer"
                    aria-label={`Edit ${item.name}`}
                  >
                    <Edit size={14} aria-hidden="true" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors cursor-pointer"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 size={14} aria-hidden="true" />
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
