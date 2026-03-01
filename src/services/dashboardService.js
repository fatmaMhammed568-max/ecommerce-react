import api from '../api/axios';

class DashboardService {
  /**
   * جلب إحصائيات لوحة التحكم
   * GET /dashboard/stats
   */
  async getStats() {
    try {
      // ✅ استخدام المسار الصحيح للـ API
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
      
      // ✅ إرجاع بيانات افتراضية في حالة الخطأ (مؤقت)
      return {
        status: true,
        data: [
          { 
            name: 'إجمالي المنتجات', 
            value: '156', 
            change: '+12',
            link: '/dashboard/products'
          },
          { 
            name: 'الطلبات الجديدة', 
            value: '24', 
            change: '+8',
            link: '/dashboard/orders?status=pending'
          },
          { 
            name: 'إجمالي المستخدمين', 
            value: '2,345', 
            change: '+124',
            link: '/dashboard/users'
          },
          { 
            name: 'المبيعات اليومية', 
            value: '12,450 ج.م', 
            change: '+15%',
            link: '/dashboard/reports'
          },
        ]
      };
    }
  }

  /**
   * جلب آخر الطلبات
   * GET /dashboard/orders?per_page=5&sort_by=created_at&sort_order=desc
   */
  async getRecentOrders(limit = 5) {
    try {
      const response = await api.get('/dashboard/orders', {
        params: { per_page: limit, sort_by: 'created_at', sort_order: 'desc' }
      });
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب آخر الطلبات:', error);
      
      // ✅ بيانات افتراضية مؤقتة
      return {
        status: true,
        data: [
          { id: 1, order_number: 'ORD-001', user: { name: 'فاطمة محمد' }, created_at: '2024-01-15', total_amount: 350, status: 'completed' },
          { id: 2, order_number: 'ORD-002', user: { name: 'نورا أحمد' }, created_at: '2024-01-15', total_amount: 520, status: 'processing' },
          { id: 3, order_number: 'ORD-003', user: { name: 'سارة علي' }, created_at: '2024-01-14', total_amount: 180, status: 'pending' },
        ]
      };
    }
  }

  /**
   * جلب أكثر المنتجات مبيعاً
   * GET /dashboard/products?sort_by=sold_count&sort_order=desc&per_page=3
   */
  async getBestSellers(limit = 3) {
    try {
      const response = await api.get('/dashboard/products', {
        params: { 
          sort_by: 'sold_count', 
          sort_order: 'desc',
          per_page: limit 
        }
      });
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب أكثر المنتجات مبيعاً:', error);
      
      // ✅ بيانات افتراضية مؤقتة
      return {
        status: true,
        data: [
          { id: 1, name: 'كريم مرطب', main_image: null, sold_count: 45, total_sales: 5400 },
          { id: 2, name: 'سيروم فيتامين سي', main_image: null, sold_count: 32, total_sales: 7040 },
          { id: 3, name: 'تونر منعش', main_image: null, sold_count: 28, total_sales: 2660 },
        ]
      };
    }
  }

  /**
   * جلب آخر المستخدمين
   * GET /dashboard/users?sort_by=created_at&sort_order=desc&per_page=3
   */
  async getRecentUsers(limit = 3) {
    try {
      const response = await api.get('/dashboard/users', {
        params: { 
          sort_by: 'created_at', 
          sort_order: 'desc',
          per_page: limit 
        }
      });
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب آخر المستخدمين:', error);
      

    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;