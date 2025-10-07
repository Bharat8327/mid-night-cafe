import { useEffect, useState } from 'react';
import {
  User,
  MapPin,
  Package,
  CreditCard,
  Settings,
  X,
  Edit2,
  Download,
  ShoppingCart,
  LogOut,
  Plus,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { getCookie, removeCookie, setCookie } from '../utils/utils.js';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Profile from './userProfile/Profile.jsx';

const UserProfile = ({
  isDarkMode,
  isOpen,
  onClose,
  name,
  email,
  mobile,
  address,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);

  const [addresses, setAddresses] = useState([]);

  const [profileData, setProfileData] = useState({
    name,
    email,
    mobile,
    address,
  });

  const [editingAddress, setEditingAddress] = useState(null);

  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    isDefault: false,
  });

  const orderHistory = [
    {
      id: 1,
      date: '2024-01-15',
      total: 24.99,
      status: 'Delivered',
      items: ['Premium Espresso', 'Chocolate Croissant'],
      orderDetails: {
        items: [
          { name: 'Premium Espresso', price: 4.99, quantity: 2 },
          { name: 'Chocolate Croissant', price: 3.49, quantity: 1 },
        ],
        subtotal: 13.47,
        tax: 1.52,
        total: 24.99,
        deliveryAddress: '123 Main St, New York, NY 10001',
      },
    },
    {
      id: 2,
      date: '2024-01-10',
      total: 18.5,
      status: 'Delivered',
      items: ['Cappuccino Deluxe', 'Blueberry Muffin'],
      orderDetails: {
        items: [
          { name: 'Cappuccino Deluxe', price: 5.99, quantity: 1 },
          { name: 'Blueberry Muffin', price: 2.99, quantity: 2 },
        ],
        subtotal: 11.97,
        tax: 1.53,
        total: 18.5,
        deliveryAddress: '123 Main St, New York, NY 10001',
      },
    },
  ];

  const [formErrors, setFormErrors] = useState({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const validateAddressForm = () => {
    const errors = {};

    if (!addressForm.label.trim()) errors.label = 'Label is required';
    if (!addressForm.street.trim())
      errors.street = 'Street address is required';
    if (!addressForm.city.trim()) errors.city = 'City is required';
    if (!addressForm.state.trim()) errors.state = 'State is required';
    if (!addressForm.country.trim()) errors.country = 'Country is required';
    if (!addressForm.postalCode.trim())
      errors.postalCode = 'Postal code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddAddressModal = () => {
    setEditingAddress(null);
    setAddressForm({
      label: 'Home',
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      isDefault: addresses.length === 0,
    });
    setFormErrors({});
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (address) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    setFormErrors({});
    setIsAddressModalOpen(true);
  };

  const handleTabClick = async (tab) => {
    setActiveTab(tab);
    try {
      const location = await axios.get(
        `${import.meta.env.VITE_API_URL}/u/loc`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`,
          },
        },
      );
      setAddresses(location.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) return;

    if (editingAddress) {
      const updatedAddresses = addresses.map((addr) => {
        if (addr._id === editingAddress._id) {
          return { ...addr, ...addressForm };
        }
        if (addressForm.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });
      setAddresses(updatedAddresses);
      const updatedAdd = {
        id: editingAddress._id,
        ...addressForm,
      };
      try {
        const updateExistingAddress = await axios.put(
          `${import.meta.env.VITE_API_URL}/u/address`,
          updatedAdd,
          {
            headers: {
              Authorization: `Bearer ${getCookie('token')}`,
            },
          },
        );
        console.log('updated existing user ', updateExistingAddress);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      const newAddress = {
        id: Math.max(...addresses.map((a) => a.id || 0), 0) + 1,
        ...addressForm,
      };

      if (addressForm.isDefault) {
        setAddresses([
          ...addresses.map((a) => ({ ...a, isDefault: false })),
          newAddress,
        ]);
      } else {
        setAddresses([...addresses, newAddress]);
      }
      try {
        const responseAdd = await axios.post(
          `${import.meta.env.VITE_API_URL}/u/loc/add`,
          newAddress,
          {
            headers: {
              Authorization: `Bearer ${getCookie('token')}`,
            },
          },
        );
      } catch (error) {
        console.log(error.message);
      }
    }
    setIsAddressModalOpen(false);
  };

  const setDefaultAddress = async (id) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr._id === id,
    }));
    setAddresses(updatedAddresses);
    try {
      const updateDefaultAddress = await axios.put(
        `${import.meta.env.VITE_API_URL}/u/default`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`,
          },
        },
      );
    } catch (error) {
      console.log('error occurs ', error.message);
    }
  };

  const handleLogout = () => {
    removeCookie('authenticated');
    removeCookie('id');
    removeCookie('name');
    removeCookie('role');
    removeCookie('email');
    removeCookie('address');
    removeCookie('mobile');

    onClose();
    navigate('/login');
  };

  const updateUserDetails = async () => {
    const data = {};
    if (String(profileData.name).trim() !== String(getCookie('name')).trim()) {
      data.name = profileData.name;
    }
    if (
      String(profileData.mobile).trim() !== String(getCookie('mobile')).trim()
    ) {
      data.mobile = profileData.mobile;
    }
    if (Object.keys(data).length === 0) return;

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/u/profile`,
        data,
        {
          headers: { Authorization: `Bearer ${getCookie('token')}` },
        },
      );
      if (res.status === 200) {
        if (data.name) setCookie('name', data.name);
        if (data.mobile) setCookie('mobile', data.mobile);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div
        className={`w-full max-w-6xl max-h-[90vh] ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        } rounded-2xl shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-6 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          } flex items-center justify-between`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">My Profile</h2>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Manage your account and preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
          >
            <X className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div
            className={`w-full lg:w-64 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            } p-4 space-y-2 lg:border-r ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="flex lg:flex-col space-x-2 lg:space-x-0 md:justify-evenly lg:space-y-2 overflow-x-auto lg:overflow-x-visible">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-shrink-0 lg:w-full w-40 text-left p-3 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-orange-500 text-white'
                    : isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="whitespace-nowrap">Profile Info</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-shrink-0 lg:w-full w-40 text-left p-3 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-orange-500 text-white'
                    : isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="whitespace-nowrap">Order History</span>
              </button>
              <button
                onClick={() => handleTabClick('addresses')}
                className={`flex-shrink-0 lg:w-full w-30 text-left p-3 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-orange-500 text-white'
                    : isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span className="whitespace-nowrap">Addresses</span>
              </button>
              <button
                onClick={() => setActiveTab('logout')}
                className={` cursor-pointer flex-shrink-0 lg:w-full w-30 text-left p-3 rounded-lg transition-colors flex items-center space-x-2 ${
                  activeTab === 'logout'
                    ? 'bg-red-500 text-white'
                    : isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span className="whitespace-nowrap">Logout</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-xl font-bold">Profile Information</h3>
                  <button
                    onClick={() => {
                      if (editMode) {
                        updateUserDetails();
                      }
                      setEditMode(!editMode);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>{editMode ? 'Save' : 'Edit'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      disabled={!editMode}
                      className={`w-full p-3 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      } ${!editMode ? 'opacity-60' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      disabled={!editMode}
                      className={`w-full p-3 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      } ${!editMode ? 'opacity-60' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <input
                      maxLength={10}
                      type="tel"
                      value={profileData.mobile}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          mobile: e.target.value,
                        })
                      }
                      disabled={!editMode}
                      className={`w-full p-3 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      } ${!editMode ? 'opacity-60' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      disabled={!editMode}
                      readOnly
                      className={`w-full p-3 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      } ${!editMode ? 'opacity-60' : ''}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Order History</h3>
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                            <div>
                              <p className="font-semibold">Order #{order.id}</p>
                              <p className="text-sm text-gray-500">
                                {order.date}
                              </p>
                            </div>
                            <div className="text-left sm:text-right mt-2 sm:mt-0">
                              <p className="font-bold text-orange-600">
                                ${order.total}
                              </p>
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  order.status === 'Delivered'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            Items: {order.items.join(', ')}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() =>
                              generateCafeInvoice(
                                {
                                  id: 'INV1003',
                                  date: '2025-09-04',
                                  items: [
                                    {
                                      name: 'Cappuccino',
                                      category: 'Beverage',
                                      quantity: 2,
                                      price: 120,
                                      tax: 20,
                                      amount: 280, // price * quantity + tax
                                    },
                                    {
                                      name: 'Veg Sandwich',
                                      category: 'Food',
                                      quantity: 1,
                                      price: 80,
                                      tax: 10,
                                      amount: 90,
                                    },
                                    {
                                      name: 'Chocolate Cake',
                                      category: 'Dessert',
                                      quantity: 1,
                                      price: 150,
                                      tax: 15,
                                      amount: 165,
                                    },
                                    {
                                      name: 'Espresso',
                                      category: 'Beverage',
                                      quantity: 1,
                                      price: 90,
                                      tax: 10,
                                      amount: 100,
                                    },
                                  ],
                                  subtotal: 510,
                                  totaltax: 55,
                                  total: 565,
                                },
                                {
                                  name: 'Bean Junction',
                                  phone: '+91 98765 43210',
                                  address: '123 Coffee Lane, New Delhi, 110001',
                                  email: 'contact@beanjunction.in',
                                },
                                {
                                  name: 'Rahul Sharma',
                                  mobile: '+91 8935421425',
                                },
                                {
                                  name: 'Priya Verma',
                                  mobile: '+91 90088 12345',
                                  address: '43 Main Street, Delhi, 110001',
                                },
                              )
                            }
                            className="flex items-center cursor-pointer justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                          >
                            <Download className="w-4 h-4" />
                            <span>Invoice</span>
                          </button>
                          <button
                            onClick={() => buyAgain(order)}
                            className="flex items-center cursor-pointer justify-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Buy Again</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-xl font-bold">Delivery Addresses</h3>
                  <button
                    onClick={openAddAddressModal}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600  rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`p-4 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold">{address.label}</p>
                            {address.isDefault && (
                              <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          >
                            {address.street}, {address.city}, {address.state}
                            {address.postalCode}, {address.country}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          {!address.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(address._id)}
                              className="px-3 py-1.5 text-sm border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => openEditAddressModal(address)}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add/Edit Address Modal */}
                {isAddressModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex justify-center items-center p-4">
                    <div
                      className={`w-full max-w-2xl ${
                        isDarkMode ? 'bg-gray-900' : 'bg-white'
                      } rounded-2xl shadow-2xl overflow-hidden`}
                    >
                      <div
                        className={`p-4 sm:p-6 border-b ${
                          isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        } flex items-center justify-between`}
                      >
                        <h3 className="text-xl font-bold">
                          {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        <button
                          onClick={() => setIsAddressModalOpen(false)}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Label <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={addressForm.label}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  label: e.target.value,
                                })
                              }
                              className={`w-full p-3 rounded-lg border ${
                                isDarkMode
                                  ? 'bg-gray-800 border-gray-600 text-white'
                                  : 'bg-white border-gray-300'
                              } ${formErrors.label ? 'border-red-500' : ''}`}
                              placeholder="e.g., Home, Office, etc."
                            />
                            {formErrors.label && (
                              <p className="text-red-500 text-sm mt-1">
                                {formErrors.label}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Street Address{' '}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={addressForm.street}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  street: e.target.value,
                                })
                              }
                              className={`w-full p-3 rounded-lg border ${
                                isDarkMode
                                  ? 'bg-gray-800 border-gray-600 text-white'
                                  : 'bg-white border-gray-300'
                              } ${formErrors.street ? 'border-red-500' : ''}`}
                              placeholder="123 Main St"
                            />
                            {formErrors.street && (
                              <p className="text-red-500 text-sm mt-1">
                                {formErrors.street}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                City <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={addressForm.city}
                                onChange={(e) =>
                                  setAddressForm({
                                    ...addressForm,
                                    city: e.target.value,
                                  })
                                }
                                className={`w-full p-3 rounded-lg border ${
                                  isDarkMode
                                    ? 'bg-gray-800 border-gray-600 text-white'
                                    : 'bg-white border-gray-300'
                                } ${formErrors.city ? 'border-red-500' : ''}`}
                                placeholder="New York"
                              />
                              {formErrors.city && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formErrors.city}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                State <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={addressForm.state}
                                onChange={(e) =>
                                  setAddressForm({
                                    ...addressForm,
                                    state: e.target.value,
                                  })
                                }
                                className={`w-full p-3 rounded-lg border ${
                                  isDarkMode
                                    ? 'bg-gray-800 border-gray-600 text-white'
                                    : 'bg-white border-gray-300'
                                } ${formErrors.state ? 'border-red-500' : ''}`}
                                placeholder="NY"
                              />
                              {formErrors.state && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formErrors.state}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Country <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={addressForm.country}
                                onChange={(e) =>
                                  setAddressForm({
                                    ...addressForm,
                                    country: e.target.value,
                                  })
                                }
                                className={`w-full p-3 rounded-lg border ${
                                  isDarkMode
                                    ? 'bg-gray-800 border-gray-600 text-white'
                                    : 'bg-white border-gray-300'
                                } ${
                                  formErrors.country ? 'border-red-500' : ''
                                }`}
                                placeholder="USA"
                              />
                              {formErrors.country && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formErrors.country}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Postal Code{' '}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={addressForm.postalCode}
                                onChange={(e) =>
                                  setAddressForm({
                                    ...addressForm,
                                    postalCode: e.target.value,
                                  })
                                }
                                className={`w-full p-3 rounded-lg border ${
                                  isDarkMode
                                    ? 'bg-gray-800 border-gray-600 text-white'
                                    : 'bg-white border-gray-300'
                                } ${
                                  formErrors.postalCode ? 'border-red-500' : ''
                                }`}
                                placeholder="10001"
                              />
                              {formErrors.postalCode && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formErrors.postalCode}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="defaultAddress"
                              checked={addressForm.isDefault}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  isDefault: e.target.checked,
                                })
                              }
                              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <label
                              htmlFor="defaultAddress"
                              className="text-sm font-medium cursor-pointer"
                            >
                              Set as default address
                            </label>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-4 sm:p-6 border-t ${
                          isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        } flex flex-col sm:flex-row gap-3 justify-end`}
                      >
                        <button
                          onClick={() => setIsAddressModalOpen(false)}
                          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveAddress}
                          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
                        >
                          {editingAddress ? 'Update Address' : 'Add Address'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'logout' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Logout</h3>
                <div
                  className={`p-6 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  } text-center`}
                >
                  <div className="mb-4">
                    <LogOut className="w-16 h-16 mx-auto text-red-500 mb-4" />
                    <h4 className="text-lg font-semibold mb-2">
                      Are you sure you want to logout?
                    </h4>
                    <p
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      You will be redirected to the login page.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="cursor-pointer px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                    >
                      Yes, Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
