import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * التخطيط الرئيسي للتطبيق
 * يحتوي على الشريط العلوي والتذييل ويحيط بالمحتوى الرئيسي
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* الشريط العلوي */}
      <Navbar />
      
      {/* المحتوى الرئيسي - يتمدد لملء المساحة المتبقية */}
      <main className="flex-grow" id="main-content">
        <Outlet />
      </main>
      
      {/* التذييل */}
      <Footer />
    </div>
  );
};

export default MainLayout;