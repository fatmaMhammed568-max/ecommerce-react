import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../components/cards/ProductCard';
import CategoryCard from '../../components/cards/CategoryCard';
import Loader from '../../components/common/Loader';
import { FiArrowLeft } from 'react-icons/fi';
import { FaLeaf, FaHeart, FaShieldAlt, FaTruck, FaStar } from 'react-icons/fa';
import homeService from '../../services/homeService';
import toast from 'react-hot-toast';

/**
 * أنيميشن للعناصر
 */
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

/**
 * أنيميشن للحاوية مع تأخير بين العناصر
 */
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * قائمة المميزات
 */
const FEATURES = [
  { icon: FaLeaf, title: 'منتجات طبيعية', desc: 'مكونات طبيعية 100% خالية من المواد الكيميائية' },
  { icon: FaHeart, title: 'آمنة للبشرة', desc: 'منتجات مناسبة لجميع أنواع البشرة' },
  { icon: FaShieldAlt, title: 'معتمدة ومضمونة', desc: 'جميع المنتجات حاصلة على شهادات الجودة' },
  { icon: FaTruck, title: 'شحن سريع', desc: 'توصيل سريع لجميع المدن خلال 24 ساعة' }
];

/**
 * الصفحة الرئيسية
 */
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * جلب البيانات عند تحميل الصفحة
   */
  useEffect(() => {
    fetchHomeData();
  }, []);

  /**
   * جلب جميع بيانات الصفحة الرئيسية
   */
  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // جلب البيانات بالتوازي
      const [featured, best, newArrivalsData, cats] = await Promise.all([
        homeService.getFeaturedProducts(4),
        homeService.getBestSellers(2),
        homeService.getNewArrivals(2),
        homeService.getHomeCategories(6)
      ]);

      setFeaturedProducts(featured);
      setBestSellers(best);
      setNewArrivals(newArrivalsData);
      setCategories(cats);

    } catch (error) {
      console.error('خطأ في جلب بيانات الصفحة الرئيسية:', error);
      toast.error('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="جاري تحميل الصفحة الرئيسية..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50" dir="rtl">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-l from-primary-600 via-primary-500 to-skin-500 text-white overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                اكتشفي <span className="text-yellow-300">جمالكِ</span> الطبيعي
              </h1>
              <p className="text-xl mb-8 text-gray-100 leading-relaxed">
                منتجات عناية بالبشرة طبيعية وعضوية 100%، مختارة بعناية لبشرة صحية ومشرقة. 
                انضمي إلى آلاف النساء اللواتي وثقن بنا.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/products" 
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-white/50"
                  aria-label="تسوق الآن"
                >
                  تسوقي الآن
                  <FiArrowLeft aria-hidden="true" />
                </Link>
                <Link 
                  to="/about" 
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
                  aria-label="تعرف علينا"
                >
                  تعرفي علينا
                </Link>
              </div>

              {/* إحصائيات سريعة */}
              <div className="flex gap-8 mt-12">
                <div>
                  <p className="text-3xl font-bold">+5000</p>
                  <p className="text-sm opacity-90">عميلة سعيدة</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">+200</p>
                  <p className="text-sm opacity-90">منتج طبيعي</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-sm opacity-90">سنوات خبرة</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="منتجات عناية بالبشرة"
                className="rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                loading="eager"
              />
              
              {/* شارة عائمة */}
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-4 rounded-2xl shadow-xl">
                <p className="font-bold text-lg">توصيل مجاني</p>
                <p className="text-sm text-gray-600">للطلبات فوق 200 ر.س</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* موجة سفلية */}
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="white" fillOpacity="0.1"/>
          </svg>
        </div>
      </section>

      {/* المميزات */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            {FEATURES.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center group"
                >
                  <div className="bg-gradient-to-br from-primary-50 to-skin-50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-12 h-12 text-primary-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* الأقسام */}
      {categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <motion.div 
              className="flex justify-between items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">تسوقي حسب الأقسام</h2>
                <p className="text-gray-600">استعرضي منتجاتنا المتنوعة حسب احتياجات بشرتك</p>
              </div>
              <Link 
                to="/categories" 
                className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-3 py-2"
                aria-label="عرض جميع الأقسام"
              >
                عرض الكل
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              {categories.map((category) => (
                <motion.div key={category.id} variants={fadeInUp}>
                  <CategoryCard category={category} variant="grid" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* المنتجات المميزة */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <motion.div 
              className="flex justify-between items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">منتجات مميزة</h2>
                <p className="text-gray-600">اخترنا لكِ أفضل المنتجات الأكثر طلباً</p>
              </div>
              <Link 
                to="/products" 
                className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-3 py-2"
                aria-label="عرض جميع المنتجات"
              >
                عرض الكل
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={fadeInUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Banner ترويجي */}
      <section className="py-16 bg-gradient-to-l from-primary-600 to-skin-600">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                خصم 30% على أول طلبية
              </h2>
              <p className="text-xl mb-8 opacity-90">
                اشتركي في النشرة البريدية واحصلي على خصم 30% على أول طلبية لكِ
              </p>
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="newsletter-email" className="sr-only">البريد الإلكتروني</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="أدخلي بريدك الإلكتروني"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                  aria-label="البريد الإلكتروني للاشتراك في النشرة البريدية"
                />
                <button 
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
                  aria-label="اشتراك في النشرة البريدية"
                >
                  اشتراك
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="عرض خاص"
                className="rounded-3xl shadow-2xl"
                loading="lazy"
              />
              
              {/* دائرة خصم */}
              <div className="absolute -top-6 -right-6 bg-yellow-400 text-gray-900 w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold animate-pulse">
                <span className="text-sm">خصم</span>
                <span className="text-3xl">30%</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* الأكثر مبيعاً */}
      {bestSellers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <motion.div 
              className="flex justify-between items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">الأكثر مبيعاً</h2>
                <p className="text-gray-600">منتجات نالت إعجاب آلاف النساء</p>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {bestSellers.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* أحدث المنتجات */}
      {newArrivals.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <motion.div 
              className="flex justify-between items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">أحدث المنتجات</h2>
                <p className="text-gray-600">تعرفي على أحدث إضافاتنا</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {newArrivals.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* آراء العملاء */}
      {bestSellers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-2">ماذا قالوا عنا؟</h2>
              <p className="text-gray-600">آلاف النساء وثقن بنا وجربن منتجاتنا</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* هنا هتيجي البيانات من API */}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;