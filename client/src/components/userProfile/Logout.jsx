import { LogOut } from 'lucide-react';
import { removeCookie } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import { notifySuccess } from '../../utils/toast.js';

const Logout = ({ isDarkMode, onClose, setActiveTab }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeCookie('authenticated');
    removeCookie('id');
    removeCookie('name');
    removeCookie('role');
    removeCookie('email');
    removeCookie('address');
    removeCookie('mobile');
    onClose();
    navigate('/login');
    notifySuccess('logout Successfully');
  };

  return (
    <div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Logout</h3>
        <div
          className={`p-6 rounded-lg border ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          } text-center`}
        >
          <div className="mb-4">
            <LogOut className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h4 className="text-lg font-semibold mb-2">
              Are you sure you want to logout?
            </h4>
            <p
              className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              You will be redirected to the login page.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActiveTab('profile')}
              className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="cursor-pointer px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
