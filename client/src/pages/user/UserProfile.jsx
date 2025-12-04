import { useEffect, useState } from 'react';
import { User, MapPin, Package, X, LogOut } from 'lucide-react';

import { getCookie, setCookie } from '../../utils/utils.js';
import axios from 'axios';
import Profile from './Profile.jsx';
import Order from './Order.jsx';
import Logout from './Logout.jsx';
import Addresses from './Addresses.jsx';

const UserProfile = ({
  isDarkMode,
  isOpen,
  onClose,
  name,
  email,
  mobile,
  address,
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const [profileData, setProfileData] = useState({
    name,
    email,
    mobile,
    address,
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

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {activeTab === 'profile' && (
              <Profile
                editMode={editMode}
                setEditMode={setEditMode}
                profileData={profileData}
                setProfileData={setProfileData}
                isDarkMode={isDarkMode}
                updateUserDetails={updateUserDetails}
              />
            )}

            {activeTab === 'orders' && (
              <Order orderHistory={orderHistory} isDarkMode={isDarkMode} />
            )}

            {activeTab === 'addresses' && (
              <Addresses
                addresses={addresses}
                isDarkMode={isDarkMode}
                setAddresses={setAddresses}
              />
            )}

            {activeTab === 'logout' && (
              <Logout
                isDarkMode={isDarkMode}
                onClose={onClose}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
