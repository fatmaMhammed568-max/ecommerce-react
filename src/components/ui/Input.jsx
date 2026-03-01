import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

/**
 * مكون حقل الإدخال
 * @param {Object} props - خصائص المكون
 * @param {string} [props.label] - نص التسمية
 * @param {string} [props.error] - رسالة الخطأ
 * @param {React.ReactNode} [props.leftIcon] - أيقونة على اليسار
 * @param {React.ReactNode} [props.rightIcon] - أيقونة على اليمين
 * @param {string} [props.helper] - نص مساعد
 * @param {string} [props.type='text'] - نوع الحقل
 * @param {string} [props.className=''] - كلاسات إضافية
 * @param {string} [props.id] - معرف الحقل
 */
const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  helper,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // إنشاء معرف فريد إذا لم يتم توفير واحد
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  // كلاسات الأساس
  const baseStyles = 'w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // كلاسات حسب وجود خطأ
  const variantStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200';

  /**
   * حساب كلاسات المسافات للأيقونات
   * @returns {string} كلاسات المسافات
   */
  const getPaddingStyles = () => {
    let styles = '';
    if (leftIcon) styles += ' pr-10';
    if (rightIcon || isPassword) styles += ' pl-10';
    return styles;
  };

  /**
   * تبديل إظهار/إخفاء كلمة المرور
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="w-full">
      {/* التسمية */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* أيقونة اليسار */}
        {leftIcon && (
          <div 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          >
            {leftIcon}
          </div>
        )}

        {/* حقل الإدخال */}
        <input
          id={inputId}
          type={inputType}
          className={`${baseStyles} ${variantStyles} ${getPaddingStyles()} ${className}`}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {/* أيقونة اليمين أو إظهار/إخفاء كلمة المرور */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isPassword ? (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          ) : (
            rightIcon && (
              <span aria-hidden="true">{rightIcon}</span>
            )
          )}
        </div>
      </div>

      {/* رسالة المساعدة أو الخطأ */}
      {(error || helper) && (
        <p
          id={error ? `${inputId}-error` : `${inputId}-helper`}
          className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}
          role={error ? 'alert' : 'status'}
        >
          {error || helper}
        </p>
      )}
    </div>
  );
};

export default Input;