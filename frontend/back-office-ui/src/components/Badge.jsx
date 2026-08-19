import React from 'react';

/**
 * Badge Component - Status badge with semantic colors and sizes
 * 
 * Features:
 * - Pre-defined status variants: draft, submitted, approved, rejected, pending, feedback
 * - Semantic color system matching design system
 * - Multiple sizes: sm (compact), md (default), lg (large)
 * - Dark mode support with proper contrast
 * - Proper typography and spacing
 * - Icon support for status indicators
 * 
 * Props:
 * - status: Status text to display (string)
 * - variant: Status variant - 'draft', 'submitted', 'approved', 'rejected', 'pending', 'feedback', 'primary', 'success', 'warning', 'danger', 'info', 'gold' (default: 'info')
 * - size: Badge size - 'sm', 'md', 'lg' (default: 'md')
 * - icon: Optional Font Awesome icon class (e.g., 'fas fa-check')
 * - className: Additional Tailwind classes
 */
function Badge({ status, variant = 'info', size = 'md', icon = null, className = '' }) {
  // Map status variants to color classes
  const variantClasses = {
    draft: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300',
    submitted: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    approved: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300',
    rejected: 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300',
    pending: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300',
    feedback: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    success: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300',
    warning: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300',
    danger: 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300',
    info: 'bg-info-100 dark:bg-info-900/30 text-info-700 dark:text-info-300',
    gold: 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-300',
  };

  // Map sizes to padding/font classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  const badgeClasses = `
    inline-flex items-center gap-1.5
    rounded-full
    font-semibold
    transition-all duration-150
    ${sizeClasses[size]}
    ${variantClasses[variant] || variantClasses.info}
    ${className}
  `;

  return (
    <span className={badgeClasses}>
      {icon && <i className={`${icon}`}></i>}
      {status}
    </span>
  );
}

export default Badge;
