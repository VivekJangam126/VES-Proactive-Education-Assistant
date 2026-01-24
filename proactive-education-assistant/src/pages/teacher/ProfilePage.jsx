import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaUser,
  FaEnvelope,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt,
  FaLock,
  FaSpinner,
  FaExclamationCircle,
} from 'react-icons/fa';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [teacher, setTeacher] = useState(user);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Keep profile in sync with auth context
  useEffect(() => {
    setTeacher(user);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // In a real app, this would call a backend API to update teacher profile
    // For now, we'll show a message indicating the feature
    setMessage('Profile updates not yet implemented. Contact admin for changes.');
    setEditMode(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: teacher?.name || '',
      email: teacher?.email || '',
    });
    setEditMode(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mb-3 mx-auto" />
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your account information</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-start gap-3">
            <FaExclamationCircle className="text-red-600 dark:text-red-400 text-lg mt-0.5 shrink-0" />
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <p className="text-blue-700 dark:text-blue-200">{message}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="h-32 bg-linear-to-r from-blue-500 to-teal-500"></div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                <div className="w-32 h-32 bg-white dark:bg-gray-900 rounded-full border-4 border-white dark:border-gray-900 shadow-lg flex items-center justify-center">
                  <div className="w-28 h-28 bg-linear-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {user.name?.charAt(0) || 'T'}
                  </div>
                </div>

                <div className="pb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                      Active
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Teacher</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 flex gap-2">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FaTimes /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 items-center gap-2">
                      <FaEnvelope className="text-gray-500" />
                      Email Address
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">{teacher.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject/Specialization</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Mathematics"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">{teacher.subject || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Status</label>
                    <p className="text-gray-900 dark:text-white py-2 capitalize">{teacher.status}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaChalkboardTeacher className="text-blue-600" />
                  Assigned Classes
                </h3>
                {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {teacher.assignedClasses.map((cls, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-700 text-sm font-medium"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">No classes assigned</p>
                )}
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaLock className="text-blue-600" />
                  Security Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Add an extra layer of security to your account</p>
                    </div>
                    <button className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 text-sm font-medium">Enable</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Login Alerts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Get notified about new device logins</p>
                    </div>
                    <button className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 text-sm font-medium">Manage</button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaSignOutAlt className="text-red-600 text-xl" />
                    <div>
                      <p className="font-semibold text-red-700 dark:text-red-200">Sign Out</p>
                      <p className="text-sm text-red-600 dark:text-red-300">You can sign back in anytime</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FaCalendarAlt className="text-blue-600 dark:text-blue-300 text-xl mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Account Information</h4>
              <p className="text-sm text-blue-800 dark:text-blue-100/80 mt-1">
                Your profile information is used to personalize your experience and manage class assignments. Contact your administrator if you need to update your assigned classes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
