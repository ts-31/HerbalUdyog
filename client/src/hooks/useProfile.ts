import { useState, useEffect } from 'react';
import { usersApi, UserProfile } from '../api/users';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await usersApi.getProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const updatedProfile = await usersApi.updateProfile(data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      throw err;
    }
  };

  return { profile, loading, error, updateProfile };
};
