import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
  FaWhatsapp,
  FaTelegramPlane,
} from 'react-icons/fa';
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiClock,
  FiSend,
  FiHeart,
  FiChevronLeft,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import newsletterService from '../../services/newsletterService';

const logo = 'https://placehold.co/150x50/0284c7/ffffff?text=BeautyToma';

/**
 * روابط حقيقية للتواصل الاجتماعي
 */
const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/beautytoma',
  instagram: 'https://instagram.com/beautytoma',
  twitter: 'https://twitter.com/beautytoma',
  youtube: 'https://youtube.com/@beautytoma',
  tiktok: 'https://tiktok.com/@beautytoma',
  snapchat: 'https://snapchat.com/add/beautytoma',
  whatsapp: 'https://wa.me/201001922197',
  telegram: 'https://t.me/beautytoma',
};

/**
 * أيقونات التواصل مع ألوانها الحقيقية
 */
const SOCIAL_ICONS = [
  { 
    icon: FaFacebook, 
    name: 'فيسبوك', 
    link: SOCIAL_LINKS.facebook,
    color: '#1877f2',
    hoverColor: 'hover:bg-[#1877f2]'
  },
  { 
    icon: FaInstagram, 
    name: 'انستغرام', 
    link: SOCIAL_LINKS.instagram,
    color: '#e4405f',
    hoverColor: 'hover:bg-[#e4405f]'
  },
  { 
    icon: FaTwitter, 
    name: 'تويتر', 
    link: SOCIAL_LINKS.twitter,
    color: '#1da1f2',
    hoverColor: 'hover:bg-[#1da1f2]'
  },
  { 
    icon: FaYoutube, 
    name: 'يوتيوب', 
    link: SOCIAL_LINKS.youtube,
    color: '#ff0000',
    hoverColor: 'hover:bg-[#ff0000]'
  },
  { 
    icon: FaTiktok, 
    name: 'تيك توك', 
    link: SOCIAL_LINKS.tiktok,
    color: '#000000',
    hoverColor: 'hover:bg-[#000000]'
  },
  { 
    icon: FaSnapchatGhost, 
    name: 'سناب شات', 
    link: SOCIAL_LINKS.snapchat,
    color: '#fffc00',
    hoverColor: 'hover:bg-[#fffc00]'
  },
  { 
    icon: FaWhatsapp, 
    name: 'واتساب', 
    link: SOCIAL_LINKS.whatsapp,
    color: '#25d366',
    hoverColor: 'hover:bg-[#25d366]'
  },
  { 
    icon: FaTelegramPlane, 
    name: 'تيليغرام', 
    link: SOCIAL_LINKS.telegram,
    color: '#0088cc',
    hoverColor: 'hover:bg-[#0088cc]'
  }
];

/**
 * روابط الصفحات الرئيسية
 */
const MAIN_PAGES = [
  { to: '/', text: 'الرئيسية' },
  { to: '/products', text: 'المنتجات' },
  { to: '/categories', text: 'الأقسام' },
  { to: '/about', text: 'من نحن' },
  { to: '/contact', text: 'اتصل بنا' },
];

/**
 * روابط سياسات الموقع
 */
const POLICY_PAGES = [
  { to: '/privacy', text: 'سياسة الخصوصية' },
  { to: '/terms', text: 'الشروط والأحكام' },
  { to: '/shipping', text: 'سياسة الشحن' },
  { to: '/returns', text: 'سياسة الإرجاع' },
  { to: '/faq', text: 'الأسئلة الشائعة' },
];

/**
 * روابط خدمة العملاء
 */
const CUSTOMER_PAGES = [
  { to: '/cart', text: 'سلة التسوق' },
  { to: '/wishlist', text: 'المفضلة' },
  { to: '/orders', text: 'طلباتي' },
  { to: '/checkout', text: 'إتمام الشراء' },
];

/**
 * روابط الأقسام الرئيسية
 */
const CATEGORY_LINKS = [
  { to: '/category/1', text: 'العناية بالبشرة' },
  { to: '/category/2', text: 'العناية بالشعر' },
  { to: '/category/3', text: 'مكياج' },
  { to: '/category/4', text: 'عطور' },
  { to: '/category/5', text: 'زيوت طبيعية' },
  { to: '/category/6', text: 'مستلزمات حمام' },
];

