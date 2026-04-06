import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'secondary' | 'outline' | 'default' | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary:   'badge-primary',
  success:   'badge-success',
  warning:   'badge-warning',
  error:     'badge-error',
  info:      'badge-info',
  neutral:   'badge-neutral',
  secondary: 'badge-secondary',
  outline:   'border border-[var(--color-border-subtle)] text-[var(--color-text-muted)]',
  default:   'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]',
  danger:    'bg-[var(--color-error)] text-white',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  dot = false,
}) => {
  return (
    <span className={`badge ${VARIANT_CLASSES[variant]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          variant === 'primary' ? 'bg-[var(--color-primary)]' : 
          variant === 'success' ? 'bg-[var(--color-success)]' :
          variant === 'warning' ? 'bg-[var(--color-warning)]' :
          variant === 'error'   ? 'bg-[var(--color-error)]'   :
          variant === 'info'    ? 'bg-[var(--color-info)]'    :
          'bg-[var(--color-text-muted)]'
        }`} />
      )}
      {children}
    </span>
  );
};
