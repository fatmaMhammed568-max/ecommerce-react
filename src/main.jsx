// ملف main.jsx (أو index.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

/**
 * نقطة الدخول الرئيسية للتطبيق
 * يتم فيها إنشاء الجذر وتقديم التطبيق
 */
const rootElement = document.getElementById('root');

// التحقق من وجود عنصر الجذر
if (!rootElement) {
  throw new Error('لم يتم العثور على عنصر الجذر. تأكد من وجود عنصر بمعرف "root" في ملف HTML');
}

// إنشاء الجذر وتقديم التطبيق
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);