/**
 * معلومات الاتصال
 */
const CONTACT_INFO = {
  address: 'القليوبية، مركز طوخ، قرية الدير، شارع جراج الفرانين',
  phone: '+20 12 0196 4471',
  email: 'info@beautytoma.com',
  workingHours: 'السبت - الخميس: 9ص - 9م'
};

/**
 * مكون تذييل الصفحة
 */
const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * معالجة الاشتراك في النشرة البريدية
   * @param {React.FormEvent} e - حدث تقديم النموذج
   */
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email?.trim()) {
      toast.error('الرجاء إدخال البريد الإلكتروني');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('البريد الإلكتروني غير صالح');
      return;
    }

    setLoading(true);
    
    try {
      const response = await newsletterService.subscribe(email.trim());
      
      if (response?.status) {
        setIsSubscribed(true);
        setEmail('');
        toast.success('تم الاشتراك بنجاح! شكراً لك');
        
        setTimeout(() => setIsSubscribed(false), 3000);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ في الاشتراك';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * التحقق من صحة البريد الإلكتروني
   * @param {string} email - البريد الإلكتروني
   * @returns {boolean} صحة البريد
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * معالجة خطأ تحميل شعار ميزة
   * @param {React.SyntheticEvent} e - حدث الخطأ
   */
  const handleMeezaError = (e) => {
    e.target.src = 'https://seeklogo.com/images/M/meeza-logo-8F5C4F7E9F-seeklogo.com.png';
  };

  /**
   * الحصول على السنة الحالية
   * @returns {number} السنة الحالية
   */
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8 relative overflow-hidden">
      {/* خلفية مزخرفة */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-skin-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* الجزء العلوي - شبكة الروابط */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          
          {/* عن الشركة - عمودين */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="بيوتي طوما" 
                className="h-12 w-auto"
                loading="lazy"
              />
              <span className="text-2xl font-bold bg-gradient-to-l from-primary-400 to-skin-400 bg-clip-text text-transparent">
                بيوتي طوما
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              وجهتك الأولى لمنتجات العناية بالبشرة الطبيعية والعضوية. نقدم لك أفضل المنتجات لبشرة صحية ومشرقة.
            </p>
            
            {/* معلومات الاتصال الأساسية */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <FiMapPin className="text-primary-500" />
                <span className="text-sm">{CONTACT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiPhone className="text-primary-500" />
                <span className="text-sm" dir="ltr">{CONTACT_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiMail className="text-primary-500" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm hover:text-primary-400 transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiClock className="text-primary-500" />
                <span className="text-sm">{CONTACT_INFO.workingHours}</span>
              </div>
            </div>

            {/* أيقونات التواصل */}
            <div className="flex flex-wrap gap-2 pt-2">
              {SOCIAL_ICONS.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-gray-800 p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${social.hoverColor} hover:text-white group relative`}
                  title={social.name}
                  style={{ color: social.color }}
                  aria-label={`تابعنا على ${social.name}`}
                >
                  <social.icon className="w-4 h-4" />
                  
                  {/* Tooltip */}
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* الصفحات الرئيسية */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              الصفحات الرئيسية
              <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-l from-primary-500 to-skin-500"></span>
            </h3>
            <ul className="space-y-2">
              {MAIN_PAGES.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.to} 
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <FiChevronLeft className="opacity-0 group-hover:opacity-100 text-primary-500 transition-all" />
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* الأقسام */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              الأقسام
              <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-l from-primary-500 to-skin-500"></span>
            </h3>
            <ul className="space-y-2">
              {CATEGORY_LINKS.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.to} 
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <FiChevronLeft className="opacity-0 group-hover:opacity-100 text-primary-500 transition-all" />
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* خدمة العملاء */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              خدمة العملاء
              <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-l from-primary-500 to-skin-500"></span>
            </h3>
            <ul className="space-y-2">
              {CUSTOMER_PAGES.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.to} 
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <FiChevronLeft className="opacity-0 group-hover:opacity-100 text-primary-500 transition-all" />
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* السياسات */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block">
              السياسات
              <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-l from-primary-500 to-skin-500"></span>
            </h3>
            <ul className="space-y-2">
              {POLICY_PAGES.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.to} 
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <FiChevronLeft className="opacity-0 group-hover:opacity-100 text-primary-500 transition-all" />
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* قسم النشرة البريدية المنفصل */}
        <div className="mb-12 bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">النشرة البريدية</h3>
              <p className="text-gray-400">
                اشتركي لتصلك أحدث العروض والمنتجات الحصرية
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3" noValidate>
              <div className="relative flex-1">
                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  disabled={loading}
                  aria-label="البريد الإلكتروني للاشتراك في النشرة البريدية"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-l from-primary-600 to-skin-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-skin-700 transition-all transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[120px]"
                aria-label={loading ? 'جاري الاشتراك...' : 'اشتراك'}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <FiSend className="group-hover:rotate-12 transition-transform" />
                    {isSubscribed ? 'تم ✓' : 'اشتراك'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* شارة الثقة */}
        <div className="mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FiHeart className="text-primary-500 flex-shrink-0" />
            <span>نحن نهتم بخصوصيتك، ولن نشارك بريدك مع أي طرف ثالث</span>
          </div>
        </div>

        {/* الجزء السفلي */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-center md:text-right text-sm">
              © {getCurrentYear()} بيوتي طوما - جميع الحقوق محفوظة. 
              <span className="mx-2 text-primary-500" aria-hidden="true">♥</span>
             Fatma mohammed Ebrahim
            </p>
            
            {/* روابط سريعة إضافية في الفوتر السفلي */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">
                الخصوصية
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/terms" className="text-gray-500 hover:text-white transition-colors">
                الشروط
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/shipping" className="text-gray-500 hover:text-white transition-colors">
                الشحن
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/returns" className="text-gray-500 hover:text-white transition-colors">
                الإرجاع
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/faq" className="text-gray-500 hover:text-white transition-colors">
                الأسئلة
              </Link>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span className="text-gray-400 text-sm">طرق الدفع:</span>
              <div className="flex gap-2 items-center flex-wrap justify-center">
                {/* Visa */}
                <svg className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
                  <rect width="100" height="32" rx="4" fill="#1A1F71"/>
                  <path d="M38 10L32 22H28L25 14L22 22H18L13 10H17L20 18L23 10H27L30 18L33 10H38Z" fill="white"/>
                  <path d="M44 22H40L44 10H48L44 22Z" fill="white"/>
                  <path d="M58 16C58 19 55 21 51 21C49 21 47 20 46 19L48 16C49 17 50 18 51 18C52 18 53 17 53 16C53 15 52 14 50 13C48 12 46 10 46 8C46 5 48 3 52 3C54 3 56 4 57 5L55 8C54 7 53 6 52 6C50 6 50 7 50 8C50 9 51 10 53 11C55 12 58 14 58 16Z" fill="white"/>
                  <path d="M68 16C68 19 65 21 61 21C59 21 57 20 56 19L58 16C59 17 60 18 61 18C62 18 63 17 63 16C63 15 62 14 60 13C58 12 56 10 56 8C56 5 58 3 62 3C64 3 66 4 67 5L65 8C64 7 63 6 62 6C60 6 60 7 60 8C60 9 61 10 63 11C65 12 68 14 68 16Z" fill="white"/>
                  <path d="M82 10L77 22H73L71 14L68 22H64L59 10H63L66 18L69 10H73L76 18L79 10H82Z" fill="white"/>
                </svg>

                {/* Mastercard */}
                <svg className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
                  <rect width="100" height="32" rx="4" fill="black"/>
                  <circle cx="36" cy="16" r="10" fill="#EB001B"/>
                  <circle cx="56" cy="16" r="10" fill="#F79E1B"/>
                  <path d="M46 10C48 12 49 14 49 16C49 18 48 20 46 22C44 20 42 18 42 16C42 14 44 12 46 10Z" fill="#FF5F00"/>
                </svg>

                {/* Meeza */}
                <img 
                  src="https://via.placeholder.com/40x25?text=Meeza" 
                  alt="Meeza" 
                  className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-all"
                  title="ميزة - البطاقة المصرية"
                  onError={handleMeezaError}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;