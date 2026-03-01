import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../../components/cards/ProductCard';
import Loader from '../../components/common/Loader';
import {
  FaArrowLeft,
  FaTh,
  FaList,
  FaSlidersH,
  FaTimes,
  FaFilter,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaStarHalf,
  FaRegStar
} from 'react-icons/fa';
import { BiSort } from 'react-icons/bi';
import categoryService from '../../services/categoryService';
import productService from '../../services/productService';
import toast from 'react-hot-toast';

/**
 * خيارات الترتيب
 */
const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'price_low', label: 'السعر: من الأقل إلى الأعلى' },
  { value: 'price_high', label: 'السعر: من الأعلى إلى الأقل' },
  { value: 'popular', label: 'الأكثر مبيعاً' },
  { value: 'rating', label: 'التقييم' }
];

/**
 * صفحة عرض منتجات قسم معين
 */
const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // حالة الصفحة
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حالة الفلاتر
  const [filters, setFilters] = useState({
    sort: 'newest',
    priceRange: { min: 0, max: 10000 },
    brands: [],
    inStock: false,
    onSale: false,
    subcategory: ''
  });

  // حالة واجهة المستخدم
  const [priceLimits, setPriceLimits] = useState({ min: 0, max: 10000 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [perPage] = useState(12);

  /**
   * جلب بيانات القسم عند تحميل الصفحة أو تغيير المعرف
   */
  useEffect(() => {
    if (id) {
      fetchCategoryData();
      fetchProducts();
    }
  }, [id]);

  /**
   * تطبيق الفلاتر عند تغيير المنتجات أو الفلاتر
   */
  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  /**
   * جلب بيانات القسم من API
   */
  const fetchCategoryData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ✅ استخدام interface بدل dashboard
      const response = await categoryService.getInterfaceCategory(id);
      console.log('Category response:', response);
      
      if (response?.status) {
        setCategory(response.data);
        
        // جلب الأقسام الفرعية إذا كانت موجودة
        if (response.data.subcategories && Array.isArray(response.data.subcategories)) {
          setSubcategories(response.data.subcategories);
        }
      } else {
        setError('القسم غير موجود');
      }
    } catch (error) {
      console.error('خطأ في جلب القسم:', error);
      setError(error.message || 'حدث خطأ في تحميل القسم');
      toast.error('حدث خطأ في تحميل القسم');
    }
  };

  /**
   * جلب منتجات القسم من API
   */
  const fetchProducts = async () => {
    try {
      const params = {
        category_id: id,
        per_page: 50, // جلب عدد كافي للتصفية
        sort: filters.sort
      };
      
      const response = await productService.getInterfaceProducts(params);
      console.log('Products response:', response);
      
      if (response?.status) {
        const productsData = response.data?.data || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
        setTotalProducts(response.data?.total || 0);
        
        // حساب حدود الأسعار
        if (productsData.length > 0) {
          const prices = productsData.map(p => p.price).filter(p => p);
          if (prices.length > 0) {
            setPriceLimits({ 
              min: Math.min(...prices), 
              max: Math.max(...prices) 
            });
            
            setFilters(prev => ({
              ...prev,
              priceRange: { 
                min: Math.min(...prices), 
                max: Math.max(...prices) 
              }
            }));
          }
        }
        
        // استخراج الماركات المتاحة
        const brands = [...new Set(productsData.map(p => p.brand).filter(Boolean))];
        setAvailableBrands(brands);
        
        setTotalPages(Math.ceil(productsData.length / perPage));
      }
    } catch (error) {
      console.error('خطأ في جلب المنتجات:', error);
      toast.error('حدث خطأ في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ترتيب المنتجات حسب الاختيار
   */
  const sortProducts = (items) => {
    const sorted = [...items];
    switch (filters.sort) {
      case 'price_low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'popular':
        return sorted.sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0));
      default:
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  };

  /**
   * تطبيق الفلاتر على المنتجات
   */
  const applyFilters = () => {
    let filtered = [...products];

    // فلتر حسب السعر
    filtered = filtered.filter(p =>
      (p.price || 0) >= filters.priceRange.min &&
      (p.price || 0) <= filters.priceRange.max
    );

    // فلتر حسب الماركات
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => p.brand && filters.brands.includes(p.brand));
    }

    // فلتر حسب التوفر
    if (filters.inStock) {
      filtered = filtered.filter(p => p.quantity > 0);
    }

    // فلتر حسب التخفيضات
    if (filters.onSale) {
      filtered = filtered.filter(p => p.compare_price && p.compare_price > p.price);
    }

    // فلتر حسب القسم الفرعي
    if (filters.subcategory) {
      filtered = filtered.filter(p => p.subcategory_id === parseInt(filters.subcategory));
    }

    // ترتيب المنتجات
    filtered = sortProducts(filtered);

    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / perPage));
    setCurrentPage(1);
  };

  /**
   * تبديل اختيار ماركة
   */
  const toggleBrand = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  /**
   * إعادة تعيين جميع الفلاتر
   */
  const resetFilters = () => {
    setFilters({
      sort: 'newest',
      priceRange: { min: priceLimits.min, max: priceLimits.max },
      brands: [],
      inStock: false,
      onSale: false,
      subcategory: ''
    });
  };

  /**
   * تغيير الصفحة
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loader text="جاري تحميل المنتجات..." />;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <p className="text-red-600 text-xl mb-4" role="alert">{error}</p>
          <button 
            onClick={() => navigate('/categories')}
            className="bg-gradient-to-l from-primary-600 to-skin-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-skin-700 transition-all"
          >
            العودة للأقسام
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8" dir="rtl">
      <div className="container-custom">
        {/* مسار التنقل (Breadcrumb) */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6" aria-label="مسار التنقل">
          <Link to="/" className="hover:text-primary-600 transition-colors">
            الرئيسية
          </Link>
          <FaArrowLeft className="w-3 h-3" />
          <Link to="/categories" className="hover:text-primary-600 transition-colors">
            الأقسام
          </Link>
          <FaArrowLeft className="w-3 h-3" />
          <span className="text-primary-600 font-semibold">{category?.name}</span>
        </nav>

        {/* عنوان القسم */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{category?.name}</h1>
          <p className="text-gray-600 max-w-3xl">{category?.description || 'جميع منتجات هذا القسم'}</p>
          <p className="text-sm text-gray-500 mt-2">
            {filteredProducts.length} من أصل {totalProducts} منتج
          </p>
        </div>

        {/* الأقسام الفرعية */}
        {subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">الأقسام الفرعية</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilters(prev => ({ ...prev, subcategory: '' }))}
                className={`px-5 py-2 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  !filters.subcategory 
                    ? 'bg-primary-600 text-white border-primary-600' 
                    : 'bg-white border-gray-200 hover:border-primary-500'
                }`}
              >
                الكل
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setFilters(prev => ({ ...prev, subcategory: sub.id }))}
                  className={`px-5 py-2 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    filters.subcategory === sub.id
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white border-gray-200 hover:border-primary-500 hover:text-primary-600'
                  }`}
                >
                  <span className="font-medium">{sub.name}</span>
                  <span className="text-xs mr-2">
                    ({sub.products_count || 0})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* شريط التحكم */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* عرض عدد النتائج */}
          <p className="text-gray-600">
            تم العثور على <span className="font-bold text-primary-600">{filteredProducts.length}</span> منتج
          </p>

          <div className="flex items-center gap-4">
            {/* زر عرض الفلاتر للشاشات الصغيرة */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
              aria-label="إظهار الفلاتر"
            >
              <FaSlidersH className="w-4 h-4" />
              <span>فلتر</span>
            </button>

            {/* تبديل عرض الشبكة/قائمة */}
            <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="عرض شبكي"
              >
                <FaTh className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="عرض قائمة"
              >
                <FaList className="w-4 h-4" />
              </button>
            </div>

            {/* قائمة الترتيب */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer pr-8"
                aria-label="ترتيب حسب"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <BiSort className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* الفلاتر - للشاشات الكبيرة */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FaFilter className="text-primary-600" />
                  تصفية النتائج
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  إعادة تعيين
                </button>
              </div>

              {/* فلتر السعر */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4">السعر (ج.م)</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={filters.priceRange.min}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                      }))}
                      className="w-24 px-3 py-2 border border-gray-200 rounded-lg"
                      min={priceLimits.min}
                      max={priceLimits.max}
                      placeholder="من"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={filters.priceRange.max}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                      }))}
                      className="w-24 px-3 py-2 border border-gray-200 rounded-lg"
                      min={priceLimits.min}
                      max={priceLimits.max}
                      placeholder="إلى"
                    />
                  </div>
                  <div className="px-2">
                    <input
                      type="range"
                      min={priceLimits.min}
                      max={priceLimits.max}
                      value={filters.priceRange.max}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                      }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{priceLimits.min} ج.م</span>
                      <span>{priceLimits.max} ج.م</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* فلتر الماركات */}
              {availableBrands.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-4">الماركات</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableBrands.map(brand => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* فلاتر إضافية */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">متوفر فقط</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={(e) => setFilters(prev => ({ ...prev, onSale: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">عروض وتخفيضات</span>
                </label>
              </div>
            </div>
          </aside>

          {/* قائمة المنتجات */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`grid ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'grid-cols-1 gap-4'
                  }`}
                >
                  {filteredProducts
                    .slice((currentPage - 1) * perPage, currentPage * perPage)
                    .map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <p className="text-xl text-gray-600 mb-4">لا توجد منتجات تطابق بحثك</p>
                  <button
                    onClick={resetFilters}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    إعادة تعيين الفلاتر
                  </button>
                </div>
              )}
            </AnimatePresence>

            {/* أزرار التنقل بين الصفحات */}
            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-center gap-2" aria-label="التنقل بين الصفحات">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="الصفحة السابقة"
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
                
                {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = index + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + index;
                  } else {
                    pageNumber = currentPage - 2 + index;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        currentPage === pageNumber
                          ? 'bg-gradient-to-l from-primary-600 to-skin-600 text-white'
                          : 'bg-white hover:bg-gray-100 border border-gray-200 text-gray-700'
                      }`}
                      aria-label={`الصفحة ${pageNumber}`}
                      aria-current={currentPage === pageNumber ? 'page' : undefined}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="الصفحة التالية"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>

      {/* مودال الفلاتر للشاشات الصغيرة */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <FaFilter className="text-primary-600" />
                    تصفية النتائج
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="إغلاق"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                {/* زر إعادة تعيين */}
                <button
                  onClick={() => {
                    resetFilters();
                    setShowMobileFilters(false);
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 mb-4 block"
                >
                  إعادة تعيين الفلاتر
                </button>

                {/* فلتر السعر */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-4">السعر (ج.م)</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={filters.priceRange.min}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                        }))}
                        className="w-24 px-3 py-2 border border-gray-200 rounded-lg"
                        min={priceLimits.min}
                        max={priceLimits.max}
                        placeholder="من"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        value={filters.priceRange.max}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                        }))}
                        className="w-24 px-3 py-2 border border-gray-200 rounded-lg"
                        min={priceLimits.min}
                        max={priceLimits.max}
                        placeholder="إلى"
                      />
                    </div>
                    <div className="px-2">
                      <input
                        type="range"
                        min={priceLimits.min}
                        max={priceLimits.max}
                        value={filters.priceRange.max}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                        }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>{priceLimits.min} ج.م</span>
                        <span>{priceLimits.max} ج.م</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* فلتر الماركات */}
                {availableBrands.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-4">الماركات</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availableBrands.map(brand => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={filters.brands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-gray-700">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* فلاتر إضافية */}
                <div className="mb-6 space-y-3">
                  <h4 className="font-semibold mb-4">خيارات إضافية</h4>
                  <label className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">المتوفرة فقط</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={filters.onSale}
                      onChange={(e) => setFilters(prev => ({ ...prev, onSale: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">عروض وتخفيضات</span>
                  </label>
                </div>

                {/* أزرار التنقل */}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => {
                      resetFilters();
                      setShowMobileFilters(false);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 px-4 py-2 bg-gradient-to-l from-primary-600 to-skin-600 text-white rounded-lg hover:from-primary-700 hover:to-skin-700 transition-colors"
                  >
                    تطبيق
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryPage;