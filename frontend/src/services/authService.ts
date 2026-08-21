import apiClient from './apiClient';

export interface UserProfile {
  id?: string;
  name: string;
  phone: string;
  city: string;
  neighborhood: string;
  userType?: string;
  avatar?: string;
  isLoggedIn?: boolean;
}

export const setToken = (token: string) => {
  localStorage.setItem('haretna_token', token);
};

export const getToken = () => {
  return localStorage.getItem('haretna_token');
};

export const removeToken = () => {
  localStorage.removeItem('haretna_token');
};

export const AuthService = {
  register: async (data: any) => {
    const res = await apiClient.post('/auth/register', data);
    if (res.data.token) {
      setToken(res.data.token);
    }
    return res.data;
  },

  login: async (data: any) => {
    const res = await apiClient.post('/auth/login', data);
    if (res.data.token) {
      setToken(res.data.token);
    }
    return res.data;
  },

  getProfile: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  logout: () => {
    removeToken();
  }
};
