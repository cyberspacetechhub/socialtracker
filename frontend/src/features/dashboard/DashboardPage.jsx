import { ClockIcon, ChartBarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useDailyUsage, useProfile } from '../../services/queries';
import { useNotifications } from '../../hooks/useNotifications';
import UsageChart from '../../components/charts/UsageChart';
import { PLATFORMS } from '../../config/api';

export default function DashboardPage() {
  const today = new Date().toISOString().split('T')[0];
  const { data: dailyUsage = {}, isLoading } = useDailyUsage(today);
  const { data: user } = useProfile();
  
  // Enable notifications
  useNotifications();

  const getTotalUsage = () => {
    return Object.values(dailyUsage).reduce((total, usage) => total + (usage.duration || 0), 0);
  };

  const getUsageStatus = (platform, duration) => {
    const limit = user?.limits?.[platform] || 60;
    const percentage = (duration / limit) * 100;
    
    if (percentage >= 100) return { color: 'text-red-600', bg: 'bg-red-500', status: 'Exceeded' };
    if (percentage >= 80) return { color: 'text-yellow-600', bg: 'bg-yellow-500', status: 'Warning' };
    return { color: 'text-green-600', bg: 'bg-green-500', status: 'Good' };
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalUsage = getTotalUsage();
  const exceededPlatforms = Object.entries(PLATFORMS).filter(([key]) => {
    const usage = dailyUsage[key] || { duration: 0 };
    const limit = user?.limits?.[key] || 60;
    return usage.duration >= limit;
  });

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 mr-3" />
            <div>
              <p className="text-blue-100 text-sm">Total Usage Today</p>
              <p className="text-2xl font-bold">{formatTime(totalUsage)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3" />
            <div>
              <p className="text-green-100 text-sm">Active Sessions</p>
              <p className="text-2xl font-bold">
                {Object.values(dailyUsage).reduce((total, usage) => total + (usage.sessions || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`bg-gradient-to-r rounded-xl p-6 text-white ${
          exceededPlatforms.length > 0 
            ? 'from-red-500 to-red-600' 
            : 'from-gray-500 to-gray-600'
        }`}>
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 mr-3" />
            <div>
              <p className={`text-sm ${
                exceededPlatforms.length > 0 ? 'text-red-100' : 'text-gray-100'
              }`}>Limits Exceeded</p>
              <p className="text-2xl font-bold">{exceededPlatforms.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(PLATFORMS).map(([key, platform]) => {
          const usage = dailyUsage[key] || { duration: 0, sessions: 0 };
          const limit = user?.limits?.[key] || 60;
          const status = getUsageStatus(key, usage.duration);
          const percentage = Math.min((usage.duration / limit) * 100, 100);
          
          return (
            <div key={key} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-500">{usage.sessions} sessions</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status.status === 'Exceeded' ? 'bg-red-100 text-red-800' :
                    status.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {status.status}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Usage</span>
                    <span className={`font-semibold ${status.color}`}>
                      {formatTime(usage.duration)} / {formatTime(limit)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${status.bg}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>{Math.round(percentage)}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Usage Chart */}
      <UsageChart data={dailyUsage} type="daily" />
    </div>
  );
}