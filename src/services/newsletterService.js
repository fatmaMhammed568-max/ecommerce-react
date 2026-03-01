import api from '../../src/api/axios'; 


class NewsletterService {
  /**
   * التحقق من صحة البريد الإلكتروني
   * @param {string} email - البريد الإلكتروني المدخل
   * @returns {boolean} صحة البريد الإلكتروني
   * @private
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * تنظيف البريد الإلكتروني (إزالة المسافات وتحويله لأحرف صغيرة)
   * @param {string} email - البريد الإلكتروني المدخل
   * @returns {string} البريد الإلكتروني المنظف
   * @private
   */
  cleanEmail(email) {
    return email?.trim().toLowerCase() || '';
  }

  /**
   * الاشتراك في النشرة البريدية
   * @param {string} email - البريد الإلكتروني للمستخدم
   * @returns {Promise<Object>} نتيجة الاشتراك
   */
  async subscribe(email) {
    // التحقق من وجود البريد الإلكتروني
    if (!email) {
      return {
        status: false,
        message: 'البريد الإلكتروني مطلوب'
      };
    }

    // تنظيف البريد الإلكتروني
    const cleanEmail = this.cleanEmail(email);

    // التحقق من صحة البريد الإلكتروني
    if (!this.isValidEmail(cleanEmail)) {
      return {
        status: false,
        message: 'البريد الإلكتروني غير صالح'
      };
    }

    try {
      const response = await api.post('/newsletter/subscribe', { 
        email: cleanEmail 
      });

      // معالجة الاستجابة من السيرفر
      return {
        status: response.data?.status || true,
        message: response.data?.message || 'تم الاشتراك في النشرة البريدية بنجاح'
      };

    } catch (error) {
      console.error('خطأ في الاشتراك في النشرة البريدية:', error);

      // معالجة أنواع مختلفة من الأخطاء
      if (error.response) {
        // خطأ من السيرفر (مثلاً: البريد موجود بالفعل)
        return {
          status: false,
          message: error.response.data?.message || 'حدث خطأ في السيرفر'
        };
      } else if (error.request) {
        // مشكلة في الاتصال (لا يوجد استجابة)
        return {
          status: false,
          message: 'فشل الاتصال بالخادم. تحقق من اتصالك بالإنترنت'
        };
      } else {
        // خطأ في إعداد الطلب
        return {
          status: false,
          message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى'
        };
      }
    }
  }

  /**
   * إلغاء الاشتراك من النشرة البريدية
   * @param {string} email - البريد الإلكتروني للمستخدم
   * @returns {Promise<Object>} نتيجة إلغاء الاشتراك
   */
  async unsubscribe(email) {
    // التحقق من وجود البريد الإلكتروني
    if (!email) {
      return {
        status: false,
        message: 'البريد الإلكتروني مطلوب'
      };
    }

    // تنظيف البريد الإلكتروني
    const cleanEmail = this.cleanEmail(email);

    // التحقق من صحة البريد الإلكتروني
    if (!this.isValidEmail(cleanEmail)) {
      return {
        status: false,
        message: 'البريد الإلكتروني غير صالح'
      };
    }

    try {
      const response = await api.post('/newsletter/unsubscribe', { 
        email: cleanEmail 
      });

      // معالجة الاستجابة من السيرفر
      return {
        status: response.data?.status || true,
        message: response.data?.message || 'تم إلغاء الاشتراك بنجاح'
      };

    } catch (error) {
      console.error('خطأ في إلغاء الاشتراك من النشرة البريدية:', error);

      // معالجة أنواع مختلفة من الأخطاء
      if (error.response) {
        // خطأ من السيرفر (مثلاً: البريد غير موجود)
        return {
          status: false,
          message: error.response.data?.message || 'حدث خطأ في السيرفر'
        };
      } else if (error.request) {
        // مشكلة في الاتصال
        return {
          status: false,
          message: 'فشل الاتصال بالخادم. تحقق من اتصالك بالإنترنت'
        };
      } else {
        // خطأ في إعداد الطلب
        return {
          status: false,
          message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى'
        };
      }
    }
  }

