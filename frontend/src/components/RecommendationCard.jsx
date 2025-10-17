import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function RecommendationCard({ recommendation, onDismiss }) {
  const getIcon = (type) => {
    switch (type) {
      case 'motivational':
        return '🎉';
      case 'wellness_tip':
        return '💡';
      case 'break_suggestion':
        return '⏰';
      case 'goal_setting':
        return '🎯';
      default:
        return '📝';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'motivational':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'wellness_tip':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'break_suggestion':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'goal_setting':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`rounded-lg p-4 border ${getColor(recommendation.type)} mb-3`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">{getIcon(recommendation.type)}</span>
            <h4 className="font-medium">{recommendation.title}</h4>
          </div>
          <p className="text-sm opacity-90">{recommendation.message}</p>
        </div>
        <button
          onClick={() => onDismiss(recommendation._id)}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}