// @ts-nocheck
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

// إنشاء سياق المصادقة
const AuthContext = createContext(undefined);

/**
 * هوك مخصص لاستخدام سياق المصادقة
 * @returns {Object} دوال وبيانات المصادقة
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('يجب استخدام useAuth داخل AuthProvider');
  }
  return context;
};

/**
 * مزود سياق المصادقة
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // تحميل المستخدم عند بدء التشغيل
  useEffect(() => {
    const initializeAuth = async () => {
      await loadUser();
      setInitialized(true);
    };
    initializeAuth();
  }, []);

  // تحميل بيانات المستخدم الحالي
  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('خطأ في تحميل المستخدم:', error);
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      
      if (response?.user) {
        setUser(response.user);
        toast.success(`مرحباً بعودتك يا ${response.user.name}!`);
        return true;
      }
      return false;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'حدث خطأ في تسجيل الدخول';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل مستخدم جديد
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response?.user) {
        setUser(response.user);
        toast.success(`مرحباً بك يا ${response.user.name}! تم إنشاء الحساب بنجاح`);
        return true;
      }
      return false;
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          errors[key].forEach(message => {
            toast.error(message);
          });
        });
      } else {
        const message = error.response?.data?.message || error.message || 'حدث خطأ في إنشاء الحساب';
        toast.error(message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      setUser(null);
      toast.error('حدث خطأ أثناء تسجيل الخروج، لكن تم تسجيل الخروج محلياً');
    } finally {
      setLoading(false);
    }
  };

  // تحديث بيانات المستخدم
  const updateUser = async (data) => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }
    
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(user.id, data);
      setUser(updatedUser);
      toast.success('تم تحديث البيانات بنجاح');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'حدث خطأ في تحديث البيانات';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // تغيير كلمة المرور
  const changePassword = async (data) => {
    try {
      setLoading(true);
      await authService.changePassword(data);
      toast.success('تم تغيير كلمة المرور بنجاح');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'حدث خطأ في تغيير كلمة المرور';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // طلب إعادة تعيين كلمة المرور
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await authService.forgotPassword({ email });
      toast.success('تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'حدث خطأ في إرسال رابط إعادة التعيين';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // تأكيد إعادة تعيين كلمة المرور
  const resetPassword = async (data) => {
    try {
      setLoading(true);
      await authService.resetPassword(data);
      toast.success('تم إعادة تعيين كلمة المرور بنجاح');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'حدث خطأ في إعادة تعيين كلمة المرور';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // تحديث التوكن
  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      return !!response?.token;
    } catch (error) {
      return false;
    }
  }, []);

  // التحقق من صلاحية التوكن
  const verifyToken = useCallback(async () => {
    try {
      return await authService.verifyToken();
    } catch (error) {
      return false;
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
    verifyToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === 1,
    initialized,
  };

  if (!initialized && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="جاري تحميل التطبيق">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
            <span className="sr-only">جاري التحميل...</span>
          </div>
          <p className="text-gray-600">جاري تحميل التطبيق...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};