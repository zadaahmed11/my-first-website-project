import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext'; // استدعاء لغة السيستم الحية
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
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;

        const formattedData = (data || []).map((item) => ({
          id: item.id,
          name: item.name || item.title || 'Product',
          category: item.category || 'General',
          description: item.description || 'Premium Quality Attar Product',
          pricePerKg: Number(item.pricePerKg || item.price || 0),
          image: item.image || item.image_url || 'https://unsplash.com'
        }));
        setProductsData(formattedData);
      } catch (error) {
        console.error('Database connection error:', error.message);
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
