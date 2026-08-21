import React, { useState } from 'react';

interface PrivacyPledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle: string;
  recipientName?: string;
  onAcceptPledge: () => void;
}

export const PrivacyPledgeModal: React.FC<PrivacyPledgeModalProps> = ({
  isOpen,
  onClose,
  postTitle,
  recipientName = 'أسرة متعففة بالحي',
  onAcceptPledge,
}) => {
  const [isPledged, setIsPledged] = useState(false);
  const [donorSignature, setDonorSignature] = useState('ياسين جمال');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!isPledged) return;
    onAcceptPledge();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={onClose}>
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col overflow-hidden transition-colors bg-white dark:bg-[#142017] border border-[#bfcaba] dark:border-slate-800 text-[#181d17] dark:text-slate-100"
      >
        {/* Header */}
        <header className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-[#0d631b] text-white flex items-center justify-between shrink-0 shadow-sm relative overflow-hidden">
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
              <span className="material-symbols-outlined text-2xl text-white">gavel</span>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">ميثاق الحفاظ على خصوصية المستلم 🛡️</h3>
              <p className="text-xs text-emerald-100 font-medium">وثيقة التزام إلكترونية ملزمة للمتبرع والمشارك لحماية كرامة وخصوصية المستلم</p>
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
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Urgent Need Target info */}
          <div className="bg-[#FFF3E0] dark:bg-amber-950/40 p-3.5 rounded-2xl border border-[#fc820c]/40 flex items-start gap-3">
            <span className="material-symbols-outlined text-[#fc820c] text-2xl shrink-0 mt-0.5">volunteer_activism</span>
            <div>
              <span className="text-xs font-bold text-[#964900] dark:text-amber-300 block mb-0.5">
                الاحتياج العاجل المراد مساعدته:
              </span>
              <h4 className="font-extrabold text-sm sm:text-base text-[#181d17] dark:text-slate-100 leading-snug">
                "{postTitle}"
              </h4>
              <p className="text-xs text-[#707a6c] dark:text-slate-400 mt-1">
                صاحب الحاجة: <span className="font-bold text-[#0d631b] dark:text-emerald-400">{recipientName}</span> (هوية محمية)
              </p>
            </div>
          </div>

          {/* Undertaking / Pledge terms */}
          <div className="space-y-3 bg-[#f8faf7] dark:bg-slate-900/80 p-4 rounded-2xl border border-[#bfcaba]/60 dark:border-slate-800">
            <h4 className="font-bold text-sm text-[#0d631b] dark:text-emerald-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">verified_user</span>
              <span>بنود ميثاق الحفاظ على خصوصية المستلم:</span>
            </h4>

            <div className="space-y-2.5 text-xs leading-relaxed text-[#40493d] dark:text-slate-300">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0d631b]/10 dark:bg-emerald-900/40 text-[#0d631b] dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  <strong className="text-[#181d17] dark:text-slate-100">السرية التامة:</strong> أتعهد بالامتناع التام عن كشف هوية صاحب الحاجة أو عنوانه أو ظروفه لأي شخص أو جهة أخرى داخل أو خارج التطبيق.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0d631b]/10 dark:bg-emerald-900/40 text-[#0d631b] dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  <strong className="text-[#181d17] dark:text-slate-100">احترام الكرامة:</strong> أتعهد بالتعامل بكامل اللباقة والود، والامتناع التام عن تصوير أو توثيق أي عملية تسليم للمساعدة.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0d631b]/10 dark:bg-emerald-900/40 text-[#0d631b] dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  <strong className="text-[#181d17] dark:text-slate-100">الأمانة والتكافل:</strong> أقر بأن مشاركتي هي لله والدعم المجتمعي الشريف بين أهالي الحي دون أي مقابل أو ابتزاز.
                </p>
              </div>
            </div>
          </div>

          {/* Signature / Name confirmation */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#181d17] dark:text-slate-200">
              اسم المتبرع / المساعد المتعهد:
            </label>
            <input
              type="text"
              value={donorSignature}
              onChange={(e) => setDonorSignature(e.target.value)}
              placeholder="اكتب اسمك الكامل بالتعهد"
              className="w-full h-10 px-3.5 bg-white dark:bg-slate-900 border border-[#bfcaba] dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:border-[#0d631b] transition-colors"
            />
          </div>

          {/* Mandatory Checkbox */}
          <label className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPledged}
              onChange={(e) => setIsPledged(e.target.checked)}
              className="w-5 h-5 accent-[#0d631b] rounded-md mt-0.5 shrink-0 cursor-pointer"
            />
            <span className="text-xs font-bold text-[#0d631b] dark:text-emerald-300 leading-relaxed">
              أنا ({donorSignature || 'المساعد'}), أقر وأتعهد أمام الله ثم أمام أهالي الحي بالالتزام التام ببنود حفظ سرية وكرامة صاحب الحاجة.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <footer className="p-4 bg-gray-50 dark:bg-slate-900 border-t border-[#bfcaba]/40 dark:border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isPledged}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 ${
              isPledged
                ? 'bg-[#0d631b] hover:bg-[#16501f] text-white cursor-pointer'
                : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed shadow-none'
            }`}
          >
            <span className="material-symbols-outlined text-lg">draw</span>
            <span>الموافقة والتعهد والتواصل للمساعدة 🤝</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors"
          >
            إلغاء
          </button>
        </footer>
      </div>
    </div>
  );
};
