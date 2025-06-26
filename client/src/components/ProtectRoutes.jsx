import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../pages/AdminDashBoard/Header.jsx';
import Sidebar from '../pages/AdminDashBoard/SideBar.jsx';

function ProtectRoutes({ role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = 'dsfmasdjvnasvj';
  const roleFromBackend = 'admin';

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!role.includes('admin')) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {roleFromBackend === 'admin' ? (
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      ) : (
        'hello'
      )}
      {sidebarOpen && (
        <Sidebar isopen={sidebarOpen} setIsOpen={setSidebarOpen} />
      )}
      <Outlet />
    </div>
  );
}

export default ProtectRoutes;
