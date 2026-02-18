import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaUserCircle, FaGraduationCap, FaBell, FaWifi } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector";

function Header({ onToggleSidebar }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "New high-risk student alert", time: "5 min ago", unread: true },
    { id: 2, message: "Attendance report ready", time: "1 hour ago", unread: true },
    { id: 3, message: "Class schedule updated", time: "2 hours ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="h-16 px-4 flex items-center justify-between">
        
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <FaBars size={20} />
          </button>

          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-lg">
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">
                {t('app.brand_full', 'Proactive Education')}
              </h1>
              <p className="text-xs text-gray-500">{t('app.tagline', 'Assistant')}</p>
            </div>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Online/Offline Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs font-medium text-gray-700 hidden sm:inline">
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <FaWifi className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`} />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View All Notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <LanguageSelector />
          
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <FaUserCircle className="text-xl" />
            <span className="text-sm font-medium hidden sm:inline">Profile</span>
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;
