import { useState, useEffect } from 'react';
import { productsApi, Product, PaginatedResponse } from '../api/products';

export const useProducts = (params: Record<string, any> = {}) => {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Stringify params to use as dependency array to avoid infinite loops
  const paramsString = JSON.stringify(params);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productsApi.getProducts(JSON.parse(paramsString));
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [paramsString]);

  return { data, loading, error };
};
