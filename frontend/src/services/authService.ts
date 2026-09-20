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

export interface LoginDto {
  phone: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  phone: string;
  password: string;
  city?: string;
  neighborhood?: string;
  userType?: string;
  lat?: number;
  lng?: number;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
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
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    if (res.data.token) {
      setToken(res.data.token);
    }
    return res.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    if (res.data.token) {
      setToken(res.data.token);
    }
    return res.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const res = await apiClient.get<UserProfile>('/auth/me');
    return res.data;
  },

  logout: () => {
    removeToken();
  }
};
