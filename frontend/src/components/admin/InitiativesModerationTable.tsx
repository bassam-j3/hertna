import React from 'react';
import { AdminInitiative } from '../../services/adminService';

interface InitiativesModerationTableProps {
  initiatives: AdminInitiative[];
  approveInitiative: (id: string) => void;
  rejectInitiative: (id: string) => void;
  actionLoading: Record<string, boolean>;
}

export default function InitiativesModerationTable({
  initiatives,
  approveInitiative,
  rejectInitiative,
  actionLoading,
}: InitiativesModerationTableProps) {
  return (
    <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-[#bfcaba] dark:border-[#333] overflow-hidden">
      <div className="p-4 border-b border-[#bfcaba]/40 dark:border-[#333] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0d631b] dark:text-emerald-400">volunteer_activism</span>
          <h2 className="font-bold text-base text-[#181d17] dark:text-white">إدارة واعتماد المبادرات المجتمعية</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-[#0d631b] dark:text-emerald-400 rounded-lg">
          إجمالي المبادرات: {initiatives.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-[#f1f5eb] dark:bg-[#1a1a1a] border-b border-[#bfcaba] dark:border-[#333]">
            <tr>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">المبادرة</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">المُنظّم</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">الموعد والمكان</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">المشاركون</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">الحالة</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {initiatives.map((init) => {
              const isApproveLoading = !!actionLoading[`approve-init-${init.id}`];
              const isRejectLoading = !!actionLoading[`reject-init-${init.id}`];
              const isAnyLoading = isApproveLoading || isRejectLoading;

              return (
                <tr
                  key={init.id}
                  className="border-b border-gray-100 dark:border-[#222] last:border-0 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-bold text-[#181d17] dark:text-white">{init.title}</div>
                    <div className="text-xs text-[#707a6c] dark:text-gray-400 line-clamp-1 mt-0.5">
                      {init.description}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-[#40493d] dark:text-gray-200">
                      {init.organizer?.name || 'غير معروف'}
                    </div>
                    {init.organizer?.phone && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 ltr text-right font-mono">
                        {init.organizer.phone}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-semibold text-[#181d17] dark:text-gray-200">
                      {init.date} {init.time ? `(${init.time})` : ''}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span>{init.location || 'دمشق'}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-[#0d631b] dark:text-emerald-400">
                    {init._count?.participants || 0} مشارك
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        init.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-[#0d631b] dark:bg-emerald-900/40 dark:text-emerald-300'
                          : init.status === 'COMPLETED'
                          ? 'bg-gray-100 text-gray-700 dark:bg-[#262626] dark:text-gray-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}
                    >
                      {init.status === 'ACTIVE'
                        ? 'معتمدة ونشطة'
                        : init.status === 'COMPLETED'
                        ? 'مكتملة / مرفوضة'
                        : 'قيد المراجعة'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">
                      {init.status !== 'ACTIVE' && (
                        <button
                          disabled={isAnyLoading}
                          onClick={() => approveInitiative(init.id)}
                          className="px-3 py-1.5 bg-[#0d631b] hover:bg-[#155e1f] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
                        >
                          {isApproveLoading ? (
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                          )}
                          <span>اعتماد ونشر</span>
                        </button>
                      )}

                      {init.status !== 'COMPLETED' && (
                        <button
                          disabled={isAnyLoading}
                          onClick={() => rejectInitiative(init.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {isRejectLoading ? (
                            <span className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <span className="material-symbols-outlined text-sm">cancel</span>
                          )}
                          <span>رفض / إنهاء</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {initiatives.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-gray-400">event_busy</span>
                    <p className="font-semibold text-sm">لا توجد مبادرات مجتمعية مسجلة حالياً</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
