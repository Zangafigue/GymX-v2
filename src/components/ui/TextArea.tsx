import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  containerClassName?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, fullWidth = true, containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2.5 ml-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`input-base min-h-[120px] resize-y py-4 ${error ? '!border-[var(--color-error)] focus:!ring-[var(--color-error-bg)]' : ''} ${className}`}
          {...props}
        />
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

TextArea.displayName = 'TextArea';
