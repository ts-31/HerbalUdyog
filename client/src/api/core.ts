import { apiClient } from './client';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  image_url?: string;
  author_name: string;
  is_published: boolean;
  created_at: string;
}

export interface ContactInquiry {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_resolved?: boolean;
  created_at?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image?: string;
  image_url?: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

export const coreApi = {
  getBlogPosts: async () => {
    const res = await apiClient.get('/api/core/blog/');
    if (!res.ok) throw new Error('Failed to fetch blog posts');
    return res.json() as Promise<BlogPost[]>;
  },

  getBlogPost: async (slug: string) => {
    const res = await apiClient.get(`/api/core/blog/${slug}/`);
    if (!res.ok) throw new Error('Failed to fetch blog post');
    return res.json() as Promise<BlogPost>;
  },

  submitContact: async (data: ContactInquiry) => {
    const res = await apiClient.post('/api/core/contact/', data);
    if (!res.ok) throw new Error('Failed to submit contact inquiry');
    return res.json() as Promise<ContactInquiry>;
  },

  getTestimonials: async () => {
    const res = await apiClient.get('/api/core/testimonials/');
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return res.json() as Promise<Testimonial[]>;
  },

  submitTestimonial: async (data: { name: string; role?: string; content: string; rating: number }) => {
    const res = await apiClient.post('/api/core/testimonials/', data);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || 'Failed to submit testimonial');
    }
    return res.json() as Promise<Testimonial>;
  }
};
