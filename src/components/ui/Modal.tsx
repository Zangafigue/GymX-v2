import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

const SIZE_CLASSES: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full m-4',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
}) => {
  // Disable scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
              relative w-full ${SIZE_CLASSES[size]}
              bg-[var(--color-bg-subtle)] border border-[var(--color-border-default)]
              rounded-2xl shadow-xl overflow-hidden
              flex flex-col max-h-[90vh]
            `}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-subtle)]">
                {title ? (
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] uppercase tracking-tight">
                    {title}
                  </h3>
                ) : <div />}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors rounded-lg hover:bg-[var(--color-surface-3)]"
                    aria-label="Fermer"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-6 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
