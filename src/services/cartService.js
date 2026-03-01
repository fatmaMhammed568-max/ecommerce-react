import api from '../../src/api/axios'; 


class CartService {
  /**
   * جلب محتويات السلة من API أو localStorage
   * @returns {Promise<Object>} بيانات السلة
   */
  async getCart() {
    // ✅ استخدام localStorage أولاً
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const items = JSON.parse(storedCart);
        const total = items.reduce((sum, item) => 
          sum + (item.price * (item.quantity || 1)), 0
        );
        
        return {
          status: true,
          message: 'تم جلب السلة من المتصفح',
          data: { items, total }
        };
      }
    } catch (error) {
      console.error('خطأ في قراءة السلة من المتصفح:', error);
    }

    // ✅ إذا كان المستخدم مسجل دخوله، حاول جلبها من API
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/cart');
        return response.data;
      }
    } catch (error) {
      // إذا كان الخطأ 404 (غير موجود)، تجاهله واستخدم localStorage
      if (error.response?.status === 404) {
        console.log('API السلة غير متوفرة، استخدام السلة المحلية');
        return {
          status: true,
          message: 'استخدام السلة المحلية',
          data: { items: [], total: 0 }
        };
      }
      console.error('خطأ في جلب السلة من API:', error);
    }

    // القيمة الافتراضية
    return {
      status: true,
      message: 'السلة فارغة',
      data: { items: [], total: 0 }
    };
  }

  /**
   * مزامنة السلة مع API
   * @param {Array} items - عناصر السلة
   * @returns {Promise<Object>} نتيجة المزامنة
   */
  async syncCart(items) {
    // ✅ حفظ في localStorage أولاً
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      
      const total = items.reduce((sum, item) => 
        sum + (item.price * (item.quantity || 1)), 0
      );
      
      return {
        status: true,
        message: 'تمت المزامنة محلياً',
        data: { items, total }
      };
    } catch (error) {
      console.error('خطأ في مزامنة السلة:', error);
      return {
        status: false,
        message: 'حدث خطأ في حفظ السلة'
      };
    }
  }

  /**
   * إفراغ السلة
   * @returns {Promise<Object>} نتيجة العملية
   */
  async clearCart() {
    try {
      localStorage.removeItem('cart');
      return {
        status: true,
        message: 'تم إفراغ السلة',
        data: { items: [], total: 0 }
      };
    } catch (error) {
      console.error('خطأ في إفراغ السلة:', error);
      return {
        status: false,
        message: 'حدث خطأ في إفراغ السلة'
      };
    }
  }

  /**
   * إضافة منتج إلى السلة
   * @param {Object} product - المنتج المراد إضافته
   * @param {number} quantity - الكمية (اختياري)
   * @returns {Promise<Object>} السلة بعد التحديث
   */
  async addToCart(product, quantity = 1) {
    try {
      const { data: { items } } = await this.getCart();
      
      const existingItemIndex = items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // تحديث الكمية إذا كان المنتج موجوداً
        items[existingItemIndex].quantity += quantity;
      } else {
        // إضافة منتج جديد
        items.push({
          ...product,
          quantity
        });
      }

      return await this.syncCart(items);
    } catch (error) {
      console.error('خطأ في إضافة المنتج للسلة:', error);
      return {
        status: false,
        message: 'حدث خطأ في إضافة المنتج للسلة'
      };
    }
  }

  /**
   * إزالة منتج من السلة
   * @param {number} productId - معرف المنتج
   * @returns {Promise<Object>} السلة بعد التحديث
   */
  async removeFromCart(productId) {
    try {
      const { data: { items } } = await this.getCart();
      
      const filteredItems = items.filter(item => item.id !== productId);
      
      return await this.syncCart(filteredItems);
    } catch (error) {
      console.error('خطأ في إزالة المنتج من السلة:', error);
      return {
        status: false,
        message: 'حدث خطأ في إزالة المنتج من السلة'
      };
    }
  }

  /**
   * تحديث كمية منتج في السلة
   * @param {number} productId - معرف المنتج
   * @param {number} quantity - الكمية الجديدة
   * @returns {Promise<Object>} السلة بعد التحديث
   */
  async updateQuantity(productId, quantity) {
    try {
      if (quantity < 1) {
        return await this.removeFromCart(productId);
      }

      const { data: { items } } = await this.getCart();
      
      const itemIndex = items.findIndex(item => item.id === productId);
      
      if (itemIndex > -1) {
        items[itemIndex].quantity = quantity;
        return await this.syncCart(items);
      }

      return {
        status: false,
        message: 'المنتج غير موجود في السلة'
      };
    } catch (error) {
      console.error('خطأ في تحديث الكمية:', error);
      return {
        status: false,
        message: 'حدث خطأ في تحديث الكمية'
      };
    }
  }

  /**
   * حساب المجموع الكلي للسلة
   * @param {Array} items - عناصر السلة
   * @returns {number} المجموع الكلي
   */
  calculateTotal(items) {
    return items.reduce((sum, item) => 
      sum + (item.price * (item.quantity || 1)), 0
    );
  }

  /**
   * التحقق من وجود منتج في السلة
   * @param {number} productId - معرف المنتج
   * @returns {Promise<boolean>} هل المنتج موجود
   */
  async hasProduct(productId) {
    try {
      const { data: { items } } = await this.getCart();
      return items.some(item => item.id === productId);
    } catch {
      return false;
    }
  }

  /**
   * الحصول على عدد العناصر في السلة
   * @returns {Promise<number>} عدد العناصر
   */
  async getItemCount() {
    try {
      const { data: { items } } = await this.getCart();
      return items.reduce((count, item) => count + (item.quantity || 1), 0);
    } catch {
      return 0;
    }
  }
}

// تصدير نسخة واحدة من الخدمة
const cartService = new CartService();
export default cartService;