import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * مكون حماية المسارات
 * يتحقق من حالة المصادقة ويوجه المستخدم حسب صلاحياته
 * 
 * @param {Object} props - خصائص المكون
 * @param {React.ReactNode} props.children - المحتوى المراد حمايته
 * @param {boolean} [props.requireAdmin=false] - هل يتطلب المسار صلاحية أدمن
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // حالة التحميل - عرض مؤشر التحميل
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-label="جاري التحقق من بيانات الدخول"
      >
        <div className="relative">
          {/* حلقة التحميل الخارجية */}
          <div 
            className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"
            aria-hidden="true"
          />
          
          {/* نص التحميل لمستخدمي قارئات الشاشة */}
          <span className="sr-only">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  // المستخدم غير مسجل الدخول - توجيه إلى صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // المسار يتطلب صلاحية أدمن والمستخدم ليس أدمن - توجيه للصفحة الرئيسية
  if (requireAdmin && !isAdmin) {
    return (
      <Navigate 
        to="/" 
        replace 
      />
    );
  }

  // جميع الشروط مستوفاة - عرض المحتوى
  return children;
};

export default ProtectedRoute;