import api from '../../src/api/axios';

class CategoryService {
  /**
   * البيانات الافتراضية للصفحات
   * @private
   */
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

  /**
   * معالجة الأخطاء بشكل موحد
   */
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
   * جلب كل الأقسام (للوحة التحكم)
   * GET /dashboard/categories
   */
  async getCategories(params = {}) {
    try {
      const response = await api.get('/dashboard/categories', { params }); // ✅ بدون /api/v1
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          status: true,
          message: 'لا توجد أقسام',
          data: this.getDefaultPaginatedData(params.per_page || 10)
        };
      }
      this.handleError(error, 'حدث خطأ في جلب الأقسام');
    }
  }

  /**
   * جلب قسم محدد (للوحة التحكم)
   * GET /dashboard/categories/{id}
   */
  async getCategory(id) {
    try {
      const response = await api.get(`/dashboard/categories/${id}`); // ✅ بدون /api/v1
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('القسم غير موجود');
      }
      this.handleError(error, 'حدث خطأ في جلب القسم');
    }
  }

  /**
   * إنشاء قسم جديد (للوحة التحكم)
   * POST /dashboard/categories
   */
  async createCategory(formData) {
    try {
      const response = await api.post('/dashboard/categories', formData, { // ✅ بدون /api/v1
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'حدث خطأ في إنشاء القسم');
    }
  }

  /**
   * تحديث قسم (للوحة التحكم)
   * PUT /dashboard/categories/{id}
   */
  async updateCategory(id, formData) {
    try {
      formData.append('_method', 'PUT');
      const response = await api.post(`/dashboard/categories/${id}`, formData, { // ✅ بدون /api/v1
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'حدث خطأ في تحديث القسم');
    }
  }

  /**
   * حذف قسم (للوحة التحكم)
   * DELETE /dashboard/categories/{id}
   */
  async deleteCategory(id) {
    try {
      const response = await api.delete(`/dashboard/categories/${id}`); // ✅ بدون /api/v1
      return response.data;
    } catch (error) {
      this.handleError(error, 'حدث خطأ في حذف القسم');
    }
  }

  /**
   * جلب الأقسام الرئيسية (الأباء) - للوحة التحكم
   * GET /dashboard/categories?parent_only=1
   */
  async getParentCategories() {
    try {
      const response = await api.get('/dashboard/categories', { // ✅ بدون /api/v1
        params: { parent_only: 1, per_page: 100 }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          status: true,
          message: 'لا توجد أقسام رئيسية',
          data: []
        };
      }
      this.handleError(error, 'حدث خطأ في جلب الأقسام الرئيسية');
    }
  }

  // ==================== الواجهة العامة (Interface) ====================

  /**
   * جلب الأقسام للواجهة العامة
   * GET /interface/categories
   */
  async getInterfaceCategories(params = {}) {
    try {
      const response = await api.get('/interface/categories', { params }); // ✅ بدون /api/v1
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          status: true,
          message: 'لا توجد أقسام',
          data: []
        };
      }
      this.handleError(error, 'حدث خطأ في جلب الأقسام');
    }
  }

  /**
   * جلب قسم محدد للواجهة العامة
   * GET /interface/categories/{id}
   */
  async getInterfaceCategory(id) {
    try {
      const response = await api.get(`/interface/categories/${id}`); // ✅ بدون /api/v1
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('القسم غير موجود');
      }
      this.handleError(error, 'حدث خطأ في جلب القسم');
    }
  }

  /**
   * جلب منتجات قسم محدد
   * GET /interface/categories/{id}/products
   */
  async getCategoryProducts(id, params = {}) {
    try {
      const response = await api.get(`/interface/categories/${id}/products`, { params }); // ✅ بدون /api/v1
      return response.data;
    } catch (error) {
      this.handleError(error, 'حدث خطأ في جلب منتجات القسم');
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;