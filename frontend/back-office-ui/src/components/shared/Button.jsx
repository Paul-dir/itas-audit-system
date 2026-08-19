import React from 'react';

/**
 * Button Component - Modern enterprise button with multiple variants and sizes
 * 
 * Features:
 * - Multiple variants: primary, secondary, tertiary, danger, success, warning, gold
 * - Flexible sizing: sm, md, lg
 * - Icon support (Font Awesome or React components)
 * - Proper focus states and accessibility
 * - Dark mode support
 * - Smooth transitions and hover effects
 * - Disabled state with cursor feedback
 * - Full width option
 * 
 * Props:
 * - variant: Button style variant - 'primary', 'secondary', 'tertiary', 'danger', 'success', 'warning', 'gold' (default: 'primary')
 * - size: Button size - 'sm', 'md', 'lg' (default: 'md')
 * - children: Button text/content
 * - icon: Optional icon class string (Font Awesome) or React component
 * - disabled: Disable the button (default: false)
 * - onClick: Click handler function
 * - className: Additional Tailwind classes
 * - type: Button type - 'button', 'submit', 'reset' (default: 'button')
 * - fullWidth: Make button full width (default: false)
 * - loading: Show loading state (default: false)
 * - ...props: Additional HTML button attributes
 */
function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon: Icon,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
  loading = false,
  ...props
}) {
  // Map variants to Tailwind classes
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 focus:ring-neutral-500 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-50',
    tertiary: 'bg-transparent hover:bg-neutral-100 text-neutral-700 focus:ring-neutral-500 dark:hover:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white focus:ring-danger-500 dark:bg-danger-600 dark:hover:bg-danger-700',
    success: 'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500 dark:bg-success-600 dark:hover:bg-success-700',
    warning: 'bg-warning-600 hover:bg-warning-700 text-white focus:ring-warning-500 dark:bg-warning-600 dark:hover:bg-warning-700',
    gold: 'bg-gold-500 hover:bg-gold-600 text-white focus:ring-gold-400 dark:bg-gold-600 dark:hover:bg-gold-700',
  };

  // Map sizes to Tailwind classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    rounded-lg
    font-semibold
    transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const buttonClass = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClass}
      {...props}
    >
      {loading ? (
        <>
          <i className="fas fa-spinner animate-spin"></i>
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {Icon && (
            <>
              {typeof Icon === 'string' ? (
                <i className={`${Icon}`}></i>
              ) : (
                <Icon className="inline" />
              )}
            </>
          )}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
