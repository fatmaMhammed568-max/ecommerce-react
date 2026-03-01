import api from '../../src/api/axios'; 


class HomeService {
  /**
   * البيانات الافتراضية للصفحة الرئيسية في حالة فشل الاتصال
   * @returns {Object} البيانات الافتراضية
   * @private
   */
  getDefaultHomeData() {
    return {
      featuredProducts: [],
      bestSellers: [],
      newArrivals: [],
      categories: [],
      stats: {
        happyCustomers: 0,
        products: 0,
        yearsExperience: 0
      }
    };
  }

  /**
   * جلب جميع بيانات الصفحة الرئيسية دفعة واحدة
   * @returns {Promise<Object>} بيانات الصفحة الرئيسية
   */
  async getHomeData() {
    try {
      const response = await api.get('/home');
      
      // التحقق من صحة البيانات المستلمة
      if (!response.data) {
        console.warn('البيانات المستلمة من الخادم فارغة');
        return this.getDefaultHomeData();
      }

      return {
        featuredProducts: response.data.featuredProducts || [],
        bestSellers: response.data.bestSellers || [],
        newArrivals: response.data.newArrivals || [],
        categories: response.data.categories || [],
        stats: {
          happyCustomers: response.data.stats?.happyCustomers || 0,
          products: response.data.stats?.products || 0,
          yearsExperience: response.data.stats?.yearsExperience || 0
        }
      };
      
    } catch (error) {
      console.error('خطأ في جلب بيانات الصفحة الرئيسية:', error);
      
      // إرجاع بيانات افتراضية في حالة الخطأ
      return this.getDefaultHomeData();
    }
  }

  /**
   * جلب المنتجات المميزة
   * @param {number} limit - عدد المنتجات المطلوبة (الافتراضي: 8)
   * @returns {Promise<Array>} قائمة المنتجات المميزة
   */
  async getFeaturedProducts(limit = 8) {
    try {
      // التحقق من صحة المدخلات
      const validLimit = this.validateLimit(limit, 8);
      
      const response = await api.get('/api/v1/dashboard/products/featured', { 
        params: { limit: validLimit } 
      });
      
      return Array.isArray(response.data) ? response.data : [];
      
    } catch (error) {
      console.error('خطأ في جلب المنتجات المميزة:', error);
      return [];
    }
  }

  /**
   * جلب الأكثر مبيعاً
   * @param {number} limit - عدد المنتجات المطلوبة (الافتراضي: 4)
   * @returns {Promise<Array>} قائمة المنتجات الأكثر مبيعاً
   */
  async getBestSellers(limit = 4) {
    try {
      const validLimit = this.validateLimit(limit, 4);
      
      const response = await api.get('/api/v1/dashboard/products/best-sellers', { 
        params: { limit: validLimit } 
      });
      
      return Array.isArray(response.data) ? response.data : [];
      
    } catch (error) {
      console.error('خطأ في جلب المنتجات الأكثر مبيعاً:', error);
      return [];
    }
  }

  /**
   * جلب أحدث المنتجات
   * @param {number} limit - عدد المنتجات المطلوبة (الافتراضي: 4)
   * @returns {Promise<Array>} قائمة أحدث المنتجات
   */
  async getNewArrivals(limit = 4) {
    try {
      const validLimit = this.validateLimit(limit, 4);
      
      const response = await api.get('/api/v1/dashboard/products/new-arrivals', { 
        params: { limit: validLimit } 
      });
      
      return Array.isArray(response.data) ? response.data : [];
      
    } catch (error) {
      console.error('خطأ في جلب أحدث المنتجات:', error);
      return [];
    }
  }

  /**
   * جلب الأقسام للصفحة الرئيسية
   * @param {number} limit - عدد الأقسام المطلوبة (الافتراضي: 6)
   * @returns {Promise<Array>} قائمة الأقسام
   */
  async getHomeCategories(limit = 6) {
    try {
      const validLimit = this.validateLimit(limit, 6);
      
      const response = await api.get('/api/v1/dashboard/categories/home', { 
        params: { limit: validLimit } 
      });
      
      return Array.isArray(response.data) ? response.data : [];
      
    } catch (error) {
      console.error('خطأ في جلب الأقسام للصفحة الرئيسية:', error);
      return [];
    }
  }

  /**
   * التحقق من صحة قيمة الحد
   * @param {number} limit - القيمة المدخلة
   * @param {number} defaultValue - القيمة الافتراضية
   * @returns {number} القيمة الصالحة
   * @private
   */
  validateLimit(limit, defaultValue) {
    const num = Number(limit);
    return !isNaN(num) && num > 0 && num <= 50 ? num : defaultValue;
  }

  /**
   * جلب العروض الخاصة
   * @param {number} limit - عدد العروض المطلوبة (الافتراضي: 3)
   * @returns {Promise<Array>} قائمة العروض الخاصة
   */
  async getSpecialOffers(limit = 3) {
    try {
      const validLimit = this.validateLimit(limit, 3);
      
      const response = await api.get('/products/special-offers', { 
        params: { limit: validLimit } 
      });
      
      return Array.isArray(response.data) ? response.data : [];
      
    } catch (error) {
      console.error('خطأ في جلب العروض الخاصة:', error);
      return [];
    }
  }

