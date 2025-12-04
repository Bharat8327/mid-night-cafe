import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Coffee } from 'lucide-react';
import { notifyError, notifySuccess } from '../../utils/toast';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      notifyError('Password do not match');
    }
    if (formData.password.length < 6) {
      notifyError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      if (1) {
        notifyError('Password updated successfully!');
        setTimeout(() => (navigate('/login'), setLoading(false)), 6000);
      } else {
        notifyError('Failed to update password');
      }
    } catch (error) {
      notifyError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-800/30 to-pink-800/30 flex items-center justify-center p-4 relative overflow-hidden">
      <Coffee className="absolute top-10 left-10 w-8 h-8 text-amber-400/30 animate-pulse" />
      <Coffee className="absolute top-20 right-16 w-6 h-6 text-orange-400/40 animate-bounce" />
      <Coffee className="absolute bottom-16 left-16 w-7 h-7 text-yellow-400/35 animate-pulse" />
      <Coffee className="absolute bottom-20 right-10 w-9 h-9 text-amber-300/30 animate-bounce" />
      <Coffee className="absolute top-1/2 left-8 w-5 h-5 text-orange-300/25 animate-pulse" />
      <Coffee className="absolute top-1/3 right-8 w-6 h-6 text-yellow-500/35 animate-bounce" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-black/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 animate-fadeInUp border border-purple-500/30 relative">
          <Coffee
            className="absolute -top-4 -left-4 w-8 h-8 text-amber-400 animate-spin"
            style={{ animationDuration: '8s' }}
          />
          <Coffee className="absolute -top-4 -right-4 w-6 h-6 text-orange-400 animate-pulse" />
          <Coffee className="absolute -bottom-4 -left-4 w-7 h-7 text-yellow-400 animate-bounce" />
          <Coffee className="absolute -bottom-4 -right-4 w-8 h-8 text-amber-300 animate-pulse" />

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Coffee className="w-16 h-16 text-amber-400 mr-4 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                  Mid-night Cafe
                </h1>
                <p className="text-sm text-amber-300 font-medium mt-1">
                  ☕ Your Perfect Coffee Destination ☕
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#C29970] mb-2">
              Reset Password
            </h2>
            <p className="text-[#8F663D]">
              Create a new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#C29970] mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-10 py-3 bg-black/80 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-[#C29970] placeholder-[#aa8f7a]"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#C29970] mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-10 py-3 bg-black/80 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-[#C29970] placeholder-[#aa8f7a]"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg cursor-pointer"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
