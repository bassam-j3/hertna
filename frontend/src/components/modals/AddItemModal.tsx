import React, { useState } from 'react';
import { insertItem } from '../../services/itemService';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState<'borrow' | 'donation' | 'urgent'>('borrow');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title || !category) {
      alert("الرجاء تعبئة العنوان والتصنيف");
      return;
    }
    
    setIsSubmitting(true);
    try {
      let backendType: 'OFFER' | 'REQUEST' = type === 'donation' ? 'OFFER' : 'REQUEST';
      let backendCategory = category;

      if (type === 'urgent') {
        backendCategory = 'احتياجات عاجلة';
      } else if (type === 'donation') {
        backendCategory = 'طلب مساعدة';
      } else if (type === 'borrow') {
        backendCategory = category;
      }

      const newItem = {
        title,
        description: '', // Optional description for now
        category: backendCategory,
        type: backendType,
        urgent: type === 'urgent',
        distanceKm: 0.5,
        location: 'دمشق - حي الروضة',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=300&q=80',
        isAnonymous: false,
        tags: []
      };
      
      const createdItem = await insertItem(newItem);
      
      // Dispatch custom event to tell HomeFeed to update
      window.dispatchEvent(new CustomEvent('ITEM_ADDED', { detail: createdItem }));
      
      // Reset form and close
      setTitle('');
      setCategory('');
      setDuration(3);
      setType('borrow');
      onClose();
      
    } catch (e) {
      console.error("Failed to add item", e);
      alert("حدث خطأ أثناء الإضافة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col overflow-hidden transition-colors bg-surface-container-lowest text-on-surface"
      >
        
        <div className="w-full flex justify-center pt-xs pb-sm">
          <div className="w-12 h-1.5 bg-outline-variant rounded-full opacity-50"></div>
        </div>
        
        <header className="px-container-margin pb-md border-b border-outline-variant/30 shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="font-title-lg text-title-lg text-on-surface">إضافة مشاركة جديدة للحي</h1>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-container-margin py-lg space-y-xl pb-32">
          
          {/* Segmented Selector */}
          <div className="bg-surface-container p-1 rounded-lg flex gap-1 w-full relative">
            <button 
              onClick={() => setType('borrow')}
              className={`flex-1 py-2 px-1 text-center font-label-lg text-label-lg rounded z-10 transition-colors flex items-center justify-center gap-1 ${type === 'borrow' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span>🔨</span> طلب إعارة
            </button>
            <button 
              onClick={() => setType('donation')}
              className={`flex-1 py-2 px-1 text-center font-label-lg text-label-lg rounded z-10 transition-colors flex items-center justify-center gap-1 ${type === 'donation' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span>🎁</span> طلب مساعدة
            </button>
            <button 
              onClick={() => setType('urgent')}
              className={`flex-1 py-2 px-1 text-center font-label-lg text-label-lg rounded z-10 transition-colors flex items-center justify-center gap-1 ${type === 'urgent' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span>🆘</span> فزعة عاجلة
            </button>
          </div>

          <div className="w-full border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer group flex flex-col items-center justify-center py-xl h-40">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
            </div>
            <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">ارفع صورة الغرض (اختياري)</span>
          </div>

          <div className="space-y-lg">
            <div className="space-y-sm">
              <label className="block font-label-lg text-label-lg text-on-surface" htmlFor="itemTitle">عنوان الغرض أو الطلب</label>
              <input 
                className="w-full h-12 px-md border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-lg text-body-lg" 
                id="itemTitle" 
                placeholder="مثال: سلم معدني 3 أمتار" 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-sm relative">
              <label className="block font-label-lg text-label-lg text-on-surface" htmlFor="itemCategory">التصنيف</label>
              <div className="relative">
                <select 
                  className="w-full h-12 px-md border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface appearance-none focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-lg text-body-lg pr-4 pl-10 cursor-pointer" 
                  id="itemCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option disabled value="">اختر التصنيف المناسب</option>
                  <option value="tools">أدوات منزلية</option>
                  <option value="garden">معدات زراعية</option>
                  <option value="kids">مستلزمات أطفال</option>
                  <option value="clothes">ملابس</option>
                  <option value="electric">أدوات كهربائية</option>
                  <option value="furniture">أثاث</option>
                </select>
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
              </div>
            </div>

            {type === 'borrow' && (
              <div className="space-y-sm">
                <label className="block font-label-lg text-label-lg text-on-surface">المدة الأقصى للإعارة (بالأيام)</label>
                <div className="flex items-center justify-between border border-outline-variant rounded-lg bg-surface-container-lowest h-12 px-xs w-48">
                  <button 
                    onClick={() => setDuration(d => d + 1)}
                    className="w-10 h-10 rounded flex items-center justify-center text-primary hover:bg-surface-container active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>add</span>
                  </button>
                  <span className="font-title-lg text-title-lg text-on-surface min-w-[2ch] text-center">{duration}</span>
                  <button 
                    onClick={() => setDuration(d => Math.max(1, d - 1))}
                    className="w-10 h-10 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>remove</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-md py-sm rounded-full bg-secondary-container/20 text-on-secondary-container border border-secondary-container/30 w-fit">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            <span className="font-label-sm text-label-sm">الموقع الحالي: حي الروضة (تحديد تلقائي)</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-container-margin bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest to-transparent pt-xl border-t border-outline-variant/10">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-14 rounded-xl bg-primary hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center text-on-primary font-title-md text-title-md shadow-sm gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'جاري النشر...' : 'نشر في نطاق 4 كم'}</span>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
