import React, { useState } from 'react';
import { CommunityInitiative } from '../../types';

interface InitiativeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initiative: CommunityInitiative | null;
  onToggleJoin: (id: string) => void;
  onOpenChat: (organizerName: string) => void;
  userProfileName?: string;
  isDarkMode?: boolean;
}

export const InitiativeDetailModal: React.FC<InitiativeDetailModalProps> = ({
  isOpen,
  onClose,
  initiative,
  onToggleJoin,
  onOpenChat,
  userProfileName = 'ياسين جمال',
  isDarkMode = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !initiative) return null;

  const percent = initiative.maxParticipants
    ? Math.min(100, Math.round((initiative.participantsCount / initiative.maxParticipants) * 100))
    : 100;

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        {/* Cover Image */}
        {initiative.image && (
          <div className="relative -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-4 h-48 sm:h-56 overflow-hidden">
            <img
              src={initiative.image}
              alt={initiative.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 left-3 bg-black/40 text-white hover:bg-black/70 p-2 rounded-full transition-colors backdrop-blur-xs"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="absolute bottom-3 right-4 left-4 text-white space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[11px] inline-block shadow-2xs">
                {initiative.categoryLabel}
              </span>
              <h3 className="font-extrabold text-base sm:text-lg leading-snug drop-shadow-sm">
                {initiative.title}
              </h3>
            </div>
          </div>
        )}

        {!initiative.image && (
          <header className="flex items-center justify-between pb-3 mb-3 border-b border-[#bfcaba]/40 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤝</span>
              <h3 className="font-extrabold text-base text-[#181d17] dark:text-slate-100">
                {initiative.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </header>
        )}

        {/* Organizer & Status Banner */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f1f5eb] dark:bg-slate-800/80 border border-[#bfcaba]/60 dark:border-slate-700/80 mb-4">
          <div className="flex items-center gap-2.5">
            <img
              src={initiative.organizerAvatar}
              alt={initiative.organizerName}
              className="w-10 h-10 rounded-full object-cover border border-[#0d631b]/30 shrink-0"
            />
            <div>
              <div className="text-[10px] font-bold text-[#707a6c] dark:text-slate-400">
                منظّم المبادرة
              </div>
              <div className="font-bold text-xs sm:text-sm text-[#181d17] dark:text-slate-100">
                {initiative.organizerName}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onOpenChat(initiative.organizerName);
              onClose();
            }}
            className="px-3 py-1.5 bg-[#ebefe5] dark:bg-slate-700 hover:bg-[#e0e4da] text-[#0d631b] dark:text-emerald-300 font-bold text-xs rounded-xl transition-colors border border-[#0d631b]/30 flex items-center gap-1 shrink-0"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>مراسلة المنظم</span>
          </button>
        </div>

        {/* Date, Time, Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 text-xs font-medium">
          <div className="p-2.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg">event</span>
            <div>
              <div className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">التاريخ والوقت</div>
              <div className="font-bold text-[#181d17] dark:text-slate-100">
                {initiative.date} • {initiative.time}
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-lg">location_on</span>
            <div>
              <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">مكان التجمع</div>
              <div className="font-bold text-[#181d17] dark:text-slate-100 truncate">
                {initiative.location}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5 mb-4">
          <h4 className="font-bold text-xs text-[#40493d] dark:text-slate-300">
            عن المبادرة والهدف منها:
          </h4>
          <p className="text-xs sm:text-sm text-[#181d17] dark:text-slate-200 leading-relaxed font-medium bg-[#f8faf7] dark:bg-slate-900/60 p-3 rounded-2xl border border-[#bfcaba]/40 dark:border-slate-800">
            {initiative.description}
          </p>
        </div>

        {/* Participants Progress Bar */}
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-[#bfcaba]/80 dark:border-slate-800 space-y-2 mb-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#181d17] dark:text-slate-100 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#0d631b] dark:text-emerald-400">group</span>
              <span>المشاركون بالجوار ({initiative.participantsCount})</span>
            </span>
            <span className="text-[#0d631b] dark:text-emerald-400 font-extrabold">
              {percent}% من الهدف ({initiative.maxParticipants || 20} متطوع)
            </span>
          </div>

          <div className="w-full h-2.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Joined User Names List / Avatars */}
          <div className="pt-2 border-t border-[#bfcaba]/30 dark:border-slate-800 space-y-1.5">
            <div className="text-[11px] font-bold text-[#707a6c] dark:text-slate-400">
              قائمة الجيران المنضمين للمبادرة:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {initiative.joinedUserNames.map((name, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-[#e0e4da] dark:bg-slate-800 text-[#181d17] dark:text-slate-200 text-[11px] font-bold border border-[#bfcaba]/50 dark:border-slate-700 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs text-emerald-600">check_circle</span>
                  <span>{name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-[#bfcaba]/40 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="px-3.5 py-2.5 bg-[#f1f5eb] dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-[#40493d] dark:text-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            <span>{copied ? 'تم نسخ الرابط! 📋' : 'مشاركة'}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleJoin(initiative.id)}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 ${
              initiative.isUserJoined
                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                : 'bg-[#0d631b] hover:bg-[#2e7d32] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {initiative.isUserJoined ? 'task_alt' : 'how_to_reg'}
            </span>
            <span>
              {initiative.isUserJoined ? 'أنت منضم للمبادرة ✅ (إلغاء)' : 'الانضمام للمبادرة الآن 🤝'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
