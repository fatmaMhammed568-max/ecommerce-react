import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiTrash2, FiUpload, FiImage } from 'react-icons/fi';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import productService from '../../../services/productService';  // ✅ تم التصحيح
import categoryService from '../../../services/categoryService';  // ✅ تم التصحيح
import toast from 'react-hot-toast';

/**
 * صفحة تعديل المنتج
 */
const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [currentMainImage, setCurrentMainImage] = useState('');
  const [currentImages, setCurrentImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [newMainImagePreview, setNewMainImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    compare_price: '',
    quantity: 0,
    description: '',
    features: '',
    details: '',
    category_id: '',
    main_image: null,
    images: []
  });

  /**
   * جلب بيانات المنتج والأقسام عند تحميل الصفحة
   */
  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchCategories();
    }
  }, [id]);

  /**
   * تنظيف عناوين URL للصور الجديدة عند إلغاء تحميل المكون
   */
  useEffect(() => {
    return () => {
      if (newMainImagePreview) URL.revokeObjectURL(newMainImagePreview);
      newImagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [newMainImagePreview, newImagePreviews]);

  /**
   * جلب بيانات المنتج
   */
  const fetchProduct = async () => {
    setFetchLoading(true);
    try {
      const response = await productService.getProduct(id);
      if (response?.status) {
        const product = response.data;
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          price: product.price || 0,
          compare_price: product.compare_price || '',
          quantity: product.quantity || 0,
          description: product.description || '',
          features: product.features || '',
          details: product.details || '',
          category_id: product.category_id?.toString() || '',
          main_image: null,
          images: []
        });
        setCurrentMainImage(product.main_image || '');
        setCurrentImages(product.images?.map(img => img.url) || []);
      }
    } catch (error) {
      console.error('خطأ في جلب المنتج:', error);
      toast.error('حدث خطأ أثناء جلب بيانات المنتج');
      navigate('/dashboard/products');
    } finally {
      setFetchLoading(false);
    }
  };

  /**
   * جلب الأقسام
   */
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories({ perPage: 100 });
      if (response?.status) {
        setCategories(response.data?.data || []);
      }
    } catch (error) {
      console.error('خطأ في جلب الأقسام:', error);
    }
  };

  /**
   * معالجة تغيير الحقول
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  /**
   * معالجة تغيير الصورة الرئيسية الجديدة
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من حجم الصورة
    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار صورة صالحة');
      return;
    }

    setFormData(prev => ({ ...prev, main_image: file }));
    setNewMainImagePreview(URL.createObjectURL(file));
  };

  /**
   * معالجة تغيير الصور الإضافية الجديدة
   * @param {React.ChangeEvent} e - حدث التغيير
   */
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // التحقق من إجمالي عدد الصور (حد أقصى 5 صور)
    if (formData.images.length + files.length > 5) {
      toast.error('يمكنك إضافة 5 صور كحد أقصى');
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`الصورة ${file.name} حجمها كبير (الحد الأقصى 2 ميجابايت)`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`الملف ${file.name} ليس صورة صالحة`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, ...validFiles] 
    }));

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...newPreviews]);
  };

  /**
   * إزالة صورة جديدة
   * @param {number} index - رقم الصورة
   */
  const removeNewImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));

    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * إزالة الصورة الرئيسية الجديدة
   */
  const removeNewMainImage = () => {
    setFormData(prev => ({ ...prev, main_image: null }));
    if (newMainImagePreview) {
      URL.revokeObjectURL(newMainImagePreview);
      setNewMainImagePreview(null);
    }
  };

  /**
   * معالجة تقديم النموذج
   * @param {React.FormEvent} e - حدث التقديم
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error('اسم المنتج مطلوب');
      return;
    }

    if (!formData.price || formData.price <= 0) {
      toast.error('السعر يجب أن يكون أكبر من 0');
      return;
    }

    if (!formData.category_id) {
      toast.error('يرجى اختيار قسم للمنتج');
      return;
    }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('_method', 'PUT');
      
      // إضافة البيانات
      formDataToSend.append('name', formData.name.trim());
      if (formData.sku) formDataToSend.append('sku', formData.sku.trim());
      formDataToSend.append('price', formData.price.toString());
      if (formData.compare_price) {
        formDataToSend.append('compare_price', formData.compare_price.toString());
      }
      formDataToSend.append('quantity', formData.quantity.toString());
      if (formData.description) formDataToSend.append('description', formData.description);
      if (formData.features) formDataToSend.append('features', formData.features);
      if (formData.details) formDataToSend.append('details', formData.details);
      formDataToSend.append('category_id', formData.category_id.toString());
      
      // إضافة الصور الجديدة
      if (formData.main_image) {
        formDataToSend.append('main_image', formData.main_image);
      }
      
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      const response = await productService.updateProduct(id, formDataToSend);
      
      if (response?.status) {
        toast.success('تم تحديث المنتج بنجاح');
        navigate('/dashboard/products');
      }
    } catch (error) {
      console.error('خطأ في تحديث المنتج:', error);
      
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((err) => {
          if (Array.isArray(err)) {
            err.forEach(msg => toast.error(msg));
          } else {
            toast.error(err);
          }
        });
      } else {
        toast.error(error.message || 'حدث خطأ أثناء تحديث المنتج');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * الحصول على رابط الصورة الكامل
   * @param {string} path - مسار الصورة
   * @returns {string} الرابط الكامل
   */
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${path}`;
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="جاري التحميل">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" aria-hidden="true" />
          <span className="sr-only">جاري تحميل بيانات المنتج...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">تعديل المنتج</h1>
            <p className="text-gray-600">قم بتعديل بيانات المنتج حسب الحاجة</p>
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
              حفظ التعديلات
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
                  label="سعر المقارنة"
                  type="number"
                  name="compare_price"
                  value={formData.compare_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                <Input
                  label="الكمية"
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
              {/* الصورة الرئيسية الحالية */}
              {currentMainImage && !newMainImagePreview && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الصورة الرئيسية الحالية
                  </label>
                  <div className="relative inline-block">
                    <img
                      src={getImageUrl(currentMainImage)}
                      alt={formData.name}
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* تغيير الصورة الرئيسية */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {newMainImagePreview ? 'الصورة الرئيسية الجديدة' : 'تغيير الصورة الرئيسية'}
                </label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  newMainImagePreview 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-500 hover:bg-gray-50'
                }`}>
                  {!newMainImagePreview ? (
                    <div>
                      <FiUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" aria-hidden="true" />
                      <p className="text-gray-600 mb-2">اختر صورة جديدة إذا أردت تغيير الصورة الرئيسية</p>
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
                        اختيار صورة جديدة
                      </label>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <img
                        src={newMainImagePreview}
                        alt="الصورة الرئيسية الجديدة"
                        className="max-h-64 rounded-lg shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={removeNewMainImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        aria-label="إزالة الصورة الرئيسية الجديدة"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  اترك هذا الحقل فارغاً إذا لم ترد تغيير الصورة الرئيسية
                </p>
              </div>

              {/* الصور الإضافية الحالية */}
              {currentImages.length > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الصور الإضافية الحالية
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {currentImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImageUrl(img)}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* إضافة صور جديدة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إضافة صور جديدة (اختياري - حتى 5 صور)
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
                
                {/* معاينة الصور الجديدة */}
                {newImagePreviews.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">الصور الجديدة ({newImagePreviews.length}/5):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {newImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`صورة جديدة ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
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
        </form>
      </div>
    </div>
  );
};

export default EditProduct;