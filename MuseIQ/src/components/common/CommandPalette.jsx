import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Moon, Sun, Library, BarChart2, BrainCircuit, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSelect = (action) => {
    setIsOpen(false);
    action();
  };

  const commands = [
    { id: 'search', title: 'Search Albums', icon: Search, onSelect: () => navigate('/search') },
    { id: 'library', title: 'Go to Library', icon: Library, onSelect: () => navigate('/library') },
    { id: 'analytics', title: 'Go to Analytics', icon: BarChart2, onSelect: () => navigate('/analytics') },
    { id: 'ai', title: 'Go to AI Insights', icon: BrainCircuit, onSelect: () => navigate('/ai-insights') },
    { id: 'theme-light', title: 'Toggle Light Mode', icon: Sun, onSelect: () => setTheme('light') },
    { id: 'theme-dark', title: 'Toggle Dark Mode', icon: Moon, onSelect: () => setTheme('dark') },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-bg-secondary rounded-xl shadow-2xl overflow-hidden border border-border mx-4"
          >
            <div className="flex items-center px-4 py-4 border-b border-border">
              <Search className="h-5 w-5 text-text-secondary mr-3" />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-secondary text-lg"
                placeholder="Type a command or search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="text-xs text-text-secondary font-medium bg-bg-primary px-2 py-1 rounded border border-border">
                ESC
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="py-14 text-center text-text-secondary">
                  No commands found for "{searchQuery}"
                </div>
              ) : (
                filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd.onSelect)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-text-primary hover:bg-primary/10 hover:text-primary transition-colors focus:bg-primary/10 focus:outline-none"
                  >
                    <cmd.icon className="h-5 w-5" />
                    <span className="font-medium">{cmd.title}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
