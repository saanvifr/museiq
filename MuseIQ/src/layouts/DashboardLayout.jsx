import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Toast from '../components/common/Toast';
import { CommandPalette } from '../components/common/CommandPalette';
import { GlobalPlayer } from '../components/common/GlobalPlayer';
import { usePlayer } from '../contexts/PlayerContext';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentTrack } = usePlayer();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden transition-opacity" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-60 transform transition-transform duration-250 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar closeSidebar={closeSidebar} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 overflow-y-auto p-6 md:p-8 w-full max-w-[1400px] mx-auto ${currentTrack ? 'pb-28 md:pb-32' : ''}`}>
          <Outlet />
        </main>
      </div>
      <Toast />
      <CommandPalette />
      <GlobalPlayer />
    </div>
  );
};

export default DashboardLayout;
