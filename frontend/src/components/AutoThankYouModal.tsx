import React, { useState } from 'react';
import { SwapItem } from '../types';

interface AutoThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SwapItem | null;
  onConfirmWithThankYou: (item: SwapItem, thankYouMessage: string) => void;
  isDarkMode?: boolean;
}

export const AutoThankYouModal: React.FC<AutoThankYouModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmWithThankYou,
  isDarkMode = false,
}) => {
  if (!isOpen || !item) return null;

  const isAnonymousNeighbor = item.borrowerName.includes('مجهول');
  const neighborDisplayName = isAnonymousNeighbor
    ? 'الجار العزيز (هوية محمية 🛡️)'
    : item.borrowerName;

  const quickTemplates = [
    {
      id: 'friendly',
      label: '💚 رسالة ودّية وتقدير',
      text: `ألف شكر يا أخي العزيز ${item.borrowerName} على حسن التعاون وإعارة/تقديم [${item.title}]. تسلم الأيادي وبارك الله فيك وفي رزقك! ✨`,
    },
    {
      id: 'blessing',
      label: '🤲 دعاء بالبركة والخير',
      text: `جزاك الله كل خير يا جارنا الفاضل على تعاملك الطيب وتأمين [${item.title}]. أسأل الله أن يبارك لك في أهلك وبيتك ودام التكافل بيننا 🌸`,
    },
    {
      id: 'reciprocal',
      label: '🤝 شكر ومبادلة المساعدة',
      text: `شكراً جزيلاً ${item.borrowerName}! تم استلام [${item.title}] بحالة ممتازة، ويسعدني دائماً تقديم أي خدمة أو غرض تحتاجه من بيتي في أي وقت! 🤝`,
    },
  ];

  const [messageText, setMessageText] = useState(quickTemplates[0].text);
  const [selectedTemplate, setSelectedTemplate] = useState('friendly');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectTemplate = (id: string, text: string) => {
    setSelectedTemplate(id);
    setMessageText(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      onConfirmWithThankYou(item, messageText);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1300);
    }, 500);
  };

  const handleSkipMessage = () => {
    onConfirmWithThankYou(item, '');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={onClose}>
      {/* Main Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex flex-col overflow-hidden transition-colors ${
          isDarkMode
            ? 'bg-[#142017] border border-slate-800 text-slate-100'
            : 'bg-white border border-[#bfcaba] text-[#181d17]'
        }`}
      >
        {isSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-[#0d631b] dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <span className="material-symbols-outlined text-4xl">mark_email_read</span>
            </div>
            <h3 className="font-extrabold text-xl sm:text-2xl text-[#181d17] dark:text-slate-100">
              تم إرسال رسالة الشكر التلقائية! 💌
            </h3>
            <p className="text-xs sm:text-sm text-[#707a6c] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              شكراً لتعزيزك ثقافة التعاون والمودة بين أهالي حي الروضة.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <header className="px-5 py-4 bg-gradient-to-r from-[#0d631b] to-emerald-800 text-white flex items-center justify-between shrink-0 shadow-sm relative overflow-hidden">
              <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
                  <span className="material-symbols-outlined text-2xl text-white">volunteer_activism</span>
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">إرسال رسالة شكر تلقائية 💌</h3>
                  <p className="text-xs text-emerald-100 font-medium">تعزيز ثقافة الشكر والتعاون بين الجيران</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors relative z-10"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </header>

            {/* Content Body */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Item & Neighbor context banner */}
              <div className="bg-[#f1f5eb] dark:bg-slate-900/80 p-3.5 rounded-2xl border border-[#bfcaba]/60 dark:border-slate-800 flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-emerald-600/40"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-[#0d631b] dark:text-emerald-400 block mb-0.5">
                    تأكيد استلام الغرض:
                  </span>
                  <h4 className="font-bold text-sm truncate text-[#181d17] dark:text-slate-100">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#707a6c] dark:text-slate-400">
                    المستلم / الجار: <strong className="text-[#181d17] dark:text-slate-200">{neighborDisplayName}</strong>
                  </p>
                </div>
              </div>

              {/* Template Selectors */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#181d17] dark:text-slate-200">
                  اختر نموذج رسالة الشكر التلقائية:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {quickTemplates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectTemplate(t.id, t.text)}
                      className={`text-right p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                        selectedTemplate === t.id
                          ? 'bg-[#0d631b]/10 dark:bg-emerald-950/60 border-[#0d631b] dark:border-emerald-500 text-[#0d631b] dark:text-emerald-300 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:border-emerald-300'
                      }`}
                    >
                      <span>{t.label}</span>
                      {selectedTemplate === t.id && (
                        <span className="material-symbols-outlined text-base text-[#0d631b] dark:text-emerald-400">
                          check_circle
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Message Textarea */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-[#181d17] dark:text-slate-200">
                    محتوى رسالة الشكر الموجهة للجار:
                  </label>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    يمكنك التعديل عليها بحرية
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="اكتب كلمة شكر ودية للجار..."
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-[#bfcaba] dark:border-slate-700 rounded-2xl text-xs font-medium leading-relaxed outline-none focus:border-[#0d631b] dark:focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Notice Banner */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg shrink-0 mt-0.5">
                  favorite
                </span>
                <p className="text-[11px] text-amber-900 dark:text-amber-200 font-medium leading-snug">
                  تساعد رسائل الشكر التلقائية على تعزيز التكافل الاجتماعي، وتقوية أواصر الجيرة الطيبة والتطوع المستمر في الحي.
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full sm:flex-1 py-3 px-4 bg-[#0d631b] hover:bg-[#16501f] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  <span>إرسال رسالة الشكر وتأكيد الاستلام 💌</span>
                </button>
                <button
                  type="button"
                  onClick={handleSkipMessage}
                  className="w-full sm:w-auto px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  تأكيد بدون رسالة
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
