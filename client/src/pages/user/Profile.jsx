import { Edit2 } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../../redux/userFeatures/UserProfileSlice';

const Profile = ({
  editMode,
  setEditMode,
  profileData,
  isDarkMode,
  setProfileData,
  updateUserDetails,
}) => {
  const dispatch = useDispatch();

  const { userDetails, isLoading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userDetails) {
      setProfileData({
        name: userDetails.name || '',
        email: userDetails.email || '',
        mobile: userDetails.mobile || '',
        address: userDetails.address || '',
      });
    }
  }, [userDetails, setProfileData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="text-sm text-gray-500">
          Fetching profile details...
        </span>
      </div>
    );
  }

  if (!profileData) return null;

  return (
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
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
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
            value={profileData.email}
            disabled
            className={`w-full p-3 rounded-lg border opacity-60 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            maxLength={10}
            value={profileData.mobile}
            onChange={(e) =>
              setProfileData({ ...profileData, mobile: e.target.value })
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
            disabled
            className={`w-full p-3 rounded-lg border opacity-60 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
