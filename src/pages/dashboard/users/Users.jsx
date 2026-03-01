import React, { useState } from 'react';
import { 
  FaSearch, 
  FaEdit, 
  FaTrashAlt, 
  FaUserPlus, 
  FaEnvelope, 
  FaPhone,
  FaTimes,
  FaEye,
  FaUserTie,
  FaUser,
  FaShoppingBag,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCheckCircle,
  FaBan,
  FaMapMarkerAlt,
  FaStickyNote
} from 'react-icons/fa';
import { MdEmail, MdPhone, MdPerson, MdAdminPanelSettings } from 'react-icons/md';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import toast from 'react-hot-toast';

/**
 * ألوان أنواع الحسابات
 */
const ROLE_COLORS = {
  1: 'bg-purple-100 text-purple-800 border-purple-200',
  0: 'bg-blue-100 text-blue-800 border-blue-200'
};

/**
 * نصوص أنواع الحسابات مع أيقونات
 */
const ROLE_LABELS = {
  1: { text: 'مدير', icon: FaUserTie },
  0: { text: 'عميل', icon: FaUser }
};

/**
 * ألوان حالة المستخدم
 */
const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  banned: 'bg-red-100 text-red-800 border-red-200'
};

/**
 * نصوص حالة المستخدم
 */
const STATUS_LABELS = {
  active: { text: 'نشط', icon: FaCheckCircle },
  inactive: { text: 'غير نشط', icon: FaBan },
  banned: { text: 'محظور', icon: FaBan }
};

/**
 * تنسيق رقم الهاتف المصري
 * @param {string} phone - رقم الهاتف
 * @returns {string} الرقم المنسق
 */
