import React from 'react';
import { Outlet } from 'react-router-dom';
import Toast from '../components/common/Toast';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center text-primary mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <span className="text-3xl font-bold ml-3 text-text-primary">MuseIQ</span>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-bg-secondary py-8 px-4 shadow-soft sm:rounded-xl sm:px-10 border border-border">
          <Outlet />
        </div>
      </div>
      <Toast />
    </div>
  );
};

export default AuthLayout;
