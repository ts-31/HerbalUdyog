import { apiClient } from './client';

export interface Address {
  id: number;
  label: string;
  full_name: string;
  phone_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type AddressInput = Omit<Address, 'id' | 'created_at' | 'updated_at'>;

export const addressesApi = {
  list: async () => {
    const res = await apiClient.get('/api/users/addresses/');
    if (!res.ok) throw new Error('Failed to fetch addresses');
    const data = await res.json();
    return (Array.isArray(data) ? data : data.results || []) as Address[];
  },

  create: async (data: Partial<AddressInput>) => {
    const res = await apiClient.post('/api/users/addresses/', data);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create address');
    }
    return res.json() as Promise<Address>;
  },

  update: async (id: number, data: Partial<AddressInput>) => {
    const res = await apiClient.patch(`/api/users/addresses/${id}/`, data);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update address');
    }
    return res.json() as Promise<Address>;
  },

  remove: async (id: number) => {
    const res = await apiClient.delete(`/api/users/addresses/${id}/`);
    if (!res.ok) throw new Error('Failed to delete address');
  },
};