const formatEgyptPhone = (phone) => {
  if (!phone) return 'غير متوفر';
  
  // إزالة أي أحرف غير رقمية
  const cleaned = phone.replace(/\D/g, '');
  
  // تنسيق الأرقام المصرية
  if (cleaned.length === 11) {
    return `+2${cleaned}`;
  } else if (cleaned.length === 10) {
    return `+20${cleaned}`;
  } else if (cleaned.startsWith('20') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  return phone;
};

/**
 * صفحة إدارة المستخدمين في لوحة التحكم
 */
const DashboardUsers = () => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  
  // ✅ هتجيبي البيانات من API هنا
  const [users, setUsers] = useState([]);

  // بيانات النموذج للإضافة
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '0',
    status: 'active',
    address: '',
    notes: ''
  });

  // بيانات النموذج للتعديل
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '0',
    status: 'active',
    address: '',
    notes: ''
  });

  /**
   * الحصول على الحرف الأول من الاسم
   * @param {string} name - الاسم الكامل
   * @returns {string} الحرف الأول
   */
  const getInitial = (name) => {
    return name?.charAt(0) || '?';
  };

  /**
   * تنسيق التاريخ
   * @param {string} dateString - نص التاريخ
   * @returns {string} التاريخ المنسق
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  /**
   * تنسيق التاريخ والوقت
   * @param {string} dateString - نص التاريخ
   * @returns {string} التاريخ والوقت المنسق
   */
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  /**
   * تنسيق السعر
   * @param {number} price - السعر
   * @returns {string} السعر المنسق
   */
  const formatPrice = (price) => {
    return price?.toLocaleString('ar-EG') || '0';
  };

  /**
   * معالجة عرض تفاصيل المستخدم
   * @param {Object} user - المستخدم المراد عرضه
   */
  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  /**
   * معالجة تعديل مستخدم
   * @param {Object} user - المستخدم المراد تعديله
   */
  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role?.toString() || '0',
      status: user.status || 'active',
      address: user.address || '',
      notes: user.notes || ''
    });
    setShowEditModal(true);
  };

  /**
   * معالجة حذف مستخدم
   * @param {number} id - معرف المستخدم
   * @param {string} name - اسم المستخدم
   */
  const handleDelete = (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف المستخدم "${name}"؟`)) {
      console.log('حذف مستخدم:', id);
      // ✅ هنا هتستدعي API الحذف
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success(`تم حذف المستخدم ${name} بنجاح`);
    }
  };

  /**
   * معالجة تغيير حقول النموذج (إضافة)
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * معالجة تغيير حقول النموذج (تعديل)
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * معالجة تقديم نموذج إضافة مستخدم
   * @param {React.FormEvent} e - حدث التقديم
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من البيانات
    if (!formData.name?.trim()) {
      toast.error('الاسم مطلوب');
      return;
    }

    if (!formData.email?.trim()) {
      toast.error('البريد الإلكتروني مطلوب');
      return;
    }

    if (!formData.password) {
      toast.error('كلمة المرور مطلوبة');
      return;
    }

    setLoading(true);
    
    try {
      // ✅ هنا هتستدعي API الإضافة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now(), // مؤقت
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim() || '',
        role: parseInt(formData.role),
        status: formData.status,
        orders_count: 0,
        total_spent: 0,
        created_at: new Date().toISOString().split('T')[0],
        last_login: null,
        address: formData.address?.trim() || '',
        notes: formData.notes?.trim() || ''
      };

      setUsers(prev => [...prev, newUser]);
      toast.success('تم إضافة المستخدم بنجاح');
      
      // إغلاق المودال وتفريغ النموذج
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: '0',
        status: 'active',
        address: '',
        notes: ''
      });
    } catch (error) {
      console.error('خطأ في إضافة المستخدم:', error);
      toast.error('حدث خطأ في إضافة المستخدم');
    } finally {
      setLoading(false);
    }
  };

  /**
   * معالجة تقديم نموذج تعديل مستخدم
   * @param {React.FormEvent} e - حدث التقديم
   */
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من البيانات
    if (!editFormData.name?.trim()) {
      toast.error('الاسم مطلوب');
      return;
    }

    if (!editFormData.email?.trim()) {
      toast.error('البريد الإلكتروني مطلوب');
      return;
    }

    setEditLoading(true);
    
    try {
      // ✅ هنا هتستدعي API التعديل
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? {
              ...user,
              name: editFormData.name.trim(),
              email: editFormData.email.trim().toLowerCase(),
              phone: editFormData.phone?.trim() || '',
              role: parseInt(editFormData.role),
              status: editFormData.status,
              address: editFormData.address?.trim() || '',
              notes: editFormData.notes?.trim() || ''
            }
          : user
      ));
      
      toast.success(`تم تحديث بيانات المستخدم ${editFormData.name} بنجاح`);
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('خطأ في تحديث المستخدم:', error);
      toast.error('حدث خطأ في تحديث المستخدم');
    } finally {
      setEditLoading(false);
    }
  };

  /**
   * تصفية المستخدمين حسب البحث
   */
  const filteredUsers = users.filter(user => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(search)
    );
  });

  // أعمدة الجدول
  const columns = [
    {
      key: 'name',
      title: 'المستخدم',
      render: (item) => {
        const RoleIcon = ROLE_LABELS[item.role]?.icon || FaUser;
        
        return (
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              item.role === 1 ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              <span className={`font-bold ${
                item.role === 1 ? 'text-purple-600' : 'text-blue-600'
              }`}>
                {getInitial(item.name)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaEnvelope className="w-3 h-3" />
                <span>{item.email}</span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'phone',
      title: 'الهاتف',
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-600">
          <FaPhone className="w-4 h-4 text-gray-400" />
          <span dir="ltr">{formatEgyptPhone(item.phone)}</span>
        </div>
      )
    },
    {
      key: 'role',
      title: 'نوع الحساب',
      render: (item) => {
        const RoleIcon = ROLE_LABELS[item.role]?.icon || FaUser;
        return (
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${ROLE_COLORS[item.role] || 'bg-gray-100'}`}>
            <RoleIcon className="w-4 h-4" />
            {ROLE_LABELS[item.role]?.text || 'غير معروف'}
          </span>
        );
      }
    },
    {
      key: 'status',
      title: 'الحالة',
      render: (item) => {
        const statusConfig = STATUS_LABELS[item.status] || STATUS_LABELS.inactive;
        const Icon = statusConfig.icon;
        
        return (
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${STATUS_COLORS[item.status] || STATUS_COLORS.inactive}`}>
            <Icon className="w-4 h-4" />
            {statusConfig.text}
          </span>
        );
      }
    },
    {
      key: 'orders_count',
      title: 'عدد الطلبات',
      render: (item) => (
        <div className="flex items-center gap-2">
          <FaShoppingBag className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-900">{item.orders_count}</span>
        </div>
      )
    },
    {
      key: 'total_spent',
      title: 'إجمالي المشتريات',
      render: (item) => (
        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="w-4 h-4 text-gray-400" />
          <span className="font-bold text-primary-600">{formatPrice(item.total_spent)} ج.م</span>
        </div>
      )
    },
    {
      key: 'created_at',
      title: 'تاريخ التسجيل',
      render: (item) => (
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{formatDate(item.created_at)}</span>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(item)}
            className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label={`عرض تفاصيل المستخدم ${item.name}`}
            title="عرض"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(item)}
            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`تعديل المستخدم ${item.name}`}
            title="تعديل"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          {item.role !== 1 && (
            <button
              onClick={() => handleDelete(item.id, item.name)}
              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`حذف المستخدم ${item.name}`}
              title="حذف"
            >
              <FaTrashAlt className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المستخدمين</h1>
          <p className="text-gray-500 text-sm mt-1">إدارة حسابات المستخدمين والصلاحيات</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          leftIcon={<FaUserPlus />}
        >
          إضافة مستخدم جديد
        </Button>
      </div>

      {/* شريط البحث */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم المستخدم أو البريد الإلكتروني أو رقم الهاتف..."
            className="w-full pr-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            aria-label="البحث عن مستخدمين"
          />
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-primary-500">
          <p className="text-sm text-gray-600 mb-1">إجمالي المستخدمين</p>
          <p className="text-3xl font-bold text-primary-600">{users.length.toLocaleString('ar-EG')}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">العملاء النشطين</p>
          <p className="text-3xl font-bold text-green-600">
            {users.filter(u => u.role === 0 && u.status === 'active').length.toLocaleString('ar-EG')}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-purple-500">
          <p className="text-sm text-gray-600 mb-1">المدراء</p>
          <p className="text-3xl font-bold text-purple-600">
            {users.filter(u => u.role === 1).length.toLocaleString('ar-EG')}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-yellow-500">
          <p className="text-sm text-gray-600 mb-1">المستخدمين الجدد (هذا الشهر)</p>
          <p className="text-3xl font-bold text-yellow-600">
            {users.filter(u => {
              if (!u.created_at) return false;
              const date = new Date(u.created_at);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length.toLocaleString('ar-EG')}
          </p>
        </div>
      </div>

      {/* جدول المستخدمين */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <Table
          columns={columns}
          data={filteredUsers}
          loading={false}
          emptyMessage={
            <div className="text-center py-12">
              <FaUser className="text-5xl mx-auto mb-4 text-gray-300" />
              <p className="text-lg text-gray-500">لا يوجد مستخدمين</p>
              <p className="text-sm text-gray-400 mt-2">قم بإضافة مستخدم جديد للبدء</p>
            </div>
          }
        />
      </div>

      {/* مودال إضافة مستخدم جديد */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowAddModal(false)}
            aria-hidden="true"
          />
          
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 id="modal-title" className="text-xl font-bold">إضافة مستخدم جديد</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                aria-label="إغلاق"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="الاسم الكامل"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل الاسم الكامل"
                />
                <Input
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="example@email.com"
                />
                <Input
                  label="رقم الهاتف"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="01xxxxxxxxx"
                />
                <Input
                  label="كلمة المرور"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="********"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الحساب
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white"
                  >
                    <option value="0">عميل</option>
                    <option value="1">مدير</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="banned">محظور</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    placeholder="العنوان (اختياري)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                    placeholder="ملاحظات إضافية (اختياري)"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  isLoading={loading}
                  className="flex-1"
                >
                  إضافة المستخدم
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال تعديل مستخدم */}
      {showEditModal && selectedUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowEditModal(false)}
            aria-hidden="true"
          />
          
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">تعديل بيانات المستخدم</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                aria-label="إغلاق"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="الاسم الكامل"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  required
                  placeholder="أدخل الاسم الكامل"
                />
                <Input
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  required
                  placeholder="example@email.com"
                />
                <Input
                  label="رقم الهاتف"
                  name="phone"
                  type="tel"
                  value={editFormData.phone}
                  onChange={handleEditInputChange}
                  placeholder="01xxxxxxxxx"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الحساب
                  </label>
                  <select
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white"
                  >
                    <option value="0">عميل</option>
                    <option value="1">مدير</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة
                  </label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="banned">محظور</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    placeholder="العنوان (اختياري)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    name="notes"
                    value={editFormData.notes}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                    placeholder="ملاحظات إضافية (اختياري)"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  isLoading={editLoading}
                  className="flex-1"
                >
                  حفظ التغييرات
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال عرض تفاصيل المستخدم */}
      {showViewModal && selectedUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowViewModal(false)}
            aria-hidden="true"
          />
          
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-l from-primary-600 to-skin-600 px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-xl font-bold">تفاصيل المستخدم</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                aria-label="إغلاق"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* صورة المستخدم */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${
                  selectedUser.role === 1 ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {getInitial(selectedUser.name)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm ${ROLE_COLORS[selectedUser.role]}`}>
                      {ROLE_LABELS[selectedUser.role]?.text}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${STATUS_COLORS[selectedUser.status]}`}>
                      {STATUS_LABELS[selectedUser.status]?.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* معلومات الاتصال */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">البريد الإلكتروني</p>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" />
                    <span className="text-gray-900" dir="ltr">{selectedUser.email}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">رقم الهاتف</p>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    <span className="text-gray-900" dir="ltr">{formatEgyptPhone(selectedUser.phone)}</span>
                  </div>
                </div>
              </div>

              {/* إحصائيات */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-primary-50 p-4 rounded-xl text-center">
                  <FaShoppingBag className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                  <p className="text-2xl font-bold text-primary-600">{selectedUser.orders_count}</p>
                  <p className="text-sm text-gray-600">عدد الطلبات</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <FaMoneyBillWave className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">{formatPrice(selectedUser.total_spent)}</p>
                  <p className="text-sm text-gray-600">إجمالي المشتريات</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center">
                  <FaCalendarAlt className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-bold text-purple-600 mt-2">{formatDate(selectedUser.created_at)}</p>
                  <p className="text-sm text-gray-600">تاريخ التسجيل</p>
                </div>
              </div>

              {/* العنوان */}
              {selectedUser.address && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary-600" />
                    العنوان
                  </h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedUser.address}</p>
                </div>
              )}

              {/* ملاحظات */}
              {selectedUser.notes && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FaStickyNote className="text-primary-600" />
                    ملاحظات
                  </h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedUser.notes}</p>
                </div>
              )}

              {/* آخر ظهور */}
              {selectedUser.last_login && (
                <div className="mt-4 text-sm text-gray-500">
                  آخر ظهور: {formatDateTime(selectedUser.last_login)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUsers;