import { useState } from 'react';
import { FunnelIcon, ClockIcon, CalendarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useActivityHistory } from '../../services/queries';
import { clearActivity } from '../../services/api';
import { PLATFORMS } from '../../config/api';

export default function ActivityPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClearing, setIsClearing] = useState(false);
  
  const { data: activityData, isLoading, refetch } = useActivityHistory(
    currentPage, 
    selectedPlatform || null
  );

  const handleClearActivity = async () => {
    if (!confirm('Are you sure you want to clear all activity data? This action cannot be undone.')) {
      return;
    }
    
    setIsClearing(true);
    try {
      await clearActivity();
      refetch();
      alert('All activity data cleared successfully!');
    } catch (error) {
      alert('Failed to clear activity data. Please try again.');
    }
    setIsClearing(false);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activities = activityData?.activities || [];
  const totalPages = activityData?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-white mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">Activity History</h1>
                <p className="text-green-100 mt-1">Track your social media sessions</p>
              </div>
            </div>
            <div className="text-right text-white">
              <p className="text-sm opacity-90">Total Sessions</p>
              <p className="text-2xl font-bold">{activities.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedPlatform}
                onChange={(e) => {
                  setSelectedPlatform(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Platforms</option>
                {Object.entries(PLATFORMS).map(([key, platform]) => (
                  <option key={key} value={key}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>
            
            {activities.length > 0 && (
              <button
                onClick={handleClearActivity}
                disabled={isClearing}
                className="flex items-center px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                {isClearing ? 'Clearing...' : 'Clear All Activity'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activity found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedPlatform 
                ? `No sessions recorded for ${PLATFORMS[selectedPlatform]?.name}`
                : 'Start using social media to see your activity here'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activities.map((activity, index) => {
              const platform = PLATFORMS[activity.platform];
              const isActive = !activity.endTime;
              
              return (
                <div key={activity._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: platform?.color }}
                      >
                        {platform?.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {platform?.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>
                              {formatTime(activity.startTime)}
                              {activity.endTime && ` - ${formatTime(activity.endTime)}`}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>{formatDate(activity.startTime)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatDuration(activity.duration)}
                        </span>
                        {isActive && (
                          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            Active
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Session #{activities.length - index}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}