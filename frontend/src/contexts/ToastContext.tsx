import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const showError = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const showInfo = useCallback((message: string) => showToast(message, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, showSuccess, showError, showInfo, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none rtl">
        {toasts.map((toast) => {
          let bgClass = 'bg-white dark:bg-[#181818] border-gray-200 dark:border-[#333] text-[#181d17] dark:text-white';
          let icon = 'info';
          let iconColor = 'text-blue-600 dark:text-blue-400';

          if (toast.type === 'success') {
            bgClass = 'bg-[#f0faf1] dark:bg-[#122216] border-[#a3d9ad] dark:border-[#1e4624] text-[#0d631b] dark:text-emerald-300';
            icon = 'check_circle';
            iconColor = 'text-[#0d631b] dark:text-emerald-400';
          } else if (toast.type === 'error') {
            bgClass = 'bg-[#fef2f2] dark:bg-[#281414] border-[#fca5a5] dark:border-[#521b1b] text-red-800 dark:text-red-300';
            icon = 'error';
            iconColor = 'text-red-600 dark:text-red-400';
          } else if (toast.type === 'warning') {
            bgClass = 'bg-[#fffbeb] dark:bg-[#282114] border-[#fcd34d] dark:border-[#523e1b] text-amber-800 dark:text-amber-300';
            icon = 'warning';
            iconColor = 'text-amber-600 dark:text-amber-400';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-xl border text-sm font-medium transition-all duration-300 transform translate-y-0 opacity-100 ${bgClass}`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className={`material-symbols-outlined shrink-0 text-xl ${iconColor}`}>{icon}</span>
                <span className="leading-snug truncate">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
