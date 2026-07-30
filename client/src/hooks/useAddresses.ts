import { useState, useEffect, useCallback } from 'react';
import { addressesApi, Address, AddressInput } from '../api/addresses';
import { useAuth } from '../context/AuthContext';

export const useAddresses = () => {
  const { isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) {
      setAddresses([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await addressesApi.list();
      setAddresses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const createAddress = async (data: Partial<AddressInput>) => {
    const created = await addressesApi.create(data);
    await fetchAddresses();
    return created;
  };

  const updateAddress = async (id: number, data: Partial<AddressInput>) => {
    const updated = await addressesApi.update(id, data);
    await fetchAddresses();
    return updated;
  };

  const deleteAddress = async (id: number) => {
    await addressesApi.remove(id);
    await fetchAddresses();
  };

  const defaultAddress = addresses.find((a) => a.is_default) || addresses[0] || null;

  return {
    addresses,
    defaultAddress,
    loading,
    error,
    refetch: fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  };
};
