import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useAdminData() {
  const [users, setUsers] = useState<{ id: string, name: string, phone: string, status: string, warnings: number, userType?: string }[]>([]);
  const [tickets, setTickets] = useState<{ id: string, type: string, message: string, status: string, user: { name: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, ticketsRes] = await Promise.all([
        apiClient.get('/admin/users'),
        apiClient.get('/admin/tickets'),
      ]);
      setUsers(usersRes.data);
      setTickets(ticketsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const warnUser = async (id: string) => {
    try {
      await apiClient.patch(`/admin/users/${id}/warn`);
      fetchData();
    } catch (error) {
      console.error('Failed to warn user', error);
    }
  };

  const blockUser = async (id: string) => {
    try {
      await apiClient.patch(`/admin/users/${id}/block`);
      fetchData();
    } catch (error) {
      console.error('Failed to block user', error);
    }
  };

  const activateUser = async (id: string) => {
    try {
      await apiClient.patch(`/admin/users/${id}/activate`);
      fetchData();
    } catch (error) {
      console.error('Failed to activate user', error);
    }
  };

  const resolveTicket = async (id: string) => {
    try {
      await apiClient.patch(`/admin/tickets/${id}/resolve`);
      fetchData();
    } catch (error) {
      console.error('Failed to resolve ticket', error);
    }
  };

  const promoteUser = async (id: string) => {
    // Optimistic update
    setUsers(prev => prev.map(u => u.id === id ? { ...u, userType: 'committee' } : u));
    try {
      await apiClient.patch(`/admin/users/${id}/promote`);
      // No need to fetchData immediately if optimistic update works, but we can do it to ensure sync
      fetchData();
    } catch (error) {
      console.error('Failed to promote user', error);
      // Revert on failure
      fetchData();
    }
  };

  return {
    users,
    tickets,
    loading,
    fetchData,
    warnUser,
    blockUser,
    activateUser,
    promoteUser,
    resolveTicket,
  };
}
