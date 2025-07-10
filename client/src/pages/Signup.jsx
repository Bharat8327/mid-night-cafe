import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../redux/features/AuthSlice.js';
import {
  Crown,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Coffee,
  Phone,
  ShieldUser,
} from 'lucide-react';
import { useDispatch } from 'react-redux';

const SignupAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer',
  });

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value); // ← Logs name & new value
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    // setLoading(true);
    console.log(formData);
    dispatch(signUp(formData));

    // TODO: Replace with real API call
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Coffee Icons */}
      <Coffee className="absolute top-10 left-10 w-8 h-8 text-amber-400/30 animate-pulse" />
      <Coffee className="absolute bottom-20 right-10 w-9 h-9 text-amber-300/30 animate-bounce" />

      <div className="w-full max-w-md z-10">
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Coffee className="w-12 h-12 text-amber-400 animate-pulse mr-2" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                Mid-night Cafe
              </h1>
            </div>
            {/* Footer Links */}
            <div className="text-center text-sm text-[#C29970] mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-pink-400 hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admin Name */}
            <div>
              <label
                htmlFor="name"
                className="text-[#C29970] text-sm mb-1 block"
              >
                Name
              </label>
              <div className="relative">
                <Crown className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Enter your name"
                  className="w-full pl-10 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] placeholder:text-[#a78b6c]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-[#C29970] text-sm mb-1 block"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Enter your email"
                  className="w-full pl-10 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] placeholder:text-[#a78b6c]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="tel"
                className="text-[#C29970] text-sm mb-1 block"
              >
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="tel"
                  name="phone"
                  id="tel"
                  required
                  maxLength={10}
                  onChange={handleChange}
                  value={formData.phone}
                  placeholder="Enter your Phone Number"
                  className="w-full pl-10 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] placeholder:text-[#a78b6c]"
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="tel"
                className="text-[#C29970] text-sm mb-1 block"
              >
                Role
              </label>
              <ShieldUser className="absolute left-3 top-12 -translate-y-1/2 text-purple-400" />
              <select
                id="role"
                name="role"
                required
                onChange={handleChange}
                value={formData.role}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970]"
              >
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-[#C29970] text-sm mb-1 block"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  required
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] placeholder:text-[#a78b6c]"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-[#C29970] text-sm mb-1 block"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  onChange={handleChange}
                  value={formData.confirmPassword}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] placeholder:text-[#a78b6c]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
                {/* 🔴 Error message */}
              </div>
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 text-white font-semibold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupAdmin;
