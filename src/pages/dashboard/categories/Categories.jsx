import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import Table from '../../../components/ui/Table';
import categoryService from '../../../services/categoryService';  // ✅ تم التصحيح
import toast from 'react-hot-toast';

/**
 * صفحة إدارة الأقسام في لوحة التحكم
 */
const DashboardCategories = () => {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  /**
   * جلب الأقسام عند تحميل الصفحة أو تغيير البحث
   */
  useEffect(() => {
    fetchCategories(1);
  }, [search]);

  /**
   * جلب الأقسام من API
   * @param {number} page - رقم الصفحة
   */
  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      setCurrentPage(page);

      const params = {
        search: search?.trim() || undefined,
        perPage: 10,
        page: page
      };

      const response = await categoryService.getCategories(params);

      if (response?.status) {
        setCategories(response.data?.data || []);
        setPagination({
          currentPage: response.data?.current_page || 1,
          totalPages: response.data?.last_page || 1,
          total: response.data?.total || 0,
        });
      }
    } catch (error) {
      console.error('خطأ في تحميل الأقسام:', error);
      toast.error('حدث خطأ أثناء تحميل الأقسام');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * معالجة حذف قسم
   * @param {number} id - معرف القسم
   */
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا القسم؟')) {
      try {
        const response = await categoryService.deleteCategory(id);

        if (response?.status) {
          toast.success('تم حذف القسم بنجاح');
          fetchCategories(currentPage);
        }
      } catch (error) {
        console.error('خطأ في حذف القسم:', error);
        toast.error('حدث خطأ أثناء حذف القسم');
      }
    }
  };

  /**
   * تنسيق التاريخ
   * @param {string} dateString - نص التاريخ
   * @returns {string} التاريخ المنسق
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'غير متوفر';
    try {
      return new Date(dateString).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'تاريخ غير صالح';
    }
  };

  /**
   * الحصول على الحرف الأول من اسم القسم
   * @param {string} name - اسم القسم
   * @returns {string} الحرف الأول
   */
  const getInitial = (name) => {
    return name?.charAt(0) || '?';
  };

  /**
   * معالجة تغيير البحث
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // أعمدة الجدول
  const columns = [
    {
      key: 'name',
      title: 'اسم القسم',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-skin-100 rounded-lg flex items-center justify-center">
            <span className="text-primary-600 font-bold">
              {getInitial(item.name)}
            </span>
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">{item.slug}</p>
          </div>
        </div>
      )
    },
    {
      key: 'products_count',
      title: 'عدد المنتجات',
      render: (item) => (
        <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
          {item.products_count?.toLocaleString('ar-SA') || 0} منتج
        </span>
      )
    },
    {
      key: 'created_at',
      title: 'تاريخ الإضافة',
      render: (item) => formatDate(item.created_at)
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (item) => (
        <div className="flex gap-2">
          <Link
            to={`/dashboard/categories/edit/${item.id}`}
            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`تعديل قسم ${item.name}`}
          >
            <FiEdit aria-hidden="true" />
          </Link>

          <button
            onClick={() => handleDelete(item.id)}
            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={`حذف قسم ${item.name}`}
          >
            <FiTrash2 aria-hidden="true" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">إدارة الأقسام</h1>

        <Link
          to="/dashboard/categories/add"
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="إضافة قسم جديد"
        >
          <FiPlus aria-hidden="true" />
          إضافة قسم
        </Link>
      </div>

      {/* شريط البحث */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-500" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="ابحث عن قسم..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pr-10 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            aria-label="البحث عن أقسام"
          />
        </div>
      </div>

      {/* جدول الأقسام */}
      <div className="bg-white rounded-xl shadow">
        <Table
          columns={columns}
          data={categories}
          loading={loading}
          emptyMessage="لا توجد أقسام حالياً"
        />
      </div>

      {/* أزرار التنقل بين الصفحات */}
      {pagination.totalPages > 1 && (
        <nav className="flex justify-center mt-6 gap-2" aria-label="التنقل بين صفحات الأقسام">
          {[...Array(pagination.totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => fetchCategories(pageNumber)}
                className={`px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  pagination.currentPage === pageNumber
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                aria-label={`الصفحة ${pageNumber}`}
                aria-current={pagination.currentPage === pageNumber ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </nav>
      )}

      {/* إحصائيات */}
      {!loading && categories.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          إجمالي {pagination.total.toLocaleString('ar-SA')} قسم
          {pagination.totalPages > 1 && ` - صفحة ${pagination.currentPage} من ${pagination.totalPages}`}
        </div>
      )}
    </div>
  );
};

export default DashboardCategories;