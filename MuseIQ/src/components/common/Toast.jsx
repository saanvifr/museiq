import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className={clsx(
              'pointer-events-auto flex items-center w-80 p-4 rounded-lg shadow-lg border bg-bg-secondary',
              {
                'border-success': toast.type === 'success',
                'border-error': toast.type === 'error',
                'border-primary': toast.type === 'info',
              }
            )}
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-success" />}
              {toast.type === 'error' && <XCircle className="h-5 w-5 text-error" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-primary" />}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-text-primary">
                {toast.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => removeToast(toast.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
