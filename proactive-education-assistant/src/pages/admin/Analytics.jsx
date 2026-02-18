import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import RiskSummaryCards from '../../components/admin/analytics/RiskSummaryCards';
import TrendPlaceholder from '../../components/admin/analytics/TrendPlaceholder';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const impactSnapshots = [
    {
      label: "Attendance",
      before: 72,
      after: 84,
      unit: "%",
    },
    {
      label: "Assessment Avg",
      before: 61,
      after: 69,
      unit: "%",
    },
    {
      label: "Behavior Flags",
      before: 18,
      after: 9,
      unit: "cases",
      invert: true,
    },
  ];
  const interventionImpact = [
    {
      type: "Home Visits",
      uplift: "+12% attendance",
      students: 24,
      trend: "Up",
    },
    {
      type: "Mentoring",
      uplift: "+8% grades",
      students: 36,
      trend: "Up",
    },
    {
      type: "Counseling",
      uplift: "-30% flags",
      students: 15,
      trend: "Down",
    },
  ];

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const result = await adminService.getAdminAnalytics();
    if (result.success) {
      setAnalytics(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className=" rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Analytics Dashboard</h1>
          <p className="text-indigo-100 text-sm sm:text-base md:text-lg">Real-time insights and performance metrics</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {[
            {
              label: 'Students Monitored',
              value: analytics?.totalStudents || 0,
              icon: '👥',
              bgColor: 'bg-blue-50',
              borderColor: 'border-blue-500'
            },
            {
              label: 'Active Classes',
              value: analytics?.activeClasses || 0,
              icon: '📚',
              bgColor: 'bg-purple-50',
              borderColor: 'border-purple-500'
            },
            {
              label: 'Improvement Rate',
              value: `${analytics?.improvementRate || 0}%`,
              icon: '📈',
              bgColor: 'bg-green-50',
              borderColor: 'border-green-500'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} border-l-4 ${stat.borderColor} rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2 line-clamp-2">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="text-3xl sm:text-4xl opacity-60 flex-shrink-0">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Distribution Section */}
        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Risk Distribution</h2>
            <p className="text-gray-600 text-sm sm:text-base">Student risk assessment breakdown across all classes</p>
          </div>
          <RiskSummaryCards riskDistribution={analytics?.riskDistribution} />
        </div>

        {/* Attendance Trend Section */}
        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Attendance Trend</h2>
            <p className="text-gray-600 text-sm sm:text-base">Weekly attendance pattern analysis</p>
          </div>
          <TrendPlaceholder
            title="7-Day Attendance Trend"
            data={analytics?.attendanceTrend}
            type="attendance"
          />
        </div>

        {/* Intervention Impact (Before / After) */}
        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Intervention Impact</h2>
            <p className="text-gray-600 text-sm sm:text-base">Before/after comparison for key outcomes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {impactSnapshots.map((item) => {
              const delta = item.after - item.before;
              const positive = item.invert ? delta < 0 : delta > 0;
              return (
                <div key={item.label} className="border border-gray-100 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-3">{item.label}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Before</span>
                    <span>After</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-bold text-gray-900">{item.before}{item.unit}</span>
                    <span className="text-lg font-bold text-gray-900">{item.after}{item.unit}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-2 ${positive ? "bg-emerald-500" : "bg-red-500"}`}
                      style={{ width: `${Math.min(Math.abs(delta) * 4, 100)}%` }}
                    ></div>
                  </div>
                  <p className={`mt-2 text-xs font-semibold ${positive ? "text-emerald-600" : "text-red-600"}`}>
                    {positive ? "+" : ""}{delta}{item.unit} change
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-800 mb-3">Impact by intervention type</p>
            <div className="space-y-3">
              {interventionImpact.map((item) => (
                <div key={item.type} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-gray-100 rounded-lg p-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.type}</p>
                    <p className="text-xs text-gray-500">Students covered: {item.students}</p>
                  </div>
                  <div className="text-sm font-semibold text-indigo-600">{item.uplift}</div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.trend === "Up" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                    Trend {item.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-6">
          {[
            { label: 'High Risk Students', value: analytics?.riskDistribution?.high || 0, color: 'text-red-600' },
            { label: 'Medium Risk', value: analytics?.riskDistribution?.medium || 0, color: 'text-yellow-600' },
            { label: 'Low Risk', value: analytics?.riskDistribution?.low || 0, color: 'text-green-600' },
            { label: 'System Health', value: '98%', color: 'text-blue-600' }
          ].map((metric, index) => (
            <div key={index} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-sm border border-gray-100 hover:border-gray-300 transition-colors duration-300">
              <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2 sm:mb-3 line-clamp-2">{metric.label}</p>
              <p className={`text-2xl sm:text-3xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="text-xl sm:text-2xl flex-shrink-0">ℹ️</div>
            <div className="flex-1 min-w-0">
              <p className="text-indigo-900 font-semibold mb-1 text-sm sm:text-base">About This Dashboard</p>
              <p className="text-indigo-800 text-xs sm:text-sm leading-relaxed">
                These are high-level system insights providing a quick overview of system performance and student risk assessment. 
                For detailed student analytics and individual progress tracking, navigate to the Student Overview page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
