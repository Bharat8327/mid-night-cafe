import { useState } from 'react';
import {
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle,
} from 'lucide-react';

const OrdersOverview = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      time: '10:30 AM',
      customer: 'John Doe',
      phone: '+1 234 567 8901',
      items: ['Cappuccino', 'Croissant'],
      total: 8.5,
      status: 'preparing',
    },
    {
      id: 'ORD002',
      time: '10:45 AM',
      customer: 'Jane Smith',
      phone: '+1 234 567 8902',
      items: ['Latte', 'Blueberry Muffin'],
      total: 12.0,
      status: 'pending',
    },
    {
      id: 'ORD003',
      time: '11:00 AM',
      customer: 'Mike Johnson',
      phone: '+1 234 567 8903',
      items: ['Espresso', 'Danish'],
      total: 6.75,
      status: 'ready',
    },
    {
      id: 'ORD004',
      time: '10:15 AM',
      customer: 'Sarah Wilson',
      phone: '+1 234 567 8904',
      items: ['Americano', 'Bagel with Cream Cheese'],
      total: 9.25,
      status: 'completed',
    },
  ]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-500',
          icon: AlertCircle,
          text: 'Pending',
          bgColor: 'bg-yellow-900 border-yellow-700',
          textColor: 'text-yellow-400',
        };
      case 'preparing':
        return {
          color: 'bg-blue-500',
          icon: PlayCircle,
          text: 'Preparing',
          bgColor: 'bg-blue-900 border-blue-700',
          textColor: 'text-blue-400',
        };
      case 'ready':
        return {
          color: 'bg-green-500',
          icon: CheckCircle,
          text: 'Ready',
          bgColor: 'bg-green-900 border-green-700',
          textColor: 'text-green-400',
        };
      case 'completed':
        return {
          color: 'bg-gray-500',
          icon: CheckCircle,
          text: 'Completed',
          bgColor: 'bg-gray-700 border-gray-600',
          textColor: 'text-gray-300',
        };
      default:
        return {
          color: 'bg-gray-500',
          icon: XCircle,
          text: 'Unknown',
          bgColor: 'bg-gray-700 border-gray-600',
          textColor: 'text-gray-300',
        };
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  const callCustomer = (phone, customerName) => {
    alert(`Calling ${customerName} at ${phone}...`);
  };

  return (
    <div className="space-y-6 min-h-screen bg-[#020817] px-2 sm:px-10 ">
      <div>
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
          Orders Overview
        </h2>
        <p className="text-slate-400">Manage and track all customer orders</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-800 p-4 md:p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
          <div className="text-2xl md:text-3xl font-bold text-white mb-2">
            {stats.total}
          </div>
          <div className="text-slate-400 text-sm">Total Orders</div>
        </div>
        <div className="bg-yellow-900 p-4 md:p-6 rounded-xl border border-yellow-700">
          <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {stats.pending}
          </div>
          <div className="text-yellow-300 text-sm">Pending</div>
        </div>
        <div className="bg-blue-900 p-4 md:p-6 rounded-xl border border-blue-700">
          <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2 flex items-center">
            <PlayCircle size={20} className="mr-2" />
            {stats.preparing}
          </div>
          <div className="text-blue-300 text-sm">Preparing</div>
        </div>
        <div className="bg-green-900 p-4 md:p-6 rounded-xl border border-green-700">
          <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2 flex items-center">
            <CheckCircle size={20} className="mr-2" />
            {stats.ready}
          </div>
          <div className="text-green-300 text-sm">Ready</div>
        </div>
        <div className="bg-gray-700 p-4 md:p-6 rounded-xl border border-gray-600">
          <div className="text-2xl md:text-3xl font-bold text-gray-300 mb-2">
            {stats.completed}
          </div>
          <div className="text-gray-400 text-sm">Completed</div>
        </div>
        <div className="bg-gradient-to-br from-orange-900 to-red-900 p-4 md:p-6 rounded-xl border border-orange-700">
          <div className="text-2xl md:text-3xl font-bold text-orange-400 mb-2">
            ${stats.revenue.toFixed(2)}
          </div>
          <div className="text-orange-300 text-sm">Revenue</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={order.id}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-orange-500 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/10 transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-white font-bold text-lg">{order.id}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusConfig.color} flex items-center space-x-1`}
                >
                  <StatusIcon size={12} />
                  <span>{statusConfig.text}</span>
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Clock size={16} />
                  <span>{order.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <User size={16} />
                  <span>{order.customer}</span>
                </div>
                <button
                  onClick={() => callCustomer(order.phone, order.customer)}
                  className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors group"
                  type="button"
                >
                  <Phone size={16} className="group-hover:animate-pulse" />
                  <span>{order.phone}</span>
                </button>
              </div>

              <div className="mb-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-orange-400 mb-1"
                  >
                    <span className="text-orange-500">☕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-orange-400 font-bold text-lg">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2 ">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                    type="button"
                  >
                    <PlayCircle size={16} />
                    <span>Start</span>
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                    type="button"
                  >
                    <CheckCircle size={16} />
                    <span>Ready</span>
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                    type="button"
                  >
                    <CheckCircle size={16} />
                    <span>Complete</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersOverview;
