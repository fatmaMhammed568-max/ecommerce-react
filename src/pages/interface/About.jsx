import React, { useState, useEffect } from 'react';
import { 
  FaHeart, FaStar, FaUsers, FaAward, FaMapMarkerAlt,
  FaPhone, FaClock, FaTruck, FaStore, FaRegClock,
  FaRegBuilding, FaRegSmile, FaBox, FaCalendarAlt
} from 'react-icons/fa';
import { MdLocalShipping, MdLocationOn } from 'react-icons/md';
import { BiStore } from 'react-icons/bi';
import staticService from '../../services/staticService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

/**
 * صفحة من نحن
 */
const About = () => {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [branches, setBranches] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * جلب البيانات عند تحميل الصفحة
   */
  useEffect(() => {
    fetchAboutData();
  }, []);

  /**
   * جلب جميع بيانات الصفحة
   */
  const fetchAboutData = async () => {
    try {
      setLoading(true);
      
      const [about, branchesData, hoursData] = await Promise.all([
        staticService.getAboutInfo(),
        staticService.getBranches(),
        staticService.getWorkingHours()
      ]);

      setAboutInfo(about || {});
      setBranches(branchesData || []);
      setWorkingHours(hoursData || []);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      toast.error('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  /**
   * القيم الأساسية للشركة
   */
  const values = [
    {
      icon: FaHeart,
      title: 'حب الطبيعة',
      description: 'نستخدم مكونات طبيعية 100% خالية من المواد الكيميائية الضارة',
      color: 'primary'
    },
    {
      icon: FaStar,
      title: 'الجودة العالية',
      description: 'نلتزم بأعلى معايير الجودة في جميع منتجاتنا',
      color: 'skin'
    },
    {
      icon: FaUsers,
      title: 'رضا العملاء',
      description: 'نضع عملائنا في المقام الأول ونسعى لإسعادهم دائماً',
      color: 'primary'
    },
    {
      icon: FaAward,
      title: 'معتمدين',
      description: 'جميع منتجاتنا حاصلة على شهادات الجودة العالمية',
      color: 'skin'
    }
  ];

  /**
   * مدن التوصيل في القليوبية
   */
  const deliveryCities = aboutInfo?.deliveryCities || [
    'بنها',
    'شبرا الخيمة',
    'قليوب',
    'الخانكة',
    'كفر شكر',
    'طوخ',
    'قها'
  ];

  /**
   * نص القصة الافتراضي
   */
  const defaultStory = [
    'بدأت قصة بيوتي طوما في محافظة القليوبية بحلم بسيط: تقديم منتجات عناية بالبشرة طبيعية وآمنة للمرأة المصرية والعربية.',
    'منذ 8 سنوات ونحن نسعى لتوفير أفضل المنتجات الطبيعية التي تجمع بين التراث والفعالية، باستخدام مكونات طبيعية 100% خالية من المواد الكيميائية الضارة.',
    'اليوم، أصبحت بيوتي طوما علامة موثوقة في عالم العناية بالبشرة، مع آلاف العملاء السعداء في جميع أنحاء القليوبية ومصر.'
  ];

  if (loading) {
    return <Loader text="جاري تحميل الصفحة..." />;
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50" dir="rtl">
      <div className="container-custom">
        {/* عنوان الصفحة */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">من نحن</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {aboutInfo?.description || 'نقدم أفضل منتجات العناية بالبشرة الطبيعية والعضوية لبشرة صحية ومشرقة'}
          </p>
        </div>

        {/* قصة الشركة */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">قصتنا</h2>
              <div className="text-gray-600 leading-relaxed space-y-4">
                {(aboutInfo?.story || defaultStory).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-6 text-primary-600">
                <FaMapMarkerAlt className="w-5 h-5" aria-hidden="true" />
                <span>{aboutInfo?.address || 'بنها - شارع سعد زغلول - محافظة القليوبية'}</span>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <img
                src={aboutInfo?.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                alt="فريق العمل"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-sm">
                <p className="font-semibold text-gray-800 flex items-center gap-1">
                  <MdLocationOn className="text-primary-600" />
                  {aboutInfo?.location || 'القليوبية - مصر'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* القيم */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {values.map((value, index) => {
            const Icon = value.icon;
            const bgColor = value.color === 'primary' ? 'bg-primary-100' : 'bg-skin-100';
            const textColor = value.color === 'primary' ? 'text-primary-600' : 'text-skin-600';
            
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`${bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 ${textColor}`} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            );
          })}
        </div>

        {/* الإحصائيات */}
        <div className="bg-gradient-to-r from-primary-600 to-skin-600 text-white rounded-3xl shadow-xl p-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <FaRegSmile className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <p className="text-5xl font-bold mb-2">{aboutInfo?.stats?.customers || '+5000'}</p>
              <p className="text-xl opacity-90">عميل سعيد في القليوبية</p>
            </div>
            <div>
              <FaBox className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <p className="text-5xl font-bold mb-2">{aboutInfo?.stats?.products || '+200'}</p>
              <p className="text-xl opacity-90">منتج طبيعي</p>
            </div>
            <div>
              <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <p className="text-5xl font-bold mb-2">{aboutInfo?.stats?.years || '8'}</p>
              <p className="text-xl opacity-90">سنوات من الخبرة</p>
            </div>
          </div>
        </div>

        {/* معلومات التواصل المحلية */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* الفروع */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaStore className="text-primary-600" />
              فروعنا في القليوبية
            </h3>
            {branches.length > 0 ? (
              <div className="space-y-4">
                {branches.map((branch, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <p className="font-semibold text-primary-600 flex items-center gap-2">
                      <BiStore className="text-lg" />
                      {branch.name}
                    </p>
                    <p className="text-gray-600 mr-7">{branch.address}</p>
                    <p className="text-gray-500 text-sm mr-7 flex items-center gap-2" dir="ltr">
                      <FaPhone className="text-xs" />
                      {branch.phone}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>بنها - شارع سعد زغلول</p>
                <p dir="ltr" className="flex items-center justify-center gap-2">
                  <FaPhone className="text-xs" />
                  +20 12 0196 4471
                </p>
              </div>
            )}
          </div>

          {/* مواعيد العمل */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaRegClock className="text-primary-600" />
              مواعيد العمل
            </h3>
            {workingHours.length > 0 ? (
              <div className="space-y-4">
                {workingHours.map((hour, index) => (
                  <div key={index} className="flex justify-between border-b pb-3 last:border-0">
                    <span className="font-semibold flex items-center gap-2">
                      <FaClock className="text-gray-400 text-sm" />
                      {hour.day}:
                    </span>
                    <span className="text-gray-600">{hour.hours}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold flex items-center gap-2">
                    <FaClock className="text-gray-400 text-sm" />
                    السبت - الخميس:
                  </span>
                  <span className="text-gray-600">9:00 صباحاً - 9:00 مساءً</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold flex items-center gap-2">
                    <FaClock className="text-gray-400 text-sm" />
                    الجمعة:
                  </span>
                  <span className="text-gray-600">مغلق</span>
                </div>
              </div>
            )}

            <div className="mt-8">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <MdLocalShipping className="text-primary-600 text-xl" />
                توصيل سريع لجميع مدن القليوبية:
              </h4>
              <div className="flex flex-wrap gap-2">
                {deliveryCities.map((city, index) => (
                  <span 
                    key={index} 
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <FaMapMarkerAlt className="text-xs" />
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;