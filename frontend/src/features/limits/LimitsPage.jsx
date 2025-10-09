import { useForm } from 'react-hook-form';
import { ClockIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useProfile, useUpdateLimits } from '../../services/queries';
import { PLATFORMS } from '../../config/api';
import toast from 'react-hot-toast';

export default function LimitsPage() {
  const { data: user, isLoading: profileLoading } = useProfile();
  const updateLimits = useUpdateLimits();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: user?.limits || {}
  });

  const watchedValues = watch();

  const onSubmit = async (data) => {
    try {
      await updateLimits.mutateAsync(data);
      toast.success('Limits updated successfully!');
    } catch (error) {
      toast.error('Failed to update limits');
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getRecommendedLimit = (platform) => {
    const recommendations = {
      facebook: 30,
      twitter: 20,
      instagram: 45,
      tiktok: 60,
      linkedin: 30,
      youtube: 90
    };
    return recommendations[platform] || 60;
  };

  if (profileLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
          <div className="flex items-center">
            <AdjustmentsHorizontalIcon className="h-8 w-8 text-white mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-white">Daily Time Limits</h1>
              <p className="text-indigo-100 mt-1">Set healthy boundaries for your social media usage</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(PLATFORMS).map(([key, platform]) => {
              const currentValue = watchedValues[key] || user?.limits?.[key] || 60;
              const recommended = getRecommendedLimit(key);
              const isOverRecommended = currentValue > recommended * 1.5;
              
              return (
                <div key={key} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-3"
                        style={{ backgroundColor: platform.color }}
                      >
                        {platform.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                        <p className="text-sm text-gray-500">Recommended: {formatTime(recommended)}</p>
                      </div>
                    </div>
                    {isOverRecommended && (
                      <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        High
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Daily limit
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          {...register(key, { 
                            required: 'Limit is required',
                            min: { value: 5, message: 'Minimum 5 minutes' },
                            max: { value: 1440, message: 'Maximum 24 hours' },
                            valueAsNumber: true
                          })}
                          type="number"
                          min="5"
                          max="1440"
                          step="5"
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                        />
                        <span className="text-sm text-gray-500">min</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatTime(currentValue)}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">per day</span>
                    </div>
                    
                    {/* Quick preset buttons */}
                    <div className="flex space-x-2">
                      {[15, 30, 60, 120].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            const event = { target: { name: key, value: preset } };
                            register(key).onChange(event);
                          }}
                          className={`px-2 py-1 text-xs rounded ${
                            currentValue === preset
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {formatTime(preset)}
                        </button>
                      ))}
                    </div>
                    
                    {errors[key] && (
                      <p className="text-sm text-red-600">{errors[key].message}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Tips for healthy social media usage:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Set realistic limits based on your daily schedule</li>
                  <li>Use the recommended limits as a starting point</li>
                  <li>Enable notifications to stay aware of your usage</li>
                  <li>Take regular breaks every 30 minutes</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                Object.keys(PLATFORMS).forEach(key => {
                  const event = { target: { name: key, value: getRecommendedLimit(key) } };
                  register(key).onChange(event);
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Use Recommended
            </button>
            <button
              type="submit"
              disabled={updateLimits.isLoading}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
            >
              {updateLimits.isLoading ? 'Saving...' : 'Save Limits'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}