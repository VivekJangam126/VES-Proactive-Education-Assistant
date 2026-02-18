import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

import { useTeacher } from "../../context/TeacherContext";
import StatCard from "../../components/StatCard";
import RiskBadge from "../../components/RiskBadge";
import { riskService } from "../../services/riskService";
import { classService } from "../../services/classService";
import {
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
  FaArrowRight,
  FaWifi,
  FaInfoCircle,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const { teacher, selectedClass, setSelectedClass } = useTeacher();

  // State management
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline] = useState(true);

  // Fetch teacher's assigned classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const classData = await classService.getClasses();
        // Use teacher context for assigned classes (like StudentListPage)
        let assignedClassIds = [];
        if (teacher && teacher.assignedClasses) {
          assignedClassIds = teacher.assignedClasses.map(String);
        }
        const filteredClasses = classData.filter(cls => assignedClassIds.includes(String(cls._id)));
        setClasses(filteredClasses);
        if (filteredClasses?.length > 0) {
          const initial = filteredClasses[0]._id;
          setSelectedClassId(initial);
          if (!selectedClass) {
            setSelectedClass(initial);
          }
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, teacher]);

  // Fetch class risk data when selected class changes
  useEffect(() => {
    if (!selectedClassId) return;

    const fetchClassRisk = async () => {
      try {
        setLoading(true);
        const data = await riskService.getClassRisk(selectedClassId);

        setRiskData(data);
        setStats({
          total: data.summary?.total || 0,
          high: data.summary?.high || 0,
          medium: data.summary?.medium || 0,
          low: data.summary?.low || 0,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching class risk:', err);
        setError('Failed to load risk data. Please try again.');
        setRiskData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClassRisk();
  }, [selectedClassId, token]);

  // Filter high-risk students from risk data
  const highRiskStudents = riskData?.risks
    ?.filter((item) => item.risk?.riskLevel === 'HIGH')
    ?.slice(0, 5) || [];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* 1️⃣ Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("dashboard.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <button
            onClick={() => navigate('/pricing')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>🚀</span>
            <span>Start Free Trial</span>
            <FaArrowRight className="text-sm" />
          </button>
        </div>

        {/* Class Selector */}
        {classes.length > 1 && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Class
            </label>
            <select
              value={selectedClassId || ''}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <FaExclamationCircle className="text-red-600 dark:text-red-400 text-lg mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">Error</h3>
              <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* No Classes State */}
        {!loading && classes.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center max-w-md">
              <FaInfoCircle className="text-6xl text-gray-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Classes Assigned
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You don't have any classes assigned yet. Please contact your administrator to get started.
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-blue-500 mb-3 mx-auto" />
              <p className="text-gray-600 dark:text-gray-400">Loading class risk data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* 2️⃣ Risk Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title={t("dashboard.total_students")}
                value={stats.total}
                icon={FaUsers}
                bgColor="bg-blue-100"
                textColor="text-blue-600"
              />
              <StatCard
                title={t("dashboard.high_risk")}
                value={stats.high}
                icon={FaExclamationTriangle}
                bgColor="bg-red-100"
                textColor="text-red-600"
              />
              <StatCard
                title={t("dashboard.medium_risk")}
                value={stats.medium}
                icon={FaExclamationTriangle}
                bgColor="bg-yellow-100"
                textColor="text-yellow-600"
              />
              <StatCard
                title={t("dashboard.low_risk")}
                value={stats.low}
                icon={FaCheckCircle}
                bgColor="bg-green-100"
                textColor="text-green-600"
              />
            </div>

        {/* Risk Trend Graph */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Risk Analysis Trend</h2>
                <p className="text-sm text-gray-600 mt-1">Student risk levels over the past 5 months</p>
              </div>
              <FaChartLine className="text-2xl text-blue-600" />
            </div>
          </div>

          {highRiskStudents.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {highRiskStudents.map((item) => (
                <div
                  key={item.student?.id}
                  className="px-6 py-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.student?.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Risk Score: {item.risk?.score}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {item.risk?.explanation}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiskBadge level={item.risk?.riskLevel?.toLowerCase()} />
                      <button
                        onClick={() => navigate(`/students/${item.student?.id}`)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-700
                                   text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors
                                   font-medium text-sm"
                      >
                        <FaEye />
                        <span className="hidden sm:inline">
                          {t("dashboard.view_profile")}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Low Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4️⃣ Primary Action */}
        <div className="bg-linear-to-r from-blue-500 to-teal-500 dark:from-blue-600 dark:to-teal-600 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="text-xl font-bold mb-1">
                {t("dashboard.view_all_title")}
              </h3>
              <p className="text-blue-100 dark:text-blue-200 text-sm">
                {t("dashboard.view_all_subtitle")}
              </p>
            </div>
            <button
              onClick={() => navigate("/students")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              View All
            </button>
          </div>

          {highRiskStudents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                <FaCheckCircle className="text-3xl text-green-600" />
              </div>
              <p className="text-gray-600">
                No high-risk students currently
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Student</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Class</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Attendance</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Risk Level</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {highRiskStudents.slice(0, 5).map(student => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{student.class}</td>
                      <td className="px-6 py-4 text-gray-600">{student.attendance}%</td>
                      <td className="px-6 py-4">
                        <RiskBadge level={student.riskLevel} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <FaEye />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">
            {title}
          </p>
          <p className="text-3xl font-semibold text-gray-900">
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <div className="text-xl">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
