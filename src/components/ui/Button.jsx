import React from 'react';

/**
 * تكوينات الزر حسب النوع
 */
const VARIANT_STYLES = {
  primary: 'bg-gradient-to-r from-primary-600 to-skin-600 text-white hover:from-primary-700 hover:to-skin-700 focus:ring-primary-500 transform hover:scale-105',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
};

/**
 * تكوينات الزر حسب الحجم
 */
const SIZE_STYLES = {
  sm: 'px-3 py-2 text-sm gap-1',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-3'
};

/**
 * مكون زر قابل لإعادة الاستخدام
 * @param {Object} props - خصائص المكون
 * @param {React.ReactNode} props.children - محتوى الزر
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} [props.variant='primary'] - نوع الزر
 * @param {'sm'|'md'|'lg'} [props.size='md'] - حجم الزر
 * @param {boolean} [props.isLoading=false] - حالة التحميل
 * @param {React.ReactNode} [props.leftIcon] - أيقونة على اليسار
 * @param {React.ReactNode} [props.rightIcon] - أيقونة على اليمين
 * @param {boolean} [props.fullWidth=false] - عرض كامل
 * @param {string} [props.className=''] - كلاسات إضافية
 * @param {boolean} [props.disabled] - حالة التعطيل
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // التأكد من أن النوع المطلوب موجود
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;
  
  // كلاسات الأساس
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // عرض كامل أم لا
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* أيقونة التحميل */}
      {isLoading && (
        <svg 
          className="animate-spin h-5 w-5 ml-2" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {/* أيقونة يسار */}
      {leftIcon && !isLoading && (
        <span className="ml-2" aria-hidden="true">{leftIcon}</span>
      )}
      
      {/* محتوى الزر */}
      {children}
      
      {/* أيقونة يمين */}
      {rightIcon && !isLoading && (
        <span className="mr-2" aria-hidden="true">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;