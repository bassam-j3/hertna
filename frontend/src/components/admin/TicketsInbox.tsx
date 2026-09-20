import React from 'react';
import { AdminTicket } from '../../services/adminService';

interface TicketsInboxProps {
  tickets: AdminTicket[];
  resolveTicket: (id: string) => void;
  actionLoading?: Record<string, boolean>;
}

export default function TicketsInbox({
  tickets,
  resolveTicket,
  actionLoading = {},
}: TicketsInboxProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tickets.map((ticket) => {
        const isLoading = !!actionLoading[`resolve-${ticket.id}`];

        return (
          <div
            key={ticket.id}
            className="bg-white dark:bg-[#121212] p-5 rounded-2xl shadow-sm border border-[#bfcaba] dark:border-[#333] flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="inline-block px-2.5 py-1 bg-[#ebefe5] dark:bg-[#222] text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg mb-2">
                    {ticket.type}
                  </span>
                  <h3 className="font-bold text-sm text-[#181d17] dark:text-white">
                    من: {ticket.user?.name || 'مستخدم'}
                  </h3>
                  {ticket.user?.phone && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono" dir="ltr">
                      {ticket.user.phone}
                    </span>
                  )}
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    ticket.status === 'open'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      : 'bg-emerald-100 text-[#0d631b] dark:bg-emerald-900/40 dark:text-emerald-300'
                  }`}
                >
                  {ticket.status === 'open' ? 'قيد المتابعة' : 'محلولة ✅'}
                </span>
              </div>
              <p className="text-sm text-[#40493d] dark:text-gray-200 bg-[#f8faf7] dark:bg-[#1a1a1a] p-3.5 rounded-xl border border-gray-100 dark:border-[#222] leading-relaxed">
                {ticket.message}
              </p>
            </div>
            {ticket.status === 'open' && (
              <button
                disabled={isLoading}
                onClick={() => resolveTicket(ticket.id)}
                className="mt-4 w-full py-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-[#0d631b] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 rounded-xl font-bold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-[#0d631b] border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-base">task_alt</span>
                )}
                <span>تحديد كمحلولة وإغلاق التذكرة</span>
              </button>
            )}
          </div>
        );
      })}
      {tickets.length === 0 && (
        <div className="col-span-2 text-center p-10 bg-white dark:bg-[#121212] rounded-2xl border border-dashed border-gray-300 dark:border-[#444] text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-gray-400">mark_email_read</span>
            <p className="font-semibold text-sm">صندوق تذاكر الدعم فارغ تماماً</p>
          </div>
        </div>
      )}
    </div>
  );
}
