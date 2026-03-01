// Contact.jsx - كما هو دون تغيير
import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaPaperPlane,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaCheckCircle
} from 'react-icons/fa';
import contactService from '../../services/contactService';
import staticService from '../../services/staticService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    about: null,
    branches: [],
    hours: []
  });
  const [fetching, setFetching] = useState(true);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setFetching(true);
      const results = await Promise.allSettled([
        staticService.getAboutInfo(),
        staticService.getBranches(),
        staticService.getWorkingHours()
      ]);
      
      setContactInfo({ 
        about: results[0].status === 'fulfilled' ? results[0].value || {} : {},
        branches: results[1].status === 'fulfilled' ? results[1].value || [] : [],
        hours: results[2].status === 'fulfilled' ? results[2].value || [] : []
      });
    } catch (error) {
      console.error('خطأ في جلب معلومات الاتصال:', error);
      toast.error('حدث خطأ في تحميل معلومات الاتصال');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const cleanPhoneNumber = (phone) => {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setSendSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error('الاسم مطلوب');
      return;
    }

    if (!formData.email?.trim()) {
      toast.error('البريد الإلكتروني مطلوب');
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error('البريد الإلكتروني غير صالح');
      return;
    }

    if (!formData.subject?.trim()) {
      toast.error('الموضوع مطلوب');
      return;
    }

    if (!formData.message?.trim()) {
      toast.error('الرسالة مطلوبة');
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error('الرسالة يجب أن تكون 10 أحرف على الأقل');
      return;
    }

    setLoading(true);
    setSendSuccess(false);

    try {
      const cleanData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: cleanPhoneNumber(formData.phone),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      };

      const response = await contactService.sendMessage(cleanData);
      
      if (response?.status) {
        toast.success(response.message);
        setSendSuccess(true);
        resetForm();
        
        toast.success('(وضع التطوير) تم حفظ الرسالة محلياً', {
          icon: '💾',
          duration: 4000
        });
      } else {
        toast.error(response?.message || 'حدث خطأ في إرسال الرسالة');
      }
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      toast.error('حدث خطأ في إرسال الرسالة');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loader text="جاري تحميل معلومات الاتصال..." />;
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-skin-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <FaEnvelope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">اتصل بنا</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نحن هنا للإجابة على استفساراتك ومساعدتك في أي وقت
          </p>
        </div>

        {sendSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <FaCheckCircle className="text-green-600 w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">تم إرسال رسالتك بنجاح!</p>
              <p className="text-green-600 text-sm">سنتواصل معك في أقرب وقت ممكن</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* معلومات الاتصال */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">معلومات الاتصال</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg flex-shrink-0">
                    <FaMapMarkerAlt className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">العنوان</h3>
                    <p className="text-gray-600">{contactInfo.about?.address || 'القليوبية، طوخ، قرية الدير'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg flex-shrink-0">
                    <FaPhone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">الهاتف</h3>
                    {contactInfo.branches?.length > 0 ? (
                      contactInfo.branches.map((branch, index) => (
                        <p key={index} className="text-gray-600" dir="ltr">
                          {branch.phone || '+20 12 0196 4471'}
                        </p>
                      ))
                    ) : (
                      <>
                        <p className="text-gray-600" dir="ltr">+20 12 0196 4471</p>
                        <p className="text-gray-600" dir="ltr">+20 10 0196 4471</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg flex-shrink-0">
                    <FaEnvelope className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">البريد الإلكتروني</h3>
                    <p className="text-gray-600">info@beautytoma.com</p>
                    <p className="text-gray-600">support@beautytoma.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg flex-shrink-0">
                    <FaClock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">ساعات العمل</h3>
                    {contactInfo.hours?.length > 0 ? (
                      contactInfo.hours.map((hour, index) => (
                        <p key={index} className="text-gray-600">
                          {hour.day || 'السبت - الخميس'}: {hour.hours || '9:00 ص - 9:00 م'}
                        </p>
                      ))
                    ) : (
                      <>
                        <p className="text-gray-600">السبت - الخميس: 9:00 ص - 9:00 م</p>
                        <p className="text-gray-600">الجمعة: مغلق</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">تابعنا على</h2>
              <div className="flex gap-3">
                <a href="https://facebook.com/beautytoma" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700">
                  <FaFacebook />
                </a>
                <a href="https://instagram.com/beautytoma" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700">
                  <FaInstagram />
                </a>
                <a href="https://twitter.com/beautytoma" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500">
                  <FaTwitter />
                </a>
                <a href="https://wa.me/201001922197" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center hover:bg-green-700">
                  <FaWhatsapp />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">موقعنا</h2>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.5!2d31.25!3d30.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDMwJzAwLjAiTiAzMcKwMTUnMDAuMCJF!5e0!3m2!1sen!2seg!4v1620000000000!5m2!1sen!2seg"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="موقع المتجر على الخريطة"
                />
              </div>
            </div>
          </div>

          {/* نموذج الاتصال */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل 
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني 
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                      placeholder="01012345678"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      الموضوع 
                    </label>
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                      placeholder="موضوع الرسالة"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    الرسالة 
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-l from-primary-600 to-skin-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-skin-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FaPaperPlane />
                  {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;