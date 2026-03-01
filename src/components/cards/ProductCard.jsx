import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { FaStar, FaRegStar } from 'react-icons/fa';

/**
 * مكون بطاقة المنتج
 * @param {Object} props - خصائص المكون
 * @param {Object} props.product - بيانات المنتج
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // التحقق من صحة بيانات المنتج
  const validProduct = {
    id: product.id || 0,
    name: product.name || 'منتج بدون اسم',
    price: product.price || 0,
    compare_price: product.compare_price || 0,
    main_image: product.main_image || '',
    quantity: product.quantity || 0,
    rating: product.rating || 4.5,
    reviews_count: product.reviews_count || 0,
    ...product
  };

  /**
   * معالجة إضافة المنتج للسلة
   * @param {React.MouseEvent} e - حدث النقر
   */
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (validProduct.quantity > 0) {
      addToCart(validProduct, 1);
    }
  };

  /**
   * معالجة تبديل حالة المفضلة
   * @param {React.MouseEvent} e - حدث النقر
   */
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(validProduct.id)) {
      removeFromWishlist(validProduct.id);
    } else {
      addToWishlist(validProduct);
    }
  };

  /**
   * معالجة خطأ تحميل الصورة
   * @param {React.SyntheticEvent} e - حدث الخطأ
   */
  const handleImageError = (e) => {
    e.target.src = getPlaceholderImage();
  };

  /**
   * الحصول على صورة بديلة
   * @returns {string} رابط الصورة البديلة
   */
  const getPlaceholderImage = () => {
    return 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(validProduct.name);
  };

  /**
   * تجهيز رابط الصورة
   * @returns {string} رابط الصورة الكامل
   */
  const getImageUrl = () => {
    if (validProduct.main_image) {
      if (validProduct.main_image.startsWith('http')) return validProduct.main_image;
      return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${validProduct.main_image}`;
    }
    return getPlaceholderImage();
  };

  /**
   * حساب نسبة التخفيض
   * @returns {number} نسبة التخفيض
   */
  const calculateDiscount = () => {
    const { compare_price, price } = validProduct;
    if (compare_price && compare_price > price) {
      return Math.round(((compare_price - price) / compare_price) * 100);
    }
    return 0;
  };

  /**
   * تنسيق السعر
   * @param {number} price - السعر
   * @returns {string} السعر المنسق
   */
  const formatPrice = (price) => {
    return price?.toLocaleString('ar-SA') || '0';
  };

  // حساب القيم المشتقة
  const discountPercentage = calculateDiscount();
  const isFavorite = isInWishlist(validProduct.id);
  const rating = validProduct.rating || 4.5;
  const reviewsCount = validProduct.reviews_count || 0;
  const isInStock = validProduct.quantity > 0;

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
      <Link to={`/product/${validProduct.id}`} className="block">
        {/* صورة المنتج */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={getImageUrl()}
            alt={validProduct.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={handleImageError}
            loading="lazy"
          />
          
          {/* شارة التخفيض */}
          {discountPercentage > 0 && (
            <div className="absolute top-4 right-4 bg-skin-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              خصم {discountPercentage}%
            </div>
          )}

          {/* شارة عدم التوفر */}
          {!isInStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold transform -rotate-12">
                نفد من المخزون
              </span>
            </div>
          )}

          {/* زر المفضلة */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isFavorite 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
            aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          >
            <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* أزرار التفاعل (تظهر عند التحويم) */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                isInStock
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              <FiShoppingCart className="w-5 h-5" />
              {isInStock ? 'أضف للسلة' : 'غير متوفر'}
            </button>
          </div>
        </div>

        {/* معلومات المنتج */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
            {validProduct.name}
          </h3>

          {/* التقييم */}
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 ml-2">
              {[...Array(5)].map((_, index) => {
                const starNumber = index + 1;
                return starNumber <= Math.floor(rating) ? (
                  <FaStar key={index} className="w-4 h-4" />
                ) : starNumber <= Math.ceil(rating) && rating % 1 !== 0 ? (
                  <FaStar key={index} className="w-4 h-4 text-yellow-200" /> // نصف نجمة مبسطة
                ) : (
                  <FaRegStar key={index} className="w-4 h-4" />
                );
              })}
            </div>
            <span className="text-sm text-gray-600">
              ({reviewsCount.toLocaleString('ar-SA')} {reviewsCount === 1 ? 'تقييم' : 'تقييمات'})
            </span>
          </div>

          {/* السعر */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(validProduct.price)} ر.س
            </span>
            {validProduct.compare_price > validProduct.price && (
              <span className="text-gray-400 line-through">
                {formatPrice(validProduct.compare_price)} ر.س
              </span>
            )}
          </div>

          {/* مؤشر الكمية */}
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-sm ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
              {isInStock ? (
                validProduct.quantity < 10 ? `متوفر (${validProduct.quantity} قطع)` : 'متوفر'
              ) : (
                'غير متوفر'
              )}
            </span>
          </div>

          {/* شارة التوصيل المجاني */}
          {validProduct.price > 200 && (
            <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block">
              توصيل مجاني
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;