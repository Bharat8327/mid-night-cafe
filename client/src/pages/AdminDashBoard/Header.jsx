import { Menu, X, Bell } from 'lucide-react';
import { useState } from 'react';
import NewOrderNotification from './NewOrderNotification';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <>
      <header className="bg-slate-800 border-b border-slate-700 px-4 md:px-6 py-4 sticky top-0 z-30 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white cursor-pointer"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="block">
              <h1 className="text-orange-500 text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                CafeHub
              </h1>
              <p className="text-slate-400 text-xs md:text-sm">
                Order Management
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Notifications */}
            <button
              onClick={() => setShowNotification(true)}
              className="relative p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white cursor-pointer"
            >
              <Bell size={18} className="md:size-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* New Order Button */}
            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 md:px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-0.5 text-sm md:text-base cursor-pointer">
              <span className="hidden md:inline">+ New Order</span>
              <span className="md:hidden">+</span>
            </button>
          </div>
        </div>
      </header>

      {/* New Order Notification Modal */}
      <NewOrderNotification
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
};

export default Header;
