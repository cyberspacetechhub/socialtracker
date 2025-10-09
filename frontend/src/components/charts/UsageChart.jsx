import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PLATFORMS } from '../../config/api';

export default function UsageChart({ data, type = 'daily' }) {
  const chartData = Object.entries(data).map(([platform, usage]) => ({
    platform: PLATFORMS[platform]?.name || platform,
    duration: usage.duration || 0,
    sessions: usage.sessions || 0
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {type === 'daily' ? 'Daily Usage' : 'Weekly Usage'}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="platform" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} minutes`, 'Duration']} />
          <Bar dataKey="duration" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}