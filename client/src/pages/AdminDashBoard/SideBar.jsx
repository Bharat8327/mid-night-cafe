import { useState } from 'react';
import { ShoppingCart, Menu, Users, BarChart3, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path.includes('/admin/orders')) return 'orders';
    if (path.includes('/admin/menu')) return 'menu';
    if (path.includes('/admin/customers')) return 'customers';
    if (path.includes('/admin/analytics')) return 'analytics';
    return 'orders';
  });

  const menuItems = [
    { id: 'orders', label: 'Orders', icon: ShoppingCart, to: '/admin/orders' },
    { id: 'menu', label: 'Menu', icon: Menu, to: '/admin/menu' },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      to: '/admin/customers',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      to: '/admin/analytics',
    },
  ];

  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ease-in-out
          w-80 md:w-60 lg:w-70 lg:translate-x-0 
        `}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm lg:text-lg">
                    🏪
                  </span>
                </div>
                <div className="overflow-hidden">
                  <h1 className="text-orange-500 text-lg lg:text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    CafeHub
                  </h1>
                  <p className="text-slate-400 text-xs lg:text-sm">
                    Management Portal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white cursor-pointer"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 lg:px-4 py-4 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-slate-400 text-xs lg:text-sm font-medium mb-3 uppercase tracking-wider px-2">
                Management
              </h2>
              <div className="space-y-1 lg:space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      to={item.to}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-200 group relative
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                      <Icon
                        size={18}
                        className={`lg:size-5 ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-white'
                        }`}
                      />
                      <span className="font-medium text-sm lg:text-base">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-3 lg:p-4 border-t border-slate-700 flex-shrink-0">
            <button className="w-full bg-slate-700 text-slate-300 py-2 lg:py-3 rounded-lg hover:bg-slate-600 transition-colors text-sm lg:text-base px-3 lg:px-4">
              View Customer Menu
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
