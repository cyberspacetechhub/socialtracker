import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRecommendations } from '../services/recommendationService';

export const useRecommendations = () => {
  const queryClient = useQueryClient();

  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations().then(res => res.data.recommendations),
    refetchInterval: 60000, // Refresh every minute
    refetchIntervalInBackground: true,
    enabled: !!localStorage.getItem('token')
  });

  return { 
    recommendations,
    refetch: () => queryClient.invalidateQueries(['recommendations'])
  };
};