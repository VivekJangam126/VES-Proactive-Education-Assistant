import { OverviewCards } from '../../components/admin/dashboard/OverviewCards';
import { RiskPieChart } from '../../components/admin/dashboard/RiskPieChart';
import { RiskTrendChart } from '../../components/admin/dashboard/RiskTrendChart';
import { AlertsPanel } from '../../components/admin/dashboard/AlertsPanel';
import { useAdmin } from '../../context/AdminContext';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's your school overview.
          </p>
        </div>

        {/* Overview Cards */}
        {stats && <OverviewCards stats={stats} />}

        {/* Charts and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Risk Distribution - Takes 1 column */}
          {riskDistribution.length > 0 && (
            <div className="lg:col-span-1">
              <RiskPieChart data={riskDistribution} />
            </div>
          )}

          {/* Alerts - Takes 2 columns and spans full height */}
          {alerts.length > 0 && (
            <div className="lg:col-span-2">
              <AlertsPanel alerts={alerts} />
            </div>
          )}
        </div>

        {/* Trend Chart - Full width */}
        {riskTrendData.length > 0 && <RiskTrendChart data={riskTrendData} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
