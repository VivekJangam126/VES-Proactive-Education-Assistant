import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import StudentTable from '../../components/admin/students/StudentTable';
import RiskBadge from '../../components/RiskBadge';

function StudentOverview() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classFilter, setClassFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Get unique classes
  const classes = ['all', ...new Set(students.map(s => s.class))];
  const riskLevels = ['all', 'high', 'medium', 'low'];

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [classFilter, riskFilter, students]);

  const loadStudents = async () => {
    setLoading(true);
    const res = await adminService.getAllStudents();
    if (res.success) {
      setStudents(res.data);
      setFilteredStudents(res.data);
    }
    setLoading(false);
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (classFilter !== 'all') {
      filtered = filtered.filter(s => s.class === classFilter);
    }

    if (riskFilter !== 'all') {
      filtered = filtered.filter(s => s.riskLevel === riskFilter);
    }

    setFilteredStudents(filtered);
  };

  const handleStudentClick = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  // Calculate stats
  const stats = {
    total: students.length,
    high: students.filter(s => s.riskLevel === 'high').length,
    medium: students.filter(s => s.riskLevel === 'medium').length,
    low: students.filter(s => s.riskLevel === 'low').length,
    avgAttendance: students.length > 0 ? Math.round(students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length) : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Overview</h1>
        <p className="text-gray-600 mt-1">Read-only view of all students (Admin perspective)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-600">High Risk</p>
          <p className="text-2xl font-bold text-red-600">{stats.high}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Medium Risk</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Low Risk</p>
          <p className="text-2xl font-bold text-green-600">{stats.low}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Avg Attendance</p>
          <p className="text-2xl font-bold text-purple-600">{stats.avgAttendance}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Class</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>
                  {cls === 'all' ? 'All Classes' : cls}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Risk Level</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {riskLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Risk Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => { setClassFilter('all'); setRiskFilter('all'); }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Showing {filteredStudents.length} of {students.length} students
        </p>
      </div>

      {/* Student Table */}
      <StudentTable
        students={filteredStudents}
        onStudentClick={handleStudentClick}
      />

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is a read-only view. Admin cannot edit student data directly. 
          Click on a student to view their profile.
        </p>
      </div>
    </div>
  );
}

export default StudentOverview;
