import React from 'react';

/**
 * مكون مؤشر التحميل
 * @param {Object} props - خصائص المكون
 * @param {boolean} [props.fullScreen=true] - عرض المؤشر بملء الشاشة
 * @param {string} [props.text='جاري التحميل...'] - نص التحميل المخصص
 */
const Loader = ({ 
  fullScreen = true, 
  text = 'جاري التحميل...' 
}) => {
  // تحديد كلاسات الحاوية بناءً على وضع العرض
  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center' 
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses} role="status" aria-label={text}>
      <div className="text-center">
        {/* حلقة التحميل الخارجية */}
        <div className="relative">
          <div 
            className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"
            aria-hidden="true"
          />
          
          {/* الدائرة الداخلية المتحركة */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-skin-500 rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* نص التحميل */}
        <p className="text-gray-600 mt-4">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loader;