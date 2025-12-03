import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/auth/HomePage.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import OTPVerification from './pages/auth/OtpVerification.jsx';
import ResetPassword from './pages/auth/resetPassword.jsx';
import UserDashBoard from './pages/user/UserDashBoard.jsx';

import OrdersOverview from './pages/admin/OrderOverview.jsx';
import MenuManagement from './pages/admin/MenuManagement.jsx';
import CustomerManagement from './pages/admin/CustomerManagement.jsx';
import Analytics from './pages/admin/Analytic.jsx';

import { useSocket } from './hooks/useSocket.js';
import OpenRoutes from './routes/OpenRoutes.jsx';
import ProtectRoutes from './routes/ProtectRoutes.jsx';

function App() {
  useSocket();
  return (
    <>
      {/* Wrap Header and Sidebar here */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route element={<OpenRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Customer routes */}
        <Route element={<ProtectRoutes roles={['customer']} />}>
          <Route path="/dashboard" element={<UserDashBoard />} />
        </Route>

        <Route element={<ProtectRoutes roles={['Admin']} />}>
          <Route path="/admin/orders" element={<OrdersOverview />} />
          <Route path="/admin/menu" element={<MenuManagement />} />
          <Route path="/admin/customers" element={<CustomerManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Route>
        <Route path="*" element={<p>Page Not Found 404</p>} />
      </Routes>
    </>
  );
}

export default App;
