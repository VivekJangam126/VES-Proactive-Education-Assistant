import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import RiskSummaryCards from '../../components/admin/analytics/RiskSummaryCards';
import TrendPlaceholder from '../../components/admin/analytics/TrendPlaceholder';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">High-level insights for admin oversight</p>
      </div>

      {/* Risk Distribution */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h2>
        <RiskSummaryCards riskDistribution={analytics?.riskDistribution} />
      </div>

      {/* Attendance Trend */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trend</h2>
        <TrendPlaceholder
          title="7-Day Attendance Trend"
          data={analytics?.attendanceTrend}
          type="attendance"
        />
      </div>

      {/* Improvement Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Improvement Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">
              {analytics?.improvementRate || 0}%
            </div>
            <p className="text-sm text-gray-600 mt-2">Overall Improvement Rate</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">
              {analytics?.totalStudents || 0}
            </div>
            <p className="text-sm text-gray-600 mt-2">Students Monitored</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600">
              {analytics?.activeClasses || 0}
            </div>
            <p className="text-sm text-gray-600 mt-2">Active Classes</p>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> These are high-level system insights. For detailed student analytics, 
          navigate to the Student Overview page.
        </p>
      </div>
    </div>
  );
}

export default Analytics;
