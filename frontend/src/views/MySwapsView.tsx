import React, { useState, useEffect } from 'react';
import { SwapItem, Rating } from '../types';
import { RateNeighborModal } from '../components/modals/RateNeighborModal';
import { AutoThankYouModal } from '../components/modals/AutoThankYouModal';
import { ReturnReminderModal } from '../components/modals/ReturnReminderModal';
import { fetchMyLoans, updateExchangeStatus, SwapRecord } from '../services/exchangeService';
import { useAuth } from '../contexts/AuthContext';

interface MySwapsViewProps {
  ratings?: Rating[];
  onOpenMessage?: (name: string) => void;
  onAddRating?: (ratingData: Omit<Rating, 'id' | 'date'>) => void;
  isDarkMode?: boolean;
}

export const MySwapsView: React.FC<MySwapsViewProps> = ({
  ratings = [],
  onOpenMessage = (name) => { },
  onAddRating = (rating) => { },
  isDarkMode = false,
}) => {
  const { currentUser } = useAuth();
  const [swapItems, setSwapItems] = useState<SwapItem[]>([]);
  const [myRequests, setMyRequests] = useState<SwapItem[]>([]);
  const [activeTab, setActiveTab] = useState<'lends' | 'requests' | 'ratings'>('lends');
  const [confirmedItems, setConfirmedItems] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<'all' | '5star' | '4star' | 'comments'>('all');

  const handleAddRating = async (ratingData: { rating: number; comment?: string; category?: string }) => {
    try {
      const { RatingsService } = await import('../services/apiClient');
      await RatingsService.create({
        rating: ratingData.rating,
        comment: ratingData.comment || '',
        category: ratingData.category || 'إعارة أداة',
        targetUserId: ratingTarget?.targetUserId || 'mock-target-id',
      });
      alert('تم تقييم الجار بنجاح واحتساب النقاط! 🌟');
      // optionally refresh ratings list here if we fetched them from backend
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء التقييم');
    }
  };

  useEffect(() => {
    loadSwaps();
  }, []);

  const loadSwaps = async () => {
    try {
      const data = await fetchMyLoans();
      const mappedLends: SwapItem[] = data.asLender.map((s: SwapRecord) => ({
        id: s.id,
        title: s.title,
        borrowerName: s.borrower?.name || 'مستخدم',
        borrowerLocation: s.borrower?.neighborhood || s.borrower?.city || 'دمشق - حي الروضة',
        borrowerId: s.borrowerId,
        lenderId: s.lenderId,
        image: s.post?.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=300&q=80',
        startDate: new Date(s.startDate).toLocaleDateString(),
        dueDate: new Date(s.dueDate).toLocaleDateString(),
        daysRemaining: 'جاري الإعارة',
        daysRemainingNum: 2,
        status: s.status,
        actionType: s.status === 'pending' ? 'waiting_confirmation' : 'message',
        neighborPhone: s.borrower?.phone || '+963 900 000 000',
      }));
      setSwapItems(mappedLends);

      const mappedRequests: SwapItem[] = data.asBorrower.map((s: SwapRecord) => ({
        id: s.id,
        title: s.title,
        borrowerName: s.lender?.name || 'مستخدم',
        borrowerLocation: s.lender?.neighborhood || s.lender?.city || 'دمشق - حي الروضة',
        borrowerId: s.borrowerId,
        lenderId: s.lenderId,
        image: s.post?.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=300&q=80',
        startDate: new Date(s.startDate).toLocaleDateString(),
        dueDate: new Date(s.dueDate).toLocaleDateString(),
        daysRemaining: 'استعارة',
        daysRemainingNum: 2,
        status: s.status,
        actionType: s.status === 'pending' ? 'confirm_receipt' : 'message',
        neighborPhone: s.lender?.phone || '+963 900 000 000',
      }));
      setMyRequests(mappedRequests);
    } catch (e) {
      console.error(e);
    }
  };

  // Modal states
  const [thankYouTargetItem, setThankYouTargetItem] = useState<SwapItem | null>(null);
  const [ratingTarget, setRatingTarget] = useState<{ neighborName: string; itemName: string; targetUserId?: string } | null>(null);
  const [returnReminderTarget, setReturnReminderTarget] = useState<SwapItem | null>(null);

  // Filter items that have 1 day remaining for return reminder
  const dueTomorrowItems = swapItems.filter(
    (item) => item.daysRemainingNum === 1 || item.daysRemaining.includes('يوم واحد')
  );

  // Calculate dynamic overall average rating
  const avgRatingNum = ratings.length > 0
    ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
    : 4.9;
  const avgRatingStr = avgRatingNum.toFixed(1);

  const count5Star = ratings.filter((r) => Math.round(r.rating) === 5).length;
  const count4Star = ratings.filter((r) => Math.round(r.rating) === 4).length;
  const count3Star = ratings.filter((r) => Math.round(r.rating) <= 3).length;

  const filteredRatings = ratings.filter((r) => {
    if (ratingFilter === '5star') return Math.round(r.rating) === 5;
    if (ratingFilter === '4star') return Math.round(r.rating) === 4;
    if (ratingFilter === 'comments') return r.comment && r.comment.length > 10;
    return true;
  });

  const handleConfirm = (e: React.MouseEvent | React.FormEvent, item: SwapItem) => {
    e.preventDefault();
    e.stopPropagation();
    // Open Auto Thank You modal first
    setThankYouTargetItem(item);
  };

  const handleConfirmWithThankYou = async (item: SwapItem, thankYouMsg: string) => {
    try {
      await updateExchangeStatus(item.id, 'completed');
      setConfirmedItems((prev) => [...prev, item.id]);
      // Open rating modal after confirming receipt
      setRatingTarget({
        neighborName: item.borrowerName,
        itemName: item.title,
        targetUserId: currentUser?.id === item.borrowerId ? item.lenderId : item.borrowerId,
      });
      setThankYouTargetItem(null);
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    }
  };

  return (
    <main className="pt-20 pb-28 px-4 md:px-8 max-w-screen-xl mx-auto rtl transition-colors duration-200">
      {/* Profile Card */}
      <section className={`${isDarkMode ? 'bg-[#152219] border-slate-800 text-slate-100' : 'bg-white border-[#bfcaba] text-[#181d17]'} rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border mb-6 relative overflow-hidden transition-colors`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2e7d32]/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-right gap-3 sm:gap-5 relative z-10">
          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 border-[#2e7d32] p-1 shrink-0 shadow-xs bg-white">
            <img
              className="w-full h-full rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZBLT_yaLwOuRch_thTaTQzGZb37gtyzu-K0GYjqeo4eteM2h2jJ3o6A7aS1eBd50leLwAMCtsoFEKL0YIudXslyY-YAKXQMnoYXe8HpqW-GPtYJtmrTQ34h39gyur_VMoc3vax_btqfZWX0yyNdq4A61neyrSKJerdHZZNEZOzOlUk0LP8F75JSaWe0ZlJqQctHu2k6j32qhB5_2tMQB-RPlAu1iSZEnjRMmZKR4ixvv99ywKDxDt"
              alt="ياسين جمال"
            />
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
              <h2 className="font-bold text-lg sm:text-xl">ياسين جمال</h2>
              <span className="bg-[#FFF3E0] dark:bg-amber-950/80 text-[#964900] dark:text-amber-300 px-3 py-1 rounded-full font-bold text-xs inline-flex items-center justify-center gap-1 border border-[#fc820c]/30 self-center sm:self-auto">
                <span
                  className="material-symbols-outlined text-[14px] text-[#fc820c] fill"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span>جار موثوق {avgRatingStr} / 5.0 ({ratings.length} تقييمات)</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2 text-xs">
              <span className={`${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-[#ebefe5] text-[#40493d]'} px-2.5 py-1 rounded-full font-bold flex items-center gap-1`}>
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                <span>حي الروضة</span>
              </span>
              <span className={`${isDarkMode ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' : 'bg-emerald-50 text-[#0d631b] border-emerald-200'} px-2.5 py-1 rounded-full font-bold border flex items-center gap-1`}>
                <span className="material-symbols-outlined text-[14px]">handshake</span>
                <span>12 إعارة ناجحة</span>
              </span>
            </div>

            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-[#707a6c]'} font-medium`}>
              عضو فعال بالحي • مساهم في التكافل المحلي منذ 2024
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5 sm:flex sm:gap-2 mb-6 border-b border-[#bfcaba]/60 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('lends')}
          className={`w-full sm:w-auto px-2 sm:px-4 py-2.5 font-bold text-xs sm:text-sm transition-all rounded-xl flex items-center justify-center gap-1 sm:gap-2 ${activeTab === 'lends'
              ? 'bg-[#0d631b] text-white shadow-xs'
              : isDarkMode
                ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                : 'bg-white text-[#40493d] border border-[#bfcaba]/60 hover:bg-[#ebefe5]'
            }`}
        >
          <span className="material-symbols-outlined text-[16px] sm:text-[18px]">outbox</span>
          <span className="truncate">جيران أساعدهم</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold ${activeTab === 'lends' ? 'bg-white/20 text-white' : 'bg-[#2e7d32]/10 text-[#0d631b]'
            }`}>
            {swapItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`w-full sm:w-auto px-2 sm:px-4 py-2.5 font-bold text-xs sm:text-sm transition-all rounded-xl flex items-center justify-center gap-1 sm:gap-2 ${activeTab === 'requests'
              ? 'bg-[#0d631b] text-white shadow-xs'
              : isDarkMode
                ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                : 'bg-white text-[#40493d] border border-[#bfcaba]/60 hover:bg-[#ebefe5]'
            }`}
        >
          <span className="material-symbols-outlined text-[16px] sm:text-[18px]">inbox</span>
          <span className="truncate">طلباتي</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${activeTab === 'requests' ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#40493d]'
            }`}>
            {myRequests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ratings')}
          className={`w-full sm:w-auto px-2 sm:px-4 py-2.5 font-bold text-xs sm:text-sm transition-all rounded-xl flex items-center justify-center gap-1 sm:gap-2 ${activeTab === 'ratings'
              ? 'bg-[#0d631b] text-white shadow-xs'
              : isDarkMode
                ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                : 'bg-white text-[#40493d] border border-[#bfcaba]/60 hover:bg-[#ebefe5]'
            }`}
        >
          <span className="material-symbols-outlined text-[16px] sm:text-[18px]">star_rate</span>
          <span className="truncate">التقييمات</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${activeTab === 'ratings' ? 'bg-white/20 text-white' : 'bg-[#FFF3E0] text-[#964900]'
            }`}>
            {ratings.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Active Lends List */}
      {activeTab === 'lends' && (
        <div className="space-y-4">
          {/* Return Reminder Banner for Items due tomorrow */}
          {dueTomorrowItems.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
                  ⏰
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <span>تذكير موعد إرجاع السلعة (الموعد غداً) 🚨</span>
                  </h4>
                  <p className="text-xs text-amber-800/90 dark:text-amber-300 font-medium">
                    ينتهي موعد إعارة "{dueTomorrowItems[0].title}" غداً مع المستعير {dueTomorrowItems[0].borrowerName}. يرجى التنسيق لإعادة السلعة وتجهيزها.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReturnReminderTarget(dueTomorrowItems[0])}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">schedule_send</span>
                <span>تنسيق الإرجاع 🤝</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {swapItems.length === 0 ? (
              <div className={`col-span-full ${isDarkMode ? 'bg-[#152219] border-slate-800 text-slate-300' : 'bg-white border-[#bfcaba] text-[#181d17]'} rounded-2xl p-8 border text-center space-y-2`}>
                <span className="material-symbols-outlined text-4xl text-[#707a6c]">volunteer_activism</span>
                <p className="font-bold">لا توجد مساعدات جارية حالياً</p>
              </div>
            ) : (
              swapItems.map((item) => {
                const isConfirmed = confirmedItems.includes(item.id);
                const isDueTomorrow = item.daysRemainingNum === 1 || item.daysRemaining.includes('يوم');
                return (
                  <article
                    key={item.id}
                    className={`${isDarkMode
                        ? 'bg-[#152219] border-slate-800 text-slate-100'
                        : 'bg-white border-[#bfcaba] text-[#181d17]'
                      } rounded-2xl p-3.5 sm:p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border transition-all hover:shadow-md flex flex-col justify-between relative overflow-hidden`}
                  >
                    {isDueTomorrow && (
                      <div className="mb-2.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-xl text-[11px] font-bold flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-amber-600">alarm</span>
                          <span>تذكير إرجاع السلعة (الموعد غداً)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setReturnReminderTarget(item)}
                          className="text-amber-800 dark:text-amber-300 underline text-[10px]"
                        >
                          تنسيق الآن
                        </button>
                      </div>
                    )}

                    <div className="flex gap-3 sm:gap-4 items-start">
                      {/* Item Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#bfcaba]/60 shadow-2xs bg-gray-100">
                        <img
                          className="w-full h-full object-cover"
                          src={item.image}
                          alt={item.title}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap justify-between items-start gap-1 mb-1">
                          <h3 className="font-bold text-sm sm:text-base leading-snug break-words line-clamp-2 flex-1">
                            {item.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] sm:text-xs whitespace-nowrap ${item.daysRemainingNum === 1
                                ? 'bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                                : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-[#e0e4da] text-[#40493d]'
                              }`}
                          >
                            {item.daysRemaining}
                          </span>
                        </div>

                        <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-[#40493d]'} flex items-center gap-1 mb-1.5`}>
                          <span className="material-symbols-outlined text-[15px]">person</span>
                          <span className="truncate">المستعير: {item.borrowerName}</span>
                          {item.borrowerName.includes('مجهول') && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300">
                              مشاركة مجهولة 🛡️
                            </span>
                          )}
                        </p>

                        <div className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-[#707a6c]'} flex flex-wrap gap-x-3 gap-y-0.5`}>
                          <span>البدء: {item.startDate}</span>
                          <span>الاستحقاق: {item.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="mt-3 pt-2.5 border-t border-[#bfcaba]/30 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <span className={`text-[11px] ${isDarkMode ? 'text-emerald-400' : 'text-[#0d631b]'} font-bold flex items-center gap-1`}>
                        <span className="material-symbols-outlined text-sm">verified</span>
                        <span>مساعدة جارية بالحي</span>
                      </span>

                      <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-end">
                        {isDueTomorrow && (
                          <button
                            type="button"
                            onClick={() => setReturnReminderTarget(item)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-1 active:scale-95"
                          >
                            <span className="material-symbols-outlined text-sm">schedule_send</span>
                            <span>تنسيق الإرجاع</span>
                          </button>
                        )}

                        {item.actionType === 'waiting_confirmation' ? (
                          <div className="flex-1 sm:flex-initial px-3 py-2 rounded-xl font-bold text-xs bg-[#e0e4da] dark:bg-slate-800 text-[#707a6c] dark:text-slate-400 flex items-center justify-center gap-1 border border-[#bfcaba]/30">
                            <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                            <span>بانتظار تأكيد استلام الجار ⏳</span>
                          </div>
                        ) : (
                          <>
                            <a
                              href={`tel:${item.neighborPhone}`}
                              className={`flex-1 sm:flex-initial ${isDarkMode
                                  ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                                  : 'bg-[#ebefe5] text-[#0d631b] border-[#0d631b]/30 hover:bg-[#e0e4da]'
                                } border px-3 py-2 rounded-xl font-bold text-xs transition-colors active:scale-95 shadow-2xs flex items-center justify-center gap-1`}
                            >
                              <span className="material-symbols-outlined text-sm">call</span>
                              <span>اتصال هاتفي 📞</span>
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: My Requests */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {myRequests.length === 0 ? (
            <div className={`col-span-full ${isDarkMode ? 'bg-[#152219] border-slate-800 text-slate-300' : 'bg-white border-[#bfcaba] text-[#181d17]'} rounded-2xl p-8 border text-center space-y-2`}>
              <span className="material-symbols-outlined text-4xl text-[#707a6c]">inbox</span>
              <p className="font-bold">لا توجد طلبات جارية حالياً</p>
            </div>
          ) : (
            myRequests.map((req) => (
              <article
                key={req.id}
                className={`${isDarkMode
                    ? 'bg-[#152219] border-slate-800 text-slate-100'
                    : 'bg-white border-[#bfcaba] text-[#181d17]'
                  } rounded-2xl p-3.5 sm:p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border flex flex-col justify-between`}
              >
                <div className="flex gap-3 sm:gap-4 items-start">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#bfcaba]/60 bg-gray-100">
                    <img src={req.image} alt={req.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-start gap-1 mb-1">
                      <h3 className="font-bold text-sm sm:text-base leading-snug break-words line-clamp-2 flex-1">{req.title}</h3>
                      <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold text-[11px] sm:text-xs whitespace-nowrap">
                        {req.daysRemaining}
                      </span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-[#40493d]'} flex items-center gap-1 mb-1`}>
                      <span className="material-symbols-outlined text-sm">person</span>
                      <span className="truncate">الطرف الآخر: {req.borrowerName}</span>
                      {req.borrowerName.includes('مجهول') && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300">
                          مشاركة مجهولة 🛡️
                        </span>
                      )}
                    </p>
                    <div className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-[#707a6c]'}`}>
                      تاريخ الطلب: {req.startDate}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#bfcaba]/30 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className={`text-[11px] ${isDarkMode ? 'text-emerald-400' : 'text-[#0d631b]'} font-bold flex items-center gap-1`}>
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span>قيد التنفيذ / جارية</span>
                  </span>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                    {req.actionType === 'confirm_receipt' ? (
                      <button
                        type="button"
                        onClick={(e) => handleConfirm(e, req)}
                        className="flex-1 sm:flex-initial px-3 py-2 bg-[#0d631b] hover:bg-[#2e7d32] text-white font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">task_alt</span>
                        <span>تأكيد استلام المساعدة ✅</span>
                      </button>
                    ) : (
                      <>
                        <a
                          href={`tel:${req.neighborPhone}`}
                          className="flex-1 sm:flex-initial px-3 py-2 bg-[#0d631b] hover:bg-[#2e7d32] text-white font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 active:scale-95"
                        >
                          <span className="material-symbols-outlined text-sm">call</span>
                          <span>اتصال هاتفي 📞</span>
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            setRatingTarget({
                              neighborName: req.borrowerName,
                              itemName: req.title,
                              targetUserId: currentUser?.id === req.borrowerId ? req.lenderId : req.borrowerId,
                            })
                          }
                          className="flex-1 sm:flex-initial px-3 py-2 bg-[#FFF3E0] text-[#964900] border border-[#fc820c]/30 font-bold text-xs rounded-xl hover:bg-[#ffe0b2] flex items-center justify-center gap-1 transition-colors"
                        >
                          <span
                            className="material-symbols-outlined text-sm text-[#fc820c] fill"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span>تقييم</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Ratings */}
      {activeTab === 'ratings' && (
        <div className="space-y-5">
          {/* Rating Summary Dashboard Banner */}
          <div
            className={`p-5 rounded-3xl border shadow-xs ${isDarkMode
                ? 'bg-[#152219] border-slate-800 text-slate-100'
                : 'bg-white border-[#bfcaba] text-[#181d17]'
              }`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
              {/* Score Box */}
              <div className="flex items-center gap-4 text-center md:text-right w-full md:w-auto">
                <div className="w-24 h-24 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 flex flex-col items-center justify-center shrink-0 shadow-inner">
                  <span className="text-3xl font-black text-amber-700 dark:text-amber-300">
                    {avgRatingStr}
                  </span>
                  <div className="flex text-amber-500 text-xs">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <span
                        key={st}
                        className="material-symbols-outlined text-sm fill"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold mt-0.5">
                    من 5.0 نقاط
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <h3 className="font-extrabold text-base sm:text-lg">
                    إجمالي تقييم الجيران والتبادلات 🌟
                  </h3>
                  <p className="text-xs text-[#707a6c] dark:text-slate-400 font-medium">
                    استناداً إلى ({ratings.length}) تقييماً موثّقاً من أهالي الحي بعد عمليات التبادل والحرص على التعاون.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold border border-emerald-300">
                      ثقة عالية 🛡️
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-xs font-bold">
                      100% التزام بالمواعيد ⏰
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bars Breakdown */}
              <div className="w-full md:w-64 space-y-1.5 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-12 text-[#707a6c] dark:text-slate-400 text-left">5 نجوم</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{
                        width: `${ratings.length ? (count5Star / ratings.length) * 100 : 80}%`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-extrabold">{count5Star}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-12 text-[#707a6c] dark:text-slate-400 text-left">4 نجوم</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{
                        width: `${ratings.length ? (count4Star / ratings.length) * 100 : 20}%`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-extrabold">{count4Star}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-12 text-[#707a6c] dark:text-slate-400 text-left">3 نجوم</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-300 rounded-full"
                      style={{
                        width: `${ratings.length ? (count3Star / ratings.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-extrabold">{count3Star}</span>
                </div>
              </div>
            </div>

            {/* Manual Rate Neighbor Button */}
            <div className="mt-4 pt-3 border-t border-[#bfcaba]/40 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-[#707a6c] dark:text-slate-400 font-medium">
                هل أتممت تبادلاً مؤخراً مع أحد الجيران؟
              </span>
              <button
                type="button"
                onClick={() =>
                  setRatingTarget({
                    neighborName: 'أحد الجيران بالحي',
                    itemName: 'تبادل  منزلية',
                  })
                }
                className="px-3.5 py-1.5 bg-[#0d631b] hover:bg-[#2e7d32] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">add_comment</span>
                <span>تقييم جار بعد تبادل 🌟</span>
              </button>
            </div>
          </div>

          {/* Filter Chips Toolbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setRatingFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${ratingFilter === 'all'
                  ? 'bg-[#0d631b] text-white shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border border-[#bfcaba] text-[#40493d] hover:bg-[#ebefe5]'
                }`}
            >
              جميع التقييمات ({ratings.length})
            </button>
            <button
              type="button"
              onClick={() => setRatingFilter('5star')}
              className={`px-3 py-1.5 rounded-xl transition-all ${ratingFilter === '5star'
                  ? 'bg-[#0d631b] text-white shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border border-[#bfcaba] text-[#40493d] hover:bg-[#ebefe5]'
                }`}
            >
              5 نجوم 🌟 ({count5Star})
            </button>
            <button
              type="button"
              onClick={() => setRatingFilter('4star')}
              className={`px-3 py-1.5 rounded-xl transition-all ${ratingFilter === '4star'
                  ? 'bg-[#0d631b] text-white shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border border-[#bfcaba] text-[#40493d] hover:bg-[#ebefe5]'
                }`}
            >
              4 نجوم 👍 ({count4Star})
            </button>
            <button
              type="button"
              onClick={() => setRatingFilter('comments')}
              className={`px-3 py-1.5 rounded-xl transition-all ${ratingFilter === 'comments'
                  ? 'bg-[#0d631b] text-white shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border border-[#bfcaba] text-[#40493d] hover:bg-[#ebefe5]'
                }`}
            >
              ملاحظات مفصّلة 💬
            </button>
          </div>

          {/* Ratings Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRatings.length === 0 ? (
              <div
                className={`col-span-full ${isDarkMode
                    ? 'bg-[#152219] border-slate-800 text-slate-300'
                    : 'bg-white border-[#bfcaba] text-[#181d17]'
                  } rounded-3xl p-8 border text-center space-y-2`}
              >
                <span className="material-symbols-outlined text-4xl text-[#707a6c]">
                  star_rate
                </span>
                <p className="font-bold">لا توجد تقييمات مطابقة لتحديد التصفية</p>
              </div>
            ) : (
              filteredRatings.map((rate) => (
                <article
                  key={rate.id}
                  className={`${isDarkMode
                      ? 'bg-[#152219] border-slate-800 text-slate-100'
                      : 'bg-white border-[#bfcaba] text-[#181d17]'
                    } rounded-3xl p-4 sm:p-5 border space-y-3 shadow-xs hover:shadow-md transition-all relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={rate.reviewerAvatar}
                        alt={rate.reviewerName}
                        className="w-10 h-10 rounded-2xl object-cover border-2 border-[#0d631b]/30 shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm sm:text-base truncate">
                          {rate.reviewerName}
                        </h4>
                        <span
                          className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-[#707a6c]'
                            } truncate flex items-center gap-1 font-semibold`}
                        >
                          <span className="material-symbols-outlined text-[14px] text-[#0d631b]">
                            handshake
                          </span>
                          <span>التبادل: {rate.itemName}</span>
                        </span>
                      </div>
                    </div>

                    {/* Star Badge */}
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900 shrink-0">
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((st) => (
                          <span
                            key={st}
                            className={`material-symbols-outlined text-xs ${st <= Math.round(rate.rating) ? 'fill text-amber-500' : 'text-gray-300'
                              }`}
                            style={{
                              fontVariationSettings:
                                st <= Math.round(rate.rating) ? "'FILL' 1" : "'FILL' 0",
                            }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="font-extrabold text-xs text-amber-900 dark:text-amber-300 mr-0.5">
                        {rate.rating}
                      </span>
                    </div>
                  </div>

                  {/* Tags list if available */}
                  {rate.tags && rate.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {rate.tags.map((tg, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-[#0d631b]/10 dark:bg-emerald-950/60 text-[#0d631b] dark:text-emerald-300 rounded-lg text-[10px] font-bold border border-[#0d631b]/20"
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Comment box */}
                  <p
                    className={`text-xs sm:text-sm ${isDarkMode
                        ? 'bg-slate-800/80 text-slate-200'
                        : 'bg-[#f7fbf0] text-[#181d17]'
                      } font-medium leading-relaxed p-3.5 rounded-2xl border border-[#bfcaba]/40 dark:border-slate-800`}
                  >
                    "{rate.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#707a6c] dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      تبادل موثّق بالحارة
                    </span>
                    <span>{rate.date}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}

      {/* Auto Thank You Modal */}
      {thankYouTargetItem && (
        <AutoThankYouModal
          isOpen={!!thankYouTargetItem}
          onClose={() => setThankYouTargetItem(null)}
          item={thankYouTargetItem}
          onConfirmWithThankYou={handleConfirmWithThankYou}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Rating Modal */}
      {ratingTarget && (
        <RateNeighborModal
          isOpen={!!ratingTarget}
          onClose={() => setRatingTarget(null)}
          neighborName={ratingTarget.neighborName}
          itemName={ratingTarget.itemName}
          onSubmitRating={handleAddRating}
        />
      )}

      {/* Return Item Reminder Modal */}
      {returnReminderTarget && (
        <ReturnReminderModal
          isOpen={!!returnReminderTarget}
          onClose={() => setReturnReminderTarget(null)}
          item={returnReminderTarget}
          onOpenMessage={onOpenMessage}
          isDarkMode={isDarkMode}
        />
      )}
    </main>
  );
};
