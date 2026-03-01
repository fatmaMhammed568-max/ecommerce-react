import api from '../../src/api/axios';

class ProductService {
  getDefaultPaginatedData(perPage = 10) {
    return {
      current_page: 1,
      data: [],
      first_page_url: '',
      from: 0,
      last_page: 1,
      last_page_url: '',
      next_page_url: null,
      path: '',
      per_page: perPage,
      prev_page_url: null,
      to: 0,
      total: 0,
      links: []
    };
  }

  handleError(error, defaultMessage) {
    if (error.response) {
      throw new Error(error.response.data?.message || defaultMessage);
    } else if (error.request) {
      throw new Error('فشل الاتصال بالخادم');
    } else {
      throw new Error(error.message || defaultMessage);
    }
  }

  // ==================== لوحة التحكم (Dashboard) ====================

  /**
   * جلب كل المنتجات (للوحة التحكم)
   * GET /dashboard/products
   */
  async getProducts(params = {}) {
    try {
      const response = await api.get('/dashboard/products', { params }); // ✅ بدون /api/v1
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          status: true,
          message: 'لا توجد منتجات',
          data: this.getDefaultPaginatedData(params.per_page || 10)
        };
      }
      this.handleError(error, 'حدث خطأ في جلب المنتجات');
    }
  }

  /**
   * جلب منتج محدد (للوحة التحكم)
   * GET /dashboard/products/{id}
   */
  async getProduct(id) {
    try {
      const response = await api.get(`/dashboard/products/${id}`); // ✅ بدون /api/v1
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('المنتج غير موجود');
      }
      this.handleError(error, 'حدث خطأ في جلب المنتج');
    }
  }

  /**
   * إنشاء منتج جديد (للوحة التحكم)
   * POST /dashboard/products
   */
  async createProduct(formData) {
    try {
      const response = await api.post('/dashboard/products', formData, { // ✅ بدون /api/v1
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'حدث خطأ في إنشاء المنتج');
    }
  }

  // ==================== الواجهة العامة (Interface) ====================

  /**
   * جلب المنتجات للواجهة العامة
   * GET /interface/products
   */
  async getInterfaceProducts(params = {}) {
    try {
      const response = await api.get('/interface/products', { params }); // ✅ بدون /api/v1
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          status: true,
          message: 'لا توجد منتجات',
          data: []
        };
      }
      this.handleError(error, 'حدث خطأ في جلب المنتجات');
    }
  }

  /**
   * جلب منتج محدد للواجهة العامة
   * GET /interface/products/{id}
   */
  async getInterfaceProduct(id) {
    try {
      const response = await api.get(`/interface/products/${id}`); // ✅ بدون /api/v1
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('المنتج غير موجود');
      }
      this.handleError(error, 'حدث خطأ في جلب المنتج');
    }
  }
}

const productService = new ProductService();
export default productService;