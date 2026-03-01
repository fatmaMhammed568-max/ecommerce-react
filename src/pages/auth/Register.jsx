import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiPhone, 
  FiMapPin, 
  FiUserPlus,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

/**
 * صفحة إنشاء حساب جديد
 */
const Register = () => {
  // بيانات النموذج
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: ''
  });
  
  // حالات واجهة المستخدم
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  
  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /**
   * إعادة التوجيه إذا كان المستخدم مسجل الدخول
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  /**
   * التحقق من قوة كلمة المرور
   */
  const passwordStrength = {
    hasMinLength: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password)
  };

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);
  const doPasswordsMatch = formData.password === formData.password_confirmation && formData.password !== '';

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
   * التحقق من صحة رقم الهاتف
   * @param {string} phone - رقم الهاتف
   * @returns {boolean} صحة الرقم
   */
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,}$/;
    return phoneRegex.test(phone);
  };

  /**
   * التحقق من صحة النموذج
   * @returns {boolean} صحة النموذج
   */
  const validateForm = () => {
    const newErrors = {};

    // التحقق من الاسم
    if (!formData.name?.trim()) {
      newErrors.name = 'الاسم مطلوب';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    }

    // التحقق من البريد الإلكتروني
    if (!formData.email?.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    // التحقق من كلمة المرور
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (!isPasswordValid) {
      newErrors.password = 'كلمة المرور ضعيفة';
    }

    // التحقق من تطابق كلمة المرور
    if (formData.password && !doPasswordsMatch) {
      newErrors.password_confirmation = 'كلمة المرور غير متطابقة';
    }

    // التحقق من رقم الهاتف (إذا تم إدخاله)
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صالح (10 أرقام على الأقل)';
    }

    // التحقق من الموافقة على الشروط
    if (!agreed) {
      newErrors.agreed = 'يجب الموافقة على الشروط والأحكام';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * مسح خطأ حقل معين
   * @param {string} fieldName - اسم الحقل
   */
  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  /**
   * معالجة تغيير الحقول
   * @param {React.ChangeEvent<HTMLInputElement>} e - حدث التغيير
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name);
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
      // تنظيف البيانات قبل الإرسال
      const cleanData = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim() || null,
        address: formData.address?.trim() || null
      };

      const success = await register(cleanData);
      
      if (success) {
        toast.success('تم إنشاء الحساب بنجاح');
        navigate('/login');
      }
    } catch (error) {
      console.error('خطأ في إنشاء الحساب:', error);
      toast.error(error.message || 'حدث خطأ في إنشاء الحساب');
    }
  };

  /**
   * مكون متطلبات كلمة المرور
   * @param {Object} props - الخصائص
   * @param {boolean} props.met - هل تم تحقيق المتطلب
   * @param {string} props.text - نص المتطلب
   */
  const PasswordRequirement = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? <FiCheckCircle className="w-4 h-4" aria-hidden="true" /> : <FiXCircle className="w-4 h-4" aria-hidden="true" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-skin-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* خلفية زخرفية */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary-100 rounded-full -translate-x-16 -translate-y-16 opacity-20" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-skin-100 rounded-full translate-x-16 translate-y-16 opacity-20" aria-hidden="true" />

          {/* الشعار */}
          <div className="text-center mb-8 relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-skin-500 rounded-2xl mx-auto mb-4 flex items-center justify-center transform rotate-45 animate-pulse">
              <FiUserPlus className="w-10 h-10 text-white transform -rotate-45" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              إنشاء حساب جديد
            </h1>
            <p className="text-gray-600">
              أنشئ حسابك واستمتع بتجربة تسوق مميزة
            </p>
          </div>

          {/* نموذج التسجيل */}
          <form onSubmit={handleSubmit} className="space-y-6 relative" noValidate>
            <div className="grid md:grid-cols-2 gap-6">
              {/* الاسم */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <div className="relative group">
                  <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => formData.name.trim().length >= 3 && clearFieldError('name')}
                    className={`w-full pr-10 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                    placeholder="محمد أحمد"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                    <FiAlertCircle className="w-4 h-4" aria-hidden="true" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <div className="relative group">
                  <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => validateEmail(formData.email) && clearFieldError('email')}
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

              {/* كلمة المرور */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور *
                </label>
                <div className="relative group">
                  <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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

              {/* تأكيد كلمة المرور */}
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور *
                </label>
                <div className="relative group">
                  <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                  <input
                    id="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    onBlur={() => doPasswordsMatch && clearFieldError('password_confirmation')}
                    className={`w-full pr-10 pl-10 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.password_confirmation 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                    placeholder="********"
                    aria-invalid={!!errors.password_confirmation}
                    aria-describedby={errors.password_confirmation ? 'password-confirmation-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p id="password-confirmation-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                    <FiAlertCircle className="w-4 h-4" aria-hidden="true" />
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              {/* رقم الهاتف */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <div className="relative group">
                  <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => (formData.phone ? validatePhone(formData.phone) && clearFieldError('phone') : null)}
                    className={`w-full pr-10 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.phone 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
                    <FiAlertCircle className="w-4 h-4" aria-hidden="true" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* العنوان */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <div className="relative group">
                  <FiMapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pr-10 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    placeholder="المدينة، الحي، الشارع"
                  />
                </div>
              </div>
            </div>

            {/* متطلبات كلمة المرور */}
            {formData.password && (
              <div className="p-4 bg-gray-50 rounded-xl space-y-2" role="status" aria-label="متطلبات كلمة المرور">
                <p className="text-sm font-medium text-gray-700 mb-2">متطلبات كلمة المرور:</p>
                <PasswordRequirement met={passwordStrength.hasMinLength} text="8 أحرف على الأقل" />
                <PasswordRequirement met={passwordStrength.hasNumber} text="تحتوي على رقم" />
                <PasswordRequirement met={passwordStrength.hasUpperCase} text="تحتوي على حرف كبير" />
                <PasswordRequirement met={passwordStrength.hasLowerCase} text="تحتوي على حرف صغير" />
                {formData.password_confirmation && (
                  <PasswordRequirement met={doPasswordsMatch} text="كلمة المرور متطابقة" />
                )}
              </div>
            )}

            {/* الموافقة على الشروط */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (errors.agreed) clearFieldError('agreed');
                  }}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  aria-label="الموافقة على الشروط والأحكام"
                />
                <span className="text-sm text-gray-700">
                  أوافق على{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">
                    الشروط والأحكام
                  </Link>
                  {' '}و{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">
                    سياسة الخصوصية
                  </Link>
                </span>
              </label>
              {errors.agreed && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1" role="alert">
                  <FiAlertCircle className="w-4 h-4" aria-hidden="true" />
                  {errors.agreed}
                </p>
              )}
            </div>

            {/* زر التسجيل */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-l from-primary-600 to-primary-700 text-white py-3 px-4 rounded-xl hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label={loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  جاري إنشاء الحساب...
                </>
              ) : (
                <>
                  <FiUserPlus className="w-5 h-5" aria-hidden="true" />
                  إنشاء حساب
                </>
              )}
            </button>
          </form>

          {/* رابط تسجيل الدخول */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link 
                to="/login" 
                className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;