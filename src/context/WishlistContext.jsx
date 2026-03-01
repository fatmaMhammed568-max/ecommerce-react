// @ts-nocheck
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import wishlistService from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(undefined);

/**
 * هوك مخصص لاستخدام سياق المفضلة
 * @returns {Object} دوال وبيانات المفضلة
 */
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('يجب استخدام useWishlist داخل WishlistProvider');
  }
  return context;
};

/**
 * مزود سياق المفضلة
 */
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlist(data || []);
    } catch (error) {
      console.error('خطأ في تحميل المفضلة:', error);
      toast.error('حدث خطأ في تحميل المفضلة');
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    if (!product?.id) {
      toast.error('بيانات المنتج غير صالحة');
      return;
    }

    try {
      await wishlistService.addToWishlist(product.id);
      
      setWishlist(prev => {
        const exists = prev.some(item => item.id === product.id);
        
        if (exists) {
          toast.success('المنتج موجود بالفعل في المفضلة');
          return prev;
        }
        
        toast.success('تمت إضافة المنتج إلى المفضلة');
        return [...prev, product];
      });
    } catch (error) {
      console.error('خطأ في إضافة المنتج:', error);
      toast.error('حدث خطأ في إضافة المنتج إلى المفضلة');
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!productId) {
      toast.error('معرف المنتج مطلوب');
      return;
    }

    try {
      await wishlistService.removeFromWishlist(productId);
      
      setWishlist(prev => {
        const newWishlist = prev.filter(item => item.id !== productId);
        toast.success('تم إزالة المنتج من المفضلة');
        return newWishlist;
      });
    } catch (error) {
      console.error('خطأ في إزالة المنتج:', error);
      toast.error('حدث خطأ في إزالة المنتج من المفضلة');
    }
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some(item => item.id === productId);
  };

  const wishlistCount = wishlist.length;

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistCount,
    loading
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};