import React from 'react';
import { SAMPLE_LOCATIONS } from '../../data/constants';

// Assuming AVATAR_PRESETS is needed, we define it here or import it
const AVATAR_PRESETS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCZBLT_yaLwOuRch_thTaTQzGZb37gtyzu-K0GYjqeo4eteM2h2jJ3o6A7aS1eBd50leLwAMCtsoFEKL0YIudXslyY-YAKXQMnoYXe8HpqW-GPtYJtmrTQ34h39gyur_VMoc3vax_btqfZWX0yyNdq4A61neyrSKJerdHZZNEZOzOlUk0LP8F75JSaWe0ZlJqQctHu2k6j32qhB5_2tMQB-RPlAu1iSZEnjRMmZKR4ixvv99ywKDxDt',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
];

interface EditProfileModalProps {
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  editForm: any;
  setEditForm: React.Dispatch<React.SetStateAction<any>>;
  handleSaveProfile: (e: React.FormEvent) => void;
  startCamera: (facingMode: "user" | "environment") => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function EditProfileModal({
  isEditProfileOpen,
  setIsEditProfileOpen,
  editForm,
  setEditForm,
  handleSaveProfile,
  startCamera,
  fileInputRef
}: EditProfileModalProps) {
  if (!isEditProfileOpen) return null;

  return (
    <>
      {/* ================= MODAL 1: EDIT PROFILE MODAL ================= */}
      <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={() => setIsEditProfileOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#121212] relative flex flex-col overflow-hidden text-[#181d17] dark:text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#bfcaba] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#bfcaba]/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d631b] text-2xl">edit_square</span>
                <h3 className="font-bold text-lg text-[#181d17] dark:text-white">تعديل الملف الشخصي</h3>
              </div>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector */}
              <div className="space-y-3 bg-[#f8faf7] p-3.5 rounded-2xl border border-[#bfcaba]/60">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#181d17] dark:text-white">الصورة الشخصية:</label>
                  <span className="text-[11px] text-[#0d631b] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">favorite</span>
                    <span>تعزز الألفة والثقة بين الجيران</span>
                  </span>
                </div>

                {/* Avatar Preview & Action Buttons */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-[#0d631b] overflow-hidden shrink-0 shadow-xs bg-white dark:bg-[#121212]">
                    <img
                      src={editForm.avatar}
                      alt="معاينة الصورة"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 flex-1">
                    <button
                      type="button"
                      onClick={() => startCamera('user')}
                      className="flex-1 py-2 px-3 bg-[#0d631b] hover:bg-[#16501f] text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-base">photo_camera</span>
                      <span>التقاط بالكاميرا 📸</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 px-3 bg-white dark:bg-[#121212] hover:bg-emerald-50 text-[#0d631b] border border-[#0d631b]/40 font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-base">file_upload</span>
                      <span>رفع من الجهاز 📁</span>
                    </button>
                  </div>
                </div>

                {/* Warmth Message */}
                <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-[#0d631b] leading-relaxed flex items-start gap-2">
                  <span className="material-symbols-outlined text-base shrink-0 mt-0.5">groups</span>
                  <span>
                    إضافة صورة حقيقية تعبر عن شخصيتك الدافئة تجعل التعرف عليك يسيرًا ومريحًا لأهالي الحي والبلدة عند استلام وإعارة الأدوات والمعدات!
                  </span>
                </div>

                {/* Presets */}
                <div>
                  <span className="block text-[11px] font-bold text-[#40493d] dark:text-gray-200 mb-1.5">أو اختر من الرموز الجاهزة:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {AVATAR_PRESETS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, avatar: url })}
                        className={`w-12 h-12 rounded-full border-2 overflow-hidden shrink-0 transition-transform ${editForm.avatar === url
                            ? 'border-[#0d631b] scale-105 shadow-md ring-2 ring-[#0d631b]/30'
                            : 'border-gray-200 opacity-70 hover:opacity-100'
                          }`}
                      >
                        <img src={url} alt={`رمز ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                  placeholder="أو أدخل رابط صورة مخصص (URL)"
                  className="w-full h-9 px-3 text-xs bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none focus:border-[#0d631b]"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none focus:border-[#0d631b] font-medium"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">رقم الهاتف للتواصل:</label>
                <input
                  type="text"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none focus:border-[#0d631b] font-medium ltr text-right"
                />
              </div>

              {/* Job / Profession */}
              <div>
                <label className="block text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">المهنة / الصفة:</label>
                <input
                  type="text"
                  value={editForm.job}
                  onChange={(e) => setEditForm({ ...editForm, job: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none focus:border-[#0d631b] font-medium"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">النبذة التعريقية للجيران:</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full p-3 text-sm bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none focus:border-[#0d631b] font-medium leading-relaxed resize-none"
                />
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">المدينة:</label>
                <select
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none focus:border-[#0d631b] font-medium cursor-pointer"
                >
                  <option value="دمشق">دمشق</option>
                  <option value="حمص">حمص</option>
                  <option value="حماة">حماة</option>
                </select>
              </div>

              {/* Neighborhood */}
              <div>
                <label className="block text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">الحي السكني:</label>
                <input
                  type="text"
                  required
                  value={editForm.neighborhood}
                  onChange={(e) => setEditForm({ ...editForm, neighborhood: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none focus:border-[#0d631b] font-medium"
                />
              </div>


              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0d631b] hover:bg-[#185e23] text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                >
                  حفظ التغييرات
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-[#222222] text-gray-700 dark:text-gray-200 font-bold text-sm rounded-xl hover:bg-gray-200"
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
