// DashboardOrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiPrinter, 
  FiDownload, 
  FiCheckCircle, 
  FiXCircle,
  FiTruck,
  FiPackage,
  FiInfo,
  FiUser,
  FiMapPin,
  FiBox,
  FiDollarSign,
  FiClock,
  FiCreditCard,
  FiPhone,
  FiMail,
  FiEdit2,
  FiSave
} from 'react-icons/fi';
import orderService from '../../../services/orderService';
import toast from 'react-hot-toast';

/**
 * ألوان وأيقونات حالات الطلب
 */
const ORDER_STATUS = {
  pending: { 
    label: 'قيد الانتظار', 
    color: 'bg-yellow-100 text-yellow-800',
    icon: FiClock,
    bg: 'bg-yellow-50',
    border: 'border-yellow-500'
  },
  processing: { 
    label: 'قيد المعالجة', 
    color: 'bg-blue-100 text-blue-800',
    icon: FiPackage,
    bg: 'bg-blue-50',
    border: 'border-blue-500'
  },
  shipped: { 
    label: 'تم الشحن', 
    color: 'bg-purple-100 text-purple-800',
    icon: FiTruck,
    bg: 'bg-purple-50',
    border: 'border-purple-500'
  },
  delivered: { 
    label: 'تم التوصيل', 
    color: 'bg-green-100 text-green-800',
    icon: FiCheckCircle,
    bg: 'bg-green-50',
    border: 'border-green-500'
  },
  completed: { 
    label: 'مكتمل', 
    color: 'bg-green-100 text-green-800',
    icon: FiCheckCircle,
    bg: 'bg-green-50',
    border: 'border-green-500'
  },
  cancelled: { 
    label: 'ملغي', 
    color: 'bg-red-100 text-red-800',
    icon: FiXCircle,
    bg: 'bg-red-50',
    border: 'border-red-500'
  },
  refunded: { 
    label: 'مسترجع', 
    color: 'bg-gray-100 text-gray-800',
    icon: FiDollarSign,
    bg: 'bg-gray-50',
    border: 'border-gray-500'
  }
};

/**
 * خيارات تغيير الحالة
 */
const STATUS_OPTIONS = [
  { value: 'pending', label: 'قيد الانتظار', icon: FiClock, color: 'yellow' },
  { value: 'processing', label: 'قيد المعالجة', icon: FiPackage, color: 'blue' },
  { value: 'shipped', label: 'تم الشحن', icon: FiTruck, color: 'purple' },
  { value: 'delivered', label: 'تم التوصيل', icon: FiCheckCircle, color: 'green' },
  { value: 'cancelled', label: 'ملغي', icon: FiXCircle, color: 'red' }
];

/**
 * صفحة تفاصيل الطلب في لوحة التحكم
 */
const DashboardOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [notes, setNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isEditingTracking, setIsEditingTracking] = useState(false);

  /**
   * التحقق إذا كان الطلب محلي
   */
  const isLocalOrder = () => {
    if (!order) return false;
    return !order.id?.toString().includes('-') && 
           (order.id?.toString().length < 13 || 
            typeof order.id === 'number');
  };

  /**
   * جلب بيانات الطلب عند تحميل الصفحة
   */
  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  /**
   * جلب بيانات الطلب من API أو localStorage
   */
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrder(id);
      if (response?.status) {
        const orderData = response.data;
        setOrder(orderData);
        setNotes(orderData.admin_notes || orderData.notes || '');
        setTrackingNumber(orderData.tracking_number || '');
      }
    } catch (error) {
      console.error('خطأ في جلب الطلب:', error);
      toast.error('حدث خطأ أثناء تحميل الطلب');
      navigate('/dashboard/orders');
    } finally {
      setLoading(false);
    }
  };

  /**
   * تحديث حالة الطلب
   */
  const handleStatusChange = async (status) => {
    if (!order) return;
    
    setUpdating(true);
    try {
      const response = await orderService.updateOrderStatus(order.id, status, notes);
      if (response?.status) {
        toast.success(`تم تحديث حالة الطلب إلى ${ORDER_STATUS[status]?.label}`);
        fetchOrder();
      }
    } catch (error) {
      console.error('خطأ في تحديث الحالة:', error);
      toast.error('حدث خطأ أثناء تحديث الحالة');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * تحديث معلومات التتبع
   */
  const handleUpdateTracking = async () => {
    if (!trackingNumber.trim()) {
      toast.error('الرجاء إدخال رقم التتبع');
      return;
    }

    setUpdating(true);
    try {
      const response = await orderService.updateShippingInfo(order.id, {
        tracking_number: trackingNumber,
        carrier: 'شركة الشحن'
      });
      if (response?.status) {
        toast.success('تم تحديث معلومات التتبع');
        setIsEditingTracking(false);
        fetchOrder();
      }
    } catch (error) {
      toast.error('حدث خطأ في تحديث معلومات التتبع');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * حفظ الملاحظات
   */
  const handleSaveNotes = async () => {
    setUpdating(true);
    try {
      const response = await orderService.addOrderNote(order.id, notes);
      if (response?.status) {
        toast.success('تم حفظ الملاحظات');
        fetchOrder();
      }
    } catch (error) {
      toast.error('حدث خطأ في حفظ الملاحظات');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * طباعة الطلب
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * تحميل الطلب كملف
   */
  const handleDownload = () => {
    try {
      const dataStr = JSON.stringify(order, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `order_${order.order_number || order.id}_${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('تم تحميل الطلب بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في تحميل الطلب');
    }
  };

  /**
   * تنسيق التاريخ
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('ar-EG', {
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
   */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/80x80/0284c7/ffffff?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('data:')) return imagePath; // للصور base64
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${API_URL}/${imagePath}`.replace(/([^:]\/)\/+/g, '$1');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="جاري التحميل">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <span className="sr-only">جاري تحميل بيانات الطلب...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <FiBox className="w-20 h-20 mx-auto text-gray-400 mb-4" />
        <p className="text-2xl text-gray-600 mb-4">الطلب غير موجود</p>
        <button
          onClick={() => navigate('/dashboard/orders')}
          className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          العودة للطلبات
        </button>
      </div>
    );
  }

  const currentStatus = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
  const StatusIcon = currentStatus.icon;
  const localOrder = isLocalOrder();

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="p-2 hover:bg-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="العودة للطلبات"
          >
            <FiArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                تفاصيل الطلب #{order.order_number || order.id}
              </h1>
              {localOrder && (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                  طلب محلي
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              تم الطلب في {formatDate(order.created_at || order.date)}
            </p>
          </div>
        </div>
        
        <div className={`px-6 py-3 rounded-xl flex items-center gap-2 ${currentStatus.bg} ${currentStatus.color} border-r-4 ${currentStatus.border}`}>
          <StatusIcon className="w-5 h-5" />
          <span className="font-semibold">{currentStatus.label}</span>
        </div>
      </div>

      {/* باقي الكود كما هو ... */}
      
      {/* ملخص المبالغ */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">ملخص المبالغ</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>المجموع الفرعي</span>
            <span className="font-semibold text-gray-900">
              {(order.subtotal || order.totals?.subtotal || 0).toLocaleString('ar-EG')} ج.م
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>الشحن</span>
            <span className="font-semibold text-green-600">
              {(order.shipping_cost || 0).toLocaleString('ar-EG')} ج.م
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>الضريبة</span>
            <span className="font-semibold text-gray-900">
              {(order.tax || order.totals?.tax || 0).toLocaleString('ar-EG')} ج.م
            </span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">الإجمالي</span>
              <span className="text-2xl font-bold text-primary-600">
                {(order.total_amount || order.totals?.total || 0).toLocaleString('ar-EG')} ج.م
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات العميل */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FiUser className="text-primary-600" />
          معلومات العميل
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-600">
            <FiUser className="text-gray-400" />
            <span className="font-medium text-gray-900">
              {order.customer?.name || order.user?.name || 'غير متوفر'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <FiMail className="text-gray-400" />
            <a href={`mailto:${order.customer?.email || order.user?.email}`} className="hover:text-primary-600">
              {order.customer?.email || order.user?.email || 'غير متوفر'}
            </a>
          </div>
          {(order.customer?.phone || order.user?.phone) && (
            <div className="flex items-center gap-3 text-gray-600">
              <FiPhone className="text-gray-400" />
              <a href={`tel:${order.customer?.phone || order.user?.phone}`} dir="ltr" className="hover:text-primary-600">
                {order.customer?.phone || order.user?.phone}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* عنوان الشحن */}
      {(order.shipping_address || order.shipping) && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FiMapPin className="text-primary-600" />
            عنوان الشحن
          </h2>
          {order.shipping_address ? (
            typeof order.shipping_address === 'object' ? (
              <div className="text-gray-600 space-y-2">
                <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
                <p className="flex items-center gap-2">
                  <FiPhone className="text-gray-400" />
                  {order.shipping_address.phone}
                </p>
                <p>{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                <p>{order.shipping_address.city} {order.shipping_address.postal_code}</p>
              </div>
            ) : (
              <p className="text-gray-600">{order.shipping_address}</p>
            )
          ) : order.shipping && (
            <div className="text-gray-600 space-y-2">
              <p>{order.shipping.address}</p>
              <p>{order.shipping.city}</p>
              {order.shipping.district && <p>{order.shipping.district}</p>}
              {order.shipping.landmark && <p>{order.shipping.landmark}</p>}
            </div>
          )}
        </div>
      )}

      {/* معلومات الدفع */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FiCreditCard className="text-primary-600" />
          معلومات الدفع
        </h2>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium text-gray-900">طريقة الدفع:</span>{' '}
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {order.payment_method === 'bank_transfer' ? 'تحويل بنكي' :
               order.payment_method === 'cod' ? 'الدفع عند الاستلام' :
               order.payment_method === 'credit_card' ? 'بطاقة ائتمان' :
               order.payment_method || 'غير محدد'}
            </span>
          </p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-900">حالة الدفع:</span>{' '}
            <span className={`px-3 py-1 rounded-full text-sm ${
              order.payment_status === 'paid' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {order.payment_status === 'paid' ? 'مدفوع' : 'في انتظار الدفع'}
            </span>
          </p>
        </div>
      </div>

      {/* صورة إيصال التحويل */}
      {order.receipt && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4">صورة إيصال التحويل</h2>
          <img 
            src={order.receipt} 
            alt="إيصال التحويل" 
            className="max-w-full h-auto rounded-lg border border-gray-200"
          />
        </div>
      )}

      {/* أزرار إضافية */}
      <div className="flex gap-3 print:hidden mt-6">
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:border-primary-600 hover:text-primary-600 transition-colors"
        >
          <FiPrinter />
          طباعة
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-l from-primary-600 to-skin-600 text-white px-4 py-3 rounded-xl hover:from-primary-700 hover:to-skin-700 transition-colors"
        >
          <FiDownload />
          تحميل
        </button>
      </div>
    </div>
  );
};

export default DashboardOrderDetails;