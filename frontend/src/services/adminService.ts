import apiClient from './apiClient';

export interface AdminUser {
  id: string;
  name: string;
  phone: string | null;
  status: 'active' | 'blocked' | string;
  warnings: number;
  userType?: string;
}

export interface AdminTicket {
  id: string;
  type: string;
  message: string;
  status: 'open' | 'resolved' | string;
  createdAt?: string;
  user: {
    name: string;
    phone?: string;
  };
}

export interface AdminInitiative {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryLabel?: string;
  date: string;
  time?: string;
  location: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | string;
  organizer: {
    id: string;
    name: string;
    phone?: string | null;
    avatar?: string | null;
  };
  _count?: {
    participants: number;
  };
}

export const AdminService = {
  getUsers: async (): Promise<AdminUser[]> => {
    const res = await apiClient.get<AdminUser[]>('/admin/users');
    return res.data;
  },

  warnUser: async (id: string): Promise<AdminUser> => {
    const res = await apiClient.patch<AdminUser>(`/admin/users/${id}/warn`);
    return res.data;
  },

  blockUser: async (id: string): Promise<AdminUser> => {
    const res = await apiClient.patch<AdminUser>(`/admin/users/${id}/block`);
    return res.data;
  },

  activateUser: async (id: string): Promise<AdminUser> => {
    const res = await apiClient.patch<AdminUser>(`/admin/users/${id}/activate`);
    return res.data;
  },

  promoteUser: async (id: string): Promise<AdminUser> => {
    const res = await apiClient.patch<AdminUser>(`/admin/users/${id}/promote`);
    return res.data;
  },

  getTickets: async (): Promise<AdminTicket[]> => {
    const res = await apiClient.get<AdminTicket[]>('/admin/tickets');
    return res.data;
  },

  resolveTicket: async (id: string): Promise<AdminTicket> => {
    const res = await apiClient.patch<AdminTicket>(`/admin/tickets/${id}/resolve`);
    return res.data;
  },

  getInitiatives: async (): Promise<AdminInitiative[]> => {
    const res = await apiClient.get<AdminInitiative[]>('/admin/initiatives');
    return res.data;
  },

  approveInitiative: async (id: string): Promise<AdminInitiative> => {
    const res = await apiClient.patch<AdminInitiative>(`/admin/initiatives/${id}/approve`);
    return res.data;
  },

  rejectInitiative: async (id: string): Promise<AdminInitiative> => {
    const res = await apiClient.patch<AdminInitiative>(`/admin/initiatives/${id}/reject`);
    return res.data;
  },
};
