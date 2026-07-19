import { apiClient } from './client';

export const authApi = {
  /** Customer login — calls the customer-only endpoint */
  login: async (credentials: Record<string, string>) => {
    const res = await apiClient.post('/api/users/login/', credentials);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message =
        body?.detail ||
        body?.non_field_errors?.[0] ||
        'Login failed. Please check your credentials.';
      throw new Error(message);
    }
    return res.json();
  },

  /** Admin login — calls the admin-only endpoint */
  adminLogin: async (credentials: Record<string, string>) => {
    const res = await apiClient.post('/api/users/admin/login/', credentials);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message =
        body?.detail ||
        body?.non_field_errors?.[0] ||
        'Admin login failed. Please check your credentials.';
      throw new Error(message);
    }
    return res.json();
  },

  register: async (data: Record<string, string>) => {
    const res = await apiClient.post('/api/users/register/', data);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message =
        body?.email?.[0] ||
        body?.password?.[0] ||
        body?.detail ||
        'Registration failed. Please try again.';
      throw new Error(message);
    }
    return res.json();
  },

  logout: async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      await apiClient.post('/api/users/logout/', { refresh });
    }
  },
};
