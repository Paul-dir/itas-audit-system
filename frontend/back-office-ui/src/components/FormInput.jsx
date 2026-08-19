import React from 'react';

/**
 * FormInput Component - Modern enterprise form input with validation and accessibility
 * 
 * Features:
 * - Clean input fields with semantic colors
 * - Label support with required indicator
 * - Error states with red border and error message
 * - Helper text for additional guidance
 * - Disabled state with proper styling
 * - Textarea support via type='textarea'
 * - Dark mode support
 * - Proper focus states with ring
 * - Smooth transitions
 * - Full accessibility (labels, ARIA attributes)
 * 
 * Props:
 * - label: Input label text (string)
 * - type: Input type - 'text', 'email', 'password', 'number', 'date', 'textarea', etc.
 * - value: Input value
 * - onChange: Change handler function
 * - placeholder: Placeholder text
 * - error: Error message to display (string)
 * - helperText: Helper text to display below input (string)
 * - disabled: Disable the input (default: false)
 * - required: Mark as required (default: false)
 * - className: Additional Tailwind classes
 * - id: Input element ID (auto-generated from label if not provided)
 * - name: Input element name
 * - rows: Number of rows for textarea (default: 4)
 * - ...props: Additional HTML input/textarea attributes
 */
function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  rows = 4,
  ...props
}) {
  const isTextarea = type === 'textarea';
  const InputElement = isTextarea ? 'textarea' : 'input';
  
  // Generate ID from label if not provided
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-group mb-6">
      {label && (
        <label 
          htmlFor={inputId}
          className="form-label block text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2"
        >
          {label}
          {required && <span className="text-danger-600 dark:text-danger-400 ml-1">*</span>}
        </label>
      )}
      
      <InputElement
        id={inputId}
        name={name}
        type={isTextarea ? undefined : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={isTextarea ? rows : undefined}
        className={`
          w-full px-3.5 py-2.5 text-sm
          bg-white dark:bg-neutral-800
          border rounded-lg
          text-neutral-900 dark:text-neutral-50
          placeholder-neutral-500 dark:placeholder-neutral-400
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900
          disabled:bg-neutral-50 dark:disabled:bg-neutral-900
          disabled:text-neutral-500 dark:disabled:text-neutral-500
          disabled:cursor-not-allowed
          ${error 
            ? 'border-danger-500 dark:border-danger-400 focus:ring-danger-500 dark:focus:ring-danger-400' 
            : 'border-neutral-200 dark:border-neutral-700 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400'
          }
          ${isTextarea ? 'resize-none' : ''}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="text-xs text-danger-600 dark:text-danger-400 mt-2 block font-medium">
          <i className="fas fa-exclamation-circle mr-1.5"></i>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 block">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default FormInput;
