import { useState } from 'react';
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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { removeCookie } from '../utils/utils.js';

const UserProfile = ({ isDarkMode, isOpen, onClose, userName, userEmail }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: userName,
    email: userEmail,
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
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

  const generateInvoice = (order) => {
    const invoiceContent = `
      CAFEHUB INVOICE
      ================

      Order #${order.id}
      Date: ${order.date}
      Status: ${order.status}

      Items:
      ${order.orderDetails.items
        .map(
          (item) =>
            `${item.name} x${item.quantity} - $${(
              item.price * item.quantity
            ).toFixed(2)}`,
        )
        .join('\n')}

      Subtotal: $${order.orderDetails.subtotal}
      Tax: $${order.orderDetails.tax}
      Total: $${order.orderDetails.total}

      Delivery Address:
      ${order.orderDetails.deliveryAddress}

      Thank you for choosing CafeHub!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CafeHub-Invoice-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const buyAgain = (order) => {
    alert(
      `Adding items from order #${order.id} to cart: ${order.items.join(', ')}`,
    );
  };

  const handleLogout = () => {
    // Clear any stored user data
    removeCookie('authenticated');
    removeCookie('id');
    removeCookie('name');
    removeCookie('role');

    // Close the profile modal
    onClose();

    // Redirect to login page
    navigate('/login');
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
                onClick={() => setActiveTab('addresses')}
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
                    onClick={() => setEditMode(!editMode)}
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
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
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
                            onClick={() => generateInvoice(order)}
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
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors cursor-pointer">
                    Add New Address
                  </button>
                </div>
                <div
                  className={`p-4 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold">Home</p>
                      <p className="text-gray-600">
                        123 Main St, New York, NY 10001
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded cursor-pointer">
                        Default
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded cursor-pointer ">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
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
