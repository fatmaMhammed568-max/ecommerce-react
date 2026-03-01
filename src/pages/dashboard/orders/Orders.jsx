// DashboardOrders.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEye, 
  FaSearch, 
  FaFilter, 
  FaSyncAlt,
  FaDownload,
  FaChevronRight,
  FaChevronLeft,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaBox,
  FaMoneyBillWave,
  FaChartBar,
  FaHourglassHalf,
  FaBoxOpen,
  FaCheckDouble,
  FaBan
} from 'react-icons/fa';
import { MdRefresh, MdOutlineFilterList } from 'react-icons/md';
import { BiExport } from 'react-icons/bi';
import orderService from '../../../services/orderService';
import toast from 'react-hot-toast';

/**
 * حالات الطلب مع ألوانها وأيقوناتها الحقيقية
 */
const ORDER_STATUS = {
  pending: { 
    label: 'قيد الانتظار', 
    color: 'bg-yellow-100 text-yellow-800',
    icon: FaHourglassHalf,
    bg: 'bg-yellow-50',
    border: 'border-yellow-500'
  },
  processing: { 
    label: 'قيد المعالجة', 
    color: 'bg-blue-100 text-blue-800',
    icon: FaBoxOpen,
    bg: 'bg-blue-50',
    border: 'border-blue-500'
  },
  shipped: { 
    label: 'تم الشحن', 
    color: 'bg-purple-100 text-purple-800',
    icon: FaTruck,
    bg: 'bg-purple-50',
    border: 'border-purple-500'
  },
  delivered: { 
    label: 'تم التوصيل', 
    color: 'bg-green-100 text-green-800',
    icon: FaCheckDouble,
    bg: 'bg-green-50',
    border: 'border-green-500'
  },
  completed: { 
    label: 'مكتمل', 
    color: 'bg-green-100 text-green-800',
    icon: FaCheckCircle,
    bg: 'bg-green-50',
    border: 'border-green-500'
  },
  cancelled: { 
    label: 'ملغي', 
    color: 'bg-red-100 text-red-800',
    icon: FaBan,
    bg: 'bg-red-50',
    border: 'border-red-500'
  },
  refunded: { 
    label: 'مسترجع', 
    color: 'bg-gray-100 text-gray-800',
    icon: FaMoneyBillWave,
    bg: 'bg-gray-50',
    border: 'border-gray-500'
  }
};

/**
 * طرق الدفع مع ترجمتها وأيقوناتها
 */
const PAYMENT_METHODS = {
  bank_transfer: { label: 'تحويل بنكي', icon: '🏦', color: 'bg-purple-100 text-purple-800' },
  cod: { label: 'الدفع عند الاستلام', icon: '💵', color: 'bg-green-100 text-green-800' },
  credit_card: { label: 'بطاقة ائتمان', icon: '💳', color: 'bg-blue-100 text-blue-800' },
  paypal: { label: 'باي بال', icon: '🌐', color: 'bg-indigo-100 text-indigo-800' },
  wallet: { label: 'محفظة إلكترونية', icon: '📱', color: 'bg-teal-100 text-teal-800' }
};

/**
 * خيارات حالة الطلب للفلتر
 */
const STATUS_OPTIONS = [
  { value: 'all', label: 'جميع الحالات', icon: FaChartBar },
  { value: 'pending', label: 'قيد الانتظار', icon: FaHourglassHalf },
  { value: 'processing', label: 'قيد المعالجة', icon: FaBoxOpen },
  { value: 'shipped', label: 'تم الشحن', icon: FaTruck },
  { value: 'delivered', label: 'تم التوصيل', icon: FaCheckDouble },
  { value: 'completed', label: 'مكتمل', icon: FaCheckCircle },
  { value: 'cancelled', label: 'ملغي', icon: FaBan }
];

/**
 * ترجمة طريقة الدفع
 */
const translatePaymentMethod = (method) => {
  return PAYMENT_METHODS[method]?.label || method || 'غير محدد';
};

