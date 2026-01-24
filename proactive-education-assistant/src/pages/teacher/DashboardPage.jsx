// import { useNavigate } from "react-router-dom";
// import { students } from "../../data/students";
// import StatCard from "../../components/StatCard";
// import RiskBadge from "../../components/RiskBadge";
// import {
//   FaUsers,
//   FaExclamationTriangle,
//   FaCheckCircle,
//   FaEye,
//   FaArrowRight,
//   FaWifi,
//   FaInfoCircle,
// } from "react-icons/fa";
// import { useState } from "react";

// export default function DashboardPage() {
//   const navigate = useNavigate();
//   const [isOnline] = useState(true); // Mock online status

//   // Calculate risk statistics
//   const stats = {
//     total: students.length,
//     highRisk: students.filter((s) => s.riskLevel === "high").length,
//     mediumRisk: students.filter((s) => s.riskLevel === "medium").length,
//     lowRisk: students.filter((s) => s.riskLevel === "low").length,
//   };

//   // Get top 5 high-risk students
//   const highRiskStudents = students
//     .filter((s) => s.riskLevel === "high")
//     .slice(0, 5);

//   return (
//     <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* 1️⃣ Page Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
//           <p className="text-gray-600">
//             Early warning overview of student dropout risk.
//           </p>
//         </div>

//         {/* 2️⃣ Risk Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <StatCard
//             title="Total Students"
//             value={stats.total}
//             icon={FaUsers}
//             bgColor="bg-blue-100"
//             textColor="text-blue-600"
//           />
//           <StatCard
//             title="High Risk"
//             value={stats.highRisk}
//             icon={FaExclamationTriangle}
//             bgColor="bg-red-100"
//             textColor="text-red-600"
//           />
//           <StatCard
//             title="Medium Risk"
//             value={stats.mediumRisk}
//             icon={FaExclamationTriangle}
//             bgColor="bg-yellow-100"
//             textColor="text-yellow-600"
//           />
//           <StatCard
//             title="Low Risk"
//             value={stats.lowRisk}
//             icon={FaCheckCircle}
//             bgColor="bg-green-100"
//             textColor="text-green-600"
//           />
//         </div>

//         {/* 3️⃣ High-Risk Students List (MOST IMPORTANT) */}
//         <div className="bg-white rounded-lg shadow-md border-2 border-red-200 mb-6">
//           <div className="bg-red-50 px-6 py-4 border-b border-red-200">
//             <div className="flex items-center gap-3">
//               <FaExclamationTriangle className="text-red-600 text-xl" />
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">
//                   Students Needing Immediate Attention
//                 </h2>
//                 <p className="text-sm text-gray-700">
//                   High-risk students require urgent intervention
//                 </p>
//               </div>
//             </div>
//           </div>

//           {highRiskStudents.length > 0 ? (
//             <div className="divide-y divide-gray-200">
//               {highRiskStudents.map((student) => (
//                 <div
//                   key={student.id}
//                   className="px-6 py-4 hover:bg-red-50 transition-colors"
//                 >
//                   <div className="flex items-center justify-between gap-4">
//                     <div className="flex-1">
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         {student.name}
//                       </h3>
//                       <div className="flex items-center gap-3 mt-1">
//                         <span className="text-sm text-gray-600">
//                           {student.class}
//                         </span>
//                         <span className="text-sm text-gray-500">
//                           Attendance: {student.attendance}%
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <RiskBadge level={student.riskLevel} />
//                       <button
//                         onClick={() => navigate(`/students/${student.id}`)}
//                         className="inline-flex items-center gap-2 px-4 py-2 bg-red-600
//                                    text-white rounded-lg hover:bg-red-700 transition-colors
//                                    font-medium text-sm"
//                       >
//                         <FaEye />
//                         <span className="hidden sm:inline">View Profile</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="px-6 py-8 text-center">
//               <FaCheckCircle className="mx-auto text-4xl text-green-500 mb-3" />
//               <p className="text-gray-600">No high-risk students at this time.</p>
//             </div>
//           )}
//         </div>

//         {/* 4️⃣ Primary Action Button */}
//         <div className="bg-linear-to-r from-blue-500 to-teal-500 rounded-lg shadow-lg p-6 mb-6">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="text-white">
//               <h3 className="text-xl font-bold mb-1">
//                 View Complete Student List
//               </h3>
//               <p className="text-blue-100 text-sm">
//                 Monitor all students and filter by risk level
//               </p>
//             </div>
//             <button
//               onClick={() => navigate("/students")}
//               className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600
//                          rounded-lg hover:bg-blue-50 transition-colors font-semibold
//                          shadow-md hover:shadow-lg"
//             >
//               View All Students
//               <FaArrowRight />
//             </button>
//           </div>
//         </div>

//         {/* 5️⃣ Offline / Sync Status */}
//         <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
//           <div className="flex items-start gap-3">
//             {isOnline ? (
//               <FaWifi className="text-blue-600 text-xl mt-0.5" />
//             ) : (
//               <FaInfoCircle className="text-gray-500 text-xl mt-0.5" />
//             )}
//             <div className="flex-1">
//               <h4 className="font-semibold text-gray-900 mb-1">
//                 {isOnline ? "Online" : "Offline Mode"}
//               </h4>
//               <p className="text-sm text-gray-700">
//                 {isOnline
//                   ? "All data is synced and up to date."
//                   : "Offline mode: Data will sync when internet is available."}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
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

        {/* 3️⃣ High-Risk Students */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-red-200 dark:border-red-800 mb-6">
          <div className="bg-red-50 dark:bg-red-900/30 px-6 py-4 border-b border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("dashboard.high_risk_section_title")}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t("dashboard.high_risk_section_subtitle")}
                </p>
              </div>
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
          ) : (
            <div className="px-6 py-8 text-center">
              <FaCheckCircle className="mx-auto text-4xl text-green-500 dark:text-green-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                {t("dashboard.no_high_risk")}
              </p>
            </div>
          )}
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-100 text-blue-600 dark:text-blue-700
                         rounded-lg hover:bg-blue-50 dark:hover:bg-white transition-colors font-semibold
                         shadow-md hover:shadow-lg"
            >
              {t("dashboard.view_all_students")}
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* 5️⃣ Offline / Sync Status */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            {isOnline ? (
              <FaWifi className="text-blue-600 dark:text-blue-400 text-xl mt-0.5" />
            ) : (
              <FaInfoCircle className="text-gray-500 dark:text-gray-400 text-xl mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {isOnline
                  ? t("dashboard.online")
                  : t("dashboard.offline")}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {isOnline
                  ? t("dashboard.online_desc")
                  : t("dashboard.offline_desc")}
              </p>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}

