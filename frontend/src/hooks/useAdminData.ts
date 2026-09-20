import { useState, useCallback } from 'react';
import { AdminService, AdminUser, AdminTicket, AdminInitiative } from '../services/adminService';
import { useToast } from '../contexts/ToastContext';

export function useAdminData() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [initiatives, setInitiatives] = useState<AdminInitiative[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const { showSuccess, showError } = useToast();

  const setButtonLoading = (key: string, isLoading: boolean) => {
    setActionLoading((prev) => ({ ...prev, [key]: isLoading }));
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersData, ticketsData, initsData] = await Promise.all([
        AdminService.getUsers(),
        AdminService.getTickets(),
        AdminService.getInitiatives(),
      ]);
      setUsers(usersData);
      setTickets(ticketsData);
      setInitiatives(initsData);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
      showError('تعذر تحميل بيانات الإدارة، يرجى إعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const warnUser = async (id: string) => {
    const actionKey = `warn-${id}`;
    setButtonLoading(actionKey, true);
    try {
      const updated = await AdminService.warnUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, warnings: updated.warnings } : u)));
      showSuccess('تم توجيه إنذار للمستخدم بنجاح ⚠️');
    } catch (error) {
      console.error('Failed to warn user', error);
      showError('فشل توجيه الإنذار للمستخدم.');
    } finally {
      setButtonLoading(actionKey, false);
    }
  };

  const blockUser = async (id: string) => {
    const actionKey = `block-${id}`;
    setButtonLoading(actionKey, true);
    try {
      await AdminService.blockUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'blocked' } : u)));
      showSuccess('تم حظر المستخدم بنجاح 🚫');
    } catch (error) {
      console.error('Failed to block user', error);
      showError('فشل حظر المستخدم.');
    } finally {
      setButtonLoading(actionKey, false);
    }
  };

  const activateUser = async (id: string) => {
    const actionKey = `activate-${id}`;
    setButtonLoading(actionKey, true);
    try {
      await AdminService.activateUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'active' } : u)));
      showSuccess('تم تفعيل حساب المستخدم بنجاح ✅');
    } catch (error) {
      console.error('Failed to activate user', error);
      showError('فشل تفعيل حساب المستخدم.');
    } finally {
      setButtonLoading(actionKey, false);
    }
  };

  const promoteUser = async (id: string) => {
    const actionKey = `promote-${id}`;
    setButtonLoading(actionKey, true);
    try {
      await AdminService.promoteUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, userType: 'committee' } : u)));
      showSuccess('تم ترقية المستخدم إلى عضو لجنة حي بنجاح 👑');
    } catch (error) {
      console.error('Failed to promote user', error);
      showError('فشل ترقية المستخدم.');
    } finally {
      setButtonLoading(actionKey, false);
    }
  };

  const resolveTicket = async (id: string) => {
    const actionKey = `resolve-${id}`;
    setButtonLoading(actionKey, true);
    try {
      await AdminService.resolveTicket(id);
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'resolved' } : t)));
      showSuccess('تم تحديد تذكرة الدعم كمحلولة ✅');
      fetchData();
    } catch (error) {
      console.error('Failed to resolve ticket', error);
      showError('فشل تحديث حالة التذكرة.');
    } finally {
      setButtonLoading(actionKey, false);
    }
  };

  const approveInitiative = async (id: string) => {
    const actionKey = `approve-init-${id}`;
    setButtonLoading(actionKey, true);
    try {
      await AdminService.approveInitiative(id);
      setInitiatives((prev) => prev.map((init) => (init.id === id ? { ...init, status: 'ACTIVE' } : init)));
      showSuccess('تم اعتماد ونشر المبادرة المجتمعية بنجاح 🎉');
    } catch (error) {
      console.error('Failed to approve initiative', error);
      showError('فشل اعتماد المبادرة المجتمعية.');
    } finally {
      setButtonLoading(actionKey, false);
    }
  };

  const rejectInitiative = async (id: string) => {
    const actionKey = `reject-init-${id}`;
    setButtonLoading(actionKey, true);
    try {
      await AdminService.rejectInitiative(id);
      setInitiatives((prev) => prev.map((init) => (init.id === id ? { ...init, status: 'COMPLETED' } : init)));
      showSuccess('تم رفض أو إنهاء المبادرة.');
    } catch (error) {
      console.error('Failed to reject initiative', error);
      showError('فشل إجراء رفض المبادرة.');
    } finally {
      setButtonLoading(actionKey, false);
    }
  };

  return {
    users,
    tickets,
    initiatives,
    loading,
    actionLoading,
    fetchData,
    warnUser,
    blockUser,
    activateUser,
    promoteUser,
    resolveTicket,
    approveInitiative,
    rejectInitiative,
  };
}
