import { X, Clock, User, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewOrderNotification = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();

  const currentOrders = [
    {
      id: '#ORD-001',
      customer: 'John Smith',
      items: ['2x Cappuccino', '1x Croissant'],
      total: '$12.50',
      time: '2 mins ago',
      phone: '+1 234-567-8900',
      address: '123 Main St, City',
      status: 'new',
    },
    {
      id: '#ORD-002',
      customer: 'Sarah Johnson',
      items: ['1x Latte', '1x Green Tea'],
      total: '$8.00',
      time: '5 mins ago',
      phone: '+1 234-567-8901',
      address: '456 Oak Ave, City',
      status: 'preparing',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🔔</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">New Orders</h2>
              <p className="text-slate-400 text-sm">Current incoming orders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Orders List */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {currentOrders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-700 rounded-lg p-4 border border-slate-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {order.customer}
                    </h3>
                    <p className="text-slate-400 text-sm">{order.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-400">{order.total}</p>
                  <div className="flex items-center space-x-1 text-slate-400 text-xs">
                    <Clock size={12} />
                    <span>{order.time}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center space-x-2 text-slate-300 text-sm">
                  <span className="font-medium">Items:</span>
                  <span>{order.items.join(', ')}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300 text-sm">
                  <Phone size={14} />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300 text-sm">
                  <MapPin size={14} />
                  <span>{order.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'new'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-orange-500/20 text-orange-400'
                  }`}
                >
                  {order.status === 'new' ? 'New Order' : 'Preparing'}
                </span>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors cursor-pointer">
                    Accept
                  </button>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors cursor-pointer">
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-750">
          <button
            onClick={() => {
              navigate('/admin/orders');
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg transition-all duration-200 font-medium cursor-pointer"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderNotification;
