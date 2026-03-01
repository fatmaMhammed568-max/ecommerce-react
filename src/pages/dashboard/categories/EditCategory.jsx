import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiUpload, FiImage, FiInfo, FiLink, FiFolder } from 'react-icons/fi';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import categoryService from '../../../services/categoryService';  // ✅ تم التصحيح
import toast from 'react-hot-toast';

/**
 * صفحة تعديل قسم
 */
const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [parentCategories, setParentCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    note: '',
    category_id: '',
    image: null,
  });

  /**
   * جلب بيانات القسم والأقسام الرئيسية عند تحميل الصفحة
   */
  useEffect(() => {
    if (id) {
      fetchCategory();
      fetchParentCategories();
    }
  }, [id]);

  /**
   * جلب الأقسام الرئيسية لاختيار القسم الأب
   */
  const fetchParentCategories = async () => {
    try {
      const response = await categoryService.getCategories({ perPage: 100 });
      if (response?.status) {
        // تصفية لمنع عرض القسم الحالي في القائمة
        const filteredCategories = (response.data?.data || []).filter(
          (cat) => cat.id !== Number(id)
        );
        setParentCategories(filteredCategories);
      }
    } catch (error) {
      console.error('خطأ في جلب الأقسام الرئيسية:', error);
    }
  };

  /**
   * جلب بيانات القسم المطلوب تعديله
   */
  const fetchCategory = async () => {
    setFetchLoading(true);
    try {
      const response = await categoryService.getCategory(id);
      if (response?.status) {
        const category = response.data;
        setFormData({
          name: category.name || '',
          slug: category.slug || '',
          note: category.note || '',
          category_id: category.category_id?.toString() || '',
          image: null,
        });
        setCurrentImage(category.image || '');
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات القسم:', error);
      toast.error('حدث خطأ أثناء جلب بيانات القسم');
      navigate('/dashboard/categories');
    } finally {
      setFetchLoading(false);
    }
  };

  /**
   * توليد slug تلقائي من الاسم
   * @param {string} name - اسم القسم
   * @returns {string} الرابط المختصر
   */
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  /**
   * معالجة تغيير الحقول
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // إذا كان الحقل هو الاسم، توليد slug تلقائي
    if (name === 'name') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        slug: generateSlug(value) 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  /**
   * معالجة تغيير الصورة
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // التحقق من حجم الصورة (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت');
      return;
    }

    // التحقق من نوع الصورة
    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار صورة صالحة');
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    
    // إنشاء معاينة للصورة
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
   * @param {React.FormEvent} e - حدث التقديم
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من البيانات
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
      formDataToSend.append('_method', 'PUT'); // Laravel method spoofing
      
      // إضافة البيانات
      if (formData.name?.trim()) formDataToSend.append('name', formData.name.trim());
      if (formData.slug) formDataToSend.append('slug', formData.slug);
      if (formData.note?.trim()) formDataToSend.append('note', formData.note.trim());
      if (formData.category_id) formDataToSend.append('category_id', formData.category_id);
      if (formData.image) formDataToSend.append('image', formData.image);

      const response = await categoryService.updateCategory(id, formDataToSend);
      
      if (response?.status) {
        toast.success('تم تحديث القسم بنجاح');
        navigate('/dashboard/categories');
      }
    } catch (error) {
      console.error('خطأ في تحديث القسم:', error);
      
      // عرض أخطاء التحقق
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((err) => {
          if (Array.isArray(err)) {
            err.forEach(msg => toast.error(msg));
          } else {
            toast.error(err);
          }
        });
      } else {
        toast.error(error.message || 'حدث خطأ أثناء تحديث القسم');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * الحصول على اسم القسم الأب
   * @param {string} categoryId - معرف القسم الأب
   * @returns {string} اسم القسم الأب
   */
  const getParentCategoryName = (categoryId) => {
    const parent = parentCategories.find(c => c.id === Number(categoryId));
    return parent?.name || '';
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="جاري التحميل">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" aria-hidden="true" />
          <span className="sr-only">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">تعديل القسم</h1>
            <p className="text-gray-600">قم بتعديل بيانات القسم حسب الحاجة</p>
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
            >
              حفظ التعديلات
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

                {/* القسم الأب */}
                <div className="md:col-span-2">
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                    القسم الرئيسي (اختياري)
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white"
                    aria-label="اختر القسم الرئيسي"
                  >
                    <option value="">لا يوجد (قسم رئيسي)</option>
                    {parentCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    إذا كان هذا قسم فرعي، اختر القسم الرئيسي التابع له
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* الملاحظات */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-l from-primary-600 to-skin-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiInfo className="w-5 h-5" aria-hidden="true" />
                ملاحظات إضافية
              </h2>
            </div>
            
            <div className="p-6">
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                  placeholder="أي ملاحظات إضافية عن القسم (اختياري)"
                />
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
                {/* عرض الصورة الحالية */}
                {currentImage && !imagePreview && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">الصورة الحالية:</p>
                    <div className="relative inline-block">
                      <img
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${currentImage}`}
                        alt={formData.name}
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML += '<p class="text-red-500">فشل تحميل الصورة</p>';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* منطقة رفع الصورة الجديدة */}
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
                        اختر صورة جديدة إذا أردت تغيير الصورة الحالية
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
                        اختيار صورة جديدة
                      </label>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="معاينة الصورة الجديدة"
                        className="max-h-64 rounded-lg shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="إزالة الصورة المختارة"
                      >
                        <FiX className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>

                {/* معلومات الصورة الجديدة */}
                {formData.image && (
                  <div className="bg-gray-50 p-4 rounded-lg" role="status" aria-label="معلومات الصورة الجديدة">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">اسم الملف:</span> {formData.image.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">الحجم:</span> {(formData.image.size / 1024).toFixed(2)} كيلوبايت
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  اترك هذا الحقل فارغاً إذا لم ترد تغيير الصورة
                </p>
              </div>
            </div>
          </div>

          {/* ملخص الإدخال */}
          {formData.name && (
            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-200" role="status" aria-label="ملخص القسم">
              <h3 className="font-semibold text-primary-800 mb-2">ملخص التعديلات:</h3>
              <p className="text-primary-600">
                <span className="font-medium">الاسم:</span> {formData.name}
              </p>
              <p className="text-primary-600">
                <span className="font-medium">الرابط:</span> /category/{formData.slug || '...'}
              </p>
              {formData.category_id && (
                <p className="text-primary-600">
                  <span className="font-medium">القسم الأب:</span> {getParentCategoryName(formData.category_id)}
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditCategory;