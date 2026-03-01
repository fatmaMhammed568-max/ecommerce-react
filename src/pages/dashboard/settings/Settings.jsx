import React, { useState } from 'react';
import { 
  FiSave, 
  FiUser, 
  FiLock, 
  FiBell, 
  FiGlobe, 
  FiTruck,
  FiCreditCard,
  FiCamera,
  FiTrash2
} from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import toast from 'react-hot-toast';

/**
 * تعريف علامات التبويب
 */
const TABS = [
  { id: 'profile', name: 'الملف الشخصي', icon: FiUser },
  { id: 'security', name: 'الأمان', icon: FiLock },
  { id: 'notifications', name: 'الإشعارات', icon: FiBell },
  { id: 'preferences', name: 'التفضيلات', icon: FiGlobe },
  { id: 'shipping', name: 'الشحن', icon: FiTruck },
  { id: 'payment', name: 'طرق الدفع', icon: FiCreditCard },
];

/**
 * صفحة الإعدادات
 */
const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // بيانات الملف الشخصي
  const [profileData, setProfileData] = useState({
    name: user?.name || 'رقية محمد',
    email: user?.email || 'roka@beautycare.com',
    phone: user?.phone || '+20012345957',
    address: user?.address || 'الرياض، حي العليا',
    bio: 'مدير نظام في بيوتي طوما'
  });

  // بيانات كلمة المرور
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // بيانات الإشعارات
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newUserAlerts: true,
    systemAlerts: true
  });

  // بيانات الموقع والعملة
  const [preferences, setPreferences] = useState({
    language: 'ar',
    currency: 'SAR',
    timezone: 'Asia/Riyadh',
    dateFormat: 'DD/MM/YYYY'
  });

  // بيانات الشحن
  const [shipping, setShipping] = useState({
    defaultWeight: 0.5,
    freeShippingThreshold: 200,
    shippingCost: 25,
    internationalShipping: false
  });

  // بيانات الدفع
  const [payment, setPayment] = useState({
    bankTransfer: true,
    cashOnDelivery: true,
    creditCard: false,
    applePay: false
  });

  /**
   * معالجة تغيير بيانات الملف الشخصي
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * معالجة تغيير بيانات كلمة المرور
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * معالجة تغيير حالة الإشعارات
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  /**
   * معالجة تغيير التفضيلات
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  /**
   * معالجة تغيير بيانات الشحن
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShipping(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseFloat(value) || 0
    }));
  };

  /**
   * معالجة تغيير طرق الدفع
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handlePaymentChange = (e) => {
    const { name, checked } = e.target;
    setPayment(prev => ({ ...prev, [name]: checked }));
  };

  /**
   * حفظ الملف الشخصي
   */
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('تم حفظ الملف الشخصي بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ الملف الشخصي:', error);
      toast.error('حدث خطأ في حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  /**
   * تغيير كلمة المرور
   */
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error('كلمة المرور الحالية مطلوبة');
      return;
    }

    if (!passwordData.newPassword) {
      toast.error('كلمة المرور الجديدة مطلوبة');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    setLoading(true);
    try {
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('تم تغيير كلمة المرور بنجاح');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('خطأ في تغيير كلمة المرور:', error);
      toast.error('حدث خطأ في تغيير كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  /**
   * حفظ التفضيلات
   */
  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      toast.error('حدث خطأ في حفظ الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  /**
   * الحصول على الحرف الأول من الاسم
   * @returns {string} الحرف الأول
   */
  const getUserInitial = () => {
    return profileData.name?.charAt(0) || 'أ';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8" dir="rtl">
        {/* عنوان الصفحة */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h1>
          <p className="text-gray-600">إدارة إعدادات حسابك وتفضيلات النظام</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* الشريط الجانبي للتبويبات */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-24">
              <nav className="space-y-1" aria-label="تبويبات الإعدادات">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-l from-primary-50 to-skin-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                      <Icon className={`w-5 h-5 ${
                        activeTab === tab.id ? 'text-primary-600' : ''
                      }`} aria-hidden="true" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* محتوى التبويبات */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* الملف الشخصي */}
              {activeTab === 'profile' && (
                <section aria-labelledby="profile-title">
                  <h2 id="profile-title" className="text-xl font-bold mb-6">الملف الشخصي</h2>

                  {/* صورة الملف الشخصي */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-primary-100 to-skin-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary-600">
                          {getUserInitial()}
                        </span>
                      </div>
                      <button 
                        className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                        aria-label="تغيير الصورة الشخصية"
                      >
                        <FiCamera className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{profileData.name}</h3>
                      <p className="text-gray-500">{profileData.email}</p>
                      <button 
                        className="text-sm text-red-600 hover:text-red-700 mt-2 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2"
                        aria-label="حذف الصورة"
                      >
                        <FiTrash2 className="w-4 h-4" aria-hidden="true" />
                        حذف الصورة
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="الاسم الكامل"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      id="profile-name"
                    />
                    <Input
                      label="البريد الإلكتروني"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      id="profile-email"
                    />
                    <Input
                      label="رقم الجوال"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      id="profile-phone"
                    />
                    <Input
                      label="العنوان"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      id="profile-address"
                    />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="profile-bio" className="block text-sm font-medium text-gray-700 mb-2">
                      نبذة عني
                    </label>
                    <textarea
                      id="profile-bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows={4}
                      className="input-field"
                      placeholder="اكتب نبذة عنك..."
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleSaveProfile}
                      isLoading={loading}
                      leftIcon={<FiSave />}
                    >
                      حفظ التغييرات
                    </Button>
                  </div>
                </section>
              )}

              {/* الأمان */}
              {activeTab === 'security' && (
                <section aria-labelledby="security-title">
                  <h2 id="security-title" className="text-xl font-bold mb-6">تغيير كلمة المرور</h2>

                  <div className="space-y-4 max-w-md">
                    <Input
                      label="كلمة المرور الحالية"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      id="current-password"
                    />
                    <Input
                      label="كلمة المرور الجديدة"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      id="new-password"
                    />
                    <Input
                      label="تأكيد كلمة المرور الجديدة"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      id="confirm-password"
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleChangePassword}
                      isLoading={loading}
                      leftIcon={<FiLock />}
                    >
                      تغيير كلمة المرور
                    </Button>
                  </div>

                  {/* المصادقة الثنائية */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-bold mb-4">المصادقة الثنائية</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">تفعيل المصادقة الثنائية</p>
                          <p className="text-sm text-gray-500">
                            أضف طبقة أمان إضافية لحسابك
                          </p>
                        </div>
                        <button 
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                          aria-label="تفعيل المصادقة الثنائية"
                        >
                          تفعيل
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* الإشعارات */}
              {activeTab === 'notifications' && (
                <section aria-labelledby="notifications-title">
                  <h2 id="notifications-title" className="text-xl font-bold mb-6">إعدادات الإشعارات</h2>

                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                        <div>
                          <p className="font-medium">
                            {key === 'emailNotifications' && 'الإشعارات عبر البريد'}
                            {key === 'orderUpdates' && 'تحديثات الطلبات'}
                            {key === 'promotions' && 'العروض الترويجية'}
                            {key === 'newUserAlerts' && 'مستخدمين جدد'}
                            {key === 'systemAlerts' && 'تنبيهات النظام'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {key === 'emailNotifications' && 'استلام الإشعارات على البريد الإلكتروني'}
                            {key === 'orderUpdates' && 'إشعارات عند إنشاء أو تحديث الطلبات'}
                            {key === 'promotions' && 'استلام العروض والخصومات الحصرية'}
                            {key === 'newUserAlerts' && 'إشعارات عند تسجيل مستخدمين جدد'}
                            {key === 'systemAlerts' && 'إشعارات مهمة عن حالة النظام'}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          name={key}
                          checked={value}
                          onChange={handleNotificationChange}
                          className="toggle-checkbox"
                          aria-label={`تفعيل ${key}`}
                        />
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleSavePreferences}
                      isLoading={loading}
                      leftIcon={<FiSave />}
                    >
                      حفظ الإعدادات
                    </Button>
                  </div>
                </section>
              )}

              {/* التفضيلات */}
              {activeTab === 'preferences' && (
                <section aria-labelledby="preferences-title">
                  <h2 id="preferences-title" className="text-xl font-bold mb-6">التفضيلات</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                        اللغة
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={preferences.language}
                        onChange={handlePreferenceChange}
                        className="input-field"
                      >
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                        العملة
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        value={preferences.currency}
                        onChange={handlePreferenceChange}
                        className="input-field"
                      >
                        <option value="SAR">ريال سعودي (SAR)</option>
                        <option value="USD">دولار أمريكي (USD)</option>
                        <option value="EUR">يورو (EUR)</option>
                        <option value="EGP">جنية مصري (EGP)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                        المنطقة الزمنية
                      </label>
                      <select
                        id="timezone"
                        name="timezone"
                        value={preferences.timezone}
                        onChange={handlePreferenceChange}
                        className="input-field"
                      >
                        <option value="Asia/Riyadh">الرياض</option>
                        <option value="Asia/Dubai">دبي</option>
                        <option value="Asia/Kuwait">الكويت</option>
                        <option value="Africa/Cairo">القاهرة</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-2">
                        تنسيق التاريخ
                      </label>
                      <select
                        id="dateFormat"
                        name="dateFormat"
                        value={preferences.dateFormat}
                        onChange={handlePreferenceChange}
                        className="input-field"
                      >
                        <option value="DD/MM/YYYY">31/12/2024</option>
                        <option value="MM/DD/YYYY">12/31/2024</option>
                        <option value="YYYY-MM-DD">2024-12-31</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleSavePreferences}
                      isLoading={loading}
                      leftIcon={<FiSave />}
                    >
                      حفظ التفضيلات
                    </Button>
                  </div>
                </section>
              )}

              {/* الشحن */}
              {activeTab === 'shipping' && (
                <section aria-labelledby="shipping-title">
                  <h2 id="shipping-title" className="text-xl font-bold mb-6">إعدادات الشحن</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="الوزن الافتراضي (كجم)"
                      name="defaultWeight"
                      type="number"
                      value={shipping.defaultWeight}
                      onChange={handleShippingChange}
                      step="0.1"
                      min="0"
                      id="shipping-weight"
                    />
                    <Input
                      label="الشحن المجاني (أكثر من)"
                      name="freeShippingThreshold"
                      type="number"
                      value={shipping.freeShippingThreshold}
                      onChange={handleShippingChange}
                      min="0"
                      id="shipping-free"
                    />
                    <Input
                      label="تكلفة الشحن"
                      name="shippingCost"
                      type="number"
                      value={shipping.shippingCost}
                      onChange={handleShippingChange}
                      min="0"
                      id="shipping-cost"
                    />
                  </div>

                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      name="internationalShipping"
                      checked={shipping.internationalShipping}
                      onChange={handleShippingChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      aria-label="تفعيل الشحن الدولي"
                    />
                    <div>
                      <p className="font-medium">شحن دولي</p>
                      <p className="text-sm text-gray-500">
                        تفعيل الشحن خارج المملكة
                      </p>
                    </div>
                  </label>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleSavePreferences}
                      isLoading={loading}
                      leftIcon={<FiSave />}
                    >
                      حفظ الإعدادات
                    </Button>
                  </div>
                </section>
              )}

              {/* طرق الدفع */}
              {activeTab === 'payment' && (
                <section aria-labelledby="payment-title">
                  <h2 id="payment-title" className="text-xl font-bold mb-6">طرق الدفع</h2>

                  <div className="space-y-4">
                    {Object.entries(payment).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                        <div>
                          <p className="font-medium">
                            {key === 'bankTransfer' && 'تحويل بنكي'}
                            {key === 'cashOnDelivery' && 'الدفع عند الاستلام'}
                            {key === 'creditCard' && 'بطاقات ائتمان'}
                            {key === 'applePay' && 'Apple Pay'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {key === 'bankTransfer' && 'قبول الدفع عبر التحويل البنكي'}
                            {key === 'cashOnDelivery' && 'قبول الدفع نقداً عند استلام الطلب'}
                            {key === 'creditCard' && 'قبول فيزا وماستركارد'}
                            {key === 'applePay' && 'قبول الدفع عبر Apple Pay'}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          name={key}
                          checked={value}
                          onChange={handlePaymentChange}
                          className="toggle-checkbox"
                          aria-label={`تفعيل ${key}`}
                        />
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleSavePreferences}
                      isLoading={loading}
                      leftIcon={<FiSave />}
                    >
                      حفظ الإعدادات
                    </Button>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ستايلات toggle checkbox */}
      <style>{`
        .toggle-checkbox {
          width: 3rem;
          height: 1.5rem;
          appearance: none;
          background-color: #e5e7eb;
          border-radius: 9999px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s;
        }
        .toggle-checkbox:checked {
          background-color: #0284c7;
        }
        .toggle-checkbox:focus {
          outline: 2px solid #0284c7;
          outline-offset: 2px;
        }
        .toggle-checkbox::before {
          content: '';
          position: absolute;
          width: 1.25rem;
          height: 1.25rem;
          background-color: white;
          border-radius: 50%;
          top: 0.125rem;
          left: 0.125rem;
          transition: transform 0.3s;
        }
        .toggle-checkbox:checked::before {
          transform: translateX(1.5rem);
        }
      `}</style>
    </div>
  );
};

export default Settings;