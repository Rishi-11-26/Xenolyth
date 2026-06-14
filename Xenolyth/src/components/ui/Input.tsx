import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const inputId = useId();
  const errorId = useId();
  const helperId = useId();

  return (
    <div className="flex flex-col gap-2 w-full">
      <label 
        htmlFor={inputId}
        className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`bg-surface border rounded-md px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-150 text-base
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-border'} 
          ${className}`}
        aria-invalid={!!error}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        {...props}
      />
      {error && (
        <span 
          id={errorId}
          className="text-sm text-red-500 font-medium mt-0.5"
          role="alert"
        >
          {error}
        </span>
      )}
      {!error && helperText && (
        <span 
          id={helperId}
          className="text-xs text-text-secondary mt-0.5"
        >
          {helperText}
        </span>
      )}
    </div>
  );
};
export default Input;
