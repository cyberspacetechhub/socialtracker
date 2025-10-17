import { useRecommendations } from '../hooks/useRecommendations';
import { markRecommendationAsRead } from '../services/recommendationService';
import { useQueryClient } from '@tanstack/react-query';
import RecommendationCard from './RecommendationCard';

export default function RecommendationPanel() {
  const { recommendations } = useRecommendations();
  const queryClient = useQueryClient();

  const handleDismiss = async (recommendationId) => {
    try {
      await markRecommendationAsRead(recommendationId);
      queryClient.invalidateQueries(['recommendations']);
    } catch (error) {
      console.error('Failed to dismiss recommendation:', error);
    }
  };

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        💡 Recommendations for You
      </h3>
      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation._id}
            recommendation={recommendation}
            onDismiss={handleDismiss}
          />
        ))}
      </div>
    </div>
  );
}