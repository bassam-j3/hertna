import React, { useState } from 'react';
import { Post, PostType } from '../../types';

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (post: Omit<Post, 'id' | 'dateAdded' | 'likesCount' | 'status'>) => void;
  currentLocation: string;
}

export const AddPostModal: React.FC<AddPostModalProps> = ({
  isOpen,
  onClose,
  onAddPost,
  currentLocation,
}) => {
  const [postType, setPostType] = useState<PostType>('loan');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [maxDays, setMaxDays] = useState(3);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(4);
  const [isAnonymous, setIsAnonymous] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleImages = [
    { label: 'دريل', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsIxxY73GYcssOcr8SrctL8-UMj84PCjht_ZAjusJAU4Qj5HA0AZ2KPj8Iw-mZ9NwF1P9jaAbRGlUQRb5Z8DLlA7XJ-o42mpc203obRufTw8d8N8UcOecWNj4xBqv1L2hlviWih6-p1veoY88eXOrUlj_wV7VgOaP7W_V55tcIJbcqooKw9b2Ao3SgLmQpByj27Z7yK4DMWmPK3ndqZoDm8P5JCy-5sw3ofwfz1Wns6e708TBgLUxj' },
    { label: 'سلم', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxfMlenCBtgAL1ye9KdGCXnVzx2aYGNYylwOn17utEGV_9mHN955HRPwAbZqDwJZVtpsFYjadpJGOoPzgTw6vsX4ifzVGgKC6cQWR9yGdAul8Fr0KDV_1rdsmMuqz1oXEFG5gPlGpqXD4tvmLSOyon12ctfWSjthxqKrjUyKgoeB8vB7eG8BVvRen-fPlibVTWtW8v4_EEizeT8Hbzc_tH1iEWpaEkSV7y1403omGnaMKSJY_jUu2E' },
    { label: 'أثاث', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddPost({
      type: postType,
      title: title.trim(),
      description: description.trim() || (postType === 'gift' ? 'غرض للإهداء المجاني للأهالي والجيران.' : 'متاح للإعارة والتبادل في الحي.'),
      category: category || 'أدوات منزلية',
      maxDays: postType === 'loan' ? maxDays : undefined,
      image: imageUrl || (postType === 'gift' ? sampleImages[2].url : sampleImages[0].url),
      ownerName: isAnonymous ? 'أسرة متعففة بالحي (هوية مستورة 🛡️)' : 'ياسين جمال',
      ownerAvatar: isAnonymous ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80' : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZBLT_yaLwOuRch_thTaTQzGZb37gtyzu-K0GYjqeo4eteM2h2jJ3o6A7aS1eBd50leLwAMCtsoFEKL0YIudXslyY-YAKXQMnoYXe8HpqW-GPtYJtmrTQ34h39gyur_VMoc3vax_btqfZWX0yyNdq4A61neyrSKJerdHZZNEZOzOlUk0LP8F75JSaWe0ZlJqQctHu2k6j32qhB5_2tMQB-RPlAu1iSZEnjRMmZKR4ixvv99ywKDxDt',
      ownerRating: 4.9,
      distanceKm: 0.3,
      distanceLabel: 'يبعد 300 متر',
      locationName: currentLocation,
      isAnonymous,
      requiresPrivacyPledge: isAnonymous || postType === 'urgent',
    });

    // Reset fields
    setTitle('');
    setCategory('');
    setMaxDays(3);
    setDescription('');
    setImageUrl('');
    setIsAnonymous(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col overflow-hidden transition-colors bg-white text-[#181d17]"
      >
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-2 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-[#bfcaba] rounded-full opacity-60"></div>
        </div>

        {/* Header */}
        <header className="px-6 pb-4 border-b border-[#bfcaba]/30 shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl text-[#181d17]">إضافة مشاركة جديدة للحي</h1>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-full hover:bg-[#ebefe5] transition-colors text-[#40493d]"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </header>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5 pb-28">
          {/* Segmented Type Selector */}
          <div className="bg-[#ebefe5] p-1.5 rounded-xl flex gap-1 w-full relative">
            <button
              type="button"
              onClick={() => setPostType('loan')}
              className={`flex-1 py-2 px-1 text-center font-bold text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                postType === 'loan'
                  ? 'bg-white shadow-sm text-[#0d631b]'
                  : 'text-[#40493d] hover:text-[#181d17]'
              }`}
            >
              <span>🔨</span>
              <span>إعارة مؤقتة</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('gift')}
              className={`flex-1 py-2 px-1 text-center font-bold text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                postType === 'gift'
                  ? 'bg-white shadow-sm text-[#0369a1]'
                  : 'text-[#40493d] hover:text-[#181d17]'
              }`}
            >
              <span>🎁</span>
              <span>إهداء مجاني</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('urgent')}
              className={`flex-1 py-2 px-1 text-center font-bold text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                postType === 'urgent'
                  ? 'bg-white shadow-sm text-[#964900]'
                  : 'text-[#40493d] hover:text-[#181d17]'
              }`}
            >
              <span>🆘</span>
              <span>طلب مساعدة</span>
            </button>
          </div>

          {/* Image Upload Area */}
          <div className="relative w-full border-2 border-dashed border-[#bfcaba] rounded-2xl bg-white hover:bg-[#f1f5eb] transition-colors cursor-pointer group flex flex-col items-center justify-center py-6 h-36 overflow-hidden">
            {imageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img src={imageUrl} alt="Preview" className="h-full object-contain rounded-lg" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageUrl('');
                  }}
                  className="absolute top-2 left-2 bg-red-600 text-white p-1 rounded-full shadow-md text-xs"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            ) : (
              <>
                <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#2e7d32] text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                    <span
                      className="material-symbols-outlined text-2xl fill"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      photo_camera
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-[#40493d] group-hover:text-[#0d631b] transition-colors">
                    ارفع صورة الغرض (اختياري)
                  </span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </>
            )}
          </div>

          {/* Sample quick image selection */}
          {!imageUrl && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#707a6c] font-medium">أو اختر صورة توضيحية:</span>
              <div className="flex gap-2">
                {sampleImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className="text-xs bg-[#ebefe5] hover:bg-[#2e7d32] hover:text-white px-2.5 py-1 rounded-lg font-bold text-[#40493d] transition-colors"
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block font-bold text-sm text-[#181d17]" htmlFor="itemTitle">
              عنوان الغرض أو الطلب
            </label>
            <input
              id="itemTitle"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: سلم معدني 3 أمتار"
              className="w-full h-12 px-4 border border-[#bfcaba] rounded-xl bg-white text-[#181d17] placeholder:text-[#40493d]/50 focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none font-medium text-sm transition-all shadow-2xs"
            />
          </div>

          {/* Description Optional */}
          <div className="space-y-1.5">
            <label className="block font-bold text-sm text-[#181d17]" htmlFor="itemDesc">
              الوصف أو تفاصيل الطلب (اختياري)
            </label>
            <textarea
              id="itemDesc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب ملاحظات إضافية حول حالة الغرض أو طريقة التسليم..."
              className="w-full p-3 border border-[#bfcaba] rounded-xl bg-white text-[#181d17] placeholder:text-[#40493d]/50 focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none font-medium text-sm transition-all shadow-2xs resize-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5 relative">
            <label className="block font-bold text-sm text-[#181d17]" htmlFor="itemCategory">
              التصنيف
            </label>
            <div className="relative">
              <select
                id="itemCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 px-4 border border-[#bfcaba] rounded-xl bg-white text-[#181d17] appearance-none focus:border-[#0d631b] focus:ring-1 focus:ring-[#0d631b] outline-none font-medium text-sm pr-4 pl-10 cursor-pointer shadow-2xs"
              >
                <option value="" disabled>اختر التصنيف المناسب</option>
                <option value="أدوات منزلية">أدوات منزلية</option>
                <option value="معدات زراعية">معدات زراعية</option>
                <option value="مستلزمات أطفال">مستلزمات أطفال</option>
                <option value="ملابس">ملابس</option>
                <option value="أدوات كهربائية">أدوات كهربائية</option>
                <option value="أثاث">أثاث</option>
                <option value="أجهزة كهربائية">أجهزة كهربائية</option>
                <option value="معدات منازل">معدات منازل</option>
              </select>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707a6c] pointer-events-none text-xl">
                expand_more
              </span>
            </div>
          </div>

          {/* Numeric Counter: Duration (Only if loan) */}
          {postType === 'loan' && (
            <div className="space-y-1.5">
              <label className="block font-bold text-sm text-[#181d17]">
                المدة الأقصى للإعارة (بالأيام)
              </label>
              <div className="flex items-center justify-between border border-[#bfcaba] rounded-xl bg-white h-12 px-2 w-48 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setMaxDays(maxDays + 1)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0d631b] hover:bg-[#ebefe5] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                </button>
                <span className="font-bold text-lg text-[#181d17] min-w-[2ch] text-center">
                  {maxDays}
                </span>
                <button
                  type="button"
                  onClick={() => setMaxDays(Math.max(1, maxDays - 1))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#707a6c] hover:bg-[#ebefe5] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-xl">remove</span>
                </button>
              </div>
            </div>
          )}

          {/* Distance Scope Selector */}
          <div className="space-y-1.5">
            <label className="block font-bold text-sm text-[#181d17]">
              نطاق النشر بالحي
            </label>
            <div className="flex bg-[#f1f5eb] p-1 rounded-xl border border-[#bfcaba]/60">
              {[1, 2, 4].map((rad) => (
                <button
                  key={rad}
                  type="button"
                  onClick={() => setSelectedRadius(rad)}
                  className={`flex-1 py-1.5 text-center font-bold text-xs rounded-lg transition-all ${
                    selectedRadius === rad
                      ? 'bg-[#0d631b] text-white shadow-xs'
                      : 'text-[#40493d]'
                  }`}
                >
                  {rad} كم
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Dignity Option Box */}
          <div className="bg-emerald-50/90 border border-emerald-200/80 p-3.5 rounded-2xl space-y-2">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">shield_person</span>
                </div>
                <div>
                  <span className="font-bold text-xs text-[#181d17] block">إخفاء الهوية لحفظ الكرامة والخصوصية 🛡️</span>
                  <span className="text-[11px] text-[#40493d] block">نشر الطلب كطلب سرّي لحماية خصوصية أسرتك</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 accent-[#0d631b] rounded-md cursor-pointer shrink-0"
              />
            </label>
            {isAnonymous && (
              <div className="text-[11px] text-[#0d631b] font-semibold bg-white p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-base shrink-0">verified_user</span>
                <span>لن يتمكن المتبرع/المساعد من التواصل معك إلا بعد التوقيع التزاماً بتعهد حفظ السرية والخصوصية.</span>
              </div>
            )}
          </div>

          {/* Location Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFF3E0] text-[#964900] border border-[#fc820c]/30 w-fit">
            <span className="material-symbols-outlined text-[18px] fill" style={{ fontVariationSettings: "'FILL' 1" }}>
              location_on
            </span>
            <span className="font-bold text-xs">
              الموقع الحالي: {currentLocation} (تحديد تلقائي)
            </span>
          </div>

          {/* Sticky Bottom Action Area */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent pt-6 border-t border-[#bfcaba]/20">
            <button
              type="submit"
              className="w-full h-14 rounded-xl bg-[#0d631b] hover:bg-[#2e7d32] active:scale-[0.98] transition-all flex items-center justify-center text-white font-bold text-base shadow-md gap-2"
            >
              <span>نشر في نطاق {selectedRadius} كم</span>
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
