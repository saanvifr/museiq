import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Library, Search, BarChart2, BrainCircuit, LogOut, Settings, ListMusic, Compass, X, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ closeSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/search', icon: Home },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'My Library', path: '/library', icon: Library },
    { name: 'Playlists', path: '/playlists', icon: ListMusic },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'AI Insights', path: '/ai-insights', icon: BrainCircuit },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-sidebar-bg text-white flex flex-col min-h-screen sticky top-0 transition-colors duration-300">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Library className="h-6 w-6 text-primary" />
          MuseIQ
        </h1>
        {closeSidebar && (
          <button onClick={closeSidebar} className="lg:hidden text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-gray-400 hover:bg-border/50 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-sm text-gray-300">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-bg-primary border border-border shrink-0">
                {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
            </div>
            <span className="font-medium truncate">{user?.name || 'User'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-gray-400 hover:bg-border/50 hover:text-white transition-all"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
