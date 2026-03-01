import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';

/**
 * صور افتراضية مناسبة للعناية بالبشرة
 */
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1596462841491-eshd8f8e5b5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1612817288484-6f916006741a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
];

/**
 * التدرجات اللونية المتاحة
 */
const GRADIENTS = [
  'from-pink-500 to-orange-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-teal-500',
  'from-blue-500 to-purple-500',
  'from-yellow-500 to-red-500',
  'from-indigo-500 to-purple-500'
];

/**
 * متغيرات الحركة
 */
const ANIMATION_VARIANTS = {
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
};

/**
 * بطاقة عرض القسم
 */
const CategoryCard = ({ 
  category, 
  variant = 'grid',
  onFavorite,
  isFavorited = false,
  showProductCount = true,
  lazyLoad = true
}) => {
  // حالات المكون
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isFavorited);

  /**
   * الحصول على رابط الصورة
   * @returns {string} رابط الصورة
   */
  const getImageUrl = () => {
    // إذا كان هناك خطأ في الصورة السابقة
    if (imageError) {
      return getDefaultImage();
    }

    if (category.image) {
      // إذا كانت الصورة من API
      return category.image.startsWith('http') 
        ? category.image 
        : `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${category.image}`;
    }
    
    return getDefaultImage();
  };

  /**
   * الحصول على صورة افتراضية
   * @returns {string} رابط الصورة الافتراضية
   */
  const getDefaultImage = () => {
    // استخدام معرف القسم لاختيار صورة افتراضية ثابتة
    const index = (category.id % DEFAULT_IMAGES.length);
    return DEFAULT_IMAGES[index];
  };

  /**
   * الحصول على التدرج اللوني
   * @returns {string} كلاس التدرج
   */
  const getGradient = () => {
    if (category.gradient) return category.gradient;
    return GRADIENTS[category.id % GRADIENTS.length];
  };

  /**
   * معالجة النقر على زر المفضلة
   * @param {React.MouseEvent} e - حدث النقر
   */
  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onFavorite?.(category.id);
  };

  /**
   * معالجة خطأ تحميل الصورة
   */
  const handleImageError = () => {
    setImageError(true);
  };

  /**
   * تنسيق عدد المنتجات
   * @param {number} count - عدد المنتجات
   * @returns {string} النص المنسق
   */
  const formatProductCount = (count) => {
    return count?.toLocaleString('ar-SA') || '0';
  };

  // ==================== تصميم مميز (Featured) ====================
  if (variant === 'featured') {
    return (
      <motion.div
        variants={ANIMATION_VARIANTS.item}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Link to={`/category/${category.id}`} className="block h-full">
          <div 
            className="relative h-80 rounded-3xl overflow-hidden cursor-pointer group shadow-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* الصورة */}
            <img
              src={getImageUrl()}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading={lazyLoad ? 'lazy' : 'eager'}
              onError={handleImageError}
            />
            
            {/* تدرج لوني */}
            <div className={`absolute inset-0 bg-gradient-to-t ${getGradient()} opacity-80 group-hover:opacity-90 transition-opacity`} />
            
            {/* المحتوى */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
              <motion.h3 
                className="text-3xl font-bold mb-4 text-shadow"
                animate={{ y: isHovered ? -10 : 0 }}
              >
                {category.name}
              </motion.h3>
              
              {showProductCount && category.products_count !== undefined && (
                <motion.p 
                  className="text-lg mb-6"
                  animate={{ y: isHovered ? -5 : 0 }}
                >
                  {formatProductCount(category.products_count)} منتج
                </motion.p>
              )}
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold shadow-lg"
              >
                اكتشفي المجموعة
              </motion.div>
            </div>

            {/* زر المفضلة */}
            {onFavorite && (
              <button
                onClick={handleFavorite}
                className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/40 transition-colors z-10"
                aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              >
                <FiHeart className={`w-5 h-5 transition-colors ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
                }`} />
              </button>
            )}

            {/* عدد المنتجات (بديل) */}
            {!showProductCount && category.products_count !== undefined && (
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                {formatProductCount(category.products_count)} منتج
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  // ==================== تصميم الشبكة (Grid) ====================
  if (variant === 'grid') {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Link to={`/category/${category.id}`} className="block h-full">
          <div 
            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative aspect-square overflow-hidden">
              <motion.img
                src={getImageUrl()}
                alt={category.name}
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.6 }}
                loading={lazyLoad ? 'lazy' : 'eager'}
                onError={handleImageError}
              />
              
              {/* تدرج متحرك */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                animate={{ opacity: isHovered ? 1 : 0.7 }}
              />
              
              {/* محتوى متحرك */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <motion.h3 
                  className="text-2xl font-bold text-white mb-2 text-shadow"
                  animate={{ y: isHovered ? -5 : 0 }}
                >
                  {category.name}
                </motion.h3>
                
                {showProductCount && category.products_count !== undefined && (
                  <motion.div
                    className="overflow-hidden"
                    animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
                  >
                    <p className="text-gray-200 text-sm mb-3">
                      {formatProductCount(category.products_count)} منتج
                    </p>
                  </motion.div>
                )}
                
                <motion.div 
                  className="flex items-center gap-2 text-white text-sm font-semibold"
                  animate={{ x: isHovered ? 0 : -20, opacity: isHovered ? 1 : 0 }}
                >
                  <span>استعرضي المنتجات</span>
                  <FiArrowLeft className="w-4 h-4" />
                </motion.div>
              </div>

              {/* زخارف خلفية */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* زر المفضلة */}
            {onFavorite && (
              <button
                onClick={handleFavorite}
                className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-lg z-10"
                aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              >
                <FiHeart className={`w-4 h-4 transition-colors ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`} />
              </button>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  // ==================== تصميم القائمة (List) ====================
  if (variant === 'list') {
    return (
      <motion.div
        whileHover={{ x: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Link to={`/category/${category.id}`}>
          <div className="group flex items-center gap-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative w-24 h-24 overflow-hidden flex-shrink-0">
              <img
                src={getImageUrl()}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading={lazyLoad ? 'lazy' : 'eager'}
                onError={handleImageError}
              />
              <div className={`absolute inset-0 bg-gradient-to-tr ${getGradient()} opacity-0 group-hover:opacity-30 transition-opacity`} />
            </div>
            
            <div className="flex-1 py-3 pl-3 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors truncate">
                {category.name}
              </h3>
              
              {category.description && (
                <p className="text-sm text-gray-600 line-clamp-1 mb-1">
                  {category.description}
                </p>
              )}
              
              {showProductCount && category.products_count !== undefined && (
                <p className="text-sm font-semibold">
                  <span className="text-primary-600">{formatProductCount(category.products_count)}</span>
                  <span className="text-gray-500 mr-1">منتج</span>
                </p>
              )}
            </div>
            
            <motion.div 
              className="pl-4 flex-shrink-0"
              animate={{ x: isHovered ? -5 : 0 }}
            >
              <FiArrowLeft className="w-5 h-5 text-primary-600" />
            </motion.div>

            {/* زر المفضلة */}
            {onFavorite && (
              <button
                onClick={handleFavorite}
                className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              >
                <FiHeart className={`w-4 h-4 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`} />
              </button>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  // ==================== تصميم مضغوط (Compact) ====================
  return (
    <motion.div whileHover={{ x: -3 }}>
      <Link to={`/category/${category.id}`}>
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={getImageUrl()}
              alt={category.name}
              className="w-full h-full object-cover"
              loading={lazyLoad ? 'lazy' : 'eager'}
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">
              {category.name}
            </h4>
            
            {showProductCount && category.products_count !== undefined && (
              <p className="text-xs text-gray-500">
                {formatProductCount(category.products_count)} منتج
              </p>
            )}
          </div>

          {/* زر المفضلة (صغير) */}
          {onFavorite && (
            <button
              onClick={handleFavorite}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
              aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            >
              <FiHeart className={`w-3 h-3 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`} />
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;