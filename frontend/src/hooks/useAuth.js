import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, token, fetchProfile } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token && !user) {
        try {
          await fetchProfile();
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
      setIsInitializing(false);
    };
    
    initAuth();
  }, [token, user, fetchProfile]);

  return {
    user,
    isAuthenticated: !!token,
    isLoading: isInitializing || (token && !user)
  };
}