import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiTruck,
  FiChevronLeft 
} from 'react-icons/fi';

/**
 * تكوين حالات الطلب
 * يحتوي على اللون والأيقونة والنص لكل حالة
 */
const STATUS_CONFIG = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: FiClock,
    text: 'قيد الانتظار',
    progressWidth: 'w-1/4',
    progressColor: 'bg-yellow-500'
  },
  processing: {
    color: 'bg-blue-100 text-blue-800',
    icon: FiPackage,
    text: 'قيد المعالجة',
    progressWidth: 'w-1/2',
    progressColor: 'bg-blue-500'
  },
  shipped: {
    color: 'bg-purple-100 text-purple-800',
    icon: FiTruck,
    text: 'تم الشحن',
    progressWidth: 'w-3/4',
    progressColor: 'bg-purple-500'
  },
  delivered: {
    color: 'bg-green-100 text-green-800',
    icon: FiCheckCircle,
    text: 'تم التوصيل',
    progressWidth: 'w-full',
    progressColor: 'bg-green-500'
  },
  completed: {
    color: 'bg-green-100 text-green-800',
    icon: FiCheckCircle,
    text: 'مكتمل',
    progressWidth: 'w-full',
    progressColor: 'bg-green-500'
  },
  cancelled: {
    color: 'bg-red-100 text-red-800',
    icon: FiXCircle,
    text: 'ملغي',
    progressWidth: 'w-0',
    progressColor: ''
  },
  refunded: {
    color: 'bg-orange-100 text-orange-800',
    icon: FiXCircle,
    text: 'مسترجع',
    progressWidth: 'w-0',
    progressColor: ''
  }
};

/**
 * ترجمة طرق الدفع
 */
const PAYMENT_METHODS = {
  bank_transfer: 'تحويل بنكي',
  cod: 'الدفع عند الاستلام',
  credit_card: 'بطاقة ائتمان',
  paypal: 'باي بال',
  default: 'غير محدد'
};

/**
 * بطاقة عرض الطلب
 * @param {Object} props - خصائص المكون
 * @param {Object} props.order - بيانات الطلب
 */
const OrderCard = ({ order }) => {
  // الحصول على تكوين الحالة الحالية
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  /**
   * تجهيز رابط الصورة
   * @param {string} imagePath - مسار الصورة
   * @returns {string} رابط الصورة الكامل
   */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/40x40?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${imagePath}`;
  };

  /**
   * معالجة خطأ تحميل الصورة
   * @param {React.SyntheticEvent} e - حدث الخطأ
   */
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/40x40?text=Error';
  };

  /**
   * تنسيق التاريخ
   * @param {string} dateString - التاريخ النصي
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
   * ترجمة طريقة الدفع
   * @param {string} method - طريقة الدفع
   * @returns {string} النص المترجم
   */
  const translatePaymentMethod = (method) => {
    return PAYMENT_METHODS[method] || PAYMENT_METHODS.default;
  };

  /**
   * الحصول على عرض شريط التقدم
   * @returns {string} كلاس العرض
   */
  const getProgressWidth = () => {
    return status.progressWidth;
  };

  /**
   * الحصول على لون شريط التقدم
   * @returns {string} كلاس اللون
   */
  const getProgressColor = () => {
    return status.progressColor;
  };

  return (
    <Link
      to={`/order/${order.id}`}
      className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* رأس البطاقة */}
      <div className={`p-4 ${status.color} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <StatusIcon className="w-5 h-5" />
          <span className="font-semibold">{status.text}</span>
        </div>
        <span className="text-sm opacity-75">
          {formatDate(order.created_at)}
        </span>
      </div>

      {/* محتوى البطاقة */}
      <div className="p-4">
        {/* رقم الطلب والسعر */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">رقم الطلب</p>
            <p className="text-lg font-bold text-primary-600">
              #{order.order_number || order.id}
            </p>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-500">الإجمالي</p>
            <p className="text-xl font-bold text-gray-900">
              {order.total_amount?.toLocaleString('ar-SA')} ر.س
            </p>
          </div>
        </div>

        {/* صور مصغرة للمنتجات */}
        {order.items && order.items.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {order.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100"
                >
                  <img
                    src={getImageUrl(item.product?.main_image || item.image)}
                    alt={item.product?.name || item.product_name || 'منتج'}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            
            {/* عرض عدد المنتجات المتبقية */}
            {order.items.length > 3 && (
              <span className="text-sm text-gray-500">
                +{order.items.length - 3}
              </span>
            )}
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          {/* طريقة الدفع */}
          <div>
            <p className="text-gray-500">طريقة الدفع</p>
            <p className="font-medium text-gray-800">
              {translatePaymentMethod(order.payment_method)}
            </p>
          </div>
          
          {/* عدد المنتجات */}
          {order.items && (
            <div>
              <p className="text-gray-500">عدد المنتجات</p>
              <p className="font-medium text-gray-800">
                {order.items.length} {order.items.length === 1 ? 'منتج' : 'منتجات'}
              </p>
            </div>
          )}
        </div>

        {/* رابط عرض التفاصيل */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {order.tracking_number && `رقم التتبع: ${order.tracking_number}`}
          </span>
          <span className="flex items-center gap-1 text-primary-600 group-hover:gap-2 transition-all">
            عرض التفاصيل
            <FiChevronLeft />
          </span>
        </div>

        {/* شريط التقدم للحالة (يظهر فقط للحالات النشطة) */}
        {order.status !== 'cancelled' && order.status !== 'refunded' && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>قيد الانتظار</span>
              <span>قيد المعالجة</span>
              <span>تم الشحن</span>
              <span>تم التوصيل</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getProgressWidth()} ${getProgressColor()}`}
              />
            </div>
          </div>
        )}

        {/* رسالة للطلبات الملغاة */}
        {order.status === 'cancelled' && (
          <div className="mt-4 p-2 bg-red-50 text-red-600 text-sm rounded-lg text-center">
            {order.cancellation_reason || 'تم إلغاء هذا الطلب'}
          </div>
        )}
      </div>
    </Link>
  );
};

export default OrderCard;