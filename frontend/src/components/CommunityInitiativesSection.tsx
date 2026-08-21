import React, { useState } from 'react';
import { CommunityInitiative } from '../types';

interface CommunityInitiativesSectionProps {
  initiatives: CommunityInitiative[];
  onToggleJoinInitiative: (id: string) => void;
  onOpenCreateModal: () => void;
  onSelectInitiative: (init: CommunityInitiative) => void;
}

export const CommunityInitiativesSection: React.FC<CommunityInitiativesSectionProps> = ({
  initiatives,
  onToggleJoinInitiative,
  onOpenCreateModal,
  onSelectInitiative,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  const categories = [
    { id: 'الكل', label: 'الكل' },
    { id: 'cleanup', label: 'حملة تنظيف 🧹' },
    { id: 'food', label: 'توزيع طعام 🍲' },
    { id: 'maintenance', label: 'صيانة وتجهيز 💡' },
    { id: 'charity', label: 'كسوة وتبرع 🧸' },
  ];

  const filteredInitiatives = initiatives.filter((init) => {
    if (selectedCategory === 'الكل') return true;
    return init.category === selectedCategory;
  });

  return (
    <section className="bg-gradient-to-br from-[#f8faf7] to-[#ebefe5] dark:from-[#142017] dark:to-[#17261c] p-4 sm:p-5 rounded-3xl border border-[#bfcaba]/80 dark:border-slate-800 space-y-4 shadow-sm rtl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#0d631b] text-white flex items-center justify-center font-bold text-lg shadow-2xs">
              🤝
            </span>
            <h2 className="font-extrabold text-lg sm:text-xl text-[#181d17] dark:text-slate-100 flex items-center gap-2">
              <span>مشاريع التكافل المجتمعي</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#0d631b] dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                مبادرات الحارة
              </span>
            </h2>
          </div>
          <p className="text-xs text-[#40493d] dark:text-slate-300 font-medium mr-1">
            مبادرات جماعية ينظمها أهالي الحي لتنظيف الشوارع، توزيع الطعام، والتكافل الاجتماعي
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#0d631b] hover:bg-[#2e7d32] text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>تنظيم مبادرة جديدة ➕</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 py-1 relative z-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#0d631b] text-white shadow-xs scale-[1.02]'
                : 'bg-white dark:bg-slate-800 text-[#40493d] dark:text-slate-300 border border-[#bfcaba]/60 dark:border-slate-700 hover:bg-[#e0e4da]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Initiative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
        {filteredInitiatives.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-[#bfcaba]/60 text-center space-y-2">
            <span className="material-symbols-outlined text-3xl text-gray-400">campaign</span>
            <p className="text-xs font-bold text-[#40493d] dark:text-slate-300">
              لا توجد مبادرات في هذا التصنيف حالياً
            </p>
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="text-xs text-[#0d631b] font-bold underline"
            >
              كن أول من ينظم مبادرة بالحارة!
            </button>
          </div>
        ) : (
          filteredInitiatives.map((init) => {
            const percent = init.maxParticipants
              ? Math.min(100, Math.round((init.participantsCount / init.maxParticipants) * 100))
              : 100;

            return (
              <article
                key={init.id}
                className="bg-white dark:bg-[#152219] rounded-2xl border border-[#bfcaba] dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Header Image & Badge */}
                <div
                  className="relative h-36 overflow-hidden cursor-pointer"
                  onClick={() => onSelectInitiative(init)}
                >
                  <img
                    src={init.image}
                    alt={init.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white font-bold text-[10px] backdrop-blur-xs shadow-2xs">
                      {init.categoryLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white font-bold text-[10px] backdrop-blur-xs flex items-center gap-1 shadow-2xs">
                      <span className="material-symbols-outlined text-xs">group</span>
                      <span>{init.participantsCount} متطوع</span>
                    </span>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-2.5 right-3 left-3 text-white">
                    <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-1 drop-shadow-sm">
                      {init.title}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div
                  className="p-3.5 space-y-2.5 cursor-pointer flex-1"
                  onClick={() => onSelectInitiative(init)}
                >
                  {/* Organizer info */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={init.organizerAvatar}
                        alt={init.organizerName}
                        className="w-6 h-6 rounded-full object-cover border border-emerald-600/40"
                      />
                      <span className="text-[#40493d] dark:text-slate-300 font-medium">
                        المنظّم: <strong className="text-[#181d17] dark:text-slate-100">{init.organizerName}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="text-[11px] font-medium text-[#707a6c] dark:text-slate-400 space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-amber-600">event</span>
                      <span>{init.date} • {init.time}</span>
                    </div>
                    <div className="flex items-center gap-1 truncate">
                      <span className="material-symbols-outlined text-xs text-emerald-600">location_on</span>
                      <span className="truncate">{init.location}</span>
                    </div>
                  </div>

                  {/* Participants Progress */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[#40493d] dark:text-slate-300">نسبة اكتمال المشاركين</span>
                      <span className="text-[#0d631b] dark:text-emerald-400">{percent}% ({init.participantsCount}/{init.maxParticipants || 20})</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-3 bg-[#f8faf7] dark:bg-slate-900/60 border-t border-[#bfcaba]/40 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectInitiative(init)}
                    className="text-xs font-bold text-[#40493d] dark:text-slate-300 hover:text-[#0d631b] flex items-center gap-0.5"
                  >
                    <span>التفاصيل</span>
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleJoinInitiative(init.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-2xs flex items-center gap-1 active:scale-95 ${
                      init.isUserJoined
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-[#0d631b] hover:bg-[#2e7d32] text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {init.isUserJoined ? 'task_alt' : 'how_to_reg'}
                    </span>
                    <span>{init.isUserJoined ? 'منضم بالفعل ✅' : 'انضمام للمبادرة 🤝'}</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
