import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import categoryService from '../../services/categoryService';
import { 
  FiMenu, 
  FiX, 
  FiShoppingCart,  
  FiLogOut,
  FiHeart,
  FiSearch,
  FiChevronDown,
  FiUser
} from 'react-icons/fi';

const logo = 'https://placehold.co/150x50/0284c7/ffffff?text=BeautyToma';

/**
 * بيانات افتراضية للأقسام في حالة فشل API
 */
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'العناية بالبشرة', slug: 'skincare' },
  { id: 2, name: 'العناية بالشعر', slug: 'haircare' },
  { id: 3, name: 'مكياج', slug: 'makeup' },
  { id: 4, name: 'عطور', slug: 'perfumes' },
  { id: 5, name: 'زيوت طبيعية', slug: 'oils' },
  { id: 6, name: 'مستلزمات حمام', slug: 'bath' }
];

/**
 * روابط القائمة الرئيسية
 */
const NAV_LINKS = [
  { to: '/', text: 'الرئيسية' },
  { to: '/products', text: 'المنتجات' },
  { to: '/about', text: 'من نحن' },
  { to: '/contact', text: 'تواصل بنا' }
];

/**
 * مكون شريط التنقل العلوي
 */
const Navbar = () => {
  // حالات واجهة المستخدم
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // استخدام hooks
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  /**
   * متابعة التمرير لتغيير شكل الـ navbar
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * جلب الأقسام عند تحميل المكون
   */
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * جلب قائمة الأقسام
   */
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryService.getCategories({ perPage: 10 });
      console.log('Categories response:', response); // للتتبع
      
      // التحقق من شكل البيانات القادمة من API
      if (response?.status) {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.warn('تنسيق البيانات غير متوقع، استخدام البيانات الافتراضية');
          setCategories(DEFAULT_CATEGORIES);
        }
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (error) {
      console.error('خطأ في جلب الأقسام:', error);
      setError('فشل تحميل الأقسام');
      // استخدام البيانات الافتراضية في حالة الخطأ
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  /**
   * معالجة البحث
   * @param {React.FormEvent} e - حدث تقديم النموذج
   */
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery?.trim();
    
    if (trimmedQuery) {
      navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  /**
   * معالجة تسجيل الخروج
   */
  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  /**
   * إغلاق جميع القوائم
   */
  const closeAllMenus = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  };

  /**
   * الحصول على الحرف الأول من الاسم
   * @param {string} name - الاسم الكامل
   * @returns {string} الحرف الأول
   */
  const getInitial = (name) => {
    return name?.charAt(0) || 'أ';
  };

  /**
   * الحصول على الاسم الأول
   * @param {string} name - الاسم الكامل
   * @returns {string} الاسم الأول
   */
  const getFirstName = (name) => {
    return name?.split(' ')[0] || '';
  };

  /**
   * معالجة النقر على القسم
   * @param {number} categoryId - معرف القسم
   */
  const handleCategoryClick = (categoryId) => {
    closeAllMenus();
    navigate(`/category/${categoryId}`);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* الشعار */}
          <Link 
            to="/" 
            className="flex items-center gap-3"
            onClick={closeAllMenus}
          >
            <img 
              src={logo} 
              alt="بيوتي طوما" 
              className="h-12 w-auto"
              loading="eager"
            />
            <span className="text-2xl font-bold bg-gradient-to-l from-primary-600 to-skin-600 bg-clip-text text-transparent">
              بيوتي طوما
            </span>
          </Link>

          {/* قائمة التصفح للشاشات الكبيرة */}
          <div className="hidden lg:flex items-center gap-8">
            {/* الرئيسية */}
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              onClick={closeAllMenus}
            >
              الرئيسية
            </Link>
            
            {/* المنتجات */}
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              onClick={closeAllMenus}
            >
              المنتجات
            </Link>
            
            {/* الأقسام - مع قائمة منسدلة */}
            <div className="relative group">
              <button 
                className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                aria-label="الأقسام"
                aria-expanded="false"
              >
                الأقسام
                <FiChevronDown className="group-hover:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">
                {loading ? (
                  <div className="px-4 py-3 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    </div>
                    <span className="mt-2 block">جاري التحميل...</span>
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className="w-full text-right px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 first:rounded-t-xl last:rounded-b-xl transition-colors border-b last:border-0"
                    >
                      {cat.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-gray-500">
                    لا توجد أقسام
                  </div>
                )}
              </div>
            </div>

            {/* من نحن */}
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              onClick={closeAllMenus}
            >
              من نحن
            </Link>
            
            {/* تواصل بنا */}
            <Link
              to="/contact"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              onClick={closeAllMenus}
            >
              تواصل بنا
            </Link>
          </div>

          {/* أيقونات التفاعل */}
          <div className="flex items-center gap-4">
            {/* بحث */}
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsProfileOpen(false);
                setIsOpen(false);
              }}
              className="text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="بحث"
              aria-expanded={isSearchOpen}
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* المفضلة */}
            <Link 
              to="/wishlist" 
              className="relative text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="المفضلة"
              onClick={closeAllMenus}
            >
              <FiHeart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* السلة */}
            <Link 
              to="/cart" 
              className="relative text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="السلة"
              onClick={closeAllMenus}
            >
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-600 to-skin-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* حساب المستخدم */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsSearchOpen(false);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                  aria-label="قائمة المستخدم"
                  aria-expanded={isProfileOpen}
                >
                  <div className="w-9 h-9 bg-gradient-to-r from-primary-100 to-skin-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold">
                      {getInitial(user?.name)}
                    </span>
                  </div>
                  <span className="hidden lg:block">{getFirstName(user?.name)}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border">
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      الملف الشخصي
                    </Link>
                    
                    <Link
                      to="/orders"
                      className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      طلباتي
                    </Link>
                    
                    {isAdmin && (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        لوحة التحكم
                      </Link>
                    )}
                    
                    <hr className="my-2" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <FiLogOut />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={closeAllMenus}
                >
                  دخول
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-600 to-skin-600 text-white px-4 py-2 rounded-lg font-medium hover:from-primary-700 hover:to-skin-700 transition-all transform hover:scale-105"
                  onClick={closeAllMenus}
                >
                  تسجيل
                </Link>
              </div>
            )}

            {/* زر القائمة للشاشات الصغيرة */}
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setIsProfileOpen(false);
                setIsSearchOpen(false);
              }}
              className="lg:hidden text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="القائمة الرئيسية"
              aria-expanded={isOpen}
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* شريط البحث */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-full bg-white shadow-lg p-4 animate-fadeIn border-t">
            <form onSubmit={handleSearch} className="container-custom">
              <div className="relative">
                <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن منتجات العناية بالبشرة..."
                  className="w-full pr-12 pl-24 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                  autoFocus
                  aria-label="بحث عن منتجات"
                />
                <button
                  type="submit"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  disabled={!searchQuery?.trim()}
                >
                  بحث
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* القائمة للشاشات الصغيرة */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg animate-slideDown">
          <div className="container-custom py-4">
            {/* روابط القائمة الرئيسية للشاشات الصغيرة */}
            <Link
              to="/"
              className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              الرئيسية
            </Link>
            
            <Link
              to="/products"
              className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              المنتجات
            </Link>
            
            {/* الأقسام للشاشات الصغيرة */}
            <div className="py-2">
              <p className="text-gray-500 text-sm mb-2">الأقسام</p>
              {loading ? (
                <div className="flex items-center gap-2 pr-4">
                  <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  <p className="text-gray-500 text-sm">جاري التحميل...</p>
                </div>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="block w-full text-right py-2 pr-4 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {cat.name}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm pr-4">لا توجد أقسام</p>
              )}
            </div>

            <Link
              to="/about"
              className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              من نحن
            </Link>
            
            <Link
              to="/contact"
              className="block py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              تواصل بنا
            </Link>

            {/* أزرار الدخول والتسجيل للشاشات الصغيرة */}
            {!isAuthenticated && (
              <div className="flex gap-3 mt-4 pt-4 border-t">
                <Link
                  to="/login"
                  className="flex-1 text-center px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  دخول
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  تسجيل
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;