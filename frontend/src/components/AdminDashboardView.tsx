import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../hooks/useAdminData';
import { useAuth } from '../contexts/AuthContext';
import UserManagementTable from './admin/UserManagementTable';
import TicketsInbox from './admin/TicketsInbox';

/**
 * لوحة تحكم اللجنة (السرية)
 * 
 * هذا المكون مخصص لأعضاء لجنة الحي فقط (Role-Based Access Control).
 * يسمح لهم بإدارة المستخدمين (حظر/إنذار) ومعالجة التذاكر الفنية.
 */
export default function AdminDashboardView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'tickets'>('users');
  
  const {
    users,
    tickets,
    loading,
    fetchData,
    warnUser,
    blockUser,
    activateUser,
    promoteUser,
    resolveTicket,
  } = useAdminData();

  const { currentUser, isLoading } = useAuth(); // سحب معلومات المستخدم الحالي من الكونتكست للتحقق من صلاحياته

  // حماية المسار (Route Guard): إذا لم يكن المستخدم "لجنة"، قم بتوجيهه للصفحة الرئيسية فوراً
  useEffect(() => {
    if (isLoading) return;
    if (!currentUser || (currentUser.userType !== 'committee' && currentUser.userType !== 'admin')) {
      navigate('/');
      return;
    }
    fetchData();
  }, [navigate, fetchData]);

  if (loading || isLoading) return <div className="p-8 text-center dark:text-white rtl">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#f8faf7] dark:bg-[#0a0a0a] pb-20 rtl pt-20 px-4 md:px-8 max-w-screen-xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#181d17] dark:text-white">لوحة تحكم اللجنة (السرية)</h1>
          <p className="text-sm text-[#707a6c] dark:text-gray-400">إدارة الجيران وتذاكر الدعم الفني</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${activeTab === 'users' ? 'bg-[#0d631b] text-white' : 'bg-gray-200 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300'}`}
          >
            إدارة الجيران
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${activeTab === 'tickets' ? 'bg-[#0d631b] text-white' : 'bg-gray-200 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300'}`}
          >
            صندوق الوارد ({tickets.filter(t => t.status === 'open').length})
          </button>
        </div>
      </header>

      {activeTab === 'users' && (
        <UserManagementTable 
          users={users} 
          warnUser={warnUser} 
          blockUser={blockUser} 
          activateUser={activateUser} 
          promoteUser={promoteUser}
        />
      )}

      {activeTab === 'tickets' && (
        <TicketsInbox 
          tickets={tickets} 
          resolveTicket={resolveTicket} 
        />
      )}
    </div>
  );
}
