import React from 'react';
import apiClient from '../../services/apiClient';

interface SupportTicketModalProps {
  isTicketModalOpen: boolean;
  setIsTicketModalOpen: (open: boolean) => void;
  ticketForm: { type: string; message: string };
  setTicketForm: React.Dispatch<React.SetStateAction<{ type: string; message: string }>>;
}

export default function SupportTicketModal({
  isTicketModalOpen,
  setIsTicketModalOpen,
  ticketForm,
  setTicketForm
}: SupportTicketModalProps) {
  if (!isTicketModalOpen) return null;

  return (
    <>
      {/* ================= MODAL: SUPPORT TICKET ================= */}
      <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={() => setIsTicketModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#121212] relative flex flex-col overflow-hidden text-[#181d17] dark:text-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#bfcaba] space-y-4">
            <div className="flex items-center justify-between border-b border-[#bfcaba]/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d631b] text-2xl">mail</span>
                <h3 className="font-bold text-lg text-[#181d17] dark:text-white">تواصل مع اللجنة</h3>
              </div>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await apiClient.post('/tickets', ticketForm);
                alert('تم إرسال تذكرتك بنجاح!');
                setIsTicketModalOpen(false);
                setTicketForm({ type: 'استفسار عام', message: '' });
              } catch (error) {
                console.error(error);
                alert('حدث خطأ أثناء الإرسال');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">نوع التذكرة:</label>
                <select
                  value={ticketForm.type}
                  onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value })}
                  className="w-full h-11 px-3 text-sm bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none font-bold text-[#181d17] dark:text-white"
                >
                  <option value="استفسار عام">استفسار عام</option>
                  <option value="بلاغ عن غرض أو جار">بلاغ عن غرض أو جار</option>
                  <option value="اقتراح تطويري للمنصة">اقتراح تطويري للمنصة</option>
                  <option value="مشكلة تقنية">مشكلة تقنية</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">نص الرسالة:</label>
                <textarea
                  required
                  rows={4}
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  placeholder="اكتب رسالتك للجنة هنا بوضوح..."
                  className="w-full p-3 text-sm bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none resize-none font-medium text-[#181d17] dark:text-white"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0d631b] hover:bg-[#0a4d15] text-white font-bold text-sm rounded-xl transition-colors"
                >
                  إرسال التذكرة
                </button>
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-3 bg-gray-100 dark:bg-[#222222] hover:bg-gray-200 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      
    </>
  );
}
