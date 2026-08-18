import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products') 
          .select('*');

        if (error) throw error;

        const formattedData = (data || []).map((item) => ({
          id: item.id,
          name: item.name || item.title || 'منتج بدون اسم',
          category: item.category || 'عام',
          description: item.description || item.desc || 'لا يوجد وصف متاح.',
          pricePerKg: Number(item.pricePerKg || item.price || 0),
          image: item.image || item.image_url || null 
        }));

        setProductsData(formattedData);
      } catch (error) {
        console.error('تفاصيل الخطأ في الكونسول:', error);
        setErrorMessage(error.message || JSON.stringify(error));
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800 mx-auto"></div>
          <p className="mt-4 text-stone-600 font-medium">جاري فحص الاتصال بالـ Database...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 max-w-xl text-center shadow-lg">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold text-red-800 mt-2">فشل جلب البيانات من Supabase</h2>
          <p className="text-stone-600 text-sm mt-2">السبب البرمجي الحقيقي هو:</p>
          <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-xl font-mono text-xs overflow-x-auto text-left" dir="ltr">
            {errorMessage}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-5 bg-red-700 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-600 transition text-sm"
          >
            إعادة محاولة الاتصال
          </button>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        
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