/**
 * الحصول على رابط الصورة (بدون process.env)
 */
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/50x50/0284c7/ffffff?text=No+Image';
  if (imagePath.startsWith('http')) return imagePath;
  
  // ✅ استخدام import.meta.env بدل process.env
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${API_URL}/${imagePath}`.replace(/([^:]\/)\/+/g, '$1');
};

/**
 * صفحة إدارة الطلبات في لوحة التحكم
 */
const DashboardOrders = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [showLocalOnly, setShowLocalOnly] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10
  });

  // إحصائيات سريعة
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
    local: 0
  });

  /**
   * جلب الطلبات المحلية من localStorage
   */
  const fetchLocalOrders = () => {
    try {
      const localOrdersData = JSON.parse(localStorage.getItem('local_orders') || '[]');
      console.log('الطلبات المحلية:', localOrdersData);
      return localOrdersData;
    } catch (error) {
      console.error('خطأ في جلب الطلبات المحلية:', error);
      return [];
    }
  };

  /**
   * جلب الطلبات من API
   */
  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    
    try {
      // 1️⃣ جلب الطلبات المحلية أولاً
      const localData = fetchLocalOrders();
      
      // 2️⃣ محاولة جلب الطلبات من API
      const params = {
        search: search?.trim() || undefined,
        per_page: pagination.perPage,
        page
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (dateFilter !== 'all') {
        params.date_range = dateFilter;
      }

      if (paymentFilter !== 'all') {
        params.payment_method = paymentFilter;
      }

      try {
        // ✅ استخدام getOrders من orderService
        const response = await orderService.getOrders(params);
        console.log('Orders response:', response);
        
        if (response?.status) {
          const apiOrders = response.data?.data || [];
          
          // 3️⃣ دمج الطلبات المحلية مع طلبات API
          let allOrders = [...localData, ...apiOrders];
          
          // إزالة التكرار بناءً على ID
          allOrders = allOrders.filter((order, index, self) => 
            index === self.findIndex(o => o.id === order.id)
          );
          
          // تطبيق الفلاتر يدوياً على الطلبات المحلية
          if (statusFilter !== 'all') {
            allOrders = allOrders.filter(order => order.status === statusFilter);
          }
          
          if (search.trim()) {
            allOrders = allOrders.filter(order => 
              order.order_number?.includes(search) ||
              order.customer?.name?.includes(search) ||
              order.customer?.email?.includes(search) ||
              order.customer?.phone?.includes(search)
            );
          }

          if (showLocalOnly) {
            allOrders = allOrders.filter(order => !order.id?.toString().includes('-'));
          }
          
          setOrders(allOrders);
          
          setPagination({
            currentPage: response.data?.current_page || 1,
            lastPage: response.data?.last_page || 1,
            total: response.data?.total || allOrders.length,
            perPage: response.data?.per_page || 10
          });
        }
      } catch (apiError) {
        console.log('API غير متاح، عرض الطلبات المحلية فقط');
        
        // تطبيق الفلاتر على الطلبات المحلية
        let filteredOrders = localData;
        
        if (statusFilter !== 'all') {
          filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
        }
        
        if (search.trim()) {
          filteredOrders = filteredOrders.filter(order => 
            order.order_number?.includes(search) ||
            order.customer?.name?.includes(search) ||
            order.customer?.email?.includes(search) ||
            order.customer?.phone?.includes(search)
          );
        }

        if (showLocalOnly) {
          filteredOrders = filteredOrders.filter(order => !order.id?.toString().includes('-'));
        }
        
        setOrders(filteredOrders);
        setPagination({
          currentPage: 1,
          lastPage: 1,
          total: filteredOrders.length,
          perPage: 10
        });
      }
      
    } catch (error) {
      console.error('خطأ في جلب الطلبات:', error);
      toast.error('حدث خطأ أثناء تحميل الطلبات');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * حساب الإحصائيات
   */
  useEffect(() => {
    if (orders.length > 0) {
      const localOrders = fetchLocalOrders();
      const newStats = {
        total: pagination.total,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        delivered: orders.filter(o => ['delivered', 'completed'].includes(o.status)).length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        revenue: orders.reduce((sum, o) => sum + (o.total || o.total_amount || 0), 0),
        local: localOrders.length
      };
      setStats(newStats);
    }
  }, [orders, pagination.total]);

  /**
   * جلب الطلبات عند تغيير البحث أو الفلتر
   */
  useEffect(() => {
    fetchOrders(1);
  }, [search, statusFilter, dateFilter, paymentFilter, showLocalOnly]);

  /**
   * إعادة تحميل الطلبات
   */
  const refreshOrders = () => {
    fetchOrders(currentPage);
    toast.success('تم تحديث الطلبات');
  };

  /**
   * مزامنة الطلبات المحلية مع API
   */
  const syncLocalOrders = async () => {
    setSyncing(true);
    try {
      const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      
      if (localOrders.length === 0) {
        toast.info('لا توجد طلبات محلية للمزامنة');
        return;
      }

      const toastId = toast.loading(`جاري مزامنة ${localOrders.length} طلب...`);
      
      let synced = 0;
      let failed = 0;
      
      for (const order of localOrders) {
        try {
          // إنشاء FormData لإرسال الطلب
          const formData = new FormData();
          
          // إضافة بيانات الطلب
          formData.append('customer_name', order.customer?.name || '');
          formData.append('customer_email', order.customer?.email || '');
          formData.append('customer_phone', order.customer?.phone || '');
          formData.append('shipping_address', order.shipping?.address || '');
          formData.append('shipping_city', order.shipping?.city || '');
          formData.append('payment_method', order.payment_method || 'bank_transfer');
          formData.append('total_amount', order.totals?.total || 0);
          
          // إضافة المنتجات
          order.items?.forEach((item, index) => {
            formData.append(`items[${index}][product_id]`, item.id);
            formData.append(`items[${index}][quantity]`, item.quantity);
            formData.append(`items[${index}][price]`, item.price);
          });

          // إضافة صورة التحويل إذا وجدت
          if (order.receipt) {
            // تحويل base64 إلى blob
            const response = await fetch(order.receipt);
            const blob = await response.blob();
            formData.append('transfer_receipt', blob, 'receipt.jpg');
          }

          // محاولة إرسال الطلب إلى API
          const response = await axios.post('/api/v1/orders', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          if (response.status === 200 || response.status === 201) {
            synced++;
          } else {
            failed++;
          }
        } catch (error) {
          console.error('فشل مزامنة الطلب:', order.id, error);
          failed++;
        }
      }
      
      // بعد المزامجة، امسح الطلبات المحلية
      if (synced > 0) {
        localStorage.removeItem('local_orders');
        localStorage.removeItem('last_order');
        toast.success(`تمت مزامنة ${synced} طلب بنجاح${failed > 0 ? `، فشل ${failed} طلب` : ''}`, {
          id: toastId
        });
        fetchOrders(); // إعادة تحميل الطلبات
      } else {
        toast.error('فشلت مزامنة جميع الطلبات', { id: toastId });
      }
      
    } catch (error) {
      console.error('خطأ في المزامنة:', error);
      toast.error('حدث خطأ أثناء المزامنة');
    } finally {
      setSyncing(false);
    }
  };

  /**
   * تصدير الطلبات
   */
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(orders, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `orders_${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('تم تصدير الطلبات بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في تصدير الطلبات');
    }
  };

  /**
   * تنسيق التاريخ
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'اليوم';
      } else if (diffDays === 1) {
        return 'أمس';
      } else if (diffDays < 7) {
        return `منذ ${diffDays} أيام`;
      }
      
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  /**
   * تنسيق الوقت
   */
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* رأس الصفحة */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaBox className="text-primary-600" />
          الطلبات
        </h1>
        <p className="text-gray-600">إدارة ومتابعة جميع طلبات المتجر</p>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 border-r-4 border-primary-500">
          <div className="flex items-center gap-3">
            <FaChartBar className="text-primary-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-4 border-r-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <FaHourglassHalf className="text-yellow-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600 mb-1">قيد الانتظار</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-4 border-r-4 border-blue-500">
          <div className="flex items-center gap-3">
            <FaBoxOpen className="text-blue-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600 mb-1">قيد المعالجة</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-4 border-r-4 border-green-500">
          <div className="flex items-center gap-3">
            <FaCheckDouble className="text-green-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600 mb-1">مكتملة</p>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-4 border-r-4 border-red-500">
          <div className="flex items-center gap-3">
            <FaBan className="text-red-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600 mb-1">ملغية</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-4 border-r-4 border-purple-500">
          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-purple-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600 mb-1">الإيرادات</p>
              <p className="text-2xl font-bold text-purple-600">{stats.revenue.toLocaleString('ar-EG')} ج.م</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border-r-4 border-orange-500">
          <div className="flex items-center gap-3">
            <FaBox className="text-orange-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600 mb-1">طلبات محلية</p>
              <p className="text-2xl font-bold text-orange-600">{stats.local}</p>
            </div>
          </div>
        </div>
      </div>

      {/* شريط الأدوات */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* بحث متقدم */}
          <div className="flex-1 w-full">
            <div className="relative">
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder=" بحث برقم الطلب أو اسم العميل..."
                className="w-full pr-10 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-3 w-full md:w-auto flex-wrap">
            <button
              onClick={() => setShowLocalOnly(!showLocalOnly)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-all ${
                showLocalOnly 
                  ? 'bg-orange-600 text-white border-orange-600' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-500'
              }`}
            >
              <FaBox className="text-lg" />
              <span className="hidden sm:inline">محلي فقط</span>
            </button>

            <button
              onClick={syncLocalOrders}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
            >
              <FaSyncAlt className={`text-lg ${syncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">مزامنة</span>
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-all ${
                showFilters 
                  ? 'bg-primary-600 text-white border-primary-600' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary-500'
              }`}
            >
              <MdOutlineFilterList className="text-lg" />
              <span className="hidden sm:inline">فلتر</span>
            </button>
            
            <button
              onClick={refreshOrders}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-primary-500 transition-all"
            >
              <MdRefresh className={`text-lg ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">تحديث</span>
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-l from-primary-600 to-skin-600 text-white rounded-xl hover:from-primary-700 hover:to-skin-700 transition-all"
            >
              <BiExport className="text-lg" />
              <span className="hidden sm:inline">تصدير</span>
            </button>
          </div>
        </div>

        {/* فلاتر إضافية */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            {/* فلتر الحالة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* فلتر التاريخ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الفترة</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">كل الفترات</option>
                <option value="today">اليوم</option>
                <option value="yesterday">أمس</option>
                <option value="week">آخر 7 أيام</option>
                <option value="month">آخر 30 يوم</option>
                <option value="month3">آخر 3 شهور</option>
              </select>
            </div>

            {/* فلتر طريقة الدفع */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">جميع الطرق</option>
                <option value="bank_transfer">تحويل بنكي</option>
                <option value="cod">الدفع عند الاستلام</option>
                <option value="credit_card">بطاقة ائتمان</option>
              </select>
            </div>

            {/* إحصائيات سريعة */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">معلومات</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">معروض:</span>
                <span className="font-semibold">{orders.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">محلي:</span>
                <span className="font-semibold text-orange-600">{stats.local}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* جدول الطلبات */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-l from-gray-50 to-gray-100">
              <tr>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">رقم الطلب</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">العميل</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">التاريخ</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">الإجمالي</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">الحالة</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">طريقة الدفع</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                      <span className="text-gray-500">جاري تحميل الطلبات...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="text-gray-500">
                      <FaBox className="text-5xl mx-auto mb-4 text-gray-300" />
                      <p className="text-lg mb-2">لا توجد طلبات</p>
                      <p className="text-sm">سيظهر هنا الطلبات الجديدة عند إنشائها</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
                  const StatusIcon = status.icon;
                  const paymentMethod = PAYMENT_METHODS[order.payment_method] || { 
                    label: order.payment_method || 'غير محدد', 
                    color: 'bg-gray-100 text-gray-800' 
                  };
                  
                  // التحقق إذا كان الطلب محلي
                  const isLocalOrder = !order.id?.toString().includes('-') && 
                                      (order.id?.toString().length < 13 || 
                                       typeof order.id === 'number');
                  
                  return (
                    <tr key={order.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isLocalOrder ? 'bg-orange-50/30' : ''}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/dashboard/orders/${order.id}`} 
                            className="font-bold text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                          >
                            #{order.order_number || order.id}
                          </Link>
                          {isLocalOrder && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full whitespace-nowrap">
                              محلي
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer?.name || order.user?.name || 'غير معروف'}</p>
                          {(order.customer?.email || order.user?.email) && (
                            <p className="text-xs text-gray-500">{order.customer?.email || order.user?.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <p className="text-gray-900">{formatDate(order.created_at || order.date)}</p>
                          <p className="text-gray-500 text-xs">{formatTime(order.created_at || order.date)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-primary-600">
                          {(order.total_amount || order.totals?.total || 0).toLocaleString('ar-EG')} ج.م
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-sm px-3 py-1 rounded-full ${paymentMethod.color}`}>
                          {paymentMethod.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          to={`/dashboard/orders/${order.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <FaEye className="w-4 h-4" />
                          <span>عرض</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.lastPage > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-2" aria-label="التنقل بين صفحات الطلبات">
          <button
            onClick={() => fetchOrders(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="الصفحة السابقة"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
          
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
                onClick={() => fetchOrders(pageNumber)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  pagination.currentPage === pageNumber
                    ? 'bg-gradient-to-l from-primary-600 to-skin-600 text-white'
                    : 'bg-white hover:bg-gray-100 border border-gray-200 text-gray-700'
                }`}
                aria-label={`الصفحة ${pageNumber}`}
                aria-current={pagination.currentPage === pageNumber ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
          
          <button
            onClick={() => fetchOrders(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.lastPage}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="الصفحة التالية"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
        </nav>
      )}

      {/* إحصائيات إضافية */}
      {!loading && orders.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          عرض {orders.length} من إجمالي {pagination.total} طلب
          {stats.local > 0 && ` (${stats.local} طلب محلي)`}
        </div>
      )}
    </div>
  );
};

export default DashboardOrders;