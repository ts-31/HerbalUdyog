import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block font-label-md text-on-surface mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`
              w-full h-11 bg-surface-bright rounded-xl border border-outline 
              px-4 font-body-md text-on-surface transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              disabled:opacity-50 disabled:bg-surface-container-low
              placeholder:text-on-surface-variant/50
              ${leftIcon ? 'pl-10' : ''} 
              ${rightIcon ? 'pr-10' : ''}
              ${error ? 'border-error focus:ring-error/20 focus:border-error' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-on-surface-variant">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-error font-body-sm">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
