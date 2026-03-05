import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSave, 
  FaTimes, 
  FaUpload, 
  FaImage, 
  FaInfo, 
  FaLink, 
  FaFolder,
  FaSpinner,
  FaTrashAlt,
  FaPlus
} from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * صفحة إضافة منتج جديد
 */
const AddProduct = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    compare_price: '',
    cost_price: '',
    quantity: '',
    sku: '',
    barcode: '',
    category_id: '',
    brand: '',
    weight: '',
    dimensions: '',
    is_active: true,
    is_featured: false,
    tax_rate: 15,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    features: '',
    details: '',
    status: 'active',
    visibility: 'public'
  });

  const [selectedImages, setSelectedImages] = useState([]);

  // التحقق من صلاحية المستخدم
  useEffect(() => {
    if (!isAdmin) {
      toast.error('ليس لديك صلاحية للوصول إلى هذه الصفحة');
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // جلب الأقسام
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setFetchingCategories(true);
    setApiError(null);
    
    try {
      const response = await categoryService.getCategories({ per_page: 100 });
      console.log('Categories response:', response);
      
      if (response?.status) {
        let categoriesData = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          categoriesData = response.data;
        } else {
          categoriesData = [];
        }
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('خطأ في جلب الأقسام:', error);
      setApiError('فشل تحميل الأقسام');
      
      if (error.response?.status === 401) {
        toast.error('انتهت الجلسة، الرجاء تسجيل الدخول مرة أخرى');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('ليس لديك صلاحية لعرض الأقسام');
      }
    } finally {
      setFetchingCategories(false);
    }
  };

  // توليد slug تلقائي
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // مسح خطأ التحقق لهذا الحقل عند التعديل
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (name === 'name') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        slug: generateSlug(value) 
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // التحقق من عدد الصور (حد أقصى 5 صور)
    if (selectedImages.length + files.length > 5) {
      toast.error('يمكنك إضافة 5 صور كحد أقصى');
      return;
    }
    
    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`الصورة ${file.name} حجمها كبير - الحد الأقصى 2 ميجابايت`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`الملف ${file.name} ليس صورة صالحة`);
        return;
      }

      setSelectedImages(prev => [...prev, file]);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'اسم المنتج مطلوب';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'سعر المنتج مطلوب ويجب أن يكون أكبر من 0';
    }

    if (!formData.category_id) {
      errors.category_id = 'القسم مطلوب';
    }

    if (formData.quantity === '' || formData.quantity === null || parseInt(formData.quantity) < 0) {
      errors.quantity = 'الكمية مطلوبة ويجب أن تكون 0 أو أكثر';
    }

    if (selectedImages.length === 0) {
      errors.images = 'الرجاء إضافة صورة واحدة على الأقل للمنتج';
    }

    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => toast.error(error));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setValidationErrors({});
    
    try {
      const formDataToSend = new FormData();
      
      // إضافة البيانات الأساسية مع معالجة خاصة للقيم المختلفة
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== null && value !== undefined && value !== '') {
          if (typeof value === 'boolean') {
            formDataToSend.append(key, value ? '1' : '0');
          } else {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      // إضافة الصور مع التأكد من الترقيم الصحيح
      selectedImages.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      // طباعة محتوى FormData للتصحيح
      console.log('FormData contents:');
      for (let pair of formDataToSend.entries()) {
        if (pair[0].includes('image')) {
          const value = pair[1];
          if (value instanceof File) {
            console.log(pair[0] + ': [File] ' + value.name);
          } else {
            console.log(pair[0] + ': ' + value);
          }
        } else {
          console.log(pair[0] + ': ' + pair[1]);
        }
      }

      const response = await productService.createProduct(formDataToSend);
      console.log('Create response:', response);
      
      if (response?.status) {
        toast.success('تم إضافة المنتج بنجاح');
        navigate('/dashboard/products');
      } else {
        toast.error(response?.message || 'فشل إضافة المنتج');
      }
    } catch (error) {
      console.error('خطأ في إضافة المنتج:', error);
      
      // عرض تفاصيل أخطاء التحقق من الخادم
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        console.log('🔍 Validation errors details:', JSON.stringify(errors, null, 2));
        
        // تخزين أخطاء التحقق في state
        setValidationErrors(errors);
        
        // عرض كل خطأ بشكل منفصل مع التنسيق
        let errorMessage = '❌ أخطاء التحقق من صحة البيانات:\n';
        Object.keys(errors).forEach(key => {
          const messages = errors[key];
          if (Array.isArray(messages)) {
            messages.forEach(msg => {
              errorMessage += `\n• ${key}: ${msg}`;
              console.error(`❌ ${key}: ${msg}`);
            });
          } else {
            errorMessage += `\n• ${key}: ${messages}`;
            console.error(`❌ ${key}: ${messages}`);
          }
        });
        
        // عرض الأخطاء في toast واحد أو عدة toasts
        toast.error(errorMessage, {
          duration: 8000,
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            direction: 'rtl',
            maxWidth: '500px',
            whiteSpace: 'pre-line'
          }
        });
      } else if (error.response?.status === 401) {
        toast.error('انتهت الجلسة، الرجاء تسجيل الدخول مرة أخرى');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('ليس لديك صلاحية لإضافة منتجات');
      } else {
        toast.error(error.message || 'حدث خطأ أثناء إضافة المنتج');
      }
    } finally {
      setLoading(false);
    }
  };

  // دالة مساعدة لعرض خطأ حقل معين
  const getFieldError = (fieldName) => {
    if (validationErrors[fieldName]) {
      const error = validationErrors[fieldName];
      if (Array.isArray(error)) {
        return error[0];
      }
      return error;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إضافة منتج جديد</h1>
            <p className="text-gray-600">أضف منتج جديد للمتجر</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/products')}
              leftIcon={<FaTimes />}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              form="product-form"
              isLoading={loading}
              leftIcon={<FaSave />}
            >
              حفظ المنتج
            </Button>
          </div>
        </div>

        {/* عرض أخطاء التحقق العامة */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="text-red-800 font-semibold mb-2">يوجد أخطاء في البيانات:</h3>
            <ul className="list-disc list-inside text-red-600 space-y-1">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field}>
                  <span className="font-medium">{field}:</span>{' '}
                  {Array.isArray(error) ? error.join(', ') : error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form 
          id="product-form" 
          onSubmit={handleSubmit} 
          encType="multipart/form-data" 
          className="space-y-6"
          noValidate
        >
          {/* المعلومات الأساسية */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-l from-primary-600 to-skin-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">المعلومات الأساسية</h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="اسم المنتج"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="أدخل اسم المنتج"
                    error={getFieldError('name')}
                  />
                </div>
                <div>
                  <Input
                    label="SKU (رمز المنتج)"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="PRD-001"
                    helper="اختياري - رمز فريد للمنتج"
                    error={getFieldError('sku')}
                  />
                </div>
                <div>
                  <Input
                    label="السعر"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    error={getFieldError('price')}
                  />
                </div>
                <div>
                  <Input
                    label="سعر المقارنة (السعر القديم)"
                    type="number"
                    name="compare_price"
                    value={formData.compare_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    helper="اختياري - لعرض التخفيضات"
                    error={getFieldError('compare_price')}
                  />
                </div>
                <div>
                  <Input
                    label="الكمية المتاحة"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    step="1"
                    placeholder="0"
                    error={getFieldError('quantity')}
                  />
                </div>
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                    القسم *
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white ${
                      getFieldError('category_id') 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                    required
                  >
                    <option value="">اختر القسم</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {getFieldError('category_id') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('category_id')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* الوصف والمميزات */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-l from-primary-600 to-skin-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">الوصف والمميزات</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                      getFieldError('description') 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                    placeholder="وصف تفصيلي للمنتج..."
                  />
                  {getFieldError('description') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('description')}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
                    المميزات
                  </label>
                  <textarea
                    id="features"
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                      getFieldError('features') 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                    placeholder="كل ميزة في سطر منفصل..."
                  />
                  <p className="text-sm text-gray-500 mt-1">كل ميزة في سطر منفصل</p>
                  {getFieldError('features') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('features')}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                    التفاصيل الإضافية
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                      getFieldError('details') 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                    placeholder="تفاصيل إضافية عن المنتج..."
                  />
                  {getFieldError('details') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('details')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* الصور */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-l from-primary-600 to-skin-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">صور المنتج</h2>
            </div>
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صور المنتج (يمكنك اختيار عدة صور - الحد الأقصى 5 صور)
                </label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  getFieldError('images') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-primary-500 hover:bg-gray-50'
                }`}>
                  <FaUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">اختر صور المنتج</p>
                  <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF - الحد الأقصى 2 ميجابايت لكل صورة</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="product-images"
                    disabled={selectedImages.length >= 5}
                  />
                  <label
                    htmlFor="product-images"
                    className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                      selectedImages.length >= 5
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    اختيار صور
                  </label>
                </div>
                {getFieldError('images') && (
                  <p className="mt-2 text-sm text-red-600 text-center">{getFieldError('images')}</p>
                )}
                
                {/* معاينة الصور المضافة */}
                {imagePreviews.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">الصور المضافة ({imagePreviews.length}):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`صورة ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg shadow-md"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23e2e8f0\'/%3E%3Ctext x=\'50\' y=\'50\' font-size=\'14\' text-anchor=\'middle\' alignment-baseline=\'middle\' fill=\'%2394a3b8\'%3Eلا توجد صورة%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                            aria-label={`إزالة الصورة ${index + 1}`}
                          >
                            <FaTrashAlt className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ملخص الإدخال */}
          {formData.name && (
            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-200">
              <h3 className="font-semibold text-primary-800 mb-2">ملخص المنتج:</h3>
              <p className="text-primary-600">
                <span className="font-medium">الاسم:</span> {formData.name}
              </p>
              <p className="text-primary-600">
                <span className="font-medium">السعر:</span> {formData.price} ر.س
              </p>
              {formData.category_id && (
                <p className="text-primary-600">
                  <span className="font-medium">القسم:</span> {categories.find(c => c.id === Number(formData.category_id))?.name}
                </p>
              )}
              <p className="text-primary-600">
                <span className="font-medium">عدد الصور:</span> {selectedImages.length}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;