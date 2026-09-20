import React from 'react';
import { AdminUser } from '../../services/adminService';

interface UserManagementTableProps {
  users: AdminUser[];
  warnUser: (id: string) => void;
  blockUser: (id: string) => void;
  activateUser: (id: string) => void;
  promoteUser: (id: string) => void;
  actionLoading?: Record<string, boolean>;
}

export default function UserManagementTable({
  users,
  warnUser,
  blockUser,
  activateUser,
  promoteUser,
  actionLoading = {},
}: UserManagementTableProps) {
  return (
    <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-[#bfcaba] dark:border-[#333] overflow-hidden">
      <div className="p-4 border-b border-[#bfcaba]/40 dark:border-[#333] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0d631b] dark:text-emerald-400">group</span>
          <h2 className="font-bold text-base text-[#181d17] dark:text-white">سجل الجيران والمستخدمين</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-[#0d631b] dark:text-emerald-400 rounded-lg">
          إجمالي المستخدمين: {users.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-[#f1f5eb] dark:bg-[#1a1a1a] border-b border-[#bfcaba] dark:border-[#333]">
            <tr>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">الاسم</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">رقم الهاتف</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">الدور والصفة</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">الحالة</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">الإنذارات</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isWarnLoading = !!actionLoading[`warn-${user.id}`];
              const isBlockLoading = !!actionLoading[`block-${user.id}`];
              const isActivateLoading = !!actionLoading[`activate-${user.id}`];
              const isPromoteLoading = !!actionLoading[`promote-${user.id}`];
              const isAnyLoading = isWarnLoading || isBlockLoading || isActivateLoading || isPromoteLoading;

              return (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 dark:border-[#222] last:border-0 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]/50 transition-colors"
                >
                  <td className="p-4 text-[#40493d] dark:text-gray-200 font-bold">{user.name}</td>
                  <td className="p-4 text-[#40493d] dark:text-gray-200 font-mono" dir="ltr">
                    {user.phone || '-'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.userType === 'committee' || user.userType === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-[#262626] dark:text-gray-300'
                      }`}
                    >
                      {user.userType === 'committee' || user.userType === 'admin' ? '👑 عضو لجنة' : 'جار ساكن'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.status === 'blocked'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-emerald-100 text-[#0d631b] dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}
                    >
                      {user.status === 'blocked' ? 'محظور' : 'نشط'}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-amber-600 dark:text-amber-500">{user.warnings}</td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        disabled={isAnyLoading}
                        onClick={() => warnUser(user.id)}
                        className="px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {isWarnLoading ? (
                          <span className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <span>⚠️</span>
                        )}
                        <span>إنذار</span>
                      </button>

                      {user.status === 'active' ? (
                        <button
                          disabled={isAnyLoading}
                          onClick={() => blockUser(user.id)}
                          className="px-2.5 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {isBlockLoading ? (
                            <span className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <span>🚫</span>
                          )}
                          <span>حظر</span>
                        </button>
                      ) : (
                        <button
                          disabled={isAnyLoading}
                          onClick={() => activateUser(user.id)}
                          className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-[#0d631b] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {isActivateLoading ? (
                            <span className="w-3 h-3 border-2 border-[#0d631b] border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <span>✅</span>
                          )}
                          <span>تفعيل</span>
                        </button>
                      )}

                      {user.userType !== 'committee' && user.userType !== 'admin' && (
                        <button
                          disabled={isAnyLoading}
                          onClick={() => promoteUser(user.id)}
                          className="px-2.5 py-1.5 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 rounded-xl text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {isPromoteLoading ? (
                            <span className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <span>👑</span>
                          )}
                          <span>ترقية</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  لا يوجد مستخدمون مسجلون حالياً
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
