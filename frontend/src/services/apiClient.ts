import axios from 'axios';
import { Post, CommunityInitiative, SwapItem, Rating, NotificationItem, ItemAlert } from '../types';

/**
 * Base URL for the backend API, securely pulled from environment variables.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Axios instance pre-configured with the base URL and standard headers.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token for secure endpoints
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('haretna_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle unauthorized errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized! Logging out...');
      localStorage.removeItem('haretna_token');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

/**
 * Service to handle Community Posts (Loans, Gifts, Urgent Needs).
 */
export const PostsService = {
  getAll: (): Promise<Post[]> => apiClient.get('/posts').then(res => res.data),
  getById: (id: string): Promise<Post> => apiClient.get(`/posts/${id}`).then(res => res.data),
  create: (data: Partial<Post>): Promise<Post> => apiClient.post('/posts', data).then(res => res.data),
  update: (id: string, data: Partial<Post>): Promise<Post> => apiClient.patch(`/posts/${id}`, data).then(res => res.data),
  delete: (id: string): Promise<{ success: boolean }> => apiClient.delete(`/posts/${id}`).then(res => res.data),
};

/**
 * Service to manage local Community Initiatives and voluntary campaigns.
 */
export const InitiativesService = {
  getAll: (category?: string): Promise<CommunityInitiative[]> => {
    const query = category ? `?category=${category}` : '';
    return apiClient.get(`/initiatives${query}`).then(res => res.data);
  },
  getById: (id: string): Promise<CommunityInitiative> => apiClient.get(`/initiatives/${id}`).then(res => res.data),
  create: (data: Partial<CommunityInitiative>): Promise<CommunityInitiative> => apiClient.post('/initiatives', data).then(res => res.data),
  update: (id: string, data: Partial<CommunityInitiative>): Promise<CommunityInitiative> => apiClient.patch(`/initiatives/${id}`, data).then(res => res.data),
  delete: (id: string): Promise<{ success: boolean }> => apiClient.delete(`/initiatives/${id}`).then(res => res.data),
  join: (id: string): Promise<{ success: boolean }> => apiClient.post(`/initiatives/${id}/join`).then(res => res.data),
};

/**
 * Service to orchestrate tracking of borrowed and lent items.
 */
export const SwapsService = {
  getAll: (): Promise<SwapItem[]> => apiClient.get('/swaps').then(res => res.data),
  getById: (id: string): Promise<SwapItem> => apiClient.get(`/swaps/${id}`).then(res => res.data),
  create: (data: Partial<SwapItem>): Promise<SwapItem> => apiClient.post('/swaps', data).then(res => res.data),
  update: (id: string, data: Partial<SwapItem>): Promise<SwapItem> => apiClient.patch(`/swaps/${id}`, data).then(res => res.data),
  delete: (id: string): Promise<{ success: boolean }> => apiClient.delete(`/swaps/${id}`).then(res => res.data),
};

/**
 * Service to manage trust and reliability ratings among neighbors.
 */
export const RatingsService = {
  create: (data: Partial<Rating>): Promise<Rating> => apiClient.post('/ratings', data).then(res => res.data),
};

/**
 * Service for neighbor item alerts (wishlist tracking).
 */
export const AlertsService = {
  getAll: (): Promise<ItemAlert[]> => apiClient.get('/alerts').then(res => res.data),
  create: (data: Partial<ItemAlert>): Promise<ItemAlert> => apiClient.post('/alerts', data).then(res => res.data),
  delete: (id: string): Promise<{ success: boolean }> => apiClient.delete(`/alerts/${id}`).then(res => res.data),
};

/**
 * Service to manage asynchronous system and neighbor notifications.
 */
export const NotificationsService = {
  getAll: (): Promise<NotificationItem[]> => apiClient.get('/notifications').then(res => res.data),
  create: (data: Partial<NotificationItem>): Promise<NotificationItem> => apiClient.post('/notifications', data).then(res => res.data),
  markAsRead: (id: string): Promise<NotificationItem> => apiClient.patch(`/notifications/${id}/read`).then(res => res.data),
  markAllAsRead: (): Promise<{ success: boolean }> => apiClient.patch('/notifications/read-all').then(res => res.data),
  delete: (id: string): Promise<{ success: boolean }> => apiClient.delete(`/notifications/${id}`).then(res => res.data),
  deleteAll: (): Promise<{ success: boolean }> => apiClient.delete('/notifications/all').then(res => res.data),
};

export const UsersService = {
  updateProfile: (data: Record<string, unknown>): Promise<any> => apiClient.patch('/users/me', data).then(res => res.data),
};

export default apiClient;

// Legacy support for older components
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const method = options.method || 'GET';
  let data = undefined;
  if (options.body) {
    try {
      data = typeof options.body === 'string' ? JSON.parse(options.body as string) : options.body;
    } catch {
      data = options.body;
    }
  }
  const response = await apiClient({
    url,
    method,
    data,
    headers: options.headers as any,
  });
  return response.data;
}