import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function AppContent() {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  const { lang } = useLanguage(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;

        if (!data || data.length === 0) {
          setDbError("الجدول فارغ في قاعدة البيانات!");
          return;
        }


        const formattedData = data.map((item) => ({
          ...item,
          price: Number(item.price || 0),
          name_en: item.name_en || "Premium Herb",
          name_ar: item.name_ar || "عشبة فاخرة",
          desc_en: item.desc_en || "Premium organic quality product.",
          desc_ar: item.desc_ar || "منتج عضوي ذو جودة عالية."
        }));

        setProductsData(formattedData);
      } catch (error) {
        console.error(error.message);
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
      <div className="min-h-screen flex items-center justify-center bg-stone-50 text-red-600 font-bold p-6">
        ⚠️ خطأ قاعدة البيانات: {dbError}
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>

            <Route path="/" element={<Home key={lang} productsData={productsData} />} />
            <Route path="/product/:id" element={<ProductDetails key={lang} productsData={productsData} />} />
            <Route path="/cart" element={<Cart key={lang} />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </LanguageProvider>
  );
}
