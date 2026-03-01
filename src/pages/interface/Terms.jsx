import React, { useState, useEffect } from 'react';
import { 
  FaFileAlt, 
  FaShoppingBag, 
  FaTruck, 
  FaUndoAlt,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaCreditCard,
  FaMoneyBillWave,
  FaUniversity,
  FaRegClock
} from 'react-icons/fa';
import { 
  MdGavel, 
  MdCopyright, 
  MdUpdate, 
  MdWarning,
  MdVerified
} from 'react-icons/md';
import { BiPurchaseTag, BiStore } from 'react-icons/bi';
import staticService from '../../services/staticService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

/**
 * الشروط والأحكام الافتراضية في حالة عدم وجود بيانات من API
 */
const DEFAULT_TERMS = `
  <h2>مقدمة</h2>
  <p>مرحباً بك في <strong>بيوتي طوما</strong>. باستخدامك لموقعنا الإلكتروني وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية قبل استخدام خدماتنا.</p>
`;

/**
 * صفحة الشروط والأحكام
 */
const Terms = () => {
  const [termsContent, setTermsContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('20 فبراير 2026');

  /**
   * جلب الشروط والأحكام عند تحميل الصفحة
   */
  useEffect(() => {
    fetchTerms();
  }, []);

  /**
   * جلب الشروط والأحكام من API
   */
  const fetchTerms = async () => {
    try {
      setLoading(true);
      const data = await staticService.getTerms();
      setTermsContent(data || '');
    } catch (error) {
      console.error('خطأ في جلب الشروط والأحكام:', error);
      toast.error('حدث خطأ في تحميل الشروط والأحكام');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="جاري تحميل الشروط والأحكام..." />;
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50" dir="rtl">
      <div className="container-custom max-w-4xl">
        {/* عنوان الصفحة */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-skin-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <FaFileAlt className="w-10 h-10 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">الشروط والأحكام</h1>
          <p className="text-xl text-gray-600 flex items-center justify-center gap-2">
            <MdUpdate className="text-primary-600" />
            آخر تحديث: {lastUpdated}
          </p>
        </div>

        {/* المحتوى الرئيسي */}
        {termsContent ? (
          <div 
            className="bg-white rounded-3xl shadow-xl p-8 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: termsContent }}
          />
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
            {/* مقدمة */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaFileAlt className="text-primary-600" aria-hidden="true" />
                مقدمة
              </h2>
              <p className="text-gray-600 leading-relaxed">
                مرحباً بك في <span className="font-bold text-primary-600">بيوتي طوما</span>. باستخدامك لموقعنا الإلكتروني وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية قبل استخدام خدماتنا.
              </p>
            </section>

            {/* الحساب والتسجيل */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MdVerified className="text-primary-600" aria-hidden="true" />
                الحساب والتسجيل
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>يجب أن تكون 18 سنة أو أكثر لإنشاء حساب</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>يجب تقديم معلومات دقيقة وكاملة عند التسجيل</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>نحن غير مسؤولين عن أي استخدام غير مصرح به لحسابك</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>نحتفظ بالحق في تعليق أو إلغاء أي حساب في حالة انتهاك الشروط</span>
                </li>
              </ul>
            </section>

            {/* الطلبات والدفع */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaShoppingBag className="text-primary-600" aria-hidden="true" />
                الطلبات والدفع
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <BiPurchaseTag className="text-primary-600" />
                    الأسعار:
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 mr-4">
                    <li>جميع الأسعار بالجنية المصري شاملة الضريبة</li>
                    <li>نحتفظ بالحق في تعديل الأسعار في أي وقت</li>
                    <li>الأسعار سارية وقت تقديم الطلب</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <FaCreditCard className="text-primary-600" />
                    طرق الدفع:
                  </h3>
                  <ul className="grid grid-cols-2 gap-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <FaCreditCard className="text-gray-400" />
                      بطاقات الائتمان
                    </li>
                    <li className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-gray-400" />
                      الدفع عند الاستلام
                    </li>
                    <li className="flex items-center gap-2">
                      <FaUniversity className="text-gray-400" />
                      التحويل البنكي
                    </li>
                    <li className="flex items-center gap-2">
                      <FaRegClock className="text-gray-400" />
                      ميزة - البطاقة المصرية
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <FaCheckCircle className="text-primary-600" />
                    تأكيد الطلب:
                  </h3>
                  <p className="text-gray-600">
                    يتم تأكيد الطلب عبر البريد الإلكتروني بعد الدفع. نحتفظ بالحق في إلغاء أي طلب لأسباب مشروعة.
                  </p>
                </div>
              </div>
            </section>

            {/* الشحن والتوصيل */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaTruck className="text-primary-600" aria-hidden="true" />
                الشحن والتوصيل
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li className="flex items-start gap-2">
                  <FaTruck className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>مدة التوصيل من 2-5 أيام عمل داخل مصر</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaTruck className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>الشحن مجاني للطلبات فوق 500 جنيه</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaTruck className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>يتم التوصيل عبر شركات شحن موثوقة</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaTruck className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>يجب التأكد من صحة عنوان التوصيل</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaTruck className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>نحن غير مسؤولين عن تأخير شركات الشحن</span>
                </li>
              </ul>
            </section>

            {/* الإرجاع والاستبدال */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaUndoAlt className="text-primary-600" aria-hidden="true" />
                سياسة الإرجاع والاستبدال
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li className="flex items-start gap-2">
                  <FaUndoAlt className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>يمكن إرجاع المنتج خلال 14 يوم من الاستلام</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaUndoAlt className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>يجب أن يكون المنتج بحالته الأصلية وغير مستخدم</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaUndoAlt className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>يتم استرداد المبلغ خلال 7-10 أيام عمل</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaUndoAlt className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>تكاليف الشحن للإرجاع يتحملها العميل</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaUndoAlt className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>المنتجات المخفضة لا تخضع للإرجاع</span>
                </li>
              </ul>
            </section>

            {/* حقوق الملكية الفكرية */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-primary-600" aria-hidden="true" />
                حقوق الملكية الفكرية
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                جميع المحتويات على هذا الموقع (صور، نصوص، شعارات) هي ملك لـ <span className="font-bold">بيوتي طوما</span> ومحمية بموجب قوانين حقوق النشر.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li className="flex items-start gap-2">
                  <MdCopyright className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>لا يجوز نسخ أو إعادة نشر المحتوى دون إذن كتابي</span>
                </li>
                <li className="flex items-start gap-2">
                  <MdCopyright className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>العلامات التجارية مسجلة باسم بيوتي طوما</span>
                </li>
                <li className="flex items-start gap-2">
                  <MdCopyright className="text-primary-500 mt-1 flex-shrink-0" />
                  <span>الاستخدام غير المصرح به يعرضك للمساءلة القانونية</span>
                </li>
              </ul>
            </section>

            {/* إخلاء المسؤولية */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-primary-600" aria-hidden="true" />
                إخلاء المسؤولية
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li className="flex items-start gap-2">
                  <MdWarning className="text-yellow-500 mt-1 flex-shrink-0" />
                  <span>المنتجات للاستخدام الخارجي فقط</span>
                </li>
                <li className="flex items-start gap-2">
                  <MdWarning className="text-yellow-500 mt-1 flex-shrink-0" />
                  <span>يجب إجراء اختبار حساسية قبل الاستخدام</span>
                </li>
                <li className="flex items-start gap-2">
                  <MdWarning className="text-yellow-500 mt-1 flex-shrink-0" />
                  <span>استشيري طبيب الأمراض الجلدية إذا كنت تعانين من حساسية</span>
                </li>
                <li className="flex items-start gap-2">
                  <MdWarning className="text-yellow-500 mt-1 flex-shrink-0" />
                  <span>النتائج قد تختلف من شخص لآخر</span>
                </li>
                <li className="flex items-start gap-2">
                  <MdWarning className="text-yellow-500 mt-1 flex-shrink-0" />
                  <span>نحن غير مسؤولين عن أي تفاعلات حساسية فردية</span>
                </li>
              </ul>
            </section>

            {/* تعديل الشروط */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MdUpdate className="text-primary-600" aria-hidden="true" />
                تعديل الشروط
              </h2>
              <p className="text-gray-600 leading-relaxed">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر التعديلات على هذه الصفحة مع تحديث تاريخ آخر تعديل. استمرارك في استخدام الموقع يعني موافقتك على الشروط المعدلة.
              </p>
            </section>

            {/* القانون الواجب التطبيق */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MdGavel className="text-primary-600" aria-hidden="true" />
                القانون الواجب التطبيق
              </h2>
              <p className="text-gray-600 leading-relaxed">
                تخضع هذه الشروط وتفسر وفقاً لقوانين جمهورية مصر العربية. أي نزاع ينشأ عن هذه الشروط يتم حله أمام محاكم محافظة القليوبية.
              </p>
            </section>

            {/* التواصل معنا */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BiStore className="text-primary-600" />
                للتواصل والدعم
              </h2>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="font-semibold flex items-center gap-2">
                      <FaPhone className="text-primary-600" />
                      الهاتف:
                    </p>
                    <p className="text-gray-600 mr-7">013-322-4567</p>
                    <p className="text-gray-600 mr-7 flex items-center gap-2">
                      <FaWhatsapp className="text-green-500" />
                      010 1234 5678 (واتساب)
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="font-semibold flex items-center gap-2">
                      <FaEnvelope className="text-primary-600" />
                      البريد الإلكتروني:
                    </p>
                    <p className="text-gray-600 mr-7">support@beautytoma.com</p>
                    <p className="text-gray-600 mr-7">legal@beautytoma.com</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-semibold flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary-600" />
                      العنوان:
                    </p>
                    <p className="text-gray-600 mr-7">بنها - شارع سعد زغلول - بجوار جامعة بنها - محافظة القليوبية</p>
                  </div>
                </div>
              </div>
            </section>

            {/* الموافقة */}
            <div className="bg-green-50 p-6 rounded-2xl mt-8 border-r-4 border-green-500">
              <p className="text-gray-700 font-semibold flex items-center gap-3">
                <FaCheckCircle className="text-green-600 w-6 h-6" aria-hidden="true" />
                باستخدامك لموقعنا، فإنك توافق على جميع الشروط والأحكام المذكورة أعلاه.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terms;