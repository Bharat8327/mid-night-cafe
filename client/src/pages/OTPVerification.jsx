import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Coffee } from 'lucide-react';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    message: '',
    type: 'info',
    visible: false,
  });

  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  };

  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      showToast('Please enter a complete 6-digit OTP', 'error');
      return;
    }

    setLoading(true);

    // Replace this with your verifyOTP function if available
    setTimeout(() => {
      setLoading(false);
      showToast('OTP verified successfully!', 'success');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-pink-900/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Coffee Icons */}
      <Coffee className="absolute top-10 left-10 w-8 h-8 text-amber-400/30 animate-pulse" />
      <Coffee className="absolute top-20 right-16 w-6 h-6 text-orange-400/40 animate-bounce" />
      <Coffee className="absolute bottom-16 left-16 w-7 h-7 text-yellow-400/35 animate-pulse" />
      <Coffee className="absolute bottom-20 right-10 w-9 h-9 text-amber-300/30 animate-bounce" />
      <Coffee className="absolute top-1/2 left-8 w-5 h-5 text-orange-300/25 animate-pulse" />
      <Coffee className="absolute top-1/3 right-8 w-6 h-6 text-yellow-500/35 animate-bounce" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-black/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 animate-fadeInUp border border-purple-500/30 relative">
          {/* Extra Coffee Icons */}
          <Coffee
            className="absolute -top-4 -left-4 w-8 h-8 text-amber-400 animate-spin"
            style={{ animationDuration: '8s' }}
          />
          <Coffee className="absolute -top-4 -right-4 w-6 h-6 text-orange-400 animate-pulse" />
          <Coffee className="absolute -bottom-4 -left-4 w-7 h-7 text-yellow-400 animate-bounce" />
          <Coffee className="absolute -bottom-4 -right-4 w-8 h-8 text-amber-300 animate-pulse" />

          {/* Header */}
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
              Verify OTP
            </h2>
            <p className="text-[#8F663D]">
              Enter the 6-digit code sent to your email
            </p>
            <p className="text-sm text-pink-400 mt-2">{email}</p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <label className="block mb-4 text-lg text-[#C29970] font-semibold tracking-wide">
                Enter 6-digit OTP
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                    className={`w-12 h-12 text-center text-xl font-bold transition-all duration-200 rounded-md shadow-sm
                      bg-black/70 text-[#C29970] border border-purple-500/40 focus:ring-2 focus:ring-purple-400 focus:border-transparent 
                      focus:scale-110 outline-none`}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-[#8F663D]">
                We’ve sent a code to{' '}
                <span className="text-pink-400">{email}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 text-white py-3 px-4 rounded-lg font-medium 
              hover:opacity-90 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed 
              disabled:transform-none shadow-lg"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <button
              onClick={() => showToast('OTP resent successfully!', 'info')}
              className="text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200"
            >
              Resend OTP
            </button>
            <div>
              <Link
                to="/forgot-password"
                className="inline-flex items-center text-[#8F663D] hover:text-[#C29970] transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change Email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