  /**
   * التحقق من حالة الاشتراك لبريد إلكتروني
   * @param {string} email - البريد الإلكتروني
   * @returns {Promise<Object>} حالة الاشتراك
   */
  async checkSubscriptionStatus(email) {
    if (!email) {
      return {
        status: false,
        message: 'البريد الإلكتروني مطلوب',
        isSubscribed: false
      };
    }

    const cleanEmail = this.cleanEmail(email);

    if (!this.isValidEmail(cleanEmail)) {
      return {
        status: false,
        message: 'البريد الإلكتروني غير صالح',
        isSubscribed: false
      };
    }

    try {
      const response = await api.get('/newsletter/status', { 
        params: { email: cleanEmail } 
      });

      return {
        status: true,
        isSubscribed: response.data?.isSubscribed || false,
        message: response.data?.message || 'تم التحقق من الحالة بنجاح'
      };

    } catch (error) {
      console.error('خطأ في التحقق من حالة الاشتراك:', error);
      
      return {
        status: false,
        message: 'حدث خطأ في التحقق من الحالة',
        isSubscribed: false
      };
    }
  }

  /**
   * الحصول على إحصائيات النشرة البريدية (للمسؤول)
   * @returns {Promise<Object>} إحصائيات النشرة البريدية
   */
  async getNewsletterStats() {
    try {
      const response = await api.get('/newsletter/stats');

      return {
        status: true,
        data: {
          totalSubscribers: response.data?.totalSubscribers || 0,
          activeSubscribers: response.data?.activeSubscribers || 0,
          unsubscribedThisMonth: response.data?.unsubscribedThisMonth || 0,
          subscribedThisMonth: response.data?.subscribedThisMonth || 0
        },
        message: 'تم جلب الإحصائيات بنجاح'
      };

    } catch (error) {
      console.error('خطأ في جلب إحصائيات النشرة البريدية:', error);

      // في حالة الخطأ 404 (API مش موجود)، نرجع بيانات تجريبية
      if (error.response?.status === 404) {
        return {
          status: true,
          data: {
            totalSubscribers: 0,
            activeSubscribers: 0,
            unsubscribedThisMonth: 0,
            subscribedThisMonth: 0
          },
          message: 'بيانات تجريبية'
        };
      }

      return {
        status: false,
        message: 'حدث خطأ في جلب الإحصائيات'
      };
    }
  }

  /**
   * إرسال النشرة البريدية (للمسؤول)
   * @param {Object} newsletterData - بيانات النشرة البريدية
   * @returns {Promise<Object>} نتيجة الإرسال
   */
  async sendNewsletter(newsletterData) {
    try {
      // التحقق من صحة البيانات
      if (!newsletterData.subject?.trim()) {
        return {
          status: false,
          message: 'عنوان النشرة البريدية مطلوب'
        };
      }

      if (!newsletterData.content?.trim()) {
        return {
          status: false,
          message: 'محتوى النشرة البريدية مطلوب'
        };
      }

      const response = await api.post('/newsletter/send', {
        subject: newsletterData.subject.trim(),
        content: newsletterData.content.trim(),
        sendTo: newsletterData.sendTo || 'all' // 'all', 'active', 'specific'
      });

      return {
        status: true,
        message: response.data?.message || 'تم إرسال النشرة البريدية بنجاح',
        sentCount: response.data?.sentCount || 0
      };

    } catch (error) {
      console.error('خطأ في إرسال النشرة البريدية:', error);

      return {
        status: false,
        message: error.response?.data?.message || 'حدث خطأ في إرسال النشرة البريدية'
      };
    }
  }
}

// تصدير نسخة واحدة من الخدمة
const newsletterService = new NewsletterService();
export default newsletterService;