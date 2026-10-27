import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopAppBar } from './TopAppBar';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  onAddClick: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ onAddClick }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-background text-on-background font-body antialiased rtl flex flex-col">
      {location.pathname !== '/search' && <TopAppBar />}
      
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>

      <BottomNav onAddClick={onAddClick} />
    </div>
  );
};
