import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';
import Header from './Header';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
