import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

export default function App() {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 1. جلب البيانات الصافية من جدولكِ الحقيقي في Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;

        if (!data || data.length === 0) {
          setDbError("الجدول متصل بنجاح، لكنه فارغ تماماً ولا يحتوي على أي صفوف بيانات داخل Supabase حالياً!");
          return;
        }

        const formattedData = data.map((item) => ({
          ...item,
          price: Number(item.price || 0),
          name_en: item.name_en || "Premium Product",
          name_ar: item.name_ar || "منتج فاخر",
          desc_en: item.desc_en || "Premium organic quality product harvested directly from nature.",
          desc_ar: item.desc_ar || "منتج عضوي ذو جودة عالية مستخلص من الطبيعة النظيفة مباشرة."
        }));

        setProductsData(formattedData);
      } catch (error) {
        console.error('Database connection error:', error.message);
        setDbError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-800"></div>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6 text-center">
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl max-w-md shadow-xs">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-base font-bold text-red-800 mt-2">تنبيه اتصال قاعدة البيانات</h2>
          <p className="text-xs text-stone-600 mt-2 bg-white p-3 rounded-lg border font-mono text-left">
            {dbError}
          </p>
          <p className="text-xs text-stone-500 mt-3">
            تأكدي من إضافة صفوف ممتلئة بالأسماء والوصف الحقيقي داخل جدول <code className="bg-stone-100 px-1 py-0.5 rounded text-red-600">products</code> في لوحة تحكم Supabase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-stone-50 flex flex-col">
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
    </LanguageProvider>
  );
}
