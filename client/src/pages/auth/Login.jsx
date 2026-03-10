import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Coffee, Loader2 } from 'lucide-react';
import {
  login,
  signInWithGithub,
  signInWithGoogle,
} from '../../redux/features/AuthSlice.js';
import gog from '../../../public/google.svg';
import git from '../../../public/github.svg';
import { useDispatch } from 'react-redux';
import { getUserProfile } from '../../redux/userFeatures/UserProfileSlice.js';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [gogLoading, setGogLoading] = useState(false);
  const [gitLoading, setGitLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await dispatch(login(formData)).unwrap();
      if (result?.role === 'Admin') {
        navigate('/admin/orders');
      } else {
        navigate('/dashboard');
      }
    } catch {
      // error handled by redux/toast
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async () => {
    setGogLoading(true);
    try {
      await dispatch(signInWithGoogle()).unwrap();
      dispatch(getUserProfile());
      navigate('/dashboard');
    } catch {
      // error handled
    } finally {
      setGogLoading(false);
    }
  };

  const githubAuth = async () => {
    setGitLoading(true);
    try {
      await dispatch(signInWithGithub()).unwrap();
      dispatch(getUserProfile());
      navigate('/dashboard');
    } catch {
      // error handled
    } finally {
      setGitLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 flex items-center justify-center md:p-12">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-purple-500/30 relative">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Coffee className="w-16 h-16 text-amber-400 mr-4 animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                    Mid-night Cafe
                  </h1>
                  <p className="text-sm text-amber-300 font-medium">
                    ☕ Your Perfect Coffee Destination ☕
                  </p>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#C29970] mt-4 mb-2">Welcome Back!</h2>
              <p className="text-sm text-gray-400">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="text-pink-400 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Social login */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                type="button"
                onClick={googleAuth}
                disabled={gogLoading || gitLoading || loading}
                className="flex items-center justify-center space-x-2 w-full py-3 rounded-lg border border-purple-500/30 bg-white/5 hover:bg-white/10 text-[#C29970] transition-colors disabled:opacity-60"
              >
                {gogLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <img src={gog} alt="Google" className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {gogLoading ? 'Signing in with Google…' : 'Continue with Google'}
                </span>
              </button>

              <button
                type="button"
                onClick={githubAuth}
                disabled={gogLoading || gitLoading || loading}
                className="flex items-center justify-center space-x-2 w-full py-3 rounded-lg border border-purple-500/30 bg-white/5 hover:bg-white/10 text-[#C29970] transition-colors disabled:opacity-60"
              >
                {gitLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <img src={git} alt="GitHub" className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {gitLoading ? 'Signing in with GitHub…' : 'Continue with GitHub'}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-purple-500/30"></div>
              <span className="text-xs text-gray-500">or sign in with email</span>
              <div className="flex-1 h-px bg-purple-500/30"></div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="text-[#C29970] text-sm mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#C29970] text-sm mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/70 border border-purple-500/30 text-[#C29970] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="accent-pink-400"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-pink-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || gogLoading || gitLoading}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Decorative right panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-black via-purple-900 to-pink-700 items-center justify-center p-12">
        <div className="text-center text-white">
          <Coffee className="w-32 h-32 mx-auto mb-6 text-amber-400 opacity-80" />
          <h2 className="text-4xl font-bold mb-4">Mid-night Cafe</h2>
          <p className="text-lg text-purple-200">
            Order your favourite food &amp; drinks, track your orders, and enjoy the experience 🌙
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;