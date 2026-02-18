import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaUserTie, 
  FaChalkboard, 
  FaBook,
  FaChartBar,
  FaGraduationCap
} from 'react-icons/fa';

function AdminSidebar({ onClose }) {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaChartLine },
    { path: '/admin/teachers', label: 'Teachers', icon: FaUserTie },
    { path: '/admin/classes', label: 'Classes', icon: FaChalkboard },
    { path: '/admin/subjects', label: 'Subjects', icon: FaBook },
    { path: '/admin/analytics', label: 'Analytics', icon: FaChartBar },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FaGraduationCap className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500">Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${active 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 font-medium">School Management</p>
          <p className="text-xs text-gray-500 mt-1">Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
