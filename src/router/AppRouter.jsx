import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

// صفحات الواجهة العامة
import Home from '../pages/interface/Home';
import Products from '../pages/interface/Products';
import ProductDetails from '../pages/interface/ProductDetails';
import Categories from '../pages/interface/Categories';
import CategoryPage from '../pages/interface/CategoryPage';
import Cart from '../pages/interface/Cart';
import Checkout from '../pages/interface/Checkout';
import Orders from '../pages/interface/Orders';
import OrderDetails from '../pages/interface/OrderDetails';
import About from '../pages/interface/About';
import Contact from '../pages/interface/Contact';
import FAQ from '../pages/interface/FAQ';
import Shipping from '../pages/interface/Shipping';
import Returns from '../pages/interface/Returns';
import Wishlist from '../pages/interface/Wishlist';
import Privacy from '../pages/interface/Privacy';
import Terms from '../pages/interface/Terms';

// صفحات المصادقة
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// صفحات لوحة التحكم
import DashboardHome from '../pages/dashboard/DashboardHome';
import DashboardProducts from '../pages/dashboard/products/Products';
import AddProduct from '../pages/dashboard/products/AddProduct';
import EditProduct from '../pages/dashboard/products/EditProduct';
import DashboardCategories from '../pages/dashboard/categories/Categories';
import AddCategory from '../pages/dashboard/categories/AddCategory';
import EditCategory from '../pages/dashboard/categories/EditCategory';
import DashboardOrders from '../pages/dashboard/orders/Orders';
import DashboardOrderDetails from '../pages/dashboard/orders/OrderDetails';
import DashboardUsers from '../pages/dashboard/users/Users';
import DashboardSettings from '../pages/dashboard/settings/Settings';
import ContactMessages from '../pages/dashboard/ContactMessages';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader text="جاري التحقق من الصلاحيات..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="categories" element={<Categories />} />
          <Route path="category/:id" element={<CategoryPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="returns" element={<Returns />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          
          <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="order/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ مسار /dashboard - مع إضافة contact-messages */}
        <Route path="/dashboard" element={<ProtectedRoute requireAdmin><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<DashboardProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="categories" element={<DashboardCategories />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="orders/:id" element={<DashboardOrderDetails />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="contact-messages" element={<ContactMessages />} /> {/* ✅ إضافة الرابط هنا */}
        </Route>

        {/* ✅ مسار /admin - مع الحفاظ على contact-messages */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<DashboardProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="categories" element={<DashboardCategories />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="orders/:id" element={<DashboardOrderDetails />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="contact-messages" element={<ContactMessages />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;