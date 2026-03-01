import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';  // ✅ تم التصحيح
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';

/**
 * ألوان حالات الطلب
 */
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
};

/**
 * نصوص حالات الطلب
 */
const STATUS_TEXT = {
  pending: 'قيد الانتظار',
  processing: 'قيد المعالجة',
  shipped: 'تم الشحن',
  delivered: 'تم التوصيل',
  completed: 'مكتمل',
  cancelled: 'ملغي',
  refunded: 'مسترجع'
};

/**
 * أيقونات حالات الطلب
 */
const STATUS_ICON = {
  pending: FiClock,
  processing: FiPackage,
  shipped: FiTruck,
  delivered: FiCheckCircle,
  completed: FiCheckCircle,
  cancelled: FiXCircle,
  refunded: FiXCircle
};

/**
 * صفحة قائمة الطلبات
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  /**
   * جلب الطلبات عند تحميل الصفحة أو تغيير حالة المصادقة
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * جلب الطلبات من API
   */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders();
      if (response?.status) {
        setOrders(response.data?.data || []);
      }
    } catch (error) {
      console.error('خطأ في جلب الطلبات:', error);
      toast.error('حدث خطأ أثناء تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  /**
   * تنسيق التاريخ
   * @param {string} dateString - نص التاريخ
   * @returns {string} التاريخ المنسق
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  /**
   * الحصول على رابط الصورة
   * @param {string} imagePath - مسار الصورة
   * @returns {string} رابط الصورة الكامل
   */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/50x50?text=Product';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${imagePath}`;
  };

  if (loading) {
    return <Loader text="جاري تحميل طلباتك..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-12 bg-gray-50" dir="rtl">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <FiPackage className="w-20 h-20 text-primary-600 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">تسجيل الدخول مطلوب</h2>
            <p className="text-gray-600 mb-8">يرجى تسجيل الدخول لعرض طلباتك</p>
            <Link 
              to="/login" 
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-block focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="تسجيل الدخول"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">طلباتي</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <FiPackage className="w-20 h-20 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">لا توجد طلبات</h2>
            <p className="text-gray-600 mb-8">لم تقم بإنشاء أي طلبات بعد</p>
            <Link 
              to="/products" 
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-block focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="تسوق الآن"
            >
              تسوق الآن
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = STATUS_ICON[order.status] || FiPackage;
              return (
                <Link
                  key={order.id}
                  to={`/order/${order.id}`}
                  className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label={`عرض تفاصيل الطلب رقم ${order.order_number || order.id}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-lg font-bold text-primary-600">
                          #{order.order_number || order.id}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                          <StatusIcon className="w-4 h-4" aria-hidden="true" />
                          {STATUS_TEXT[order.status] || order.status}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        تاريخ الطلب: {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="text-left">
                      <p className="text-2xl font-bold text-primary-600">
                        {order.total_amount?.toLocaleString('ar-SA')} ر.س
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'منتج' : 'منتجات'}
                      </p>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="flex flex-wrap items-center gap-4">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <img
                              src={getImageUrl(item.product?.main_image)}
                              alt={item.product?.name || item.product_name}
                              className="w-10 h-10 object-cover rounded"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/50x50?text=Product';
                              }}
                              loading="lazy"
                            />
                            <span className="text-sm text-gray-600">
                              {item.product?.name || item.product_name} × {item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-sm text-gray-500">
                            +{order.items.length - 3} {order.items.length - 3 === 1 ? 'منتج آخر' : 'منتجات أخرى'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-sm text-primary-600">
                    <span>عرض التفاصيل</span>
                    <FiPackage aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;