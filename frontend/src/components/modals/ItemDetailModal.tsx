import React, { useState } from 'react';
import { Post, Rating } from '../../types';
import { PrivacyPledgeModal } from './PrivacyPledgeModal';
import { useAuth } from '../../contexts/AuthContext';

interface ItemDetailModalProps {
  post: Post | null;
  onClose: () => void;
  onRequestSubmitted: (postTitle: string, message: string, requesterName?: string) => void;
  onOpenChat: (ownerName: string) => void;
  ratings?: Rating[];
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  post,
  onClose,
  onRequestSubmitted,
  onOpenChat,
  ratings = [],
}) => {
  const [requestMessage, setRequestMessage] = useState('');
  const [borrowDays, setBorrowDays] = useState(post?.maxDays || 3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isAnonymousSharing, setIsAnonymousSharing] = useState(false);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [hasPledged, setHasPledged] = useState(false);
  const [showOwnerReviews, setShowOwnerReviews] = useState(false);
  const { currentUser } = useAuth();

  if (!post) return null;

  const isAnonymousOrUrgent = post.isAnonymous || post.type === 'urgent' || post.requiresPrivacyPledge;
  const displayOwnerName = post.isAnonymous
    ? 'أسرة متعففة بالحي (هوية محمية 🛡️)'
    : post.ownerName;

  // دالة لفتح الدردشة. تتطلب التوقيع على "ميثاق الخصوصية" أولاً إذا كان الطلب طارئاً أو به هوية محمية
  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if ((isAnonymousOrUrgent || isAnonymousSharing) && !hasPledged) {
      setShowPledgeModal(true);
    } else {
      onOpenChat(displayOwnerName);
    }
  };

  // دالة الموافقة على ميثاق الخصوصية (Privacy Pledge) وإتمام طلب المصافحة (Handshake)
  const handleAcceptPledge = () => {
    setHasPledged(true);
    setShowPledgeModal(false);
    setIsSubmitting(true);
    const finalRequesterName = isAnonymousSharing ? 'جار مجهول' : 'ياسين جمال';
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      onRequestSubmitted(
        post.title,
        requestMessage || 'أود المساهمة في هذا التبادل مع التزام كامل بميثاق الحفاظ على الخصوصية.',
        finalRequesterName
      );
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  // معالجة الإرسال عند تلبية الطلب (طلب استعارة أو تقديم مساعدة)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if ((isAnonymousOrUrgent || isAnonymousSharing) && !hasPledged) {
      setShowPledgeModal(true);
      return;
    }
    setIsSubmitting(true);
    const finalRequesterName = isAnonymousSharing ? 'جار مجهول' : 'ياسين جمال';
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      onRequestSubmitted(
        post.title,
        requestMessage || 'مرحباً، أنا أمتلك هذا الغرض وسأقوم بمساعدتك.',
        finalRequesterName
      );
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col overflow-hidden transition-colors bg-white text-[#181d17]"
      >
        {/* Header bar */}
        <div className="absolute top-3 left-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-md"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Image Banner */}
          {post.image ? (
            <div className="w-full h-64 bg-[#ebefe5] relative overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full font-bold text-xs shadow-md ${
                    post.type === 'loan'
                      ? 'bg-[#0d631b] text-white'
                      : post.type === 'gift'
                      ? 'bg-[#0369a1] text-white'
                      : 'bg-[#fc820c] text-white'
                  }`}
                >
                  {(currentUser?.id !== post.ownerId) && post.type === 'loan'
                    ? `مطلوب إعارة (${post.maxDays} أيام)`
                    : post.type === 'gift'
                    ? 'مطلوب مساعدة/هدية'
                    : 'طلب احتیاج عاجل'}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-36 bg-[#2e7d32]/10 p-6 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-[#0d631b]">volunteer_activism</span>
            </div>
          )}

          {/* Details Section */}
          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#707a6c] mb-1 font-semibold">
                <span className="material-symbols-outlined text-sm text-[#0d631b]">location_on</span>
                <span>{post.locationName}</span>
                <span>•</span>
                <span>{post.distanceLabel}</span>
              </div>
              <h1 className="font-bold text-2xl text-[#181d17] leading-snug">{post.title}</h1>
            </div>

            {/* Owner Profile Header */}
            <div className="bg-[#f1f5eb] p-4 rounded-2xl flex items-center justify-between border border-[#bfcaba]/60 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {post.isAnonymous ? (
                  <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xl border-2 border-emerald-500 shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-2xl">shield_person</span>
                  </div>
                ) : (
                  <img
                    src={post.ownerAvatar}
                    alt={post.ownerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#2e7d32] shrink-0"
                  />
                )}
                <div>
                  <h3 className="font-bold text-base text-[#181d17]">
                    {displayOwnerName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {post.isAnonymous ? (
                      <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">verified_user</span>
                        طلب محمي التضامن والخصوصية
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowOwnerReviews(!showOwnerReviews)}
                        className="text-xs text-[#964900] bg-[#FFF3E0] hover:bg-[#ffe0b2] px-2.5 py-0.5 rounded-full border border-[#fc820c]/30 font-bold flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs text-[#fc820c] fill">star</span>
                        <span>{post.ownerRating} / 5.0 (تقييمات الجيران)</span>
                        <span className="material-symbols-outlined text-xs">
                          {showOwnerReviews ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <a
                href={`tel:${post.owner?.phone}`}
                className="px-3.5 py-2 bg-white text-[#0d631b] border border-[#0d631b] hover:bg-[#2e7d32] hover:text-white rounded-xl font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-base">
                  {isAnonymousOrUrgent ? 'gavel' : 'phone'}
                </span>
                <span>{isAnonymousOrUrgent ? 'تقديم مساعدة' : 'اتصال'}</span>
              </a>
            </div>

            {/* Expandable Owner Reviews List */}
            {!post.isAnonymous && showOwnerReviews && (
              <div className="bg-[#f8faf7] p-3.5 rounded-2xl border border-[#bfcaba]/60 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-[#181d17]">
                  <span>آراء وتقييمات الجيران ({ratings.length}):</span>
                  <span className="text-[#0d631b]">موثّقة بالحارة 🛡️</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {ratings.map((rt) => (
                    <div
                      key={rt.id}
                      className="bg-white p-2.5 rounded-xl border border-[#bfcaba]/40 text-xs space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#181d17]">{rt.reviewerName}</span>
                        <span className="text-amber-600 font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs fill">star</span>
                          {rt.rating}
                        </span>
                      </div>
                      <p className="text-[#40493d] font-medium leading-relaxed">"{rt.comment}"</p>
                      <div className="text-[10px] text-[#707a6c]">{rt.date} • {rt.itemName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Shield Info Banner for Urgent/Anonymous Needs */}
            {isAnonymousOrUrgent && (
              <div className="bg-[#FFF3E0] p-3.5 rounded-2xl border border-[#fc820c]/40 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#fc820c] text-xl shrink-0 mt-0.5">
                  shield_lock
                </span>
                <div className="text-xs text-[#964900] space-y-0.5">
                  <strong className="block font-bold">حماية الخصوصية والكرامة مفعلة 🛡️</strong>
                  <p className="leading-relaxed">
                    يخضع هذا الطلب لتعهد إلكتروني ملزم بحفظ الخصوصية والسرية التامة لضمان كرامة المستفيد وعدم كشف هويته لأي طرف خارجي.
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm text-[#181d17]">التفاصيل والمعلومات:</h4>
              <p className="text-sm text-[#40493d] leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-[#bfcaba]/40">
                {post.description}
              </p>
            </div>

            {/* If loan: duration picker */}
            {post.type === 'loan' && (
              <div className="bg-[#FFF3E0] p-4 rounded-2xl border border-[#fc820c]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#964900]">المدة التي سأعير فيها الغرض:</span>
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-[#bfcaba]">
                    <button
                      type="button"
                      onClick={() => setBorrowDays(Math.max(1, borrowDays - 1))}
                      className="px-2 text-base font-bold text-[#707a6c]"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-[#181d17] min-w-[2ch] text-center">
                      {borrowDays} يوم
                    </span>
                    <button
                      type="button"
                      onClick={() => setBorrowDays(Math.min(30, borrowDays + 1))}
                      className="px-2 text-base font-bold text-[#0d631b]"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#707a6c]">المدة التي طلبها الجار: {post.maxDays} أيام</p>
              </div>
            )}

            {/* Request Message Form */}
            {post.ownerId === currentUser?.id ? (
              <div className="bg-[#f1f5eb] p-4 rounded-xl text-center border border-[#bfcaba] mt-4 shadow-inner">
                <span className="material-symbols-outlined text-[#0d631b] text-3xl mb-1">person</span>
                <p className="font-bold text-[#181d17]">أنت صاحب هذا الطلب</p>
                <p className="text-xs text-[#707a6c]">لا يمكنك تقديم مساعدة لطلبك الخاص.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
                {/* Anonymous Sharing Option Box */}
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 rounded-2xl space-y-2">
                  <label className="flex items-center justify-between cursor-pointer select-none">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-lg">shield_person</span>
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#181d17] dark:text-slate-100 block">
                          مشاركة مجهولة الهوية 🛡️
                        </span>
                        <span className="text-[11px] text-[#40493d] dark:text-slate-300 block">
                          يظهر اسمك كـ "جار مجهول" في سجلات التبادل لدى الطرف الآخر للحفاظ على الخصوصية
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isAnonymousSharing}
                      onChange={(e) => setIsAnonymousSharing(e.target.checked)}
                      className="w-5 h-5 accent-[#0d631b] rounded-md cursor-pointer shrink-0"
                    />
                  </label>
                  {isAnonymousSharing && (
                    <div className="text-[11px] text-[#0d631b] dark:text-emerald-400 font-semibold bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 animate-in fade-in">
                      <span className="material-symbols-outlined text-base shrink-0">verified_user</span>
                      <span>سيُطلب منك الموافقة على ميثاق الحفاظ على خصوصية المستلم عند الموافقة وإرسال الطلب.</span>
                    </div>
                  )}
                </div>

                <label className="block font-bold text-sm text-[#181d17]">
                  رسالة توضيحية للجار:
                </label>
                <textarea
                  rows={2}
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="اكتب رسالة توضح فيها كيف يمكنك المساعدة ووقت التسليم..."
                  className="w-full p-3 border border-[#bfcaba] rounded-xl text-sm font-medium focus:border-[#0d631b] outline-none shadow-2xs resize-none"
                />

                {submittedSuccess ? (
                  <div className="bg-emerald-100 text-emerald-800 p-3 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 animate-in fade-in">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    <span>تم ارسال طلبك بنجاح إلى الجار!</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full h-13 rounded-xl font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all ${
                      post.type === 'urgent'
                        ? 'bg-[#fc820c] hover:bg-[#964900] text-white'
                        : post.type === 'gift'
                        ? 'bg-[#0369a1] hover:bg-[#0284c7] text-white'
                        : 'bg-[#0d631b] hover:bg-[#2e7d32] text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <span>جاري الإرسال...</span>
                    ) : (
                      <>
                        <span>
                          {post.type === 'loan'
                            ? 'أنا أمتلك هذا - سأعيره'
                            : post.type === 'gift'
                            ? 'أنا أمتلك هذا - سأتبرع به'
                            : 'تلبية النداء والمساعدة'}
                        </span>
                        <span className="material-symbols-outlined text-xl">handshake</span>
                      </>
                    )}
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Undertaking Modal */}
      <PrivacyPledgeModal
        isOpen={showPledgeModal}
        onClose={() => setShowPledgeModal(false)}
        postTitle={post.title}
        recipientName={displayOwnerName}
        onAcceptPledge={handleAcceptPledge}
      />
    </div>
  );
};
