import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LibraryProvider } from './contexts/LibraryContext';
import { PlaylistProvider } from './contexts/PlaylistContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlayerProvider } from './contexts/PlayerContext';
import ErrorBoundary from './components/common/ErrorBoundary';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Playlists from './pages/Playlists';
import Discover from './pages/Discover';

// Lazy loaded components for code splitting optimization
const Analytics = lazy(() => import('./pages/Analytics'));
const AIInsights = lazy(() => import('./pages/AIInsights'));

// Loading fallback for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <LibraryProvider>
              <PlaylistProvider>
                <PlayerProvider>
                  <Router>
                    <Routes>
                    
                    {/* Public Routes */}
                    <Route element={<PublicRoute />}>
                      <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                      </Route>
                    </Route>

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route element={<DashboardLayout />}>
                        <Route path="/search" element={<Search />} />
                        <Route path="/discover" element={<Discover />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/playlists" element={<Playlists />} />
                        <Route path="/settings" element={<Settings />} />
                        
                        <Route path="/analytics" element={
                          <Suspense fallback={<PageLoader />}>
                            <Analytics />
                          </Suspense>
                        } />
                        
                        <Route path="/ai-insights" element={
                          <Suspense fallback={<PageLoader />}>
                            <AIInsights />
                          </Suspense>
                        } />
                      </Route>
                    </Route>

                    {/* Default Route */}
                    <Route path="*" element={<Navigate to="/library" replace />} />
                    
                    </Routes>
                  </Router>
                </PlayerProvider>
              </PlaylistProvider>
            </LibraryProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
