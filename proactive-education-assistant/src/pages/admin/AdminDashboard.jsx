import { useState, useEffect } from 'react';
import { FaUserTie, FaChalkboard, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
import { adminService } from '../../services/adminService';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const result = await adminService.getAdminDashboardStats();
    if (result.success) {
      setStats(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Teachers',
      value: stats?.totalTeachers || 0,
      icon: FaUserTie,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingApprovals || 0,
      icon: FaExclamationTriangle,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      alert: stats?.pendingApprovals > 0
    },
    {
      title: 'Total Classes',
      value: stats?.totalClasses || 0,
      icon: FaChalkboard,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: FaUsers,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'High-Risk Students',
      value: stats?.highRiskStudents || 0,
      icon: FaExclamationTriangle,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      alert: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of what needs attention right now</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 
                ${stat.alert ? 'border-yellow-500 ring-2 ring-yellow-200' : `border-${stat.color}-500`}
                hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  {stat.alert && stat.value > 0 && (
                    <p className="text-xs text-yellow-600 mt-1 font-medium">Requires attention</p>
                  )}
                </div>
                <div className={`${stat.bgColor} p-4 rounded-full`}>
                  <Icon className={`text-2xl ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/teachers"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <FaUserTie className="text-blue-600 text-xl" />
            <div>
              <p className="font-medium text-gray-900">Manage Teachers</p>
              <p className="text-sm text-gray-500">Approve & assign classes</p>
            </div>
          </a>
          <a
            href="/admin/classes"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <FaChalkboard className="text-green-600 text-xl" />
            <div>
              <p className="font-medium text-gray-900">Manage Classes</p>
              <p className="text-sm text-gray-500">Add or edit classes</p>
            </div>
          </a>
          <a
            href="/admin/data-import"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <FaUsers className="text-purple-600 text-xl" />
            <div>
              <p className="font-medium text-gray-900">Import Data</p>
              <p className="text-sm text-gray-500">Bulk upload students</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
