import { ArrowLeft, Coffee, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(!loading);
    setTimeout(() => {
      setLoading(!!loading);
      navigate('/otp-verification', { state: { email } });
    }, 4000);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900/40 to-sky-700/20 flex items-center justify-center p-4 relative overflow-hidden">
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
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-bright-gradient rounded-full animate-ping"></div>
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
              Forgot Password
            </h2>
            <p className="text-[#8F663D]">Enter your email to receive an OTP</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/80 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-[#C29970] placeholder-muted-foreground"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2 text-[#F472B6]" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
