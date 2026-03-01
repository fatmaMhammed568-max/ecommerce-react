import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiUpload, FiImage, FiInfo, FiLink, FiFolder } from 'react-icons/fi';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import categoryService from '../../../services/categoryService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * صفحة إضافة قسم جديد
 */
const AddCategory = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [fetchingParents, setFetchingParents] = useState(true);
  const [parentCategories, setParentCategories] = useState([]); // ✅ مصفوفة
  const [imagePreview, setImagePreview] = useState(null);
  const [apiError, setApiError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    image: null,
    is_active: true,
    sort_order: 0
  });

  /**
   * التحقق من صلاحية المستخدم
   */
  useEffect(() => {
    if (!isAdmin) {
      toast.error('ليس لديك صلاحية للوصول إلى هذه الصفحة');
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  /**
   * جلب الأقسام الرئيسية (الأب) لعرضها في القائمة المنسدلة
   */
  useEffect(() => {
    fetchParentCategories();
  }, []);

  /**
   * جلب الأقسام الرئيسية من API
   */
  const fetchParentCategories = async () => {
    setFetchingParents(true);
    setApiError(null);
    
    try {
      const response = await categoryService.getParentCategories();
      console.log('Parent categories response:', response);
      
      // ✅ معالجة شكل البيانات القادمة من API
      let categoriesArray = [];
      
      if (response?.data?.data && Array.isArray(response.data.data)) {
        // شكل: { status: true, data: { data: [...] } }
        categoriesArray = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        // شكل: { status: true, data: [...] }
        categoriesArray = response.data;
      } else if (response?.data && response.data.data && Array.isArray(response.data.data)) {
        // شكل: { data: { data: [...] } }
        categoriesArray = response.data.data;
      } else if (Array.isArray(response)) {
        // شكل: [...]
        categoriesArray = response;
      } else {
        console.warn('تنسيق البيانات غير متوقع:', response);
        categoriesArray = [];
      }
      
      setParentCategories(categoriesArray);
      
    } catch (error) {
      console.error('خطأ في جلب الأقسام الرئيسية:', error);
      setApiError('فشل تحميل الأقسام الرئيسية من الخادم');
      
      if (error.response?.status === 401) {
        toast.error('انتهت الجلسة، الرجاء تسجيل الدخول مرة أخرى');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('ليس لديك صلاحية لعرض الأقسام');
      }
      
      setParentCategories([]); // ✅ مصفوفة فارغة في حالة الخطأ
    } finally {
      setFetchingParents(false);
    }
  };

  /**
   * توليد slug تلقائي من الاسم
   */
  const generateSlug = (name) => {
    if (!name) return '';
    
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  /**
   * معالجة تغيير الحقول
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'name') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        slug: generateSlug(value) 
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'sort_order') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  /**
   * معالجة تغيير الصورة
   */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار صورة صالحة');
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * إزالة الصورة المختارة
   */
  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  /**
   * معالجة تقديم النموذج
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error('اسم القسم مطلوب');
      return;
    }

    if (!formData.slug?.trim()) {
      toast.error('الرابط المختصر (Slug) مطلوب');
      return;
    }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('slug', formData.slug.toLowerCase().trim());
      
      if (formData.description?.trim()) {
        formDataToSend.append('description', formData.description.trim());
      }
      
      if (formData.parent_id) {
        formDataToSend.append('parent_id', formData.parent_id.toString());
      }
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');
      formDataToSend.append('sort_order', formData.sort_order.toString());

      const response = await categoryService.createCategory(formDataToSend);
      console.log('Create response:', response);
      
      if (response?.status) {
        toast.success('تم إضافة القسم بنجاح');
        navigate('/dashboard/categories');
      } else {
        toast.error(response?.message || 'فشل إضافة القسم');
      }
    } catch (error) {
      console.error('خطأ في إضافة القسم:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          const messages = errors[key];
          if (Array.isArray(messages)) {
            messages.forEach(msg => toast.error(msg));
          } else {
            toast.error(messages);
          }
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error('انتهت الجلسة، الرجاء تسجيل الدخول مرة أخرى');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('ليس لديك صلاحية لإضافة أقسام');
      } else {
        toast.error(error.message || 'حدث خطأ أثناء إضافة القسم');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * الحصول على اسم القسم الأب
   */
  const getParentCategoryName = (parentId) => {
    if (!parentId) return '';
    // ✅ التأكد أن parentCategories مصفوفة قبل استخدام find
    if (Array.isArray(parentCategories)) {
      const parent = parentCategories.find(c => c.id === Number(parentId));
      return parent?.name || '';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إضافة قسم جديد</h1>
            <p className="text-gray-600">أضف قسم جديد لتنظيم منتجاتك بشكل أفضل</p>
            
            {/* عرض رسالة الخطأ من API */}
            {apiError && (
              <div className="mt-2 p-3 bg-yellow-50 border-r-4 border-yellow-500 rounded-lg">
                <p className="text-yellow-800 text-sm">{apiError}</p>
                <button 
                  onClick={fetchParentCategories}
                  className="text-yellow-700 text-sm underline mt-1 hover:text-yellow-900"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/categories')}
              leftIcon={<FiX />}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              form="category-form"
              isLoading={loading}
              leftIcon={<FiSave />}
              disabled={loading}
            >
              حفظ القسم
            </Button>
          </div>
        </div>

        {/* النموذج الرئيسي */}
        <form 
          id="category-form" 
          onSubmit={handleSubmit} 
          encType="multipart/form-data" 
          className="space-y-6"
          noValidate
        >
          {/* المعلومات الأساسية */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-l from-primary-600 to-skin-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiInfo className="w-5 h-5" aria-hidden="true" />
                المعلومات الأساسية
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* اسم القسم */}
                <div className="md:col-span-2">
                  <Input
                    label="اسم القسم"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="أدخل اسم القسم (مثال: العناية بالبشرة)"
                    leftIcon={<FiFolder className="text-gray-400" />}
                  />
                </div>

                {/* الرابط المختصر (Slug) */}
                <div className="md:col-span-2">
                  <Input
                    label="الرابط المختصر (Slug)"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    placeholder="skin-care"
                    helper={`سيتم استخدامه في الرابط: /category/${formData.slug || '...'}`}
                    leftIcon={<FiLink className="text-gray-400" />}
                  />
                </div>

                {/* الوصف */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                    placeholder="وصف مختصر للقسم (اختياري)"
                  />
                </div>

                {/* القسم الأب - مع التحقق أن parentCategories مصفوفة */}
                <div className="md:col-span-2">
                  <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700 mb-2">
                    القسم الرئيسي (اختياري)
                  </label>
                  <select
                    id="parent_id"
                    name="parent_id"
                    value={formData.parent_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white"
                    aria-label="اختر القسم الرئيسي"
                    disabled={fetchingParents}
                  >
                    <option value="">لا يوجد (قسم رئيسي)</option>
                    {/* ✅ التحقق أن parentCategories مصفوفة قبل استخدام map */}
                    {Array.isArray(parentCategories) && parentCategories.length > 0 ? (
                      parentCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      !fetchingParents && <option disabled>لا توجد أقسام رئيسية</option>
                    )}
                  </select>
                  {fetchingParents && (
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></span>
                      جاري تحميل الأقسام الرئيسية...
                    </p>
                  )}
                </div>

                {/* الترتيب */}
                <div>
                  <Input
                    label="ترتيب العرض"
                    name="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    helper="كلما قل الرقم، ظهر القسم في البداية"
                  />
                </div>

                {/* حالة التفعيل */}
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">القسم نشط</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* صورة القسم */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-l from-primary-600 to-skin-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiImage className="w-5 h-5" aria-hidden="true" />
                صورة القسم
              </h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {/* منطقة رفع الصورة */}
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    imagePreview 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-300 hover:border-primary-500 hover:bg-gray-50'
                  }`}
                  role="region"
                  aria-label="منطقة رفع الصورة"
                >
                  {!imagePreview ? (
                    <div>
                      <FiUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" aria-hidden="true" />
                      <p className="text-gray-600 mb-2">
                        اسحب وأفلت الصورة هنا أو اضغط للاختيار
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF - الحد الأقصى 2 ميجابايت
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="category-image"
                        aria-label="اختيار صورة القسم"
                      />
                      <label
                        htmlFor="category-image"
                        className="inline-block mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            document.getElementById('category-image')?.click();
                          }
                        }}
                      >
                        اختيار صورة
                      </label>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="معاينة صورة القسم"
                        className="max-h-64 rounded-lg shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="إزالة الصورة"
                      >
                        <FiX className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>

                {/* معلومات الصورة */}
                {formData.image && (
                  <div className="bg-gray-50 p-4 rounded-lg" role="status" aria-label="معلومات الصورة">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">اسم الملف:</span> {formData.image.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">الحجم:</span> {(formData.image.size / 1024).toFixed(2)} كيلوبايت
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ملخص الإدخال */}
          {formData.name && (
            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-200" role="status" aria-label="ملخص القسم">
              <h3 className="font-semibold text-primary-800 mb-2">معاينة القسم:</h3>
              <p className="text-primary-600">
                <span className="font-medium">الاسم:</span> {formData.name}
              </p>
              <p className="text-primary-600">
                <span className="font-medium">الرابط:</span> /category/{formData.slug || '...'}
              </p>
              {formData.parent_id && (
                <p className="text-primary-600">
                  <span className="font-medium">القسم الأب:</span> {getParentCategoryName(formData.parent_id)}
                </p>
              )}
              <p className="text-primary-600">
                <span className="font-medium">الحالة:</span>{' '}
                {formData.is_active ? (
                  <span className="text-green-600">نشط</span>
                ) : (
                  <span className="text-red-600">غير نشط</span>
                )}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddCategory;