import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

/**
 * صفحة تسجيل الدخول
 */
const Login = () => {
  // حالات النموذج
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, loading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // الصفحة التي جاء منها المستخدم (أو الصفحة الرئيسية)
  const from = location.state?.from?.pathname || '/';

  /**
   * تحميل البريد الإلكتروني المحفوظ عند تحميل الصفحة
   */
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  /**
   * إعادة التوجيه إذا كان المستخدم مسجل الدخول
   */
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate(from === '/' ? '/' : from, { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate, from]);

  /**
   * التحقق من صحة البريد الإلكتروني
   * @param {string} email - البريد الإلكتروني
   * @returns {boolean} صحة البريد
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * التحقق من صحة النموذج
   * @returns {boolean} صحة النموذج
   */
  const validateForm = () => {
    const newErrors = {};

    if (!email?.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!validateEmail(email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * مسح خطأ حقل معين
   * @param {string} field - اسم الحقل
   */
  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * معالجة تقديم النموذج
   * @param {React.FormEvent} e - حدث التقديم
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const success = await login(email.trim(), password);
      
      if (success) {
        // حفظ البريد الإلكتروني إذا اختار المستخدم "تذكرني"
        if (rememberMe) {
          localStorage.setItem('remembered_email', email.trim());
        } else {
          localStorage.removeItem('remembered_email');
        }
        
        toast.success('تم تسجيل الدخول بنجاح');
      }
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      toast.error(error.message || 'حدث خطأ في تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-skin-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* خلفية زخرفية */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary-100 rounded-full -translate-x-16 -translate-y-16 opacity-20" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-skin-100 rounded-full translate-x-16 translate-y-16 opacity-20" aria-hidden="true" />

          {/* الشعار */}
          <div className="text-center mb-8 relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-skin-500 rounded-2xl mx-auto mb-4 flex items-center justify-center transform rotate-45 animate-pulse">
              <FiLogIn className="w-10 h-10 text-white transform -rotate-45" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-gray-600">
              مرحباً بعودتك! سجل دخولك للوصول إلى حسابك
            </p>
          </div>

          {/* نموذج تسجيل الدخول */}
          <form onSubmit={handleSubmit} className="space-y-6 relative" noValidate>
            {/* حقل البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative group">
                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError('email');
                  }}
                  onBlur={() => validateEmail(email) && clearFieldError('email')}
                  className={`w-full pr-10 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                  }`}
                  placeholder="example@email.com"
                  dir="ltr"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                  <FiAlertCircle className="w-4 h-4" aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative group">
                <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError('password');
                  }}
                  onBlur={() => password.length >= 6 && clearFieldError('password')}
                  className={`w-full pr-10 pl-10 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                  }`}
                  placeholder="********"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600"
                  tabIndex={-1}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                  <FiAlertCircle className="w-4 h-4" aria-hidden="true" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* خيارات إضافية */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="ml-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                  aria-label="تذكرني"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  تذكرني
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-l from-primary-600 to-primary-700 text-white py-3 px-4 rounded-xl hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
              aria-label={authLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            >
              <span className="relative z-10 flex items-center gap-2">
                <FiLogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                {authLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </span>
            </button>
          </form>

          {/* فواصل */}
          <div className="relative my-6" role="separator">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">أو</span>
            </div>
          </div>

          {/* روابط إضافية */}
          <div className="space-y-3 text-center">
            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <Link 
                to="/register" 
                className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              >
                إنشاء حساب جديد
              </Link>
            </p>
            <Link 
              to="/" 
              className="inline-block text-sm text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2"
            >
              العودة إلى المتجر
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;