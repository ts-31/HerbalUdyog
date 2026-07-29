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
  profile_image_url?: string;
}

export const usersApi = {
  getProfile: async () => {
    const res = await apiClient.get('/api/users/profile/');
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json() as Promise<UserProfile>;
  },

  updateProfile: async (data: Partial<UserProfile> & { profile_image?: File }) => {
    const formData = new FormData();
    
    // Add non-file fields
    Object.keys(data).forEach(key => {
      if (key !== 'profile_image' && data[key as keyof UserProfile] !== undefined) {
        formData.append(key, String(data[key as keyof UserProfile]));
      }
    });
    
    // Add file if present
    if (data.profile_image instanceof File) {
      formData.append('profile_image', data.profile_image);
    }
    
    const res = await apiClient.patch('/api/users/profile/', formData);
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json() as Promise<UserProfile>;
  }
};
