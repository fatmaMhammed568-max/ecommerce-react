import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';  // ✅ تم التصحيح
import Loader from '../../components/common/Loader';
import { 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiTruck,
  FiArrowLeft,
  FiDownload,
  FiPrinter
} from 'react-icons/fi';
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
 * ترجمة طريقة الدفع
 * @param {string} method - طريقة الدفع
 * @returns {string} النص المترجم
 */
const translatePaymentMethod = (method) => {
  const methods = {
    bank_transfer: 'تحويل بنكي',
    cod: 'الدفع عند الاستلام',
    credit_card: 'بطاقة ائتمان',
    paypal: 'باي بال'
  };
  return methods[method] || method || 'غير محدد';
};

/**
 * صفحة تفاصيل الطلب
 */
const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * جلب تفاصيل الطلب عند تحميل الصفحة
   */
  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  /**
   * جلب تفاصيل الطلب من API
   */
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrder(id);
      if (response?.status) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error('خطأ في جلب الطلب:', error);
      toast.error('حدث خطأ أثناء تحميل الطلب');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  /**
   * معالجة الطباعة
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * معالجة تحميل PDF
   */
  const handleDownloadPDF = () => {
    toast.success('جاري تجهيز ملف PDF...');
    // يمكن إضافة وظيفة التحميل الفعلية هنا
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
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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
    if (!imagePath) return 'https://via.placeholder.com/80x80?text=Product';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${imagePath}`;
  };

  if (loading) {
    return <Loader text="جاري تحميل تفاصيل الطلب..." />;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">الطلب غير موجود</p>
          <Link 
            to="/orders" 
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            العودة إلى الطلبات
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = STATUS_ICON[order.status] || FiPackage;

  return (
    <div className="min-h-screen py-12 bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* رأس الصفحة */}
        <div className="mb-6">
          <Link
            to="/orders"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-3 py-2"
            aria-label="العودة إلى الطلبات"
          >
            <FiArrowLeft className="ml-2" aria-hidden="true" />
            العودة إلى الطلبات
          </Link>
        </div>

        {/* بطاقة الطلب */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* حالة الطلب */}
          <div className={`p-6 ${STATUS_COLORS[order.status] || 'bg-gray-100'} flex flex-wrap items-center justify-between gap-4`}>
            <div className="flex items-center gap-3">
              <StatusIcon className="w-8 h-8" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold">{STATUS_TEXT[order.status] || order.status}</h2>
                <p className="text-sm opacity-90">
                  آخر تحديث: {formatDate(order.updated_at)}
                </p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-3xl font-bold">{order.total_amount?.toLocaleString('ar-SA')} ر.س</p>
            </div>
          </div>

          {/* معلومات الطلب */}
          <div className="p-6 space-y-6">
            {/* رقم الطلب والتاريخ */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">رقم الطلب</p>
                <p className="text-lg font-bold text-primary-600">
                  #{order.order_number || order.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاريخ الطلب</p>
                <p className="text-lg font-semibold">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>

            {/* معلومات التتبع */}
            {order.tracking_number && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 mb-2">رقم التتبع</p>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-lg font-semibold" dir="ltr">{order.tracking_number}</p>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                      aria-label="تتبع الشحنة"
                    >
                      تتبع الشحنة
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* المنتجات */}
            <div>
              <h3 className="text-lg font-bold mb-4">المنتجات</h3>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center gap-4 border-b pb-4 last:border-0">
                    <img
                      src={getImageUrl(item.product?.main_image)}
                      alt={item.product?.name || item.product_name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=Product';
                      }}
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-[200px]">
                      <Link 
                        to={`/product/${item.product_id}`}
                        className="font-semibold hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                        aria-label={`عرض تفاصيل ${item.product?.name || item.product_name}`}
                      >
                        {item.product?.name || item.product_name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        الكمية: {item.quantity} × {item.unit_price?.toLocaleString('ar-SA')} ر.س
                      </p>
                    </div>
                    <p className="text-lg font-bold text-primary-600">
                      {item.subtotal?.toLocaleString('ar-SA')} ر.س
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ملخص المبالغ */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-semibold">{order.total_amount?.toLocaleString('ar-SA')} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الشحن</span>
                  <span className="font-semibold text-green-600">مجاني</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>الإجمالي</span>
                  <span className="text-primary-600">{order.total_amount?.toLocaleString('ar-SA')} ر.س</span>
                </div>
              </div>
            </div>

            {/* معلومات الشحن */}
            {order.shipping_address && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-bold mb-4">عنوان الشحن</h3>
                <div className="bg-gray-50 p-4 rounded-xl">
                  {typeof order.shipping_address === 'object' ? (
                    <>
                      <p className="font-semibold">{order.shipping_address.name}</p>
                      <p className="text-gray-600" dir="ltr">{order.shipping_address.phone}</p>
                      <p className="text-gray-600">{order.shipping_address.address_line1}</p>
                      {order.shipping_address.address_line2 && (
                        <p className="text-gray-600">{order.shipping_address.address_line2}</p>
                      )}
                      <p className="text-gray-600">
                        {order.shipping_address.city} {order.shipping_address.postal_code}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-600">{order.shipping_address}</p>
                  )}
                </div>
              </div>
            )}

            {/* طريقة الدفع */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-bold mb-2">طريقة الدفع</h3>
              <p className="text-gray-600">
                {translatePaymentMethod(order.payment_method)}
              </p>
            </div>

            {/* ملاحظات */}
            {order.notes && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-bold mb-2">ملاحظات</h3>
                <p className="text-gray-600">{order.notes}</p>
              </div>
            )}

            {/* أزرار الإجراءات */}
            <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-4">
              <button
                onClick={handlePrint}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-primary-600 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="طباعة الطلب"
              >
                <FiPrinter className="w-5 h-5" aria-hidden="true" />
                طباعة
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-primary-600 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="تحميل كملف PDF"
              >
                <FiDownload className="w-5 h-5" aria-hidden="true" />
                تحميل PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;