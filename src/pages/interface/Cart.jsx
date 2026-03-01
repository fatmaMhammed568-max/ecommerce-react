import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FaTrashAlt, 
  FaMinus, 
  FaPlus, 
  FaArrowLeft,
  FaShoppingCart,
  FaCreditCard,
  FaTruck,
  FaShieldAlt
} from 'react-icons/fa';
import { BiSolidOffer } from 'react-icons/bi';
import toast from 'react-hot-toast';

/**
 * صفحة سلة التسوق
 */
const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /**
   * معالجة النقر على زر إتمام الطلب
   */
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('الرجاء تسجيل الدخول أولاً');
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  /**
   * زيادة كمية المنتج
   */
  const handleIncrement = (item) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  /**
   * تقليل كمية المنتج
   */
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  /**
   * تنسيق السعر بشكل آمن
   */
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0';
    
    // تحويل النص إلى رقم
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // التحقق من صحة الرقم
    if (isNaN(numPrice)) return '0';
    
    // تنسيق الرقم
    return numPrice.toFixed(2).toLocaleString('ar-EG');
  };

  /**
   * صورة افتراضية آمنة
   */
  const DEFAULT_IMAGE = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'%3E%3Crect width=\'200\' height=\'200\' fill=\'%23f3f4f6\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'16\' fill=\'%239ca3af\'%3Eمنتج%3C/text%3E%3C/svg%3E';

  // عرض صفحة السلة الفارغة
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white" dir="rtl">
        <div className="container-custom">
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <FaShoppingCart className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">سلتك فارغة</h2>
            <p className="text-gray-600 mb-8">
              لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
            </p>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-gradient-to-l from-primary-600 to-skin-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-skin-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <FaShoppingCart className="w-5 h-5" />
              تسوق الآن
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // حساب الضريبة والإجمالي
  const subtotal = cartTotal;
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      <div className="container-custom">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <FaShoppingCart className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">سلة التسوق</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* قائمة المنتجات */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {cartItems.map((item, index) => {
                const itemTotal = (item.price * item.quantity);
                
                return (
                  <div
                    key={item.id}
                    className={`p-6 flex flex-col sm:flex-row gap-6 ${
                      index !== cartItems.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    {/* صورة المنتج */}
                    <Link to={`/product/${item.id}`} className="sm:w-32 flex-shrink-0">
                      <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={item.main_image || item.image || DEFAULT_IMAGE}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = DEFAULT_IMAGE;
                          }}
                          loading="lazy"
                        />
                      </div>
                    </Link>

                    {/* معلومات المنتج */}
                    <div className="flex-1">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-lg font-semibold hover:text-primary-600 transition-colors mb-2">
                          {item.name}
                        </h3>
                      </Link>
                      
                      {/* السعر والخصم */}
                      <div className="mb-4">
                        <span className="text-xl font-bold text-primary-600">
                          {formatPrice(item.price)} ج.م
                        </span>
                        {item.compare_price && item.compare_price > item.price && (
                          <span className="mr-2 text-sm text-gray-400 line-through">
                            {formatPrice(item.compare_price)} ج.م
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 justify-between">
                        {/* كمية المنتج */}
                        <div className="flex items-center border-2 border-gray-200 rounded-lg">
                          <button
                            onClick={() => handleDecrement(item)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="تقليل الكمية"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus className="w-3 h-3" />
                          </button>
                          <span className="w-12 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                            aria-label="زيادة الكمية"
                          >
                            <FaPlus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* الإجمالي */}
                        <div className="text-left">
                          <p className="text-sm text-gray-500">الإجمالي</p>
                          <p className="text-lg font-bold text-primary-600">
                            {formatPrice(itemTotal)} ج.م
                          </p>
                        </div>

                        {/* زر الحذف */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-2 hover:bg-red-50"
                          aria-label={`حذف ${item.name} من السلة`}
                        >
                          <FaTrashAlt className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* أزرار الإجراءات */}
              <div className="p-6 bg-gray-50 flex flex-wrap justify-between gap-4">
                <button
                  onClick={() => {
                    if (window.confirm('هل أنت متأكد من إفراغ السلة؟')) {
                      clearCart();
                      toast.success('تم إفراغ السلة');
                    }
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-4 py-2 flex items-center gap-2"
                >
                  <FaTrashAlt className="w-4 h-4" />
                  إفراغ السلة
                </button>
                <Link
                  to="/products"
                  className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-4 py-2"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  متابعة التسوق
                </Link>
              </div>
            </div>
          </div>

          {/* ملخص الطلب */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BiSolidOffer className="text-primary-600" />
                ملخص الطلب
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)} ج.م</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaTruck className="text-gray-400" />
                    الشحن
                  </span>
                  <span className="font-semibold text-green-600">مجاني</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaShieldAlt className="text-gray-400" />
                    الضريبة (15%)
                  </span>
                  <span className="font-semibold text-gray-900">{formatPrice(tax)} ج.م</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">الإجمالي</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatPrice(total)} ج.م
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">شامل الضريبة</p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-l from-primary-600 to-skin-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-skin-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                <FaCreditCard className="w-5 h-5" />
                إتمام الطلب
              </button>

              {/* طرق الدفع */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">طرق الدفع المتاحة</p>
                <div className="flex justify-center gap-4">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    Visa
                  </div>
                  <div className="w-12 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    MC
                  </div>
                  <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    Mada
                  </div>
                  <div className="w-12 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    PayPal
                  </div>
                </div>
              </div>

              {/* شارة الثقة */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">
                    الدفع آمن ومضمون. معلوماتك مشفرة ومحمية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;