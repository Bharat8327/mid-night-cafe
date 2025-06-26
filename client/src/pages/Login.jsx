import { use, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Coffee } from 'lucide-react';
import {
  login,
  signInWithGithub,
  signInWithGoogle,
} from '../redux/features/AuthSlice.js';
import { useDispatch } from 'react-redux';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
    setLoading(!loading);
    setTimeout(() => {
      setLoading(!!loading);
      console.log(formData);
    }, 8000);
  };

  const googleAuth = () => {
    dispatch(signInWithGoogle());
  };

  const githubAuth = () => {
    dispatch(signInWithGithub());
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Coffee Icons */}
      <Coffee className="absolute top-10 left-10 w-8 h-8 text-amber-400/30 animate-pulse" />
      <Coffee className="absolute top-20 right-16 w-6 h-6 text-orange-400/40 animate-bounce" />
      <Coffee className="absolute bottom-16 left-16 w-7 h-7 text-yellow-400/35 animate-pulse" />
      <Coffee className="absolute bottom-20 right-10 w-9 h-9 text-amber-300/30 animate-bounce" />
      <Coffee className="absolute top-1/2 left-8 w-5 h-5 text-orange-300/25 animate-pulse" />
      <Coffee className="absolute top-1/3 right-8 w-6 h-6 text-yellow-500/35 animate-bounce" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 animate-fadeInUp border border-purple-500/30 relative">
          {/* Additional decorative icons around the form */}
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
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 rounded-full animate-ping"></div>
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
              Welcome Back!
            </h2>
            <p className="text-[#C29970]">
              Sign in to enjoy our premium coffee experience
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#C29970] mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/80 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-[#C29970] placeholder:text-[#a78b6c]"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#C29970] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 bg-black/80 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-[#C29970] placeholder:text-[#a78b6c]"
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-400 focus:ring-purple-400 border-purple-500/30 rounded bg-black/80"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-[#C29970]"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-500/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-[#8F663D]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={googleAuth}
                className="w-full inline-flex justify-center py-2 px-4 border border-purple-500/30 rounded-md shadow-sm bg-black/80 text-sm font-medium text-[#C29970] hover:bg-purple-900/20 transition-colors duration-200 hover:scale-110"
              >
                <span className="w-5 h-5 rounded-2xl bg-[#D1B394] ">
                  <img
                    src="../public/LoginPageIcons/google.svg"
                    className=" "
                    alt="sdafsdga"
                  />
                </span>
                <span className="ml-2 text-[#D1B394]">Google</span>
              </button>

              <button
                onClick={githubAuth}
                className="w-full inline-flex justify-center py-2 px-4 border border-purple-500/30 rounded-md shadow-sm bg-black/80 text-sm font-medium text-[#C29970] hover:bg-purple-900/20 transition-colors duration-200 hover:scale-110"
              >
                <span className="w-5 h-5 rounded-2xl bg-[#D1B394]">
                  <img
                    src="../public/LoginPageIcons/github.svg"
                    className=" "
                    alt="sdafsdga"
                  />
                </span>
                <span className="ml-2 text-[#D1B394]">GitHub</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-[#C29970]">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
