import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

export default function App() {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // جلب البيانات من جدول 'products' في السوبابيز
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;

        // دالة الماب الذكية لتوحيد مسميات الأعمدة وتجنب مشاكل الـ Undefined
        const formattedData = (data || []).map((item) => ({
          id: item.id,
          name: item.name || item.title || 'منتج بدون اسم',
          category: item.category || 'عام',
          description: item.description || item.desc || 'لا يوجد وصف متاح لهذا المنتج حالياً.',
          
          // حماية السعر: يبحث عن pricePerKg أو price أو يضع 0 كقيمة افتراضية
          pricePerKg: Number(item.pricePerKg || item.price || 0),
          
          // حماية الصورة: يبحث عن image أو image_url أو يضع رابط صورة افتراضية للعطارة
          image: item.image || item.image_url || 'https://unsplash.com'
        }));

        setProductsData(formattedData);
      } catch (error) {
        console.error('حدث خطأ أثناء جلب المنتجات من قاعدة البيانات:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          {/* أنيميشن التحميل */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800 mx-auto"></div>
          <p className="mt-4 text-stone-600 font-medium">جاري الاتصال بـ Supabase وتحميل المنتجات الحية...</p>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-stone-50 flex flex-col font-sans" dir="rtl">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home productsData={productsData} />} />
              <Route path="/product/:id" element={<ProductDetails productsData={productsData} />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}
