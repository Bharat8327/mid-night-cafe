import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Coffee,
  Star,
  Users,
  Award,
  Sun,
  Moon,
} from 'lucide-react';
import { getCookie } from '../../utils/utils.js';
import { useSelector } from 'react-redux';

const Homepage = () => {
  const role = useSelector((state) => state.auth.role);
  const authenticated = useSelector((state) => state.auth.authenticated);

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(authenticated);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      role === 'Admin' ? navigate('/admin/orders') : navigate('/dashboard');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
          : 'bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 text-gray-900'
      }`}
    >
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isDarkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
              : 'bg-white hover:bg-gray-100 text-gray-600'
          }`}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? 'bg-gradient-to-r from-orange-600/10 to-red-600/10'
              : 'bg-gradient-to-r from-orange-600/20 to-red-600/20'
          }`}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <Coffee className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500 bg-clip-text text-transparent mb-6 animate-fade-in">
              CafeHub
            </h1>

            <p
              className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Experience the finest coffee, delicious food, and exceptional
              service. Your perfect cafe experience awaits!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                className={`border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 ${
                  isDarkMode ? 'hover:bg-orange-500' : ''
                }`}
              >
                View Menu
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Why Choose CafeHub?
          </h2>
          <p
            className={`text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Discover what makes us special
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className={`rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3
              className={`text-2xl font-bold mb-4 text-center ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              Premium Quality
            </h3>
            <p
              className={`text-center leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              We source the finest ingredients and craft every item with passion
              and precision.
            </p>
          </div>

          <div
            className={`rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3
              className={`text-2xl font-bold mb-4 text-center ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              Community
            </h3>
            <p
              className={`text-center leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Join thousands of satisfied customers who have made CafeHub their
              favorite spot.
            </p>
          </div>

          <div
            className={`rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3
              className={`text-2xl font-bold mb-4 text-center ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              Excellence
            </h3>
            <p
              className={`text-center leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Award-winning service and consistently high-quality products you
              can trust.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join us today and discover the perfect blend of taste, quality, and
            experience.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-orange-600 hover:bg-orange-50 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
