import { AlertTriangle, ArrowRight } from 'lucide-react';

export const AlertsPanel = ({ alerts }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          High-Risk Alerts
        </h3>
        <span className="text-sm text-gray-500">
          Top {alerts.length}
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">{alert.avatar}</span>
              <div>
                <p className="font-medium text-gray-900">
                  {alert.name}
                </p>
                <p className="text-sm text-gray-500">
                  {alert.class} • Last: {alert.lastIntervention}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  alert.riskLevel === 'High'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}
              >
                {alert.riskLevel}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
        View All Students
      </button>
    </div>
  );
};
