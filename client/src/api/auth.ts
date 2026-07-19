import { apiClient } from './client';

export const authApi = {
  login: async (credentials: Record<string, string>) => {
    const res = await apiClient.post('/api/users/login/', credentials);
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
  
  register: async (data: Record<string, string>) => {
    const res = await apiClient.post('/api/users/register/', data);
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },
  
  logout: async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      await apiClient.post('/api/users/logout/', { refresh });
    }
  }
};
