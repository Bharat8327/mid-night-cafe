import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Coffee } from 'lucide-react';
import axios from 'axios';
import { notifyError, notifyInfo, notifySuccess } from '../../utils/toast';

const OTP_LENGTH = 6;
const RESEND_TIME = 30;

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [resendTimer, setResendTimer] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  useEffect(() => {
    if (otp.join('').length === OTP_LENGTH && !loading) {
      handleSubmit(new Event('submit'));
    }
  }, [otp]);

  useEffect(() => {
    if (resendTimer === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }

    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();

    if (!/^\d{6}$/.test(pasted)) {
      notifyError('Invalid OTP format');
      return;
    }

    setOtp(pasted.split(''));
    inputRefs.current[OTP_LENGTH - 1]?.focus();
    setActiveIndex(OTP_LENGTH - 1);
  };

  const handleFocus = (index) => setActiveIndex(index);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/u/auth/verify-otp`,
        {
          email,
          otp: otpString,
        },
      );
      notifySuccess('OTP verified successfully');
      navigate('/reset-password', { state: { email, otp: otpString } });
    } catch (err) {
      console.log(err);

      notifyError(err.response?.data?.message || 'Invalid or expired OTP');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      setActiveIndex(0);
    } finally {
      setLoading(false);
    }
  };

  const sentOtp = async () => {
    if (!canResend) return;
    try {
      setResendLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/u/auth/forgot-passwd`, {
        email,
      });
      notifyInfo('OTP resent successfully');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      setActiveIndex(0);
      setResendTimer(RESEND_TIME);
      setCanResend(false);
    } catch {
      notifyError('Unable to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-pink-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/90 rounded-2xl p-8 border border-purple-500/30">
          <div className="text-center mb-6">
            <Coffee className="w-16 h-16 text-amber-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-[#C29970]">Verify OTP</h2>
            <p className="text-[#8F663D] text-sm">{email}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  onFocus={() => handleFocus(index)}
                  className={`w-12 h-12 text-center text-xl font-bold bg-black/70 text-[#C29970]
                    border rounded-md focus:ring-2 focus:ring-purple-400 outline-none
                    ${
                      activeIndex === index
                        ? 'ring-2 ring-purple-400 scale-110'
                        : ''
                    }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400
              text-white py-3 rounded-lg font-medium disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={sentOtp}
              disabled={!canResend || resendLoading}
              className={`${
                canResend ? 'text-pink-400' : 'text-gray-500'
              } cursor-pointer`}
            >
              {canResend ? 'Resend OTP' : `Resend OTP in ${resendTimer}s`}
            </button>

            <div className="mt-3">
              <Link
                to="/forgot-password"
                className="inline-flex items-center text-[#8F663D]"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Change Email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
