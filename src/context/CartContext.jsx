// @ts-nocheck
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

/**
 * هوك مخصص لاستخدام سياق السلة
 * @returns {Object} دوال وبيانات السلة
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('يجب استخدام useCart داخل CartProvider');
  }
  return context;
};

/**
 * مزود سياق السلة
 */
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartFromAPI();
    } else {
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated]);

  const fetchCartFromAPI = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      
      if (response?.status && response.data?.items) {
        setCartItems(response.data.items);
      } else {
        loadCartFromLocalStorage();
      }
    } catch (error) {
      console.error('خطأ في جلب السلة:', error);
      loadCartFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('خطأ في قراءة السلة:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
    
    const total = cartItems.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
    
    setCartTotal(total);
  }, [cartItems, isAuthenticated]);

  const syncWithAPI = async (items) => {
    if (isAuthenticated) {
      try {
        await cartService.syncCart(items);
      } catch (error) {
        console.error('خطأ في مزامنة السلة:', error);
      }
    }
  };

  const addToCart = async (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      let newItems;
      if (existingItem) {
        toast.success('تم تحديث الكمية في السلة');
        newItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      } else {
        toast.success('تمت إضافة المنتج إلى السلة');
        newItems = [...prevItems, { ...product, quantity }];
      }

      syncWithAPI(newItems);
      return newItems;
    });
  };

  const removeFromCart = async (productId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      toast.success('تم إزالة المنتج من السلة');
      syncWithAPI(newItems);
      return newItems;
    });
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      syncWithAPI(newItems);
      return newItems;
    });
  };

  const clearCart = async () => {
    setCartItems([]);
    toast.success('تم إفراغ السلة');

    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error('خطأ في إفراغ السلة:', error);
      }
    }
  };

  const cartCount = cartItems.reduce((count, item) => count + (item.quantity || 1), 0);

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};