import React from 'react';
import { NavLink } from 'react-router-dom';

interface BottomNavProps {
  onAddClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onAddClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe h-20 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md shadow-lg rounded-t-3xl border-t border-outline-variant/30 rtl">
      {/* Home */}
      <NavLink 
        to="/"
        className={({ isActive }) => `flex flex-col items-center justify-center rounded-full p-2 transition-transform duration-150 ${isActive ? 'bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container scale-95' : 'text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed'}`}
      >
        {({ isActive }) => (
          <>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>home</span>
            <span className="font-label-sm text-label-sm mt-1">الرئيسية</span>
          </>
        )}
      </NavLink>
      
      {/* Search */}
      <NavLink 
        to="/search"
        className={({ isActive }) => `flex flex-col items-center justify-center rounded-full p-2 transition-transform duration-150 ${isActive ? 'bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container scale-95' : 'text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed'}`}
      >
        {({ isActive }) => (
          <>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>search</span>
            <span className="font-label-sm text-label-sm mt-1">بحث</span>
          </>
        )}
      </NavLink>
      
      {/* Add */}
      <button onClick={onAddClick} className="flex flex-col items-center justify-center rounded-full p-2 transition-transform duration-150 text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>add</span>
        <span className="font-label-sm text-label-sm mt-1 text-on-surface-variant">إضافة</span>
      </button>
      
      {/* Swaps */}
      <NavLink 
        to="/swaps"
        className={({ isActive }) => `flex flex-col items-center justify-center rounded-full p-2 transition-transform duration-150 ${isActive ? 'bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container scale-95' : 'text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed'}`}
      >
        {({ isActive }) => (
          <>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>swap_horiz</span>
            <span className="font-label-sm text-label-sm mt-1">مبادلاتي</span>
          </>
        )}
      </NavLink>
      
      {/* Profile */}
      <NavLink 
        to="/profile"
        className={({ isActive }) => `flex flex-col items-center justify-center rounded-full p-2 transition-transform duration-150 ${isActive ? 'bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container scale-95' : 'text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed'}`}
      >
        {({ isActive }) => (
          <>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>person</span>
            <span className="font-label-sm text-label-sm mt-1">حسابي</span>
          </>
        )}
      </NavLink>
    </nav>
  );
};
