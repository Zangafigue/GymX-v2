/**
 * Toast.tsx — Notifications non-bloquantes (Premium)
 *
 * Remplace tous les alert() natifs de l'application.
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  icon?: React.ReactNode;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
  removeToast: () => {},
});

const DEFAULT_ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={18} />,
  error:   <XCircle size={18} />,
  warning: <AlertCircle size={18} />,
  info:    <Info size={18} />,
};

const COLORS: Record<ToastType, string> = {
  success: 'text-[var(--color-success)] bg-[var(--color-success-bg)] border-[var(--color-success-border)]',
  error:   'text-[var(--color-error)]   bg-[var(--color-error-bg)]   border-[var(--color-error-border)]',
  warning: 'text-[var(--color-warning)] bg-[var(--color-warning-bg)] border-[var(--color-warning-border)]',
  info:    'text-[var(--color-info)]    bg-[var(--color-info-bg)]    border-[var(--color-info-border)]',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback(({ type, message, duration = 4000, icon }: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message, duration, icon }]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="fixed bottom-8 right-8 z-[var(--z-toast)] flex flex-col gap-4 pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={`
                pointer-events-auto
                flex items-start gap-4 p-5 rounded-2xl border
                min-w-[320px] max-w-[440px]
                shadow-2xl backdrop-blur-md
                ${COLORS[toast.type]}
              `}
              role="alert"
            >
              <div className="shrink-0 mt-0.5 opacity-80">
                {toast.icon || DEFAULT_ICONS[toast.type]}
              </div>
              <div className="flex-1">
                 <p className="text-sm font-bold leading-relaxed tracking-tight">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 opacity-40 hover:opacity-100 transition-opacity p-1 -mt-1 -mr-1"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
