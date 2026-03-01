import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

/**
 * مكون جدول مع إمكانية الفرز والتصفح
 * @template T - نوع بيانات الجدول
 * @param {Object} props - خصائص المكون
 * @param {Array<{key: string, title: string, render?: Function, sortable?: boolean, width?: string}>} props.columns - أعمدة الجدول
 * @param {T[]} props.data - بيانات الجدول
 * @param {boolean} [props.loading=false] - حالة التحميل
 * @param {Object} [props.pagination] - إعدادات التصفح
 * @param {number} props.pagination.currentPage - الصفحة الحالية
 * @param {number} props.pagination.totalPages - إجمالي الصفحات
 * @param {number} props.pagination.totalItems - إجمالي العناصر
 * @param {Function} props.pagination.onPageChange - دالة تغيير الصفحة
 * @param {Function} [props.onRowClick] - دالة النقر على الصف
 * @param {string} [props.emptyMessage='لا توجد بيانات'] - رسالة عدم وجود بيانات
 */
function Table({
  columns,
  data,
  loading = false,
  pagination,
  onRowClick,
  emptyMessage = 'لا توجد بيانات'
}) {
  const [sortConfig, setSortConfig] = React.useState(null);

  /**
   * معالجة النقر على زر الفرز
   * @param {string} key - مفتاح العمود
   */
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  /**
   * ترتيب البيانات حسب التكوين الحالي
   */
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // مقارنة القيم
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  /**
   * الحصول على أيقونة الفرز المناسبة
   * @param {Object} column - عمود الجدول
   * @returns {string} كلاسات الأيقونة
   */
  const getSortIconClass = (column) => {
    if (sortConfig?.key !== column.key) return '';
    return sortConfig.direction === 'asc' ? 'rotate-180' : '';
  };

  /**
   * تصفية أرقام الصفحات المعروضة
   * @param {number} page - رقم الصفحة
   * @returns {boolean} هل تظهر الصفحة
   */
  const shouldShowPage = (page) => {
    const current = pagination.currentPage;
    return (
      page === 1 ||
      page === pagination.totalPages ||
      Math.abs(page - current) <= 2
    );
  };

  /**
   * إنشاء أزرار الصفحات
   * @returns {Array} مصفوفة أزرار الصفحات
   */
  const renderPageButtons = () => {
    const pages = [];
    const totalPages = pagination.totalPages;
    const current = pagination.currentPage;

    for (let i = 1; i <= totalPages; i++) {
      if (shouldShowPage(i)) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div 
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"
          role="status"
          aria-label="جاري التحميل"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* الرأس */}
          <thead className="bg-gradient-to-l from-primary-50 to-skin-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="text-right py-4 px-6 font-semibold text-gray-700"
                  style={{ width: column.width }}
                  scope="col"
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(String(column.key))}
                        className="hover:text-primary-600 transition-colors focus:outline-none focus:text-primary-600"
                        aria-label={`ترتيب حسب ${column.title}`}
                      >
                        <svg
                          className={`w-4 h-4 transform ${getSortIconClass(column)}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* الجسم */}
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  role={onRowClick ? 'button' : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onRowClick(item);
                    }
                  }}
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="py-4 px-6">
                      {column.render
                        ? column.render(item)
                        : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* التصفح */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-600">
            إجمالي {pagination.totalItems.toLocaleString('ar-SA')} عنصر
          </div>
          
          <nav className="flex items-center gap-2" aria-label="تصفح الصفحات">
            {/* الصفحة الأولى */}
            <button
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="الصفحة الأولى"
            >
              <FiChevronsRight aria-hidden="true" />
            </button>

            {/* السابق */}
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="الصفحة السابقة"
            >
              <FiChevronRight aria-hidden="true" />
            </button>

            {/* أرقام الصفحات */}
            <div className="flex items-center gap-1">
              {renderPageButtons().map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2 text-gray-400" aria-hidden="true">...</span>
                  )}
                  <button
                    onClick={() => pagination.onPageChange(page)}
                    className={`w-10 h-10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      pagination.currentPage === page
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'hover:bg-gray-100'
                    }`}
                    aria-label={`الصفحة ${page}`}
                    aria-current={pagination.currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* التالي */}
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="الصفحة التالية"
            >
              <FiChevronLeft aria-hidden="true" />
            </button>

            {/* الصفحة الأخيرة */}
            <button
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="الصفحة الأخيرة"
            >
              <FiChevronsLeft aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Table;