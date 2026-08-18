import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// مكون ذكي لضمان صعود الشاشة للأعلى تلقائياً عند الانتقال بين الصفحات (LTR)
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

        // 🛠️ الربط الجغرافي والبرمجي المتوافق مع جدول الـ SQL الخاص بكِ بالملي
        const formattedData = (data || []).map((item) => ({
          id: item.id,
          // قراءة حقل الاسم الإنجليزي name_en وفي حال غيابه يقرأ name_ar
          name: item.name_en || item.name_ar || 'Unnamed Product', 
          category: item.category || 'General',
          // قراءة حقل الوصف الإنجليزي desc_en وفي حال غيابه يقرأ desc_ar
          description: item.desc_en || item.desc_ar || 'No description available.',
          // مطابقة حقل السعر المسمى price في جدولكِ وتحويله لرقم نقي
          pricePerKg: Number(item.price || 0),
          // مطابقة حقل الصورة المسمى image_url في جدولكِ
          image: item.image_url || null 
        }));

        setProductsData(formattedData);
      } catch (error) {
        console.error('Database connection error logs:', error);
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
          <p className="mt-4 text-stone-600 font-medium">Connecting to Supabase Database...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 max-w-xl text-center shadow-lg">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold text-red-800 mt-2">Database Connection Failed</h2>
          <p className="text-stone-600 text-sm mt-2">The system encountered the following error:</p>
          <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-xl font-mono text-xs overflow-x-auto text-left" dir="ltr">
            {errorMessage}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-5 bg-red-700 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-600 transition text-sm"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        
        {/* ضبط التوجيه العام للمشروع بالكامل ليصبح إنجليزي LTR افتراضي ونظيف */}
        <div className="min-h-screen bg-stone-50 flex flex-col font-sans" dir="ltr">
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
