import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../redux/features/AuthSlice.js';
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    dispatch(signUp(formData))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-black via-purple-900 to-pink-700">
      <div className="w-full md:w-1/2 flex items-center justify-center p-2">
        <div className="w-full max-w-lg bg-black/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/30">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Coffee className="w-12 h-12 text-amber-400 animate-pulse mr-2" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                Mid-night Cafe
              </h1>
            </div>
            <p className="text-sm text-[#C29970]">
              Already have an account?{' '}
              <Link to="/login" className="text-pink-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    className="w-full pl-10 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] placeholder:text-[#a78b6c] focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>

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
                    className="w-full pl-10 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] placeholder:text-[#a78b6c] focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="phone"
                  className="text-[#C29970] text-sm mb-1 block"
                >
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    maxLength={10}
                    onChange={handleChange}
                    value={formData.phone}
                    placeholder="Phone No."
                    className="w-full pl-10 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] placeholder:text-[#a78b6c] focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="text-[#C29970] text-sm mb-1 block"
                >
                  Role
                </label>
                <div className="relative">
                  <ShieldUser className="absolute left-3 top-7 -translate-y-1/2 text-purple-400" />
                  <select
                    id="role"
                    name="role"
                    required
                    onChange={handleChange}
                    value={formData.role}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] focus:outline-none focus:ring-2 focus:ring-pink-400"
                  >
                    <option value="customer">Customer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

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
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] placeholder:text-[#a78b6c] focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-pink-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

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
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] placeholder:text-[#a78b6c] focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-pink-400"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>

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

      <div className="hidden md:flex md:w-1/2 flex-col p-10 bg-gradient-to-br from-purple-900 via-black to-pink-800 overflow-hidden max-h-screen">
        <div className="max-w-lg mx-auto text-center text-[#E7D4C0] space-y-8">
          <h2 className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg tracking-wide">
            Why choose Midnight Café?
          </h2>

          <p className="text-lg leading-relaxed px-6">
            At Midnight Café, we believe every cup of coffee should be an
            experience. Our cozy ambiance and handcrafted brews are designed to
            inspire, relax, and energize you throughout your day and night.
          </p>

          <div className="flex ">
            <div className=" rounded-xl border-r-cyan-200 p-6 shadow-lg  hover:scale-105 cursor-pointer">
              <Coffee className="mx-auto w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                Freshly Brewed
              </h3>
              <p className="text-sm">
                Savor the rich, bold flavors carefully crafted by expert
                baristas.
              </p>
            </div>

            <div className="rounded-xl p-6 shadow-lg  hover:scale-105 cursor-pointer">
              <Coffee className="mx-auto w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                Cozy Ambience
              </h3>
              <p className="text-sm">
                Relax and recharge in our welcoming space designed just for you.
              </p>
            </div>
          </div>

          <p className="mt-10 text-sm italic text-[#C29970] border-t border-yellow-400/50 pt-5 max-w-md mx-auto">
            “Life happens, coffee helps.” Join us to experience community,
            comfort, and incredible coffee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupAdmin;
