import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Coffee } from 'lucide-react';
import axios from 'axios';
import { notifyError, notifySuccess } from '../../utils/toast';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      notifyError('Passwords do not match');
      return;
    }
    if (!isStrongPassword(password)) {
      notifyError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
      );
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/u/auth/passwd`, {
        email,
        newPassword: password,
      });
      notifySuccess(
        'Password updated successfully. All sessions have been logged out.',
      );
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      console.log(err);

      notifyError(
        err.response?.data?.message ||
          'Reset link expired. Please request a new one.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-800/30 to-pink-800/30 flex items-center justify-center p-4 relative overflow-hidden">
      <Coffee className="absolute top-10 left-10 w-8 h-8 text-amber-400/30 animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-black/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-purple-500/30">
          <div className="text-center mb-8">
            <Coffee className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#C29970]">
              Reset Password
            </h2>
            <p className="text-[#8F663D] text-sm">
              Create a new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-[#C29970] mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-10 py-3 bg-black/80 border border-purple-500/30 rounded-lg text-[#C29970]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#C29970] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-10 py-3 bg-black/80 border border-purple-500/30 rounded-lg text-[#C29970]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 text-white py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-pink-400 hover:text-pink-300"
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
