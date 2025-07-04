import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(({ 
  className, 
  type = 'text', 
  label, 
  error, 
  icon, 
  ...props 
}, ref) => {
  const inputClasses = clsx(
    'w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100',
    'placeholder-secondary-500 dark:placeholder-secondary-400',
    error 
      ? 'border-error-500 focus:ring-error-500' 
      : 'border-secondary-300 dark:border-secondary-600',
    icon && 'pl-12',
    className
  );
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-secondary-400">{icon}</span>
          </div>
        )}
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
