import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const RiskTrendChart = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        30-Day Risk Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#999"
          />
          <YAxis tick={{ fontSize: 12 }} stroke="#999" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => `${value} students`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="highRisk"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="High Risk"
          />
          <Line
            type="monotone"
            dataKey="mediumRisk"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            name="Medium Risk"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
