const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API call helper with auth header
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, umkmData: any) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, umkmData }),
    }),

  registerAdmin: (email: string, password: string, adminKey: string) =>
    apiCall('/auth/register-admin', {
      method: 'POST',
      body: JSON.stringify({ email, password, adminKey }),
    }),

  getMe: () => apiCall('/auth/me'),
};

// UMKM API
export const umkmAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string; kota?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return apiCall(`/umkm?${queryParams}`);
  },

  getById: (id: string) => apiCall(`/umkm/${id}`),

  getMy: () => apiCall('/umkm/my/profile'),

  update: (id: string, data: any) =>
    apiCall(`/umkm/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall(`/umkm/${id}`, {
      method: 'DELETE',
    }),
};

// Product API
export const productAPI = {
  getByUMKM: (umkmId: string) => apiCall(`/products/umkm/${umkmId}`),

  getById: (id: string) => apiCall(`/products/${id}`),

  create: (data: any) =>
    apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// Admin API
export const adminAPI = {
  getAllUMKM: (params?: { status?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return apiCall(`/admin/umkm?${queryParams}`);
  },

  getPending: () => apiCall('/admin/umkm/pending'),

  approve: (id: string) =>
    apiCall(`/admin/umkm/${id}/approve`, {
      method: 'PUT',
    }),

  reject: (id: string) =>
    apiCall(`/admin/umkm/${id}/reject`, {
      method: 'PUT',
    }),

  getStats: () => apiCall('/admin/stats'),
};
