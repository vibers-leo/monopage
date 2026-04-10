'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, X, Camera } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'instagram';
  message: string;
}

interface ToastProviderProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const icons = {
  success: <Check size={14} />,
  error: <AlertTriangle size={14} />,
  info: <AlertTriangle size={14} />,
  instagram: <Camera size={14} />,
};

const colors = {
  success: 'bg-black text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-gray-800 text-white',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
};

export function ToastContainer({ toasts, onDismiss }: ToastProviderProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg ${colors[toast.type]}`}
          >
            {icons[toast.type]}
            <span className="text-xs font-bold flex-1">{toast.message}</span>
            <button onClick={() => onDismiss(toast.id)} className="opacity-60 hover:opacity-100">
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Auto-dismiss hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, addToast, dismiss };
}
