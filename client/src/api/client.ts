import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// URLs that should not trigger the top loading bar (background/silent requests)
const SILENT_URLS = [
  '/api/users/profile/',
  '/api/users/wishlist/',
  '/api/users/token/refresh/',
  '/api/core/testimonials/',
  '/api/core/blog/',
];

const isSilentUrl = (url: string) => SILENT_URLS.some(s => url.startsWith(s));

class ApiClient {
  private timer: ReturnType<typeof setTimeout> | null = null;

  private async fetchWithAuth(url: string, options: RequestInit = {}, silent = false) {
    const headers = new Headers(options.headers);
    const token = localStorage.getItem('access_token');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const trackProgress = !silent && !isSilentUrl(url);
    if (trackProgress) {
      if (this.timer) clearTimeout(this.timer);
      NProgress.start();
    }

    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
      });

      if (response.status === 401 && token) {
        // Attempt token refresh (always silent)
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
          try {
            const res = await fetch(`${BASE_URL}/api/users/token/refresh/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh }),
            });

            if (res.ok) {
              const data = await res.json();
              localStorage.setItem('access_token', data.access);
              
              // Retry original request
              headers.set('Authorization', `Bearer ${data.access}`);
              return await fetch(`${BASE_URL}${url}`, { ...options, headers });
            } else {
              // Refresh failed, logout
              this.handleLogout();
            }
          } catch (e) {
            this.handleLogout();
          }
        } else {
          this.handleLogout();
        }
      }
      return response;
    } finally {
      if (trackProgress) {
        this.timer = setTimeout(() => NProgress.done(), 100);
      }
    }
  }

  private handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new Event('auth-logout'));
  }

  async get(url: string, options?: RequestInit, silent = false) {
    return this.fetchWithAuth(url, { ...options, method: 'GET' }, silent);
  }

  async post(url: string, body?: any, options?: RequestInit, silent = false) {
    return this.fetchWithAuth(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }, silent);
  }

  async put(url: string, body?: any, options?: RequestInit, silent = false) {
    return this.fetchWithAuth(url, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }, silent);
  }

  async patch(url: string, body?: any, options?: RequestInit, silent = false) {
    return this.fetchWithAuth(url, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }, silent);
  }

  async delete(url: string, options?: RequestInit, silent = false) {
    return this.fetchWithAuth(url, { ...options, method: 'DELETE' }, silent);
  }
}

export const apiClient = new ApiClient();
