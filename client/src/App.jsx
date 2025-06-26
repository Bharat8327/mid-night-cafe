import { Routes, Route } from 'react-router-dom';
import ProtectRoutes from './components/protectRoutes.jsx';
import OpenRoutes from './components/OpenRoutes.jsx';
// import AdminLayout from './pages/AdminDashBoard/AdminLayout.jsx';

import HomePage from './pages/HomePage.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import OTPVerification from './pages/OtpVerification.jsx';
import ResetPassword from './pages/resetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';

import OrdersOverview from './pages/AdminDashBoard/OrderOverview.jsx';
import MenuManagement from './pages/AdminDashBoard/MenuManagement.jsx';
import CustomerManagement from './pages/AdminDashBoard/CustomerManagement.jsx';
import Analytics from './pages/AdminDashBoard/Analytic.jsx';
import SideBar from './pages/AdminDashBoard/SideBar.jsx';
import Header from './pages/AdminDashBoard/Header.jsx';

function App() {
  return (
    <>
      {/* Wrap Header and Sidebar here */}
      <Routes>
        {/* Public routes */}
        <Route element={<OpenRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Customer routes */}
        <Route element={<ProtectRoutes role={['customer']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectRoutes role={['admin']} />}>
          <Route path="/admin/orders" element={<OrdersOverview />} />
          <Route path="/admin/menu" element={<MenuManagement />} />
          <Route path="/admin/customers" element={<CustomerManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
