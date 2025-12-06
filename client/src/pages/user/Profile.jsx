import { Edit2 } from 'lucide-react';
import { getCookie } from '../../utils/utils';

const Profile = ({
  editMode,
  setEditMode,
  profileData,
  isDarkMode,
  setProfileData,
  updateUserDetails,
}) => {
  console.log(getCookie('name'),getCookie('email'),getCookie('mobile'),getCookie('address'));

  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-bold">Profile Information</h3>
          <button
            onClick={() => {
              if (editMode) {
                updateUserDetails();
              }
              setEditMode(!editMode);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>{editMode ? 'Save' : 'Edit'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              disabled={!editMode}
              className={`w-full p-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              } ${!editMode ? 'opacity-60' : ''}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              readOnly
              value={profileData.email}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  email: e.target.value,
                })
              }
              disabled={!editMode}
              className={`w-full p-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              } ${!editMode ? 'opacity-60' : ''}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              maxLength={10}
              type="tel"
              value={profileData.mobile}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  mobile: e.target.value,
                })
              }
              disabled={!editMode}
              className={`w-full p-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              } ${!editMode ? 'opacity-60' : ''}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              value={profileData.address}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  address: e.target.value,
                })
              }
              disabled={!editMode}
              readOnly
              className={`w-full p-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              } ${!editMode ? 'opacity-60' : ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
