// services/orderService.js
import api from '../../src/api/axios'; 

const orderService = {
  /**
   * جلب جميع الطلبات مع دعم الطلبات المحلية
   */
  getOrders: async (params = {}) => {
    try {
      // محاولة جلب من API
      const response = await axios.get('/dashboard/orders', { params });
      return response.data;
    } catch (error) {
      console.log('API غير متاح، استخدام الطلبات المحلية');
      
      // جلب الطلبات المحلية
      const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      
      // تطبيق الفلاتر
      let filteredOrders = localOrders;
      
      if (params.search) {
        filteredOrders = filteredOrders.filter(order => 
          order.order_number?.includes(params.search) ||
          order.customer?.name?.includes(params.search) ||
          order.customer?.email?.includes(params.search) ||
          order.customer?.phone?.includes(params.search)
        );
      }
      
      if (params.status && params.status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === params.status);
      }
      
      if (params.payment_method && params.payment_method !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.payment_method === params.payment_method);
      }
      
      return {
        status: true,
        data: {
          data: filteredOrders,
          current_page: 1,
          last_page: 1,
          total: filteredOrders.length,
          per_page: params.per_page || 10
        }
      };
    }
  },

  /**
   * جلب طلب محدد
   */
  getOrder: async (id) => {
    try {
      // محاولة جلب من API
      const response = await axios.get(`/dashboard/orders/${id}`);
      return response.data;
    } catch (error) {
      console.log('API غير متاح، البحث في الطلبات المحلية');
      
      // البحث في الطلبات المحلية
      const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const order = localOrders.find(o => o.id == id);
      
      if (order) {
        return {
          status: true,
          data: order
        };
      }
      
      throw new Error('الطلب غير موجود');
    }
  },

  /**
   * تحديث حالة الطلب
   */
  updateOrderStatus: async (id, status, notes = '') => {
    try {
      const response = await axios.patch(`/dashboard/orders/${id}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      console.log('API غير متاح، تحديث محلي');
      
      // تحديث في localStorage
      const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const orderIndex = localOrders.findIndex(o => o.id == id);
      
      if (orderIndex !== -1) {
        localOrders[orderIndex].status = status;
        localOrders[orderIndex].admin_notes = notes;
        localStorage.setItem('local_orders', JSON.stringify(localOrders));
        
        return {
          status: true,
          message: 'تم تحديث الحالة محلياً'
        };
      }
      
      throw new Error('الطلب غير موجود');
    }
  },

  /**
   * تحديث معلومات الشحن
   */
  updateShippingInfo: async (id, shippingData) => {
    try {
      const response = await axios.patch(`/dashboard/orders/${id}/shipping`, shippingData);
      return response.data;
    } catch (error) {
      console.log('API غير متاح، تحديث محلي');
      
      // تحديث في localStorage
      const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const orderIndex = localOrders.findIndex(o => o.id == id);
      
      if (orderIndex !== -1) {
        localOrders[orderIndex].tracking_number = shippingData.tracking_number;
        localStorage.setItem('local_orders', JSON.stringify(localOrders));
        
        return {
          status: true,
          message: 'تم تحديث معلومات الشحن محلياً'
        };
      }
      
      throw new Error('الطلب غير موجود');
    }
  },

  /**
   * إضافة ملاحظة للطلب
   */
  addOrderNote: async (id, note) => {
    try {
      const response = await axios.post(`/dashboard/orders/${id}/notes`, { note });
      return response.data;
    } catch (error) {
      console.log('API غير متاح، تحديث محلي');
      
      // تحديث في localStorage
      const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const orderIndex = localOrders.findIndex(o => o.id == id);
      
      if (orderIndex !== -1) {
        localOrders[orderIndex].admin_notes = note;
        localStorage.setItem('local_orders', JSON.stringify(localOrders));
        
        return {
          status: true,
          message: 'تم حفظ الملاحظة محلياً'
        };
      }
      
      throw new Error('الطلب غير موجود');
    }
  },

  /**
   * إنشاء طلب جديد
   */
  createOrder: async (orderData) => {
    try {
      const response = await axios.post('/api/v1/orders', orderData);
      return response.data;
    } catch (error) {
      console.log('API غير متاح، حفظ محلي');
      
      // حفظ في localStorage
      const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const newOrder = {
        ...orderData,
        id: Date.now(),
        created_at: new Date().toISOString(),
        status: 'pending'
      };
      
      localOrders.push(newOrder);
      localStorage.setItem('local_orders', JSON.stringify(localOrders));
      
      return {
        status: true,
        data: newOrder,
        message: 'تم حفظ الطلب محلياً'
      };
    }
  }
};

export default orderService;