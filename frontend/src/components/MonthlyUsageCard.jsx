import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { PLATFORMS } from '../config/api';

export default function MonthlyUsageCard() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  const { data: monthlyUsage = {}, isLoading } = useQuery({
    queryKey: ['monthlyUsage', selectedMonth],
    queryFn: async () => {
      const [year, month] = selectedMonth.split('-');
      const response = await api.get(`/activity/monthly/${year}/${month}`);
      return response.data;
    }
  });

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTotalMonthlyUsage = () => {
    return Object.values(monthlyUsage).reduce((total, usage) => total + (usage.duration || 0), 0);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📊 Monthly Usage</h3>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
        <p className="text-purple-100 text-sm">Total Monthly Usage</p>
        <p className="text-2xl font-bold">{formatTime(getTotalMonthlyUsage())}</p>
      </div>

      <div className="space-y-3">
        {Object.entries(PLATFORMS).map(([key, platform]) => {
          const usage = monthlyUsage[key] || { duration: 0, sessions: 0 };
          return (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{platform.name}</p>
                  <p className="text-xs text-gray-500">{usage.sessions} sessions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatTime(usage.duration)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}