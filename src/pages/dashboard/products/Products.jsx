import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiRefreshCw } from 'react-icons/fi';
import productService from '../../../services/productService';
import toast from 'react-hot-toast';

/**
 * صفحة إدارة المنتجات في لوحة التحكم
 */
const DashboardProducts = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  // ✅ استخدام import.meta.env بدل process.env
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  /**
   * جلب المنتجات عند تحميل الصفحة أو تغيير البحث
   */
  useEffect(() => {
    fetchProducts(1);
  }, [search]);

  /**
   * جلب المنتجات من API
   * @param {number} page - رقم الصفحة
   */
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    
    try {
      const filters = {
        search: search?.trim() || undefined,
        per_page: 10,
        page: page
      };
      
      const response = await productService.getProducts(filters);
      console.log('Products response:', response);
      
      if (response?.status) {
        // ✅ معالجة شكل البيانات
        const productsData = response.data?.data || response.data || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
        
        setPagination({
          currentPage: response.data?.current_page || 1,
          lastPage: response.data?.last_page || 1,
          total: response.data?.total || 0,
        });
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('خطأ في جلب المنتجات:', error);
      toast.error('حدث خطأ أثناء تحميل المنتجات');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * إعادة تحميل المنتجات
   */
  const refreshProducts = () => {
    fetchProducts(currentPage);
    toast.success('تم تحديث المنتجات');
  };

  /**
   * معالجة حذف منتج
   * @param {number} id - معرف المنتج
   */
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        const response = await productService.deleteProduct(id);
        if (response?.status) {
          toast.success('تم حذف المنتج بنجاح');
          fetchProducts(currentPage);
        }
      } catch (error) {
        console.error('خطأ في حذف المنتج:', error);
        toast.error('حدث خطأ أثناء حذف المنتج');
      }
    }
  };

  /**
   * الحصول على رابط الصورة
   * @param {string} imagePath - مسار الصورة
   * @returns {string} رابط الصورة الكامل
   */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/50x50/0284c7/ffffff?text=No+Image';
    
    if (imagePath.startsWith('http')) return imagePath;
    
    // ✅ استخدام import.meta.env بدل process.env
    return `${API_URL}/${imagePath}`.replace(/([^:]\/)\/+/g, '$1');
  };

  /**
   * تنسيق السعر
   * @param {number} price - السعر
   * @returns {string} السعر المنسق
   */
  const formatPrice = (price) => {
    if (!price && price !== 0) return '0';
    return price.toLocaleString('ar-EG');
  };

  return (
    <div className="p-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">المنتجات</h1>
        <div className="flex gap-3">
          <button
            onClick={refreshProducts}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="تحديث المنتجات"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>تحديث</span>
          </button>
          <Link
            to="/dashboard/products/add"
            className="flex items-center gap-2 bg-gradient-to-l from-primary-600 to-skin-600 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-skin-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="إضافة منتج جديد"
          >
            <FiPlus aria-hidden="true" />
            إضافة منتج جديد
          </Link>
        </div>
      </div>

      {/* شريط البحث */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث عن منتج..."
            className="w-full pr-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            aria-label="البحث عن منتجات"
          />
        </div>
      </div>

      {/* جدول المنتجات */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="text-right py-4 px-6 font-semibold text-gray-700">المنتج</th>
                <th scope="col" className="text-right py-4 px-6 font-semibold text-gray-700">السعر</th>
                <th scope="col" className="text-right py-4 px-6 font-semibold text-gray-700">الكمية</th>
                <th scope="col" className="text-right py-4 px-6 font-semibold text-gray-700">القسم</th>
                <th scope="col" className="text-right py-4 px-6 font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" role="status" aria-label="جاري التحميل" />
                      <span className="text-gray-500">جاري تحميل المنتجات...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="text-gray-500">
                      <p className="text-lg mb-2">لا توجد منتجات</p>
                      <Link
                        to="/dashboard/products/add"
                        className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center gap-2"
                      >
                        <FiPlus />
                        إضافة منتج جديد
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(product.main_image || product.image)}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/50x50/0284c7/ffffff?text=No+Image';
                          }}
                          loading="lazy"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          {product.sku && (
                            <p className="text-sm text-gray-500">كود: {product.sku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary-600">{formatPrice(product.price)} ج.م</span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.compare_price)} ج.م
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.quantity > 0 
                          ? product.quantity < 10 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.quantity > 0 ? `${product.quantity} قطعة` : 'غير متوفر'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {product.category?.name || 'غير مصنف'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/products/edit/${product.id}`}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label={`تعديل المنتج ${product.name}`}
                          title="تعديل"
                        >
                          <FiEdit aria-hidden="true" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label={`حذف المنتج ${product.name}`}
                          title="حذف"
                        >
                          <FiTrash2 aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* أزرار التنقل بين الصفحات */}
      {pagination.lastPage > 1 && (
        <nav className="mt-6 flex justify-center" aria-label="التنقل بين صفحات المنتجات">
          <div className="flex gap-2">
            {/* زر الصفحة السابقة */}
            <button
              onClick={() => fetchProducts(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="الصفحة السابقة"
            >
              السابق
            </button>

            {/* أرقام الصفحات */}
            {[...Array(Math.min(pagination.lastPage, 5))].map((_, index) => {
              let pageNumber;
              if (pagination.lastPage <= 5) {
                pageNumber = index + 1;
              } else if (pagination.currentPage <= 3) {
                pageNumber = index + 1;
              } else if (pagination.currentPage >= pagination.lastPage - 2) {
                pageNumber = pagination.lastPage - 4 + index;
              } else {
                pageNumber = pagination.currentPage - 2 + index;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => fetchProducts(pageNumber)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    pagination.currentPage === pageNumber
                      ? 'bg-gradient-to-l from-primary-600 to-skin-600 text-white hover:from-primary-700 hover:to-skin-700'
                      : 'bg-white hover:bg-gray-100 border border-gray-200 text-gray-700'
                  }`}
                  aria-label={`الصفحة ${pageNumber}`}
                  aria-current={pagination.currentPage === pageNumber ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* زر الصفحة التالية */}
            <button
              onClick={() => fetchProducts(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.lastPage}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="الصفحة التالية"
            >
              التالي
            </button>
          </div>
        </nav>
      )}

      {/* إحصائيات */}
      {!loading && products.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          إجمالي {pagination.total?.toLocaleString('ar-EG') || 0} منتج
          {pagination.lastPage > 1 && ` - صفحة ${pagination.currentPage} من ${pagination.lastPage}`}
        </div>
      )}
    </div>
  );
};

export default DashboardProducts;