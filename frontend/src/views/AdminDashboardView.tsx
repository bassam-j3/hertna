import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../hooks/useAdminData';
import { useAuth } from '../contexts/AuthContext';
import UserManagementTable from '../components/admin/UserManagementTable';
import TicketsInbox from '../components/admin/TicketsInbox';
import InitiativesModerationTable from '../components/admin/InitiativesModerationTable';

type AdminTab = 'overview' | 'users' | 'initiatives' | 'tickets';

/**
 * لوحة تحكم اللجنة (Admin Dashboard)
 * 
 * واجهة إدارة شاملة ومحمية لأعضاء لجنة الحي والمشرفين.
 * تتضمن شريط جانبي متجاوب للهواتف والحواسيب، وإدارة المستخدمين،
 * واعتماد المبادرات المجتمعية، ومتابعة تذاكر الدعم الفني.
 */
export default function AdminDashboardView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const {
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
  } = useAdminData();

  const { currentUser, isLoading } = useAuth();

  // حماية المسار (Route Guard): إذا لم يكن المستخدم "لجنة" أو "مشرف"، يتم توجيهه للرئيسية
  useEffect(() => {
    if (isLoading) return;
    if (!currentUser || (currentUser.userType !== 'committee' && currentUser.userType !== 'admin')) {
      navigate('/');
      return;
    }
    fetchData();
  }, [navigate, fetchData, currentUser, isLoading]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8faf7] dark:bg-[#0a0a0a] text-[#181d17] dark:text-white rtl gap-3">
        <div className="w-10 h-10 border-4 border-[#0d631b] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-sm">جاري تحميل لوحة تحكم اللجنة...</p>
      </div>
    );
  }

  // حساب الإحصائيات العامة للـ Overview
  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;
  const activeUsersCount = users.filter((u) => u.status !== 'blocked').length;
  const pendingInitsCount = initiatives.filter((i) => i.status !== 'ACTIVE' && i.status !== 'COMPLETED').length;
  const activeInitsCount = initiatives.filter((i) => i.status === 'ACTIVE').length;
  const totalWarnings = users.reduce((acc, curr) => acc + (curr.warnings || 0), 0);

  const navItems = [
    {
      id: 'overview' as AdminTab,
      label: 'نظرة عامة وإحصائيات',
      icon: 'dashboard',
      badge: null,
    },
    {
      id: 'users' as AdminTab,
      label: 'إدارة الجيران',
      icon: 'group',
      badge: `${users.length}`,
    },
    {
      id: 'initiatives' as AdminTab,
      label: 'اعتماد المبادرات',
      icon: 'volunteer_activism',
      badge: pendingInitsCount > 0 ? `${pendingInitsCount} بانتظار الاعتماد` : null,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    },
    {
      id: 'tickets' as AdminTab,
      label: 'صندوق تذاكر الدعم',
      icon: 'mark_email_unread',
      badge: openTicketsCount > 0 ? `${openTicketsCount} مفتوحة` : null,
      badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf7] dark:bg-[#0a0a0a] text-[#181d17] dark:text-white rtl flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#121212] border-b border-[#bfcaba]/40 dark:border-[#333] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#222] rounded-xl"
            aria-label="القائمة الجانبية"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <div className="flex items-center gap-1.5 font-black text-lg text-[#0d631b] dark:text-emerald-400">
            <span className="material-symbols-outlined">security</span>
            <span>لوحة اللجنة</span>
          </div>
        </div>
        <button
          onClick={() => fetchData()}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] rounded-xl flex items-center gap-1 text-xs font-bold"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          <span>تحديث</span>
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop Persistent + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 right-0 h-screen w-72 bg-white dark:bg-[#121212] border-l border-[#bfcaba]/40 dark:border-[#262626] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#bfcaba]/30 dark:border-[#262626]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#0d631b] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <div>
                <h1 className="font-black text-base leading-tight text-[#181d17] dark:text-white">لجنة الحي</h1>
                <p className="text-[11px] text-[#707a6c] dark:text-gray-400 font-semibold">حارتنا • دمشق</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-[#0d631b] text-white shadow-sm'
                      : 'text-[#40493d] dark:text-gray-300 hover:bg-[#f1f5eb] dark:hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-gray-200 dark:bg-[#333] text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#bfcaba]/30 dark:border-[#262626] bg-[#f8faf7] dark:bg-[#0e0e0e]">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0d631b]/20 text-[#0d631b] dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                {currentUser?.name?.slice(0, 1) || 'ع'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#181d17] dark:text-white truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-[#0d631b] dark:text-emerald-400 font-semibold">عضو معتمد باللجنة</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 px-3 bg-white dark:bg-[#1e1e1e] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] border border-[#bfcaba]/40 dark:border-[#333] text-[#40493d] dark:text-gray-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span>العودة للصفحة الرئيسية</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Header with Title & Refresh */}
        <div className="hidden md:flex items-center justify-between pb-2 border-b border-[#bfcaba]/30 dark:border-[#222]">
          <div>
            <h1 className="text-2xl font-black text-[#181d17] dark:text-white">
              {activeTab === 'overview' && 'لوحة المعلومات والإحصائيات'}
              {activeTab === 'users' && 'إدارة الجيران وسجلات المستخدمين'}
              {activeTab === 'initiatives' && 'اعتماد وإدارة المبادرات المجتمعية'}
              {activeTab === 'tickets' && 'صندوق معالجة تذاكر الدعم الفني'}
            </h1>
            <p className="text-xs text-[#707a6c] dark:text-gray-400 mt-1">
              متابعة أنشطة الحي، حماية الأمان والثقة، وضمان جودة الخدمات التطوعية
            </p>
          </div>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-white dark:bg-[#181818] hover:bg-gray-50 dark:hover:bg-[#222] border border-[#bfcaba]/60 dark:border-[#333] rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-all"
          >
            <span className="material-symbols-outlined text-base text-[#0d631b] dark:text-emerald-400">sync</span>
            <span>تحديث البيانات</span>
          </button>
        </div>

        {/* Tab 1: Overview & KPI Stats */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-[#bfcaba]/50 dark:border-[#2a2a2a] shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#707a6c] dark:text-gray-400 mb-2">
                  <span className="text-xs font-bold">إجمالي الجيران</span>
                  <span className="material-symbols-outlined text-xl text-[#0d631b]">group</span>
                </div>
                <div className="text-2xl font-black text-[#181d17] dark:text-white">{users.length}</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                  {activeUsersCount} حساب نشط
                </div>
              </div>

              <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-[#bfcaba]/50 dark:border-[#2a2a2a] shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#707a6c] dark:text-gray-400 mb-2">
                  <span className="text-xs font-bold">المبادرات المجتمعية</span>
                  <span className="material-symbols-outlined text-xl text-blue-600">volunteer_activism</span>
                </div>
                <div className="text-2xl font-black text-[#181d17] dark:text-white">{initiatives.length}</div>
                <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-semibold">
                  {activeInitsCount} مبادرة نشطة حالياً
                </div>
              </div>

              <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-[#bfcaba]/50 dark:border-[#2a2a2a] shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#707a6c] dark:text-gray-400 mb-2">
                  <span className="text-xs font-bold">تذاكر الدعم الفني</span>
                  <span className="material-symbols-outlined text-xl text-amber-600">contact_support</span>
                </div>
                <div className="text-2xl font-black text-[#181d17] dark:text-white">{tickets.length}</div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">
                  {openTicketsCount} تذكرة مفتوحة
                </div>
              </div>

              <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-[#bfcaba]/50 dark:border-[#2a2a2a] shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#707a6c] dark:text-gray-400 mb-2">
                  <span className="text-xs font-bold">الإنذارات الموجهة</span>
                  <span className="material-symbols-outlined text-xl text-red-600">warning</span>
                </div>
                <div className="text-2xl font-black text-[#181d17] dark:text-white">{totalWarnings}</div>
                <div className="text-[11px] text-red-600 dark:text-red-400 mt-1 font-semibold">
                  لحماية حسن الجوار
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Initiatives Needs Review */}
              <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-[#bfcaba]/40 dark:border-[#2a2a2a] space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-sm text-[#181d17] dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0d631b]">notification_important</span>
                    <span>مبادرات بانتظار الاعتماد</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('initiatives')}
                    className="text-xs text-[#0d631b] dark:text-emerald-400 font-bold hover:underline"
                  >
                    عرض الكل
                  </button>
                </div>

                <div className="space-y-2">
                  {initiatives.filter((i) => i.status !== 'ACTIVE' && i.status !== 'COMPLETED').slice(0, 3).map((init) => (
                    <div
                      key={init.id}
                      className="p-3 bg-[#f8faf7] dark:bg-[#191919] rounded-xl flex items-center justify-between border border-[#bfcaba]/30 dark:border-[#333]"
                    >
                      <div>
                        <p className="font-bold text-xs text-[#181d17] dark:text-white">{init.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">من: {init.organizer?.name} • {init.date}</p>
                      </div>
                      <button
                        onClick={() => approveInitiative(init.id)}
                        className="px-2.5 py-1 bg-[#0d631b] text-white rounded-lg text-xs font-bold"
                      >
                        اعتماد
                      </button>
                    </div>
                  ))}
                  {initiatives.filter((i) => i.status !== 'ACTIVE' && i.status !== 'COMPLETED').length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-4">لا توجد مبادرات معلقة حالياً</p>
                  )}
                </div>
              </div>

              {/* Open Support Tickets */}
              <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-[#bfcaba]/40 dark:border-[#2a2a2a] space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-sm text-[#181d17] dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600">inbox</span>
                    <span>تذاكر الدعم المفتوحة</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('tickets')}
                    className="text-xs text-[#0d631b] dark:text-emerald-400 font-bold hover:underline"
                  >
                    عرض الكل
                  </button>
                </div>

                <div className="space-y-2">
                  {tickets.filter((t) => t.status === 'open').slice(0, 3).map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3 bg-[#f8faf7] dark:bg-[#191919] rounded-xl flex items-center justify-between border border-[#bfcaba]/30 dark:border-[#333]"
                    >
                      <div className="min-w-0 flex-1 pl-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded">
                          {ticket.type}
                        </span>
                        <p className="text-xs text-gray-700 dark:text-gray-300 truncate mt-1">{ticket.message}</p>
                      </div>
                      <button
                        onClick={() => resolveTicket(ticket.id)}
                        className="px-2.5 py-1 bg-emerald-100 text-[#0d631b] rounded-lg text-xs font-bold shrink-0"
                      >
                        حل
                      </button>
                    </div>
                  ))}
                  {tickets.filter((t) => t.status === 'open').length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-4">جميع تذاكر الدعم محلولة بنجاح</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users Management */}
        {activeTab === 'users' && (
          <UserManagementTable
            users={users}
            warnUser={warnUser}
            blockUser={blockUser}
            activateUser={activateUser}
            promoteUser={promoteUser}
            actionLoading={actionLoading}
          />
        )}

        {/* Tab 3: Initiatives Moderation */}
        {activeTab === 'initiatives' && (
          <InitiativesModerationTable
            initiatives={initiatives}
            approveInitiative={approveInitiative}
            rejectInitiative={rejectInitiative}
            actionLoading={actionLoading}
          />
        )}

        {/* Tab 4: Tickets Inbox */}
        {activeTab === 'tickets' && (
          <TicketsInbox
            tickets={tickets}
            resolveTicket={resolveTicket}
            actionLoading={actionLoading}
          />
        )}
      </main>
    </div>
  );
}
