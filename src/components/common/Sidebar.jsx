import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiChevronUp,
  FiBarChart2,
  FiStar,
  FiTag,
  FiTruck,
  FiMail,
  FiMessageSquare // ✅ أيقونة إضافية للرسائل
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import categoryService from '../../../services/categoryService';
import toast from 'react-hot-toast';

/**
 * عناصر القائمة الرئيسية (بدون الأقسام الديناميكية)
 */
const BASE_MENU_ITEMS = [
  {
    title: 'الرئيسية',
    icon: FiHome,
    path: '/dashboard'
  },
  {
    title: 'المنتجات',
    icon: FiPackage,
    hasSubmenu: true
  },
  {
    title: 'الطلبات',
    icon: FiShoppingBag,
    submenu: [
      { title: 'جميع الطلبات', path: '/dashboard/orders' },
      { title: 'الطلبات الجديدة', path: '/dashboard/orders?status=pending' },
      { title: 'طلبات قيد المعالجة', path: '/dashboard/orders?status=processing' },
      { title: 'الطلبات المكتملة', path: '/dashboard/orders?status=completed' }
    ]
  },
  {
    title: 'المستخدمين',
    icon: FiUsers,
    path: '/dashboard/users'
  },
  {
    title: 'رسائل الاتصال', // ✅ هذا العنصر موجود
    icon: FiMail,
    path: '/dashboard/contact-messages'
  },
  {
    title: 'التقارير',
    icon: FiBarChart2,
    path: '/dashboard/reports'
  },
  {
    title: 'التقييمات',
    icon: FiStar,
    path: '/dashboard/reviews'
  },
  {
    title: 'العروض',
    icon: FiTag,
    path: '/dashboard/offers'
  },
  {
    title: 'الشحن',
    icon: FiTruck,
    path: '/dashboard/shipping'
  },
  {
    title: 'الإعدادات',
    icon: FiSettings,
    path: '/dashboard/settings'
  }
];

/**
 * مكون القائمة الجانبية للوحة التحكم
 */
const Sidebar = ({ isOpen, onClose }) => {
  const [openMenus, setOpenMenus] = useState(['المنتجات']);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // ✅ عدد الرسائل غير المقروءة
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchUnreadCount(); // ✅ جلب عدد الرسائل غير المقروءة
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getCategories({ perPage: 100 });
      if (response?.status) {
        setCategories(response.data?.data || []);
      }
    } catch (error) {
      console.error('خطأ في جلب الأقسام:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ جلب عدد الرسائل غير المقروءة
  const fetchUnreadCount = async () => {
    try {
      // يمكنك استخدام service لجلب الإحصائيات
      // مؤقتاً نستخدم رقم ثابت
      setUnreadCount(3);
    } catch (error) {
      console.error('خطأ في جلب عدد الرسائل:', error);
    }
  };

  const getProductMenu = () => {
    const productSubmenu = [
      { title: 'جميع المنتجات', path: '/dashboard/products' },
      { title: 'إضافة منتج', path: '/dashboard/products/add' },
      { title: 'الأقسام', path: '/dashboard/categories' },
      ...categories.slice(0, 5).map(cat => ({
        title: cat.name,
        path: `/dashboard/products?category=${cat.id}`
      }))
    ];

    return {
      title: 'المنتجات',
      icon: FiPackage,
      submenu: productSubmenu
    };
  };

  const getFullMenu = () => {
    return BASE_MENU_ITEMS.map(item => {
      if (item.title === 'المنتجات') {
        return getProductMenu();
      }
      return item;
    });
  };

  const toggleMenu = (title) => {
    setOpenMenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (path) => {
    if (!path) return false;
    const basePath = path.split('?')[0];
    return location.pathname === basePath;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/login');
      onClose();
    } catch (error) {
      toast.error('حدث خطأ في تسجيل الخروج');
    }
  };

  const getDisplayName = () => {
    return user?.name || 'مدير النظام';
  };

  const getDisplayEmail = () => {
    return user?.email || 'admin@example.com';
  };

  const menuItems = getFullMenu();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 lg:static lg:shadow-lg overflow-y-auto`}
        aria-label="القائمة الجانبية"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-3" 
              onClick={onClose}
              aria-label="الصفحة الرئيسية"
            >
              <span className="text-2xl font-bold bg-gradient-to-l from-primary-600 to-skin-600 bg-clip-text text-transparent">
                بيوتي طوما
              </span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
              aria-label="إغلاق القائمة"
            >
              <FiLogOut className="w-5 h-5 rotate-180" />
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">مرحباً،</p>
            <p className="font-semibold truncate">{getDisplayName()}</p>
            <p className="text-xs text-gray-400 truncate">{getDisplayEmail()}</p>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.title}>
                {item.path ? (
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-gradient-to-l from-primary-50 to-skin-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    <item.icon className={`w-5 h-5 ${
                      isActive(item.path) ? 'text-primary-600' : ''
                    }`} />
                    <span className="font-medium">{item.title}</span>
                    
                    {/* ✅ عرض عدد الرسائل غير المقروءة */}
                    {item.title === 'رسائل الاتصال' && unreadCount > 0 && (
                      <span className="mr-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        openMenus.includes(item.title)
                          ? 'bg-gradient-to-l from-primary-50 to-skin-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-expanded={openMenus.includes(item.title)}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${
                          openMenus.includes(item.title) ? 'text-primary-600' : ''
                        }`} />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      {openMenus.includes(item.title) ? (
                        <FiChevronUp className="w-4 h-4" />
                      ) : (
                        <FiChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {openMenus.includes(item.title) && item.submenu && (
                      <ul className="mr-8 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.title}>
                            <Link
                              to={subItem.path}
                              onClick={onClose}
                              className={`block px-4 py-2 rounded-lg text-sm transition-all ${
                                isActive(subItem.path)
                                  ? 'text-primary-600 font-medium bg-primary-50'
                                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                              }`}
                              aria-current={isActive(subItem.path) ? 'page' : undefined}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                        
                        {loading && item.title === 'المنتجات' && (
                          <li className="px-4 py-2 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                              <span>جاري تحميل الأقسام...</span>
                            </div>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="border-t mt-6 pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              aria-label="تسجيل الخروج"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;