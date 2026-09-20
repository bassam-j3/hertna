import React, { useState } from 'react';
import { Rating } from '../../types';

interface RateNeighborModalProps {
  isOpen: boolean;
  onClose: () => void;
  neighborName: string;
  itemName: string;
  onSubmitRating: (ratingData: Omit<Rating, 'id' | 'date'>) => void;
  currentUser?: { name: string; avatar: string };
  isDarkMode?: boolean;
}

const QUICK_TAGS = [
  'الالتزام بالمواعيد ⏰',
  'نظافة وأمانة 🧼',
  'تعامل خلوق 🤝',
  'حالة جيدة 🔧',
  'تواصل ممتاز 💬',
  'كرم وسخاء ❤️',
];

export const RateNeighborModal: React.FC<RateNeighborModalProps> = ({
  isOpen,
  onClose,
  neighborName,
  itemName,
  onSubmitRating,
  currentUser,
  isDarkMode = false,
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['تعامل خلوق 🤝']);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRating({
      reviewerName: currentUser?.name || 'ياسين جمال',
      reviewerAvatar:
        currentUser?.avatar ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCZBLT_yaLwOuRch_thTaTQzGZb37gtyzu-K0GYjqeo4eteM2h2jJ3o6A7aS1eBd50leLwAMCtsoFEKL0YIudXslyY-YAKXQMnoYXe8HpqW-GPtYJtmrTQ34h39gyur_VMoc3vax_btqfZWX0yyNdq4A61neyrSKJerdHZZNEZOzOlUk0LP8F75JSaWe0ZlJqQctHu2k6j32qhB5_2tMQB-RPlAu1iSZEnjRMmZKR4ixvv99ywKDxDt',
      rating: selectedRating,
      comment: comment.trim() || 'تجربة تبادل ممتازة وجار خلوق ومتعاون جداً في حارتنا.',
      itemName: itemName,
      targetUser: neighborName,
      tags: selectedTags,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setComment('');
      onClose();
    }, 1200);
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return 'ممتاز جداً 🌟 (تجربة مثالية)';
      case 4:
        return 'جيد جداً 👍 (تعامل راقٍ)';
      case 3:
        return 'جيد (معاملة مقبولة)';
      case 2:
        return 'متوسط (يوجد ملاحظات)';
      case 1:
        return 'ضعيف (تجربة غير مرضية)';
      default:
        return '';
    }
  };

  const currentActiveStars = hoverRating || selectedRating;

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
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#2e7d32]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-[#0d631b] rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="font-bold text-xl text-[#181d17] dark:text-slate-100">
              تم تسجيل التقييم بنجاح! ⭐
            </h3>
            <p className="text-xs text-[#707a6c] dark:text-slate-400">
              شكراً لمساهمتك في زيادة الثقة والأمان والتكافل داخل مجتمعنا المحلي.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-[#bfcaba]/40 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#FFF3E0] dark:bg-amber-950 text-[#fc820c] dark:text-amber-300 rounded-xl">
                  <span className="material-symbols-outlined text-xl">grade</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#181d17] dark:text-slate-100">
                    تقييم الجار بعد التبادل 🌟
                  </h3>
                  <p className="text-xs text-[#707a6c] dark:text-slate-400">
                    شارك انطباعك لتعزيز الأمان والتكافل بالحارة
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#f1f5eb] dark:bg-slate-800 text-[#40493d] dark:text-slate-300 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Target Info */}
            <div className="my-4 bg-[#f7fbf0] dark:bg-slate-900 border border-[#bfcaba]/60 dark:border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0d631b] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                {neighborName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-sm text-[#181d17] dark:text-slate-100">
                  الجار: {neighborName}
                </div>
                <div className="text-xs text-[#707a6c] dark:text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                  <span>التبادل: {itemName}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Selection */}
              <div className="text-center space-y-1.5">
                <label className="block text-xs font-bold text-[#40493d] dark:text-slate-300">
                  كيف كانت تجربتك في هذا التبادل؟
                </label>

                <div className="flex justify-center items-center gap-1 py-1 dir-ltr">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setSelectedRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <span
                        className={`material-symbols-outlined text-3xl transition-colors ${
                          star <= currentActiveStars
                            ? 'text-[#fc820c] fill'
                            : 'text-gray-300 dark:text-slate-700'
                        }`}
                        style={{
                          fontVariationSettings: star <= currentActiveStars ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>

                <div className="text-xs font-bold text-[#fc820c] dark:text-amber-400 min-h-[1.25rem]">
                  {getRatingLabel(currentActiveStars)}
                </div>
              </div>

              {/* Quick Praise Tags */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#40493d] dark:text-slate-300">
                  وسوم تميز الجار (اضغط للاختيار):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                          isSelected
                            ? 'bg-[#0d631b] text-white border-[#0d631b] shadow-2xs'
                            : isDarkMode
                            ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                            : 'bg-white text-[#40493d] border-[#bfcaba] hover:bg-[#ebefe5]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#40493d] dark:text-slate-300">
                  ملاحظات أو تعليق إضافي (اختياري)
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="مثال: التعامل راقٍ جداً، حافظ على الأداة وسلمها بموعدها بالضبط..."
                  className="w-full p-3 border border-[#bfcaba] dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-900 text-[#181d17] dark:text-slate-100 placeholder:text-gray-400 focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none resize-none font-medium"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0d631b] hover:bg-[#2e7d32] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>إرسال التقييم</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 bg-[#f1f5eb] dark:bg-slate-800 text-[#40493d] dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
