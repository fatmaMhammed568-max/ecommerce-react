import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiPackage, 
  FiGrid, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiBell,
  FiMail // ✅ إضافة أيقونة الرسائل
} from 'react-icons/fi';
import toast from 'react-hot-toast';

/**
 * عناصر قائمة التنقل في لوحة التحكم
 */
const NAVIGATION_ITEMS = [
  { name: 'الرئيسية', href: '/dashboard', icon: FiHome },
  { name: 'المنتجات', href: '/dashboard/products', icon: FiPackage },
  { name: 'الأقسام', href: '/dashboard/categories', icon: FiGrid },
  { name: 'الطلبات', href: '/dashboard/orders', icon: FiShoppingBag },
  { name: 'المستخدمين', href: '/dashboard/users', icon: FiUsers },
  { name: 'رسائل الاتصال', href: '/dashboard/contact-messages', icon: FiMail }, // ✅ عنصر جديد
  { name: 'الإعدادات', href: '/dashboard/settings', icon: FiSettings },
];

/**
 * تخطيط لوحة التحكم الرئيسي
 */
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(0); // عدد الإشعارات
  const [unreadMessages, setUnreadMessages] = useState(0); // عدد الرسائل غير المقروءة
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * التحقق من صلاحية الدخول عند تحميل الصفحة
   */
  useEffect(() => {
    if (!isAdmin) {
      toast.error('ليس لديك صلاحية الوصول للوحة التحكم');
      navigate('/');
    }
  }, [isAdmin, navigate]);

  /**
   * جلب عدد الرسائل غير المقروءة
   */
  useEffect(() => {
    // يمكنك جلب العدد من API هنا
    // مؤقتاً نستخدم رقم ثابت
    setUnreadMessages(3);
  }, []);

  /**
   * التحقق إذا كان الرابط نشطاً
   */
  const isActive = (path) => {
    return location.pathname === path;
  };

  /**
   * معالجة تسجيل الخروج
   */
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  /**
   * إغلاق القائمة الجانبية
   */
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /**
   * الحصول على الحرف الأول من الاسم
   */
  const getUserInitial = () => {
    return user?.name?.charAt(0) || 'أ';
  };

  /**
   * الحصول على دور المستخدم المعروض
   */
  const getUserRole = () => {
    return 'مدير النظام';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            {/* زر القائمة للشاشات الصغيرة */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
              aria-label="فتح القائمة"
              aria-expanded={sidebarOpen}
            >
              <FiMenu className="w-6 h-6" />
            </button>
            
            {/* الشعار */}
            <Link 
              to="/dashboard" 
              className="mr-4 lg:mr-0 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              aria-label="الصفحة الرئيسية"
            >
              <h1 className="text-2xl font-bold text-primary-600">بيوتي طوما</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* الإشعارات */}
            <button 
              className="relative text-gray-600 hover:text-primary-600 focus:outline-none focus:text-primary-600"
              aria-label={`لديك ${notifications} إشعارات`}
            >
              <FiBell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* المستخدم */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{getUserRole()}</p>
              </div>
              <div 
                className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
                aria-label={`${user?.name || 'المستخدم'}`}
              >
                <span className="text-primary-600 font-bold text-lg">
                  {getUserInitial()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* القائمة الجانبية للشاشات الكبيرة */}
        <aside className="hidden lg:block w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-8 px-4" aria-label="القائمة الرئيسية">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <item.icon className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">{item.name}</span>
                
                {/* عرض عدد الرسائل غير المقروءة بجانب رسائل الاتصال */}
                {item.name === 'رسائل الاتصال' && unreadMessages > 0 && (
                  <span className="mr-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            ))}

            {/* زر تسجيل الخروج */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="تسجيل الخروج"
            >
              <FiLogOut className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </nav>
        </aside>

        {/* القائمة الجانبية للشاشات الصغيرة (منبثقة) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* الخلفية المعتمة */}
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={closeSidebar}
              aria-hidden="true"
            />
            
            {/* القائمة الجانبية */}
            <aside className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold text-primary-600">القائمة</h2>
                <button
                  onClick={closeSidebar}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                  aria-label="إغلاق القائمة"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <nav className="p-4" aria-label="القائمة الرئيسية">
                {NAVIGATION_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                    <span className="font-medium">{item.name}</span>
                    
                    {/* عرض عدد الرسائل غير المقروءة بجانب رسائل الاتصال */}
                    {item.name === 'رسائل الاتصال' && unreadMessages > 0 && (
                      <span className="mr-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadMessages}
                      </span>
                    )}
                  </Link>
                ))}

                {/* زر تسجيل الخروج للشاشات الصغيرة */}
                <button
                  onClick={() => {
                    handleLogout();
                    closeSidebar();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="تسجيل الخروج"
                >
                  <FiLogOut className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium">تسجيل الخروج</span>
                </button>
              </nav>
            </aside>
          </div>
        )}

        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-4 lg:p-8" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;