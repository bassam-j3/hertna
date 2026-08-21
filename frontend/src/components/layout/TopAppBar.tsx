import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NotificationModal } from '../NotificationModal';
import { useAuth } from '../../contexts/AuthContext';

export const TopAppBar: React.FC = () => {
  const { currentUser, selectedLocation, setSelectedLocation } = useAuth();
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
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
      setUnreadCount(data.filter((n: any) => !n.read).length);
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
      <header className="bg-surface fixed top-0 w-full z-40 border-b border-outline-variant shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-screen-xl mx-auto rtl">
          {/* Brand Logo / Leading */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95">
            <img
              alt="Haretna Logo"
              className="h-10 w-10 object-contain rounded-md"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcPZoh8Nkef0hTSPv_uK69kfq9Ltv8r7WPjIWf8iI1DSUKqwL56jzpn_G4asiHIqP4JvQr9XNuVH-AKNRZBEh8dl-VjktgXYdO_qh3aDsMwrvvMth4CJW3JqbkhIPWxQQI_yJJuEBeSDHsms0-0Xz4V6YWm9FzcbY_SS_JVq3FKkZ27Fn9PchKVS6eSHRnCK0hy3ZSmsGYaS-WRj0geWb_M8v70KAeHX2YbVjSi2n4TyiUbCwJlk7N"
            />
          </Link>


          {/* Trailing Icons */}
          <div className="flex items-center gap-2">

            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-full transition-colors active:scale-95 duration-150"
            >
              <span className="material-symbols-outlined">notifications</span>
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
        onAddSimulatedNotification={handleAddSimulatedNotification as any}
      />
    </>
  );
};
