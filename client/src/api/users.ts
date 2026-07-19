import { apiClient } from './client';

export interface UserProfile {
  id: number;
  email: string;
  role: 'admin' | 'customer';
  first_name: string;
  last_name: string;
  phone_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export const usersApi = {
  getProfile: async () => {
    const res = await apiClient.get('/api/users/profile/');
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json() as Promise<UserProfile>;
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const res = await apiClient.patch('/api/users/profile/', data);
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json() as Promise<UserProfile>;
  }
};
