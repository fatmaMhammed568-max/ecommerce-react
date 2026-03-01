// @ts-nocheck
import axios from 'axios';

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  apiKey: import.meta.env.VITE_API_KEY || '',
  version: 'v1'
};

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-Version': API_CONFIG.version,
    'X-API-Key': API_CONFIG.apiKey,  
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
});

// Interceptor للطلبات
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.metadata = { startTime: new Date() };
    
    // ✅ إزالة أي تكرار في المسار
    const url = config.url || '';
    if (url.startsWith('/api/v1/')) {
      config.url = url.replace('/api/v1/', '');
    }
    
    console.log(` [API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
    
    return config;
  },
  (error) => {
    console.error(' [API Request Error]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    const endTime = new Date();
    const startTime = response.config.metadata?.startTime;
    const duration = startTime ? endTime - startTime : 'unknown';
    
    console.log(` [API Response] ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
    
    return response;
  },
  async (error) => {
    const { response, config } = error;
    
    if (!response) {
      console.error(' [Network Error] - تحقق من اتصال السيرفر');
      
      if (!config?.__isRetry) {
        config.__isRetry = true;
        return new Promise(resolve => {
          setTimeout(() => resolve(api(config)), 2000);
        });
      }
      
      return Promise.reject({
        status: false,
        message: 'فشل الاتصال بالخادم'
      });
    }

    const status = response?.status;
    const url = config?.url;
    const method = config?.method?.toUpperCase();

    console.error(` [API Error] ${method} ${url} - Status: ${status}`, response.data);

    switch (status) {
      case 401:
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject({
          status: false,
          message: 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى'
        });

      case 403:
        return Promise.reject({
          status: false,
          message: 'ليس لديك صلاحية للوصول إلى هذا المورد'
        });

      case 404:
        return Promise.reject({
          status: false,
          message: 'المورد المطلوب غير موجود',
          isNotFound: true
        });

      case 422:
        return Promise.reject({
          status: false,
          message: response.data?.message || 'خطأ في البيانات المدخلة',
          errors: response.data?.errors || {}
        });

      default:
        return Promise.reject({
          status: false,
          message: response?.data?.message || 'حدث خطأ غير متوقع'
        });
    }
  }
);

export default api;