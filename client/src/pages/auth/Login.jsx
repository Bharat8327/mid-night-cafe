import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Coffee } from 'lucide-react';
import {
  login,
  signInWithGithub,
  signInWithGoogle,
} from '../../redux/features/AuthSlice.js';
import gog from '../../../public/google.svg';
import git from '../../../public/github.svg';
import cofe from '../../../public/cofe.png';
import cofe2 from '../../../public/coffe2.jpg';
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
  const [gogAuthDisable, setGogAuthDisable] = useState(false);
  const [gitAuthDisable, setGitAuthDisable] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(login(formData))
      .unwrap()
      .then(() => {
        navigate('/admin/orders');
      });
    setLoading(false);
  };

  const googleAuth = () => {
    setGogAuthDisable(true);
    dispatch(signInWithGoogle())
      .unwrap()
      .then(() => {
        navigate('/dashboard');
        dispatch(getUserProfile());
        setGogAuthDisable(false);
      });
  };

  const githubAuth = () => {
    setGitAuthDisable(true);
    dispatch(signInWithGithub())
      .unwrap()
      .then(() => {
        navigate('/dashboard');
        dispatch(getUserProfile());
        setGitAuthDisable(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 flex items-center justify-center  md:p-12">
        <div className="w-full max-w-md relative z-10">
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-purple-500/30 relative">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center ">
                <div className="relative">
                  <Coffee className="w-16 h-16 text-amber-400 mr-4 animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 from-yellow-400 via-pink-400 to-purple-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                    Mid-night Cafe
                  </h1>
                  <p className="text-sm text-amber-300 font-medium ">
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
                    className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
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
                    className="h-4 cursor-pointer w-4 text-purple-400 focus:ring-purple-400 border-purple-500/30 rounded bg-black/80"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-[#C29970] cursor-pointer"
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
                className="w-full cursor-pointer from-yellow-400 via-pink-400 to-purple-400 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
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
                  disabled={gogAuthDisable}
                  onClick={googleAuth}
                  className="w-full cursor-pointer inline-flex justify-center py-2 px-4 border border-purple-500/30 rounded-md shadow-sm bg-black/80 text-sm font-medium text-[#C29970] hover:bg-purple-900/20 transition-colors duration-200 hover:scale-110"
                >
                  <span className="w-5 h-5 rounded-2xl bg-[#D1B394] ">
                    <img src={gog} className=" " alt="Google logo" />
                  </span>
                  <span className="ml-2 text-[#D1B394]">Google</span>
                </button>
                <button
                  disabled={gitAuthDisable}
                  onClick={githubAuth}
                  className="w-full cursor-pointer inline-flex justify-center py-2 px-4 border border-purple-500/30 rounded-md shadow-sm bg-black/80 text-sm font-medium text-[#C29970] hover:bg-purple-900/20 transition-colors duration-200 hover:scale-110"
                >
                  <span className="w-5 h-5 rounded-2xl bg-[#D1B394]">
                    <img src={git} className=" " alt="GitHub logo" />
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

      <div className="w-full md:w-1/2 hidden md:flex items-center justify-center from-purple-900 via-black to-pink-800 relative p-10">
        <div className="max-w-lg text-center text-[#E7D4C0] space-y-6">
          <h2 className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg">
            Why Midnight Café?
          </h2>
          <p className="text-lg leading-relaxed">
            Midnight Café isn’t just a coffee shop — it’s your{' '}
            <span className="font-bold text-pink-400">
              perfect late-night escape
            </span>
            . Whether you need a space to work, relax, or hangout, we provide
            the warm aroma of fresh brews and cozy vibes around the clock.
          </p>

          <div className="">
            <div className="bg-black/60 rounded-lg shadow-md hover:scale-105 transition col-span-2">
              <img
                src={cofe2}
                alt="Night café vibes"
                className="rounded-md mb-2"
              />
              <h3 className="text-md font-semibold text-yellow-400">
                Open Late
              </h3>
              <p className="text-sm">
                Perfect for night owls, workers, and friends who love midnight
                talks.
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm italic text-[#C29970]">
            “Life happens, coffee helps.” Join us and feel the vibe. 🌙☕
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
