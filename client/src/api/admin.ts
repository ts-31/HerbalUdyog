import { apiClient } from './client';
import { Product, Category, PaginatedResponse } from './products';

// ─── Products ────────────────────────────────────────────────────────────────

export const adminProductsApi = {
  /** Get all products (admin sees inactive too) */
  list: async (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null).map(([k, v]) => [k, String(v)])
    ).toString();
    const res = await apiClient.get(`/api/products/${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json() as Promise<PaginatedResponse<Product>>;
  },

  create: async (formData: FormData) => {
    const res = await apiClient.post('/api/products/', formData);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.detail || JSON.stringify(body) || 'Failed to create product');
    }
    return res.json() as Promise<Product>;
  },

  update: async (slug: string, formData: FormData) => {
    const res = await apiClient.patch(`/api/products/${slug}/`, formData);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.detail || JSON.stringify(body) || 'Failed to update product');
    }
    return res.json() as Promise<Product>;
  },

  delete: async (slug: string) => {
    const res = await apiClient.delete(`/api/products/${slug}/`);
    if (!res.ok) throw new Error('Failed to delete product');
  },
};

// ─── Categories ──────────────────────────────────────────────────────────────

export const adminCategoriesApi = {
  list: async () => {
    const res = await apiClient.get('/api/products/categories/');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json() as Promise<Category[]>;
  },

  create: async (data: { name: string; description?: string }) => {
    const res = await apiClient.post('/api/products/categories/', data);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.name?.[0] || body?.detail || 'Failed to create category');
    }
    return res.json() as Promise<Category>;
  },

  update: async (slug: string, data: { name?: string; description?: string }) => {
    const res = await apiClient.patch(`/api/products/categories/${slug}/`, data);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.detail || 'Failed to update category');
    }
    return res.json() as Promise<Category>;
  },

  delete: async (slug: string) => {
    const res = await apiClient.delete(`/api/products/categories/${slug}/`);
    if (!res.ok) throw new Error('Failed to delete category');
  },
};

// ─── Admin Stats ─────────────────────────────────────────────────────────────

export interface AdminStats {
  total_customers: number;
  total_orders: number;
  total_products: number;
  total_revenue: string;
}

export const adminStatsApi = {
  get: async () => {
    const res = await apiClient.get('/api/users/admin/stats/');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json() as Promise<AdminStats>;
  },
};

// ─── Orders (Admin) ──────────────────────────────────────────────────────────

export const adminOrdersApi = {
  list: async () => {
    const res = await apiClient.get('/api/orders/');
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json() as Promise<import('./orders').Order[]>;
  },

  updateStatus: async (id: number, status: string) => {
    const res = await apiClient.patch(`/api/orders/${id}/update_status/`, { status });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json() as Promise<import('./orders').Order>;
  },
};

// ─── Customers (Admin) ───────────────────────────────────────────────────────

export interface AdminCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
}

export const adminCustomersApi = {
  list: async () => {
    const res = await apiClient.get('/api/users/admin/customers/');
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json() as Promise<AdminCustomer[]>;
  },
};

// ─── Blog (Admin) ─────────────────────────────────────────────────────────────

export const adminBlogApi = {
  list: async () => {
    const res = await apiClient.get('/api/core/blog/?is_published=all');
    if (!res.ok) throw new Error('Failed to fetch blog posts');
    return res.json() as Promise<import('./core').BlogPost[]>;
  },

  create: async (data: FormData) => {
    const res = await apiClient.post('/api/core/blog/', data);
    if (!res.ok) throw new Error('Failed to create blog post');
    return res.json() as Promise<import('./core').BlogPost>;
  },

  update: async (slug: string, data: Partial<import('./core').BlogPost>) => {
    const res = await apiClient.patch(`/api/core/blog/${slug}/`, data);
    if (!res.ok) throw new Error('Failed to update blog post');
    return res.json() as Promise<import('./core').BlogPost>;
  },

  delete: async (slug: string) => {
    const res = await apiClient.delete(`/api/core/blog/${slug}/`);
    if (!res.ok) throw new Error('Failed to delete blog post');
  },
};

// ─── Contact Inquiries (Admin) ───────────────────────────────────────────────

export const adminContactApi = {
  list: async () => {
    const res = await apiClient.get('/api/core/contact/');
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return res.json() as Promise<import('./core').ContactInquiry[]>;
  },

  markResolved: async (id: number, is_resolved: boolean) => {
    const res = await apiClient.patch(`/api/core/contact/${id}/`, { is_resolved });
    if (!res.ok) throw new Error('Failed to update inquiry');
    return res.json() as Promise<import('./core').ContactInquiry>;
  },
};

// ─── Testimonials (Admin) ────────────────────────────────────────────────────

export const adminTestimonialsApi = {
  list: async () => {
    const res = await apiClient.get('/api/core/testimonials/');
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return res.json() as Promise<import('./core').Testimonial[]>;
  },

  approve: async (id: number, is_approved: boolean) => {
    const res = await apiClient.patch(`/api/core/testimonials/${id}/`, { is_approved });
    if (!res.ok) throw new Error('Failed to update testimonial');
    return res.json() as Promise<import('./core').Testimonial>;
  },

  delete: async (id: number) => {
    const res = await apiClient.delete(`/api/core/testimonials/${id}/`);
    if (!res.ok) throw new Error('Failed to delete testimonial');
  },
};