  /**
   * جلب إحصائيات الموقع للصفحة الرئيسية
   * @returns {Promise<Object>} إحصائيات الموقع
   */
  async getSiteStats() {
    try {
      const response = await api.get('/stats');
      
      return {
        happyCustomers: response.data?.happyCustomers || 0,
        products: response.data?.products || 0,
        yearsExperience: response.data?.yearsExperience || 0,
        orders: response.data?.orders || 0,
        categories: response.data?.categories || 0
      };
      
    } catch (error) {
      console.error('خطأ في جلب إحصائيات الموقع:', error);
      
      // إرجاع إحصائيات افتراضية
      return {
        happyCustomers: 0,
        products: 0,
        yearsExperience: 0,
        orders: 0,
        categories: 0
      };
    }
  }

  /**
   * جلب التقييمات الأخيرة
   * @param {number} limit - عدد التقييمات المطلوبة (الافتراضي: 5)
   * @returns {Promise<Array>} قائمة التقييمات الأخيرة
   */
  async getLatestReviews(limit = 5) {
    try {
      const validLimit = this.validateLimit(limit, 5);
      
      const response = await api.get('/reviews/latest', { 
        params: { limit: validLimit } 
      });
      
      return Array.isArray(response.data) ? response.data : [];
      
    } catch (error) {
      console.error('خطأ في جلب التقييمات الأخيرة:', error);
      return [];
    }
  }

  /**
   * جلب المدونات الأخيرة
   * @param {number} limit - عدد المدونات المطلوبة (الافتراضي: 3)
   * @returns {Promise<Array>} قائمة المدونات الأخيرة
   */
  async getLatestBlogs(limit = 3) {
    try {
      const validLimit = this.validateLimit(limit, 3);
      
      const response = await api.get('/blogs/latest', { 
        params: { limit: validLimit } 
      });
      
      return Array.isArray(response.data) ? response.data : [];
      
    } catch (error) {
      console.error('خطأ في جلب المدونات الأخيرة:', error);
      return [];
    }
  }

  /**
   * جلب جميع بيانات الصفحة الرئيسية مرة واحدة (تحسين الأداء)
   * @returns {Promise<Object>} جميع بيانات الصفحة الرئيسية
   */
  async getAllHomeData() {
    try {
      // استخدام Promise.all لجلب جميع البيانات بشكل متوازي
      const [
        featuredProducts,
        bestSellers,
        newArrivals,
        categories,
        specialOffers,
        siteStats,
        latestReviews,
        latestBlogs
      ] = await Promise.allSettled([
        this.getFeaturedProducts(8),
        this.getBestSellers(4),
        this.getNewArrivals(4),
        this.getHomeCategories(6),
        this.getSpecialOffers(3),
        this.getSiteStats(),
        this.getLatestReviews(5),
        this.getLatestBlogs(3)
      ]);

      // معالجة النتائج (نجاح أو فشل كل طلب على حدة)
      return {
        featuredProducts: featuredProducts.status === 'fulfilled' ? featuredProducts.value : [],
        bestSellers: bestSellers.status === 'fulfilled' ? bestSellers.value : [],
        newArrivals: newArrivals.status === 'fulfilled' ? newArrivals.value : [],
        categories: categories.status === 'fulfilled' ? categories.value : [],
        specialOffers: specialOffers.status === 'fulfilled' ? specialOffers.value : [],
        stats: siteStats.status === 'fulfilled' ? siteStats.value : {
          happyCustomers: 0,
          products: 0,
          yearsExperience: 0,
          orders: 0,
          categories: 0
        },
        latestReviews: latestReviews.status === 'fulfilled' ? latestReviews.value : [],
        latestBlogs: latestBlogs.status === 'fulfilled' ? latestBlogs.value : []
      };
      
    } catch (error) {
      console.error('خطأ غير متوقع في جلب بيانات الصفحة الرئيسية:', error);
      return this.getDefaultHomeData();
    }
  }

  /**
   * البحث السريع في الصفحة الرئيسية
   * @param {string} query - نص البحث
   * @returns {Promise<Object>} نتائج البحث
   */
  async quickSearch(query) {
    try {
      if (!query?.trim()) {
        return {
          products: [],
          categories: [],
          blogs: []
        };
      }

      const response = await api.get('/search/quick', { 
        params: { q: query.trim() } 
      });
      
      return {
        products: response.data?.products || [],
        categories: response.data?.categories || [],
        blogs: response.data?.blogs || []
      };
      
    } catch (error) {
      console.error('خطأ في البحث السريع:', error);
      return {
        products: [],
        categories: [],
        blogs: []
      };
    }
  }
}

// تصدير نسخة واحدة من الخدمة
const homeService = new HomeService();
export default homeService;