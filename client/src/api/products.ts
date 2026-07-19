import { apiClient } from './client';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  product_count?: number;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: Category;
  description: string;
  price: string;
  effective_price: string;
  discount_price: string | null;
  stock_quantity: number;
  sku: string;
  is_active: boolean;
  is_featured: boolean;
  rating: string;
  review_count: number;
  tags: string;
  images: ProductImage[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const productsApi = {
  getProducts: async (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    const query = searchParams.toString();
    const url = `/api/products/${query ? `?${query}` : ''}`;
    
    const res = await apiClient.get(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json() as Promise<PaginatedResponse<Product>>;
  },

  getProduct: async (slug: string) => {
    const res = await apiClient.get(`/api/products/${slug}/`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json() as Promise<Product>;
  },

  getCategories: async () => {
    const res = await apiClient.get('/api/products/categories/');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json() as Promise<Category[]>;
  }
};
