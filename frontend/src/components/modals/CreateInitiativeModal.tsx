import React, { useState } from 'react';
import { CommunityInitiative } from '../../types';

interface CreateInitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInitiative: (newInit: Omit<CommunityInitiative, 'id' | 'participantsCount' | 'joinedUserNames' | 'isUserJoined'>) => void;
  userProfileName?: string;
  userProfileAvatar?: string;
}

export const CreateInitiativeModal: React.FC<CreateInitiativeModalProps> = ({
  isOpen,
  onClose,
  onCreateInitiative,
  userProfileName = 'ياسين جمال',
  userProfileAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'cleanup' | 'food' | 'maintenance' | 'charity' | 'general'>('cleanup');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('الجمعة القادمة');
  const [time, setTime] = useState('9:00 صباحاً');
  const [location, setLocation] = useState('حي الروضة - الساحة الرئيسية');
  const [maxParticipants, setMaxParticipants] = useState<number>(20);
  const [selectedImage, setSelectedImage] = useState<string>(
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'
  );

  if (!isOpen) return null;

  const categoryPresets = [
    {
      id: 'cleanup',
      label: 'حملة تنظيف وتجميل 🧹',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'food',
      label: 'توزيع طعام جماعي 🍲',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'maintenance',
      label: 'صيانة وتجهيز 💡',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'charity',
      label: 'كسوة وتبرع أهلي 🧸',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'general',
      label: 'مبادرة مجتمعية عامة 🤝',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleCategorySelect = (catId: 'cleanup' | 'food' | 'maintenance' | 'charity' | 'general') => {
    setCategory(catId);
    const preset = categoryPresets.find((p) => p.id === catId);
    if (preset) {
      setSelectedImage(preset.image);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const preset = categoryPresets.find((p) => p.id === category);

    onCreateInitiative({
      title: title.trim(),
      description: description.trim(),
      organizerName: userProfileName,
      organizerAvatar: userProfileAvatar,
      category,
      categoryLabel: preset ? preset.label.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim() : 'مبادرة مجتمعية',
      date,
      time,
      location,
      maxParticipants,
      status: 'upcoming',
      image: selectedImage,
      tags: ['تضامن أهلي', 'مبادرة حارة', category],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col overflow-hidden transition-colors bg-white dark:bg-[#152219] border border-[#bfcaba] dark:border-slate-800 text-[#181d17] dark:text-slate-100"
      >
        {/* Header */}
        <header className="flex items-center justify-between pb-3 border-b border-[#bfcaba]/40 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              🤝
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#181d17] dark:text-slate-100">
                تنظيم مبادرة تكافل جديدة
              </h3>
              <p className="text-[11px] text-[#707a6c] dark:text-slate-400">
                دعوة جيرانك بالحي للمشاركة في عمل جماعي نافع
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-[#40493d] dark:text-slate-300 mb-1.5">
              نوع المبادرة المجتمعية:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categoryPresets.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id as any)}
                  className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                    category === cat.id
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs scale-[1.02]'
                      : 'bg-[#f1f5eb] dark:bg-slate-800 text-[#40493d] dark:text-slate-300 border-[#bfcaba]/60 dark:border-slate-700 hover:bg-[#e0e4da]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#40493d] dark:text-slate-300 mb-1">
              عنوان المبادرة:
            </label>
            <input
              type="text"
              required
              placeholder="مثال: حملة تنظيف وزراعة أشجار بالشارع الرئيسي..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-[#bfcaba] dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 text-[#181d17] dark:text-slate-100 outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#40493d] dark:text-slate-300 mb-1">
              تفاصيل المبادرة والهدف منها:
            </label>
            <textarea
              required
              rows={3}
              placeholder="شرح الخطوات، الأدوات المطلوبة، وكيف يمكن للجيران المساهمة..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-[#bfcaba] dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 text-[#181d17] dark:text-slate-100 outline-none focus:border-emerald-600 font-medium resize-none"
            />
          </div>

          {/* Date, Time, Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#40493d] dark:text-slate-300 mb-1">
                تاريخ المبادرة:
              </label>
              <input
                type="text"
                required
                placeholder="الجمعة القادمة (10 أغسطس)"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 border border-[#bfcaba] dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 text-[#181d17] dark:text-slate-100 outline-none focus:border-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#40493d] dark:text-slate-300 mb-1">
                وقت التجمع:
              </label>
              <input
                type="text"
                required
                placeholder="8:00 صباحاً - 11:00 صباحاً"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 border border-[#bfcaba] dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 text-[#181d17] dark:text-slate-100 outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#40493d] dark:text-slate-300 mb-1">
                مكان التجمع بالحارة:
              </label>
              <input
                type="text"
                required
                placeholder="الحديقة الفرعية - حي الروضة"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 border border-[#bfcaba] dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 text-[#181d17] dark:text-slate-100 outline-none focus:border-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#40493d] dark:text-slate-300 mb-1">
                عدد المتطوعين المستهدف:
              </label>
              <input
                type="number"
                min={2}
                max={100}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full p-2.5 border border-[#bfcaba] dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 text-[#181d17] dark:text-slate-100 outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-[#bfcaba]/40 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#f1f5eb] dark:bg-slate-800 text-[#40493d] dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0d631b] hover:bg-[#2e7d32] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">campaign</span>
              <span>نشر المبادرة بالحي 📣</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
