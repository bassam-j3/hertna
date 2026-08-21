import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface BottomNavProps {
  onAddClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onAddClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isProfile = location.pathname === '/profile';

  return (
    <nav className="bg-surface-container-lowest fixed bottom-0 w-full z-[60] rounded-t-xl border-t border-outline-variant shadow-[0_-4px_12px_0_rgba(0,0,0,0.04)]">
      <div className="flex justify-around items-center h-20 max-w-screen-xl mx-auto px-2 rtl">
        {/* Home */}
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center rounded-full px-4 py-1 transition-all active:scale-90 duration-200 ${isHome ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-primary'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isHome ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          <span className="font-label-sm text-label-sm mt-1">الرئيسية</span>
        </button>
        
        {/* Search */}
        <button 
          onClick={() => navigate('/search')}
          className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-200 ${location.pathname === '/search' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/search' ? "'FILL' 1" : "'FILL' 0" }}>search</span>
          <span className="font-label-sm text-label-sm mt-1">بحث</span>
        </button>
        
        {/* Add (FAB-like) */}
        <button onClick={onAddClick} className="flex flex-col items-center justify-center -mt-6 group hover:text-primary transition-all active:scale-90 duration-200">
          <div className="bg-primary text-on-primary p-3 rounded-full shadow-md flex items-center justify-center border-4 border-surface-container-lowest">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
          </div>
          <span className="font-label-sm text-label-sm mt-1 text-on-surface-variant">إضافة</span>
        </button>
        
        {/* Swaps */}
        <button 
          onClick={() => navigate('/swaps')}
          className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-200 ${location.pathname === '/swaps' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/swaps' ? "'FILL' 1" : "'FILL' 0" }}>swap_horiz</span>
          <span className="font-label-sm text-label-sm mt-1">مبادلاتي</span>
        </button>
        
        {/* Profile */}
        <button 
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-200 ${isProfile ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isProfile ? "'FILL' 1" : "'FILL' 0" }}>person</span>
          <span className="font-label-sm text-label-sm mt-1">حسابي</span>
        </button>
      </div>
    </nav>
  );
};
