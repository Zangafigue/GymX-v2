import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  prefix?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, fullWidth = true, containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2.5 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {prefix && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors duration-300">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={`input-base ${prefix ? 'pl-12' : ''} ${error ? '!border-[var(--color-error)] focus:!ring-[var(--color-error-bg)]' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-[var(--color-error)] ml-1 animate-fade-in flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-current" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
