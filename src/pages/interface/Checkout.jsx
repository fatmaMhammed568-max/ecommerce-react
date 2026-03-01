// Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  FaTruck, 
  FaCreditCard, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaUser,
  FaMoneyBillWave,
  FaUniversity,
  FaUpload,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

/**
 * المدن المصرية الرئيسية
 */
const EGYPT_CITIES = [
  'القاهرة',
  'الإسكندرية',
  'الجيزة',
  'شبرا الخيمة',
  'بورسعيد',
  'السويس',
  'المحلة الكبرى',
  'المنصورة',
  'طنطا',
  'أسيوط',
  'الفيوم',
  'الزقازيق',
  'الإسماعيلية',
  'كفر الشيخ',
  'دمياط',
  'دمنهور',
  'بني سويف',
  'المنيا',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'العريش',
  'الغردقة',
  'مرسى مطروح'
].sort();

/**
 * صفحة إتمام الطلب
 */
const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transferImage, setTransferImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    district: '',
    landmark: '',
    paymentMethod: 'bank_transfer',
    notes: ''
  });

  // حساب المجموع والضريبة
  const subtotal = cartTotal || 0;
  const tax = subtotal * 0.14; // 14% ضريبة في مصر
  const codFee = 20; // رسوم الدفع عند الاستلام
  const total = subtotal + tax + (formData.paymentMethod === 'cod' ? codFee : 0);

  /**
   * معالجة تغيير الحقول
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * معالجة رفع صورة التحويل
   */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // التحقق من حجم الصورة (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت');
      return;
    }

    // التحقق من نوع الصورة
    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار صورة صالحة (JPG, PNG)');
      return;
    }

    setTransferImage(file);
    
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
    setTransferImage(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  /**
   * تنظيف رقم الهاتف
   */
  const cleanPhoneNumber = (phone) => {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  };

  /**
   * إنشاء رقم طلب فريد
   */
  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}${month}${day}-${random}`;
  };

  /**
   * حفظ الطلب في LocalStorage
   */
  const saveOrderLocally = () => {
    const cleanPhone = cleanPhoneNumber(formData.phone);
    
    // تحويل صورة التحويل إلى Base64 إذا وجدت
    let receiptBase64 = null;
    if (transferImage && imagePreview) {
      receiptBase64 = imagePreview;
    }

    const newOrder = {
      id: Date.now(),
      order_number: generateOrderNumber(),
      date: new Date().toISOString(),
      status: 'pending',
      payment_status: 'pending',
      payment_method: formData.paymentMethod,
      customer: {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: cleanPhone
      },
      shipping: {
        address: formData.address.trim(),
        city: formData.city.trim(),
        district: formData.district?.trim() || null,
        landmark: formData.landmark?.trim() || null
      },
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        image: item.image || null
      })),
      totals: {
        subtotal: subtotal,
        tax: tax,
        cod_fee: formData.paymentMethod === 'cod' ? codFee : 0,
        total: total
      },
      notes: formData.notes?.trim() || null,
      receipt: receiptBase64,
      user_id: user?.id || null
    };

    // جلب الطلبات الموجودة
    const existingOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
    
    // إضافة الطلب الجديد
    existingOrders.push(newOrder);
    
    // حفظ في LocalStorage
    localStorage.setItem('local_orders', JSON.stringify(existingOrders));
    
    // حفظ آخر طلب للمستخدم
    localStorage.setItem('last_order', JSON.stringify(newOrder));
    
    return newOrder;
  };

  /**
   * معالجة تقديم النموذج
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من السلة
    if (cartItems.length === 0) {
      toast.error('سلة التسوق فارغة');
      return;
    }

    // التحقق من البيانات المطلوبة
    if (!formData.name?.trim()) {
      toast.error('الاسم مطلوب');
      return;
    }

    if (!formData.email?.trim()) {
      toast.error('البريد الإلكتروني مطلوب');
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('البريد الإلكتروني غير صالح');
      return;
    }

    if (!formData.phone?.trim()) {
      toast.error('رقم الهاتف مطلوب');
      return;
    }

    // التحقق من صحة رقم الهاتف المصري
    const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    const cleanPhone = cleanPhoneNumber(formData.phone);
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('رقم الهاتف غير صالح (يجب أن يبدأ بـ 010, 011, 012, 015 ويتكون من 11 رقم)');
      return;
    }

    if (!formData.address?.trim()) {
      toast.error('العنوان مطلوب');
      return;
    }

    if (!formData.city?.trim()) {
      toast.error('المدينة مطلوبة');
      return;
    }

    // التحقق من صورة التحويل إذا كانت طريقة الدفع تحويل بنكي
    if (formData.paymentMethod === 'bank_transfer' && !transferImage) {
      toast.error('الرجاء رفع صورة إيصال التحويل البنكي');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    // محاكاة تقدم التحميل
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // ✅ إنشاء FormData
      const formDataToSend = new FormData();
      
      // إضافة كل منتج على حدة
      cartItems.forEach((item, index) => {
        formDataToSend.append(`items[${index}][product_id]`, item.id);
        formDataToSend.append(`items[${index}][quantity]`, item.quantity);
        formDataToSend.append(`items[${index}][price]`, item.price);
      });

      // إضافة معلومات العميل
      formDataToSend.append('customer_name', formData.name.trim());
      formDataToSend.append('customer_email', formData.email.trim().toLowerCase());
      formDataToSend.append('customer_phone', cleanPhone);
      
      // إضافة عنوان الشحن
      formDataToSend.append('shipping_address', formData.address.trim());
      formDataToSend.append('shipping_city', formData.city.trim());
      if (formData.district?.trim()) {
        formDataToSend.append('shipping_district', formData.district.trim());
      }
      if (formData.landmark?.trim()) {
        formDataToSend.append('shipping_landmark', formData.landmark.trim());
      }

      // إضافة معلومات الدفع
      formDataToSend.append('payment_method', formData.paymentMethod);
      formDataToSend.append('subtotal', subtotal);
      formDataToSend.append('tax', tax);
      formDataToSend.append('cod_fee', formData.paymentMethod === 'cod' ? codFee : 0);
      formDataToSend.append('total_amount', total);
      
      // إضافة الملاحظات
      if (formData.notes?.trim()) {
        formDataToSend.append('notes', formData.notes.trim());
      }

      // إضافة صورة التحويل إذا وجدت
      if (transferImage) {
        formDataToSend.append('transfer_receipt', transferImage);
      }

      // ✅ المسار الرئيسي حسب طلبك: /api/v1/orders
      const mainEndpoint = '/api/v1/orders';
      
      // مسارات بديلة في حالة فشل المسار الرئيسي
      const fallbackEndpoints = [
        '/orders',
        '/api/orders',
        '/v1/orders',
        '/checkout',
        '/api/checkout'
      ];

      console.log(`محاولة إرسال الطلب إلى: ${mainEndpoint}`);
      
      try {
        // محاولة المسار الرئيسي أولاً
        const response = await axios.post(mainEndpoint, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 5000 // 5 ثواني timeout
        });
        
        // إذا نجح الطلب
        clearInterval(interval);
        setUploadProgress(100);
        
        toast.success(
          formData.paymentMethod === 'bank_transfer' 
            ? 'تم استلام طلبك وإيصال التحويل، سيتم مراجعة الطلب قريباً' 
            : 'تم إنشاء الطلب بنجاح'
        );
        
        clearCart();
        
        setTimeout(() => {
          navigate(`/order-success/${response.data.id || response.data.order_id || 'new'}`);
        }, 1000);
        
      } catch (mainError) {
        // إذا فشل المسار الرئيسي بـ 404، جرب المسارات البديلة
        if (mainError.response?.status === 404) {
          console.log('المسار الرئيسي غير موجود، جرب المسارات البديلة...');
          
          let fallbackSuccess = false;
          
          for (const endpoint of fallbackEndpoints) {
            try {
              console.log(`محاولة إرسال الطلب إلى: ${endpoint}`);
              const response = await axios.post(endpoint, formDataToSend, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                timeout: 5000
              });
              
              clearInterval(interval);
              setUploadProgress(100);
              
              toast.success(
                formData.paymentMethod === 'bank_transfer' 
                  ? 'تم استلام طلبك وإيصال التحويل، سيتم مراجعة الطلب قريباً' 
                  : 'تم إنشاء الطلب بنجاح'
              );
              
              clearCart();
              
              setTimeout(() => {
                navigate(`/order-success/${response.data.id || response.data.order_id || 'new'}`);
              }, 1000);
              
              fallbackSuccess = true;
              break;
              
            } catch (fallbackError) {
              if (fallbackError.response?.status === 404) {
                console.log(`المسار ${endpoint} غير موجود، جرب التالي...`);
                continue;
              }
              // إذا كان خطأ غير 404، نرميه للـ catch الخارجي
              throw fallbackError;
            }
          }
          
          // إذا فشلت كل المسارات البديلة
          if (!fallbackSuccess) {
            console.log('جميع مسارات API غير متاحة، استخدام التخزين المحلي');
            
            const savedOrder = saveOrderLocally();
            
            clearInterval(interval);
            setUploadProgress(100);
            
            toast.success('تم حفظ طلبك بنجاح (وضع التطوير)', {
              icon: '💾',
              duration: 5000
            });
            
            clearCart();
            
            setTimeout(() => {
              navigate(`/order-success/${savedOrder.id}`);
            }, 1500);
          }
          
        } else if (mainError.response?.status === 422) {
          // أخطاء التحقق
          const errors = mainError.response.data.errors;
          if (errors) {
            Object.keys(errors).forEach(field => {
              const messages = Array.isArray(errors[field]) ? errors[field] : [errors[field]];
              messages.forEach(msg => toast.error(msg));
            });
          } else {
            toast.error('البيانات المرسلة غير صالحة');
          }
          clearInterval(interval);
          
        } else {
          // أخطاء أخرى
          throw mainError;
        }
      }

    } catch (error) {
      clearInterval(interval);
      console.error('خطأ في إنشاء الطلب:', error);
      
      if (error.response?.status === 401) {
        toast.error('يرجى تسجيل الدخول أولاً');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('ليس لديك صلاحية إنشاء طلب');
      } else if (error.response?.status === 422) {
        // تم معالجتها بالفعل
      } else {
        // في حالة أي خطأ آخر، نحفظ محلياً
        console.log('حدث خطأ غير متوقع، حفظ محلياً');
        
        const savedOrder = saveOrderLocally();
        
        toast.success('تم حفظ طلبك محلياً للاختبار', {
          icon: '💾',
          duration: 5000
        });
        
        clearCart();
        
        setTimeout(() => {
          navigate(`/order-success/${savedOrder.id}`);
        }, 1500);
      }
      
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  /**
   * تنسيق السعر
   */
  const formatPrice = (price) => {
    if (!price && price !== 0) return '0';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '0';
    return numPrice.toFixed(2).toLocaleString('ar-EG');
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <FaCreditCard className="text-primary-600" />
          إتمام الطلب
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <p className="text-xl text-gray-600 mb-4">سلة التسوق فارغة</p>
            <Link 
              to="/products" 
              className="bg-gradient-to-l from-primary-600 to-skin-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-skin-700 transition-all inline-block"
            >
              تسوق الآن
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8" noValidate>
            {/* معلومات الشحن */}
            <div className="lg:col-span-2 space-y-6">
              {/* المعلومات الشخصية */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FaUser className="text-primary-600" />
                  المعلومات الشخصية
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل *
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="محمد أحمد"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* عنوان الشحن - مصري */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary-600" />
                  عنوان الشحن (مصر)
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف المحمول *
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pr-10 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        placeholder="01012345678"
                        dir="ltr"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">مثال: 01012345678</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        المدينة *
                      </label>
                      <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all bg-white"
                      >
                        <option value="">اختر المدينة</option>
                        {EGYPT_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                        الحي / المنطقة
                      </label>
                      <input
                        id="district"
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        placeholder="مصر الجديدة"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان بالتفصيل *
                    </label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="الشارع، رقم المبنى، الشقة"
                    />
                  </div>

                  <div>
                    <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
                      علامة مميزة قريبة
                    </label>
                    <input
                      id="landmark"
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="بجوار مسجد، مدرسة، ..."
                    />
                  </div>
                </div>
              </div>

              {/* طريقة الدفع - مصرية */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FaMoneyBillWave className="text-primary-600" />
                  طريقة الدفع
                </h2>
                
                <div className="space-y-4">
                  <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.paymentMethod === 'bank_transfer' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-200 hover:border-primary-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleChange}
                      className="ml-3 mt-1 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FaUniversity className="text-primary-600" />
                        <span className="font-medium">تحويل بنكي</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        بنك مصر - حساب رقم: 1234-5678-9012-3456
                      </p>
                      <p className="text-sm text-gray-600">
                        IBAN: EG12 3456 7890 1234 5678 9012 3456
                      </p>
                    </div>
                  </label>

                  {/* رفع صورة التحويل */}
                  {formData.paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        صورة إيصال التحويل *
                      </label>
                      
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                          <FaUpload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                          <p className="text-gray-600 mb-2">اسحب وأفلت الصورة هنا أو اضغط للاختيار</p>
                          <p className="text-sm text-gray-500 mb-3">JPG, PNG - الحد الأقصى 5 ميجابايت</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="transfer-image"
                          />
                          <label
                            htmlFor="transfer-image"
                            className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700 transition-colors"
                          >
                            اختيار صورة
                          </label>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="إيصال التحويل"
                            className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <FaTimesCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}

                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>جاري الرفع...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {uploadProgress === 100 && (
                        <div className="mt-3 flex items-center gap-2 text-green-600">
                          <FaCheckCircle />
                          <span>تم رفع الصورة بنجاح</span>
                        </div>
                      )}
                    </div>
                  )}

                  <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-200 hover:border-primary-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="ml-3 mt-1 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FaMoneyBillWave className="text-green-600" />
                        <span className="font-medium">الدفع عند الاستلام</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        ادفع نقداً عند استلام الطلب (رسوم إضافية 20 ج.م)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* ملاحظات إضافية */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6">ملاحظات إضافية</h2>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                  placeholder="أي ملاحظات إضافية للطلب (اختياري)"
                />
              </div>
            </div>

            {/* ملخص الطلب */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)} ج.م
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المجموع الفرعي</span>
                      <span className="font-medium">{formatPrice(subtotal)} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشحن</span>
                      <span className="text-green-600 font-medium">مجاني</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الضريبة (14%)</span>
                      <span className="font-medium">{formatPrice(tax)} ج.م</span>
                    </div>
                    {formData.paymentMethod === 'cod' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">رسوم الدفع عند الاستلام</span>
                        <span className="font-medium">{codFee} ج.م</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold">الإجمالي</span>
                        <span className="text-2xl font-bold text-primary-600">
                          {formatPrice(total)} ج.م
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-l from-primary-600 to-skin-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-skin-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {uploadProgress > 0 ? `جاري ${uploadProgress}%` : 'جاري إنشاء الطلب...'}
                    </span>
                  ) : 'تأكيد الطلب'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  بإتمام الطلب، أنت توافق على{' '}
                  <Link 
                    to="/terms" 
                    className="text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                  >
                    الشروط والأحكام
                  </Link>
                </p>

                {/* معلومات بنكية إضافية */}
                {formData.paymentMethod === 'bank_transfer' && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">معلومات التحويل البنكي</h3>
                    <p className="text-sm text-blue-700 mb-1">بنك مصر</p>
                    <p className="text-sm text-blue-700 mb-1">رقم الحساب: 1234-5678-9012-3456</p>
                    <p className="text-sm text-blue-700">IBAN: EG12 3456 7890 1234 5678 9012 3456</p>
                  </div>
                )}

                {/* رسالة وضع التطوير */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <p className="text-xs text-yellow-700">
                    ⚡ وضع التطوير: سيتم حفظ الطلب محلياً
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;