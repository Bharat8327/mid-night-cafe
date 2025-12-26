import axios from 'axios';
import { X, Plus } from 'lucide-react';
import { useState } from 'react';
import { getCookie } from '../../utils/utils';

const Addresses = ({ addresses, isDarkMode, setAddresses }) => {
  const [editMode, setEditMode] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    isDefault: false,
  });

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
      console.log(error.message);
    }
  };

  return (
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
                    Street Address <span className="text-red-500">*</span>
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
                      } ${formErrors.country ? 'border-red-500' : ''}`}
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
                      Postal Code <span className="text-red-500">*</span>
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
                      } ${formErrors.postalCode ? 'border-red-500' : ''}`}
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
  );
};

export default Addresses;
