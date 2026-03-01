import api from '../../src/api/axios'; 


class StaticService {
  /**
   * البيانات الافتراضية للأسئلة الشائعة
   * @returns {Array} قائمة الأسئلة الشائعة الافتراضية
   * @private
   */
  getDefaultFAQs() {
    return [
      {
        question: 'ما هي طرق الدفع المتاحة؟',
        answer: 'يمكنك الدفع عبر بطاقة الائتمان، الدفع عند الاستلام، أو التحويل البنكي.'
      },
      {
        question: 'كم تستغرق عملية الشحن؟',
        answer: 'تستغرق عملية الشحن من 3 إلى 7 أيام عمل حسب المنطقة.'
      },
      {
        question: 'كيف يمكنني تتبع طلبي؟',
        answer: 'يمكنك تتبع طلبك من خلال حسابك في الموقع أو عبر رابط التتبع المرسل إلى بريدك الإلكتروني.'
      }
    ];
  }

  /**
   * معالجة الأخطاء بشكل موحد
   * @param {Error} error - الخطأ المراد معالجته
   * @param {string} defaultMessage - الرسالة الافتراضية
   * @param {*} defaultData - البيانات الافتراضية في حالة الخطأ
   * @returns {*} البيانات الافتراضية أو رمي الخطأ
   * @private
   */
  handleError(error, defaultMessage, defaultData = null) {
    console.error(defaultMessage, error);
    
    // إذا كان الخطأ 404 (غير موجود)، نرجع بيانات افتراضية
    if (error.response?.status === 404 && defaultData !== null) {
      return defaultData;
    }
    
    // إعادة رمي الخطأ لمعالجته في المكان المناسب
    throw error;
  }

  /**
   * جلب الأسئلة الشائعة
   * @returns {Promise<Array>} قائمة الأسئلة الشائعة
   */
  async getFAQs() {
    try {
      const response = await api.get('/faqs');
      return response.data;
    } catch (error) {
      return this.handleError(error, 'خطأ في جلب الأسئلة الشائعة', this.getDefaultFAQs());
    }
  }

  /**
   * جلب معلومات الفروع
   * @returns {Promise<Array>} قائمة الفروع
   */
  async getBranches() {
    try {
      const response = await api.get('/branches');
      return response.data;
    } catch (error) {
      // بيانات افتراضية للفروع
      const defaultBranches = [
        {
          name: 'الفرع الرئيسي',
          address: 'شارع الملك فهد، الرياض',
          phone: '+966 11 234 5678',
          city: 'الرياض'
        },
        {
          name: 'فرع جدة',
          address: 'شارع التحلية، جدة',
          phone: '+966 12 345 6789',
          city: 'جدة'
        }
      ];
      
      return this.handleError(error, 'خطأ في جلب الفروع', defaultBranches);
    }
  }

  /**
   * جلب معلومات عن الشركة
   * @returns {Promise<Object>} معلومات عن الشركة
   */
  async getAboutInfo() {
    try {
      const response = await api.get('/about');
      return response.data;
    } catch (error) {
      // بيانات افتراضية عن الشركة
      const defaultAbout = {
        name: 'اسم الشركة',
        description: 'وصف مختصر للشركة ونشاطها',
        vision: 'رؤية الشركة',
        mission: 'رسالة الشركة',
        founded: '2020',
        team: [
          { name: 'المدير التنفيذي', position: 'CEO' }
        ]
      };
      
      return this.handleError(error, 'خطأ في جلب معلومات عن الشركة', defaultAbout);
    }
  }

