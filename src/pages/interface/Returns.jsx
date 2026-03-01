import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import staticService from '../../services/staticService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

/**
 * سياسة الإرجاع الافتراضية في حالة عدم وجود بيانات من API
 */
const DEFAULT_RETURN_POLICY = {
  duration: 14,
  conditions: [
    'المنتج بحالته الأصلية: يجب أن يكون المنتج غير مستخدم وفي نفس الحالة التي استلمته بها',
    'العبوة الأصلية: يجب إرجاع المنتج مع عبوته الأصلية وجميع ملصقاته',
    'الفاتورة: يجب إرفاق فاتورة الشراء مع المنتج المرتجع',
    'المنتجات التالفة: إذا وصل المنتج تالفاً، يرجى التواصل معنا خلال 48 ساعة من الاستلام'
  ],
  exceptions: [
    'المنتجات المخصصة (حسب الطلب)',
    'المنتجات الرقمية (قوائم العناية، كتب إلكترونية)',
    'المنتجات المفتوحة (منتجات العناية المفتوحة)',
    'المنتجات المخفضة (فوق 50% خصم)'
  ],
  refundTime: {
    cod: '5-7 أيام عمل',
    bank: '3-5 أيام عمل',
    credit: '7-14 يوم عمل'
  }
};

/**
 * صفحة سياسة الإرجاع والاستبدال
 */
const Returns = () => {
  const [returnPolicy, setReturnPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * جلب سياسة الإرجاع عند تحميل الصفحة
   */
  useEffect(() => {
    fetchReturnPolicy();
  }, []);

  /**
   * جلب سياسة الإرجاع من API
   */
  const fetchReturnPolicy = async () => {
    try {
      setLoading(true);
      const data = await staticService.getReturnPolicy();
      setReturnPolicy(data || DEFAULT_RETURN_POLICY);
    } catch (error) {
      console.error('خطأ في جلب سياسة الإرجاع:', error);
      toast.error('حدث خطأ في تحميل سياسة الإرجاع');
      setReturnPolicy(DEFAULT_RETURN_POLICY);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="جاري تحميل سياسة الإرجاع..." />;
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50" dir="rtl">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">سياسة الإرجاع والاستبدال</h1>

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
          {/* شروط الإرجاع */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FiRefreshCw className="text-primary-600" aria-hidden="true" />
              شروط الإرجاع
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FiCheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold mb-2">مدة الإرجاع</h3>
                  <p className="text-gray-600">
                    يمكن إرجاع المنتج خلال {returnPolicy?.duration || 14} يوم من تاريخ الاستلام
                  </p>
                </div>
              </div>
              
              {returnPolicy?.conditions?.map((condition, index) => {
                // تقسيم النص إلى عنوان ووصف
                const parts = condition.split(':');
                const title = parts[0];
                const description = parts.slice(1).join(':');
                
                return (
                  <div key={index} className="flex items-start gap-4">
                    <FiCheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold mb-2">{title}</h3>
                      <p className="text-gray-600">{description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* حالات لا يمكن إرجاعها */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FiXCircle className="text-red-600" aria-hidden="true" />
              حالات لا يمكن إرجاعها
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              {returnPolicy?.exceptions?.map((exception, index) => (
                <li key={index}>{exception}</li>
              ))}
            </ul>
          </section>

          {/* خطوات الإرجاع */}
          <section>
            <h2 className="text-2xl font-bold mb-6">خطوات الإرجاع</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <p className="text-gray-700">تسجيل الدخول إلى حسابك واختيار الطلب المراد إرجاعه</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <p className="text-gray-700">اختيار المنتجات المراد إرجاعها وسبب الإرجاع</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <p className="text-gray-700">انتظار موافقة فريق الدعم على طلب الإرجاع</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <p className="text-gray-700">شحن المنتج إلينا عبر شركة الشحن المتفق عليها</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <p className="text-gray-700">استرداد المبلغ خلال 5-7 أيام عمل بعد استلام المنتج</p>
              </div>
            </div>
          </section>

          {/* مدة استرداد المبلغ */}
          <section className="bg-primary-50 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiClock className="text-primary-600" aria-hidden="true" />
              مدة استرداد المبلغ
            </h2>
            <p className="text-gray-700 mb-4">
              بعد استلامنا للمنتج المرتجع والتأكد من مطابقته للشروط، سيتم استرداد المبلغ خلال:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
              <li>
                <span className="font-semibold">الدفع عند الاستلام:</span>{' '}
                {returnPolicy?.refundTime?.cod || '5-7 أيام عمل'}
              </li>
              <li>
                <span className="font-semibold">التحويل البنكي:</span>{' '}
                {returnPolicy?.refundTime?.bank || '3-5 أيام عمل'}
              </li>
              <li>
                <span className="font-semibold">بطاقات الائتمان:</span>{' '}
                {returnPolicy?.refundTime?.credit || '7-14 يوم عمل'} (حسب سياسة البنك)
              </li>
            </ul>
          </section>

          {/* معلومات إضافية */}
          <section className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4">ملاحظات مهمة</h2>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">
                 تكاليف الشحن للإرجاع يتحملها العميل إلا في حالة وصول المنتج تالفاً أو خطأ من المتجر.
              </p>
            </div>
            <div className="mt-4">
              <p className="text-gray-600">
                للاستفسارات حول سياسة الإرجاع، يرجى التواصل مع فريق الدعم عبر{' '}
                <a href="/contact" className="text-primary-600 hover:underline">
                  صفحة الاتصال بنا
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Returns;