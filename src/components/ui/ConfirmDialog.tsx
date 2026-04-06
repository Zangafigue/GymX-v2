/**
 * ConfirmDialog.tsx — Replaces all native confirm() calls
 *
 * Usage:
 *   const { confirm } = useConfirm();
 *   const ok = await confirm({
 *     title: 'Cancel booking?',
 *     message: 'This action cannot be undone.',
 *     confirmLabel: 'Yes, cancel',
 *     variant: 'danger',
 *   });
 *   if (ok) { // proceed }
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType>({
  confirm: async () => false,
});

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setState({ options, resolve });
    });
  }, []);

  const handleConfirm = () => {
    state?.resolve(true);
    setState(null);
  };

  const handleCancel = () => {
    state?.resolve(false);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <AnimatePresence>
        {state && (
          <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="absolute inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)] p-8 rounded-2xl w-full max-w-sm shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
            >
              <button
                onClick={handleCancel}
                className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label="Cancel"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center gap-5">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  state.options.variant === 'danger'
                    ? 'bg-[var(--color-error-bg)] text-[var(--color-error)]'
                    : 'bg-[var(--warning-bg,rgba(251,191,36,0.1))] text-[var(--warning,var(--gymx-amber-400))]'
                }`}>
                  <AlertTriangle size={28} />
                </div>

                <div>
                  <h3 id="confirm-title" className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                    {state.options.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {state.options.message}
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={handleConfirm}
                    className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${
                      state.options.variant === 'danger'
                        ? 'bg-[var(--color-error)] text-white hover:opacity-90'
                        : 'btn-primary'
                    }`}
                  >
                    {state.options.confirmLabel || 'Confirm'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="w-full bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[var(--color-border-default)] hover:text-[var(--color-text-primary)] transition-all"
                  >
                    {state.options.cancelLabel || 'Cancel'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext);