  /**
   * جلب سياسة الخصوصية
   * @returns {Promise<string>} نص سياسة الخصوصية
   */
  async getPrivacyPolicy() {
    try {
      const response = await api.get('/privacy');
      return response.data;
    } catch (error) {
      // نص افتراضي لسياسة الخصوصية
      const defaultPrivacy = `
        <h1>سياسة الخصوصية</h1>
        <p>نحن نلتزم بحماية خصوصية معلوماتك. سيتم استخدام معلوماتك الشخصية فقط لتلبية طلباتك وتحسين تجربتك في الموقع.</p>
        <h2>المعلومات التي نجمعها</h2>
        <p>نقوم بجمع المعلومات التي تقدمها لنا عند التسجيل أو تقديم طلب، مثل الاسم والبريد الإلكتروني والعنوان.</p>
        <h2>كيف نستخدم معلوماتك</h2>
        <p>نستخدم معلوماتك لمعالجة طلباتك، تحسين خدماتنا، والتواصل معك بشأن العروض والتحديثات.</p>
      `;
      
      return this.handleError(error, 'خطأ في جلب سياسة الخصوصية', defaultPrivacy);
    }
  }

  /**
   * جلب الشروط والأحكام
   * @returns {Promise<string>} نص الشروط والأحكام
   */
  async getTerms() {
    try {
      const response = await api.get('/terms');
      return response.data;
    } catch (error) {
      // نص افتراضي للشروط والأحكام
      const defaultTerms = `
        <h1>الشروط والأحكام</h1>
        <p>باستخدام هذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام.</p>
        <h2>الحساب والتسجيل</h2>
        <p>يجب أن تكون مسؤولاً عن الحفاظ على سرية حسابك وكلمة المرور الخاصة بك.</p>
        <h2>الطلبات والمدفوعات</h2>
        <p>نحتفظ بالحق في رفض أي طلب تقدمه لنا. جميع الأسعار قابلة للتغيير دون إشعار.</p>
      `;
      
      return this.handleError(error, 'خطأ في جلب الشروط والأحكام', defaultTerms);
    }
  }

