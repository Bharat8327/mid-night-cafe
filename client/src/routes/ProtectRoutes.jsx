import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../pages/admin/Header.jsx';
import Sidebar from '../pages/admin/SideBar.jsx';
import { getCookie, removeCookie } from '../utils/utils.js';

function ProtectRoutes({ roles }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthnticated = getCookie('authenticated');
  const role = getCookie('role');

  if (!isAuthnticated || role === 'undefined') {
    return <Navigate to="/login" />;
  }

  if (!roles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {role === 'Admin' && (
        <>
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {sidebarOpen && (
            <Sidebar isopen={sidebarOpen} setIsOpen={setSidebarOpen} />
          )}
        </>
      )}
      <Outlet />
    </div>
  );
}

export default ProtectRoutes;
