import React from 'react';
import { Download, ShoppingCart } from 'lucide-react';
import { generateCafeInvoice } from '../../utils/Invoice.js';
const Order = ({ orderHistory, isDarkMode }) => {
  const handleGenrateInvoice = (order) => {
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
    );
  };
  return (
    <div>
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
                      <p className="text-sm text-gray-500">{order.date}</p>
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
                    onClick={() => handleGenrateInvoice()}
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
    </div>
  );
};

export default Order;
