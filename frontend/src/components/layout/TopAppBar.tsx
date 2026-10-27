import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NotificationModal } from '../modals/NotificationModal';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationItem } from '../../types';

export const TopAppBar: React.FC = () => {
  const { currentUser, selectedLocation, setSelectedLocation } = useAuth();
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const loadNotifs = async () => {
    if (!currentUser?.isLoggedIn) return;
    try {
      const { NotificationsService } = await import('../../services/apiClient');
      const data = await NotificationsService.getAll();
      setNotifications(data);
      setUnreadCount(data.filter((n: NotificationItem) => !n.read).length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (currentUser?.isLoggedIn) {
      loadNotifs();
    }
  }, [currentUser?.isLoggedIn]);

  const handleMarkAllRead = async () => {
    try {
      const { NotificationsService } = await import('../../services/apiClient');
      await NotificationsService.markAllAsRead();
      loadNotifs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleRead = async (id: string) => {
    try {
      const { NotificationsService } = await import('../../services/apiClient');
      await NotificationsService.markAsRead(id);
      loadNotifs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const { NotificationsService } = await import('../../services/apiClient');
      await NotificationsService.delete(id);
      loadNotifs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    try {
      const { NotificationsService } = await import('../../services/apiClient');
      await NotificationsService.deleteAll();
      loadNotifs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSimulatedNotification = async (title: string, message: string, type: 'request' | 'approval' | 'urgent' | 'message') => {
    try {
      const { NotificationsService } = await import('../../services/apiClient');
      await NotificationsService.create({
        title,
        message,
        type,
      });
      loadNotifs();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="bg-surface dark:bg-surface-dim shadow-sm w-full sticky top-0 z-40">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-sm w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-2">
            <img src="/haretna_logo.png" alt="حارتنا" className="w-8 h-8 rounded-lg object-contain" />
            <Link to="/" className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary dark:text-primary-fixed font-bold leading-none decoration-none">
              حارتنا
            </Link>
            {/* Neighborhood Dropdown */}
            <div className="ml-4 flex items-center bg-surface-container-low rounded-full px-3 py-1.5 cursor-pointer">
              <span className="font-label-md text-label-md text-on-surface">{selectedLocation ? selectedLocation.split(' - ')[0] : 'المهاجرين'}</span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm ml-1" data-icon="expand_more">expand_more</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 bg-surface-container-low rounded-full px-3 py-1">
              <span className="material-symbols-outlined text-secondary text-sm" data-icon="verified">verified</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">موثوق</span>
            </div>
            <button 
              onClick={() => setIsNotifOpen(true)}
              className="relative text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high transition-colors p-2 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-error border-2 border-surface rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => {
          setIsNotifOpen(false);
          loadNotifs();
        }}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onToggleRead={handleToggleRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAll={handleClearAll}
        onAddSimulatedNotification={handleAddSimulatedNotification}
      />
    </>
  );
};
