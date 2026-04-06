import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize    = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  loading?:   boolean;
  icon?:      React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

// Support for polymorphic component
type ButtonProps<T extends React.ElementType = 'button'> = ButtonBaseProps & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonBaseProps | 'as'>;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-primary !bg-[var(--color-error)] !hover:bg-[var(--color-error-hover)]', 
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'text-[10px] px-3 py-2 gap-1',
  md: 'text-xs px-5 py-3 gap-2',
  lg: 'text-xs px-8 py-4 gap-2',
};

export const Button = <T extends React.ElementType = 'button'>({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  iconRight,
  fullWidth = false,
  as,
  className,
  ...props
}: ButtonProps<T>) => {
  const Component = as || 'button';
  
  const classes = [
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    loading || disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    className as string,
  ].filter(Boolean).join(' ');

  return (
    <Component
      disabled={Component === 'button' ? (disabled || loading) : undefined}
      className={classes}
      {...(props as any)}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : icon}
      {children}
      {!loading && iconRight}
    </Component>
  );
};
