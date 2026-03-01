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
  FaSpinner
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
    meta_keywords: ''
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
      // ✅ استخدام dashboard للمسؤول
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
        toast.error('انتهت الجلسة، الرjاء تسجيل الدخول مرة أخرى');
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
    
    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('الرجاء اختيار صورة صالحة');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error('اسم المنتج مطلوب');
      return;
    }

    if (!formData.price) {
      toast.error('سعر المنتج مطلوب');
      return;
    }

    if (!formData.category_id) {
      toast.error('القسم مطلوب');
      return;
    }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // إضافة البيانات الأساسية
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key].toString());
        }
      });

      // إضافة الصور
      selectedImages.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      // ✅ استخدام createProduct للمسؤول
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
              leftIcon={<FiX />}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              form="product-form"
              isLoading={loading}
              leftIcon={<FiSave />}
            >
              حفظ المنتج
            </Button>
          </div>
        </div>

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
                <Input
                  label="اسم المنتج"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسم المنتج"
                />
                <Input
                  label="SKU (رمز المنتج)"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="PRD-001"
                  helper="اختياري - رمز فريد للمنتج"
                />
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
                />
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
                />
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
                />
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                    القسم *
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white"
                    required
                  >
                    <option value="">اختر القسم</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                    placeholder="وصف تفصيلي للمنتج..."
                  />
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                    placeholder="كل ميزة في سطر منفصل..."
                  />
                  <p className="text-sm text-gray-500 mt-1">كل ميزة في سطر منفصل</p>
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                    placeholder="تفاصيل إضافية عن المنتج..."
                  />
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
              {/* الصورة الرئيسية */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصورة الرئيسية *
                </label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  mainImagePreview 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-500 hover:bg-gray-50'
                }`}>
                  {!mainImagePreview ? (
                    <div>
                      <FiUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" aria-hidden="true" />
                      <p className="text-gray-600 mb-2">اختر الصورة الرئيسية للمنتج</p>
                      <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF - الحد الأقصى 2 ميجابايت</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="hidden"
                        id="main-image"
                      />
                      <label
                        htmlFor="main-image"
                        className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors cursor-pointer"
                      >
                        اختيار صورة
                      </label>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <img
                        src={mainImagePreview}
                        alt="الصورة الرئيسية"
                        className="max-h-64 rounded-lg shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={removeMainImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        aria-label="إزالة الصورة الرئيسية"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* الصور الإضافية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صور إضافية (اختياري - حتى 5 صور)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 hover:bg-gray-50 transition-all">
                  <FiImage className="w-12 h-12 mx-auto mb-4 text-gray-400" aria-hidden="true" />
                  <p className="text-gray-600 mb-2">اختر صور إضافية للمنتج</p>
                  <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF - الحد الأقصى 2 ميجابايت لكل صورة</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    className="hidden"
                    id="additional-images"
                    disabled={formData.images.length >= 5}
                  />
                  <label
                    htmlFor="additional-images"
                    className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                      formData.images.length >= 5
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    اختيار صور
                  </label>
                </div>
                
                {/* معاينة الصور المضافة */}
                {imagePreviews.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">الصور المضافة ({imagePreviews.length}/5):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`صورة ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            aria-label={`إزالة الصورة ${index + 1}`}
                          >
                            <FiTrash2 className="w-3 h-3" />
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
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;