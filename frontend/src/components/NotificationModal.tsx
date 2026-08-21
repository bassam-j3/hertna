import React, { useState } from 'react';
import { NotificationItem } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onToggleRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  onAddSimulatedNotification?: (title: string, message: string, type: 'request' | 'approval' | 'urgent' | 'message') => void;
  isDarkMode?: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onToggleRead,
  onDeleteNotification,
  onClearAll,
  onNotificationClick,
  onAddSimulatedNotification,
  isDarkMode = false,
}) => {
  if (!isOpen) return null;

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'request' | 'urgent' | 'message'>('all');
  const [showSimulateInput, setShowSimulateInput] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [customType, setCustomType] = useState<'request' | 'approval' | 'urgent' | 'message'>('urgent');

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'request') return n.type === 'request' || n.type === 'approval';
    if (activeFilter === 'urgent') return n.type === 'urgent';
    if (activeFilter === 'message') return n.type === 'message';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSimulateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customMsg.trim()) return;
    if (onAddSimulatedNotification) {
      onAddSimulatedNotification(customTitle, customMsg, customType);
      setCustomTitle('');
      setCustomMsg('');
      setShowSimulateInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={onClose}>
      {/* Main Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex flex-col overflow-hidden transition-colors ${
          isDarkMode
            ? 'bg-[#142017] border border-slate-800 text-slate-100'
            : 'bg-white border border-[#bfcaba] text-[#181d17]'
        }`}
      >
        {/* Header */}
        <header className="px-5 py-4 border-b border-[#bfcaba]/40 flex items-center justify-between bg-[#f7fbf0] dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0d631b] text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#181d17] dark:text-slate-100">
                  إشعارات الحي التفاعلية 🔔
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-[10px] font-extrabold">
                    {unreadCount} غير مقروء
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#707a6c] dark:text-slate-400">
                تنبيهات طلبات التبادل والاحتياجات العاجلة بين الجيران
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSimulateInput(!showSimulateInput)}
              className="px-2.5 py-1.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded-xl font-bold text-xs flex items-center gap-1 border border-amber-300 hover:bg-amber-200 transition-colors"
              title="تجربة إرسال إشعار"
            >
              <span className="material-symbols-outlined text-sm">add_alert</span>
              <span className="hidden sm:inline">تجربة إشعار</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </header>

        {/* Simulate New Notification Form */}
        {showSimulateInput && (
          <form
            onSubmit={handleSimulateSend}
            className="p-3.5 bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-900 space-y-2 animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">bolt</span>
                ارسل إشعاراً تجريبياً حياً للتفاعل:
              </span>
              <select
                value={customType}
                onChange={(e) => setCustomType(e.target.value as any)}
                className="text-xs bg-white dark:bg-slate-900 border border-amber-300 rounded-lg px-2 py-1 font-bold outline-none"
              >
                <option value="urgent">🚨 احتياج عاجل</option>
                <option value="request">🤝 طلب تبادل</option>
                <option value="approval">✅ موافقة استلام</option>
                <option value="message">💬 رسالة من جار</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="عنوان الإشعار (مثلاً: طلب صيانة دريل)"
                className="flex-1 h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl outline-none font-medium"
              />
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="تفاصيل الإشعار للحي..."
                className="flex-1 h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl outline-none font-medium"
              />
              <button
                type="submit"
                className="h-9 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shrink-0 flex items-center justify-center gap-1"
              >
                <span>إرسال الإشعار</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </form>
        )}

        {/* Filter Toolbar & Actions */}
        <div className="p-3 bg-[#f1f5eb] dark:bg-slate-900/90 border-b border-[#bfcaba]/40 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#0d631b] text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100'
              }`}
            >
              الكل ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                activeFilter === 'unread'
                  ? 'bg-[#0d631b] text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100'
              }`}
            >
              غير مقروء ({unreadCount})
            </button>
            <button
              onClick={() => setActiveFilter('request')}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                activeFilter === 'request'
                  ? 'bg-[#0d631b] text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100'
              }`}
            >
              طلبات وموافقات
            </button>
            <button
              onClick={() => setActiveFilter('urgent')}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                activeFilter === 'urgent'
                  ? 'bg-[#0d631b] text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100'
              }`}
            >
              عاجل 🚨
            </button>
          </div>

          {/* Quick Bulk Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[#0d631b] dark:text-emerald-400 hover:underline flex items-center gap-0.5 text-[11px]"
            >
              <span className="material-symbols-outlined text-sm">done_all</span>
              <span>تعليم الكل كقراءة</span>
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={onClearAll}
              className="text-red-700 dark:text-red-400 hover:underline flex items-center gap-0.5 text-[11px]"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              <span>مسح الكل</span>
            </button>
          </div>
        </div>

        {/* Notifications Interactive List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#bfcaba]/30 dark:divide-slate-800">
          {filteredNotifications.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-2xl">notifications_off</span>
              </div>
              <p className="text-xs text-[#707a6c] dark:text-slate-400 font-semibold">
                لا توجد إشعارات تطابق التصفية الحالية
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 transition-colors flex items-start gap-3 group relative ${
                  !n.read
                    ? 'bg-[#0d631b]/5 dark:bg-emerald-950/40 font-semibold'
                    : 'bg-white dark:bg-slate-900 hover:bg-[#f1f5eb] dark:hover:bg-slate-800/80'
                }`}
              >
                {/* Icon Badge */}
                <div
                  onClick={() => onToggleRead(n.id)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer shadow-2xs transition-transform active:scale-90 ${
                    n.type === 'urgent'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                      : n.type === 'request'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300'
                  }`}
                  title={n.read ? 'تعليم كغير مقروء' : 'تعليم كمقروء'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {n.type === 'urgent'
                      ? 'priority_high'
                      : n.type === 'request'
                      ? 'handshake'
                      : n.type === 'approval'
                      ? 'verified'
                      : 'chat'}
                  </span>
                </div>

                {/* Content */}
                <div
                  onClick={() => {
                    onToggleRead(n.id);
                    if (onNotificationClick) onNotificationClick(n);
                  }}
                  className="flex-1 space-y-1 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs sm:text-sm text-[#181d17] dark:text-slate-100 flex items-center gap-1.5">
                      <span>{n.title}</span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#0d631b] dark:bg-emerald-400 inline-block" />
                      )}
                    </h4>
                    <span className="text-[10px] text-[#707a6c] dark:text-slate-400 font-medium">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-[#40493d] dark:text-slate-300 font-normal leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => onDeleteNotification(n.id)}
                  className="p-1 text-gray-300 hover:text-red-600 rounded-lg transition-colors shrink-0 opacity-70 group-hover:opacity-100"
                  title="حذف الإشعار"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
