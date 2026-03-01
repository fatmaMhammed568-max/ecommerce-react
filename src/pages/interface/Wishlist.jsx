import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';  // ✅ استيراد useWishlist وليس Wishlist
import ProductCard from '../../components/cards/ProductCard';
import { FiHeart } from 'react-icons/fi';
import Loader from '../../components/common/Loader';

/**
 * صفحة المفضلة
 */
const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const { wishlist, loading } = useWishlist();

  // إذا كان المستخدم غير مسجل الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-12 bg-gray-50" dir="rtl">
        <div className="container-custom">
          <div className="text-center py-16">
            <FiHeart className="w-20 h-20 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              المفضلة متاحة للأعضاء فقط
            </h1>
            <p className="text-gray-600 mb-8">
              سجل دخولك أو أنشئ حساب جديد للاستفادة من خدمة المفضلة
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/login" 
                className="bg-gradient-to-l from-primary-600 to-skin-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-skin-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="تسجيل الدخول"
              >
                تسجيل دخول
              </Link>
              <Link 
                to="/register" 
                className="border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="إنشاء حساب جديد"
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // عرض مؤشر التحميل
  if (loading) {
    return <Loader text="جاري تحميل المفضلة..." />;
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50" dir="rtl">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">المفضلة</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <FiHeart className="w-20 h-20 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              المفضلة فارغة
            </h2>
            <p className="text-gray-600 mb-8">
              لم تقم بإضافة أي منتجات إلى المفضلة بعد
            </p>
            <Link 
              to="/products" 
              className="bg-gradient-to-l from-primary-600 to-skin-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-skin-700 transition-all inline-block focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="تصفح المنتجات"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <>
            {/* إحصائيات سريعة */}
            <div className="bg-white rounded-xl shadow p-4 mb-6">
              <p className="text-gray-600">
                لديك <span className="font-bold text-primary-600">{wishlist.length}</span> {wishlist.length === 1 ? 'منتج' : 'منتجات'} في المفضلة
              </p>
            </div>

            {/* قائمة المنتجات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;