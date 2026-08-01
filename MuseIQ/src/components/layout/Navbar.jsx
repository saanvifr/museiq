import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/search': return 'Discover Music';
      case '/library': return 'My Library';
      case '/analytics': return 'Analytics Dashboard';
      case '/ai-insights': return 'AI Music Insights';
      default: return 'MuseIQ';
    }
  };

  return (
    <header className="h-16 bg-bg-secondary border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10 shadow-sm transition-all duration-150">
      <div className="flex items-center flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 mr-2 text-text-secondary hover:text-text-primary rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-text-primary truncate">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search shortcut indicator (Clickable) */}
        <button 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="hidden sm:flex items-center text-sm text-text-secondary bg-bg-primary hover:bg-bg-primary/80 transition-colors px-3 py-1.5 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <SearchIcon className="h-4 w-4 mr-2" />
          <span>Cmd K</span>
        </button>

        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${showNotifications ? 'bg-bg-primary text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'}`}
          >
            <Bell className="h-5 w-5" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 md:w-80 bg-bg-secondary rounded-lg shadow-xl border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-border">
                <h3 className="font-semibold text-text-primary">Notifications</h3>
              </div>
              <div className="px-4 py-8 text-center text-text-secondary">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">You're all caught up!</p>
              </div>
            </div>
          )}
        </div>

        <Link to="/settings" className="flex items-center group">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm overflow-hidden border border-transparent group-hover:border-primary/50 group-hover:ring-2 group-hover:ring-primary/20 transition-all cursor-pointer">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
        </Link>
      </div>
    </header>
  );
};

const SearchIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default Navbar;
