import React, { useState, useEffect } from 'react';
import { FiShield, FiLock, FiEye, FiDatabase, FiMail, FiClock } from 'react-icons/fi';
import staticService from '../../services/staticService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

/**
 * صفحة سياسة الخصوصية
 */
const Privacy = () => {
  const [privacyContent, setPrivacyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('20 فبراير 2026');

  /**
   * جلب سياسة الخصوصية عند تحميل الصفحة
   */
  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  /**
   * جلب سياسة الخصوصية من API
   */
  const fetchPrivacyPolicy = async () => {
    try {
      setLoading(true);
      const data = await staticService.getPrivacyPolicy();
      setPrivacyContent(data || '');
    } catch (error) {
      console.error('خطأ في جلب سياسة الخصوصية:', error);
      toast.error('حدث خطأ في تحميل سياسة الخصوصية');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="جاري تحميل سياسة الخصوصية..." />;
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50" dir="rtl">
      <div className="container-custom max-w-4xl">
        {/* عنوان الصفحة */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-skin-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <FiShield className="w-10 h-10 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">سياسة الخصوصية</h1>
          <p className="text-xl text-gray-600">
            آخر تحديث: {lastUpdated}
          </p>
        </div>

        {/* المحتوى الرئيسي */}
        {privacyContent ? (
          <div 
            className="bg-white rounded-3xl shadow-xl p-8 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: privacyContent }}
          />
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
            {/* مقدمة */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiEye className="text-primary-600" aria-hidden="true" />
                مقدمة
              </h2>
              <p className="text-gray-600 leading-relaxed">
                نحن في <span className="font-bold text-primary-600">بيوتي طوما</span> نلتزم بحماية خصوصيتك وأمان بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات التي تقدمها لنا عند استخدام موقعنا الإلكتروني وخدماتنا.
              </p>
            </section>

            {/* المعلومات التي نجمعها */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiDatabase className="text-primary-600" aria-hidden="true" />
                المعلومات التي نجمعها
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">المعلومات الشخصية:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                    <li>الاسم الكامل</li>
                    <li>البريد الإلكتروني</li>
                    <li>رقم الجوال</li>
                    <li>العنوان (للشحن)</li>
                    <li>تاريخ الميلاد (اختياري)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">معلومات الدفع:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                    <li>بيانات بطاقات الدفع (يتم تشفيرها بالكامل)</li>
                    <li>سجل المشتريات</li>
                    <li>طرق الدفع المفضلة</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">معلومات تلقائية:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                    <li>عنوان IP</li>
                    <li>نوع المتصفح</li>
                    <li>الصفحات التي تزورها</li>
                    <li>الوقت الذي تقضيه في الموقع</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* كيفية استخدام المعلومات */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiLock className="text-primary-600" aria-hidden="true" />
                كيفية استخدام معلوماتك
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>معالجة طلباتك وتوصيل المنتجات</li>
                <li>تحسين خدماتنا وتجربة المستخدم</li>
                <li>إرسال تحديثات حول حالة طلبك</li>
                <li>إرسال عروض ترويجية (بموافقتك فقط)</li>
                <li>الرد على استفساراتك وطلبات الدعم</li>
                <li>منع الاحتيال وحماية أمان موقعنا</li>
              </ul>
            </section>

            {/* حماية البيانات */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiShield className="text-primary-600" aria-hidden="true" />
                حماية البيانات
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نتخذ إجراءات أمنية صارمة لحماية معلوماتك الشخصية، بما في ذلك:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>تشفير البيانات باستخدام SSL/TLS</li>
                <li>الوصول المقيد إلى المعلومات الشخصية</li>
                <li>مراجعة أمنية دورية للأنظمة</li>
                <li>الامتثال لمعايير أمان PCI DSS للدفع</li>
              </ul>
            </section>

            {/* ملفات تعريف الارتباط */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4">ملفات تعريف الارتباط (Cookies)</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا، وتشمل:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>تذكر تفضيلاتك وإعداداتك</li>
                <li>تتبع سلة التسوق الخاصة بك</li>
                <li>تحليل حركة المرور على الموقع</li>
                <li>تقديم عروض مخصصة</li>
              </ul>
            </section>

            {/* حقوقك */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4">حقوقك</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                لديك الحق في:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>الوصول إلى معلوماتك الشخصية</li>
                <li>تصحيح أو تحديث بياناتك</li>
                <li>طلب حذف معلوماتك</li>
                <li>الاعتراض على معالجة بياناتك</li>
                <li>سحب الموافقة في أي وقت</li>
              </ul>
            </section>

            {/* التواصل معنا */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiMail className="text-primary-600" aria-hidden="true" />
                التواصل معنا
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                إذا كان لديك أي استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><span className="font-semibold">البريد الإلكتروني:</span> privacy@beautytoma.com</p>
                <p><span className="font-semibold">الهاتف:</span> 013-322-4567</p>
                <p><span className="font-semibold">العنوان:</span> بنها - شارع سعد زغلول - محافظة القليوبية</p>
              </div>
            </section>

            {/* تحديثات السياسة */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FiClock className="text-primary-600" aria-hidden="true" />
                تحديثات سياسة الخصوصية
              </h2>
              <p className="text-gray-600 leading-relaxed">
                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإشعارك بأي تغييرات عن طريق نشر السياسة الجديدة على هذه الصفحة مع تحديث تاريخ "آخر تحديث".
              </p>
            </section>

            {/* الموافقة */}
            <div className="bg-primary-50 p-6 rounded-2xl mt-8">
              <p className="text-gray-700">
                باستخدامك لموقعنا، فإنك توافق على سياسة الخصوصية هذه وشروط الاستخدام.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Privacy;