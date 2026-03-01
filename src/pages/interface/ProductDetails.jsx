import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Loader from '../../components/common/Loader';
import ProductCard from '../../components/cards/ProductCard';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaMinus, 
  FaPlus,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaStar,
  FaStarHalf,
  FaRegStar,
  FaCheckCircle,
  FaBox
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import toast from 'react-hot-toast';
import productService from '../../services/productService';

/**
 * صفحة تفاصيل المنتج
 */
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // ✅ استخدام import.meta.env بدل process.env
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  /**
   * جلب تفاصيل المنتج عند تحميل الصفحة
   */
  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  /**
   * جلب تفاصيل المنتج من API
   */
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      // ✅ استخدام interface بدل dashboard للمستخدم العادي
      const response = await productService.getInterfaceProduct(id);
      console.log('Product details response:', response);
      
      if (response?.status) {
        setProduct(response.data);
        
        // جلب منتجات مشابهة
        if (response.data?.category_id) {
          const filters = { 
            category_id: response.data.category_id,
            per_page: 4,
            page: 1
          };
          
          const relatedResponse = await productService.getInterfaceProducts(filters);
          
          if (relatedResponse?.status) {
            // استثناء المنتج الحالي
            const productsData = relatedResponse.data?.data || [];
            const filtered = productsData.filter(
              (p) => p.id !== response.data.id
            );
            setRelatedProducts(filtered.slice(0, 4));
          }
        }
      } else {
        toast.error('المنتج غير موجود');
        navigate('/products');
      }
    } catch (error) {
      console.error('خطأ في جلب المنتج:', error);
      toast.error(error.message || 'حدث خطأ في تحميل المنتج');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  /**
   * إضافة المنتج إلى السلة
   */
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success('تمت إضافة المنتج إلى السلة', {
        icon: '🛒',
        duration: 3000
      });
    }
  };

  /**
   * تبديل حالة المفضلة
   */
  const handleToggleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('تم إزالة المنتج من المفضلة', {
        icon: '❤️',
        duration: 3000
      });
    } else {
      addToWishlist(product);
      toast.success('تمت إضافة المنتج إلى المفضلة', {
        icon: '❤️',
        duration: 3000
      });
    }
  };

  /**
   * تغيير الكمية
   */
  const handleQuantityChange = (type) => {
    if (!product) return;
    
    if (type === 'increment' && quantity < (product.quantity || 10)) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  /**
   * عرض النجوم حسب التقييم
   */
  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 w-5 h-5" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalf key={i} className="text-yellow-400 w-5 h-5" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 w-5 h-5" />);
      }
    }
    return stars;
  };

  /**
   * الحصول على رابط الصورة
   */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x600/0284c7/ffffff?text=Product';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}/${imagePath}`.replace(/([^:]\/)\/+/g, '$1');
  };

  if (loading) {
    return <Loader text="جاري تحميل المنتج..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <FaBox className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-600 mb-4">المنتج غير موجود</p>
          <button 
            onClick={() => navigate('/products')}
            className="text-primary-600 hover:text-primary-700 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-4 py-2"
          >
            العودة إلى المنتجات
          </button>
        </div>
      </div>
    );
  }

  const isFavorite = product ? isInWishlist(product.id) : false;
  
  // معالجة الصور
  let images = [];
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    images = product.images.map(img => img.url || img);
  } else if (product.main_image) {
    images = [product.main_image];
  } else if (product.image) {
    images = [product.image];
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      <div className="container-custom">
        {/* تفاصيل المنتج */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* معرض الصور */}
            <div>
              <div className="mb-4 aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={images.length > 0 ? getImageUrl(images[selectedImage]) : getImageUrl(product.main_image)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600/0284c7/ffffff?text=Product';
                  }}
                  loading="eager"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        selectedImage === index ? 'border-primary-600' : 'border-transparent'
                      }`}
                      aria-label={`عرض الصورة ${index + 1}`}
                    >
                      <img 
                        src={getImageUrl(img)} 
                        alt={`صورة ${index + 1} للمنتج`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150x150/0284c7/ffffff?text=Image';
                        }}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* معلومات المنتج */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* التقييم */}
              {product.rating !== undefined && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1" aria-label={`تقييم ${product.rating} من 5 نجوم`}>
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviews_count?.toLocaleString('ar-EG') || 0} تقييم)
                  </span>
                </div>
              )}

              {/* SKU */}
              {product.sku && (
                <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                  <MdVerified className="text-primary-600" />
                  كود المنتج: {product.sku}
                </p>
              )}

              {/* السعر */}
              <div className="mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-4xl font-bold text-primary-600">
                    {product.price?.toLocaleString('ar-EG')} ج.م
                  </span>
                  {product.compare_price && product.compare_price > product.price && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        {product.compare_price?.toLocaleString('ar-EG')} ج.م
                      </span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                        وفر {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">شامل الضريبة</p>
              </div>

              {/* الوصف */}
              {product.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">الوصف</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* المميزات */}
              {product.features && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">المميزات</h3>
                  <ul className="space-y-2">
                    {product.features.split('\n').map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* الكمية */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">الكمية</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrement')}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                      aria-label="تقليل الكمية"
                    >
                      <FaMinus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center font-semibold text-lg" aria-label={`الكمية: ${quantity}`}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange('increment')}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= (product.quantity || 10)}
                      aria-label="زيادة الكمية"
                    >
                      <FaPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {(product.quantity || 10)} قطعة متوفرة
                  </span>
                </div>
              </div>

              {/* أزرار الإجراء */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-l from-primary-600 to-skin-600 text-white px-6 py-4 rounded-xl hover:from-primary-700 hover:to-skin-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  disabled={product.quantity === 0}
                  aria-label="إضافة إلى السلة"
                >
                  <FaShoppingCart className="w-5 h-5" />
                  أضف إلى السلة
                </button>
                <button 
                  onClick={handleToggleWishlist}
                  className={`p-4 border-2 rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    isFavorite 
                      ? 'border-red-500 bg-red-50 text-red-500' 
                      : 'border-gray-200 hover:border-primary-600'
                  }`}
                  aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                >
                  <FaHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* معلومات إضافية */}
              <div className="border-t border-gray-200 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <FaTruck className="w-6 h-6 text-primary-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">توصيل سريع</h4>
                      <p className="text-sm text-gray-600">خلال 2-3 أيام عمل</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <FaShieldAlt className="w-6 h-6 text-primary-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">منتج أصلي</h4>
                      <p className="text-sm text-gray-600">ضمان الجودة 100%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <FaUndo className="w-6 h-6 text-primary-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">إرجاع مجاني</h4>
                      <p className="text-sm text-gray-600">خلال 14 يوم</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* منتجات مشابهة */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <FaBox className="text-primary-600" />
              منتجات مشابهة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;