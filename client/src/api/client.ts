const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    const token = localStorage.getItem('access_token');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && token) {
      // Attempt token refresh
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
            return fetch(`${BASE_URL}${url}`, { ...options, headers });
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
  }

  private handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new Event('auth-logout'));
  }

  async get(url: string, options?: RequestInit) {
    return this.fetchWithAuth(url, { ...options, method: 'GET' });
  }

  async post(url: string, body?: any, options?: RequestInit) {
    return this.fetchWithAuth(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  async put(url: string, body?: any, options?: RequestInit) {
    return this.fetchWithAuth(url, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  async patch(url: string, body?: any, options?: RequestInit) {
    return this.fetchWithAuth(url, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  async delete(url: string, options?: RequestInit) {
    return this.fetchWithAuth(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
