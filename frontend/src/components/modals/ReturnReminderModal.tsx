import React, { useState } from 'react';
import { SwapItem } from '../../types';

interface ReturnReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SwapItem | null;
  onOpenMessage: (name: string) => void;
  isDarkMode?: boolean;
}

export const ReturnReminderModal: React.FC<ReturnReminderModalProps> = ({
  isOpen,
  onClose,
  item,
  onOpenMessage,
  isDarkMode = false,
}) => {
  if (!isOpen || !item) return null;

  const defaultMsg1 = `أهلاً أخي ${item.borrowerName}، تذكير لطيف بأن موعد إرجاع (${item.title}) غداً (${item.dueDate}). متى يناسبك الاستلام بالحارة؟`;
  const defaultMsg2 = `السلام عليكم، أود التنسيق معك لإرجاع (${item.title}) بحالة ممتازة كما استلمتها. أين تفضل اللقاء؟`;
  const defaultMsg3 = `أهلاً جاري الطيب، أرجو تحديد وقت مناسب غداً لاستلام السلعة لردها وإتاحتها لباقي الجيران.`;

  const [selectedPreset, setSelectedPreset] = useState<string>(defaultMsg1);
  const [customMsg, setCustomMsg] = useState<string>(defaultMsg1);
  const [isSent, setIsSent] = useState<boolean>(false);

  const handleSelectPreset = (msg: string) => {
    setSelectedPreset(msg);
    setCustomMsg(msg);
  };

  const handleSendReminder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      onOpenMessage(item.borrowerName);
      setIsSent(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex flex-col overflow-hidden transition-colors ${
          isDarkMode
            ? 'bg-[#142017] border border-slate-800 text-slate-100'
            : 'bg-white border border-[#bfcaba] text-[#181d17]'
        }`}
      >
        {/* Background Decorative Blur */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        {isSent ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-2xl flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <span className="material-symbols-outlined text-3xl">send</span>
            </div>
            <h3 className="font-bold text-lg text-[#181d17] dark:text-slate-100">
              تم إرسال تذكير الإرجاع بنجاح! ⏰
            </h3>
            <p className="text-xs text-[#707a6c] dark:text-slate-400">
              جاري فتح نافذة المحادثة المباشرة مع الجار {item.borrowerName} للتنسيق...
            </p>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <header className="flex items-center justify-between pb-3 border-b border-[#bfcaba]/40 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                  ⏰
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#181d17] dark:text-slate-100 flex items-center gap-1.5">
                    <span>تذكير إرجاع السلعة</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                      الموعد غداً
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#707a6c] dark:text-slate-400">
                    التنسيق مع الجار لإعادة الأداة في الموعد المحدد
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </header>

            {/* Item Details Summary Card */}
            <div className="my-3.5 p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl flex items-center gap-3">
              <img
                src={item.image}
                alt={item.title}
                className="w-14 h-14 rounded-xl object-cover border border-amber-300/60 shrink-0"
              />
              <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="font-bold text-xs sm:text-sm text-[#181d17] dark:text-slate-100 truncate">
                  {item.title}
                </h4>
                <div className="text-[11px] text-[#40493d] dark:text-slate-300 font-medium">
                  الطرف الآخر: <span className="font-bold">{item.borrowerName}</span>
                </div>
                <div className="text-[10px] text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">event</span>
                  <span>تاريخ الاستحقاق: {item.dueDate} (متبقي يوم واحد)</span>
                </div>
              </div>
            </div>

            {/* Quick Preset Messages */}
            <form onSubmit={handleSendReminder} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#40493d] dark:text-slate-300">
                  اختر رسالة تنسيق جاهزة أو اكتب رسالتك:
                </label>
                <div className="space-y-1.5">
                  {[
                    { label: 'تذكير ودّي بالموعد 🤝', text: defaultMsg1 },
                    { label: 'جاهزية الإرجاع والحالة 🧼', text: defaultMsg2 },
                    { label: 'تحديد وقت ومكان التسليم 📍', text: defaultMsg3 },
                  ].map((preset, idx) => {
                    const isSelected = selectedPreset === preset.text;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset.text)}
                        className={`w-full text-right p-2.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-amber-100/80 border-amber-400 text-amber-950 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-200 font-bold shadow-2xs'
                            : isDarkMode
                            ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                            : 'bg-white border-[#bfcaba]/60 text-[#40493d] hover:bg-[#f7fbf0]'
                        }`}
                      >
                        <div className="text-[11px] font-extrabold text-amber-800 dark:text-amber-300 mb-0.5">
                          {preset.label}
                        </div>
                        <div className="line-clamp-2 leading-relaxed">{preset.text}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editable Message Field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#707a6c] dark:text-slate-400">
                  تعديل نص الرسالة للمحادثة:
                </label>
                <textarea
                  rows={3}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full p-2.5 border border-[#bfcaba] dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 text-[#181d17] dark:text-slate-100 outline-none focus:border-amber-500 font-medium resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-[#f1f5eb] dark:bg-slate-800 text-[#40493d] dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">schedule_send</span>
                  <span>إرسال التنسيق للمحادثة 💬</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
