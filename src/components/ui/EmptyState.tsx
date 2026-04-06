import React from 'react';
import { Search } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = <Search size={40} />,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center text-center p-12 glass-card bg-opacity-20 animate-fade-in ${className}`}>
      <div className="w-20 h-20 rounded-full bg-[var(--color-bg-base)] flex items-center justify-center text-[var(--color-text-muted)] mb-6 shadow-sm border border-[var(--color-border-subtle)]">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[var(--color-text-primary)] uppercase tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-8 leading-relaxed">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