  /**
   * جلب سياسة الشحن
   * @returns {Promise<Object>} سياسة الشحن
   */
  async getShippingPolicy() {
    try {
      const response = await api.get('/shipping');
      return response.data;
    } catch (error) {
      // بيانات افتراضية لسياسة الشحن
      const defaultShipping = {
        methods: [
          {
            name: 'شحن عادي',
            duration: '3-5 أيام عمل',
            cost: 20,
            description: 'شحن اقتصادي خلال 3-5 أيام عمل'
          },
          {
            name: 'شحن سريع',
            duration: '1-2 يوم عمل',
            cost: 50,
            description: 'شحن سريع خلال 1-2 يوم عمل'
          },
          {
            name: 'شحن مجاني',
            duration: '5-7 أيام عمل',
            cost: 0,
            description: 'شحن مجاني للطلبات فوق 500 ريال'
          }
        ],
        cities: ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'القصيم'],
        notes: [
          'الشحن متاح لجميع مدن المملكة',
          'يتم الشحن عبر شركات شحن موثوقة',
          'سيتم إرسال رقم تتبع الشحنة بعد الشحن'
        ]
      };
      
      return this.handleError(error, 'خطأ في جلب سياسة الشحن', defaultShipping);
    }
  }

  /**
   * جلب سياسة الإرجاع
   * @returns {Promise<Object>} سياسة الإرجاع
   */
  async getReturnPolicy() {
    try {
      const response = await api.get('/returns');
      return response.data;
    } catch (error) {
      // بيانات افتراضية لسياسة الإرجاع
      const defaultReturn = {
        duration: 14,
        conditions: [
          'المنتج بحالته الأصلية',
          'لم يتم استخدام المنتج',
          'العبوة الأصلية سليمة'
        ],
        exceptions: [
          'المنتجات المخصصة',
          'المنتجات الرقمية',
          'المنتجات المفتوحة'
        ],
        refundTime: {
          cod: '3-5 أيام عمل',
          bank: '5-7 أيام عمل',
          credit: '7-14 يوم عمل'
        }
      };
      
      return this.handleError(error, 'خطأ في جلب سياسة الإرجاع', defaultReturn);
    }
  }

  /**
   * جلب ساعات العمل
   * @returns {Promise<Array>} ساعات العمل
   */
  async getWorkingHours() {
    try {
      const response = await api.get('/working-hours');
      return response.data;
    } catch (error) {
      // بيانات افتراضية لساعات العمل
      const defaultHours = [
        { day: 'الاثنين - الخميس', hours: '9:00 صباحاً - 6:00 مساءً' },
        { day: 'الجمعة', hours: 'مغلق' },
        { day: 'السبت - الأحد', hours: '10:00 صباحاً - 4:00 مساءً' }
      ];
      
      return this.handleError(error, 'خطأ في جلب ساعات العمل', defaultHours);
    }
  }

  /**
   * جلب الصفحات الثابتة (طريقة موحدة لجلب أي صفحة ثابتة)
   * @param {string} pageName - اسم الصفحة (about, privacy, terms, etc.)
   * @returns {Promise<Object|string>} محتوى الصفحة
   */
  async getStaticPage(pageName) {
    try {
      const response = await api.get(`/static/${pageName}`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في جلب الصفحة ${pageName}:`, error);
      
      // محاولة جلب الصفحة من مسار بديل
      try {
        const altResponse = await api.get(`/${pageName}`);
        return altResponse.data;
      } catch (altError) {
        // إرجاع صفحة افتراضية
        return {
          title: `صفحة ${pageName}`,
          content: `محتوى صفحة ${pageName} غير متوفر حالياً. يرجى المحاولة لاحقاً.`,
          status: 'unavailable'
        };
      }
    }
  }

  /**
   * جلب معلومات التواصل
   * @returns {Promise<Object>} معلومات التواصل
   */
  async getContactInfo() {
    try {
      const response = await api.get('/contact-info');
      return response.data;
    } catch (error) {
      // معلومات تواصل افتراضية
      const defaultContact = {
        email: 'info@example.com',
        phone: '+966 11 234 5678',
        whatsapp: '+966 55 555 5555',
        address: 'الرياض، المملكة العربية السعودية',
        social: {
          facebook: 'https://facebook.com/example',
          twitter: 'https://twitter.com/example',
          instagram: 'https://instagram.com/example'
        }
      };
      
      return this.handleError(error, 'خطأ في جلب معلومات التواصل', defaultContact);
    }
  }

  /**
   * جلب الصور والوسائط (شعارات، صور ثابتة)
   * @returns {Promise<Object>} روابط الصور والوسائط
   */
  async getMediaAssets() {
    try {
      const response = await api.get('/media');
      return response.data;
    } catch (error) {
      // بيانات افتراضية للوسائط
      const defaultMedia = {
        logo: '/images/logo.png',
        favicon: '/images/favicon.ico',
        defaultProductImage: '/images/default-product.jpg',
        defaultCategoryImage: '/images/default-category.jpg',
        banners: {
          home: '/images/banners/home.jpg',
          offers: '/images/banners/offers.jpg'
        }
      };
      
      return this.handleError(error, 'خطأ في جلب الوسائط', defaultMedia);
    }
  }

  /**
   * جلب إعدادات الموقع
   * @returns {Promise<Object>} إعدادات الموقع
   */
  async getSiteSettings() {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch (error) {
      // إعدادات افتراضية للموقع
      const defaultSettings = {
        siteName: 'متجري',
        siteDescription: 'أفضل موقع للتسوق الإلكتروني',
        currency: 'ريال',
        currencySymbol: 'ر.س',
        language: 'ar',
        minOrderAmount: 0,
        maxOrderAmount: 10000,
        taxRate: 15
      };
      
      return this.handleError(error, 'خطأ في جلب إعدادات الموقع', defaultSettings);
    }
  }
}

// تصدير نسخة واحدة من الخدمة
const staticService = new StaticService();
export default staticService;