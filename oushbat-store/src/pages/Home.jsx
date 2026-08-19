import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Home({ productsData }) {
  const { t, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const CATEGORIES = [
    { id: 'All', label: lang === 'en' ? "All Products" : t('allProducts') },
    { id: 'أعشاب طبيعية وعطرية', label: lang === 'en' ? "Medicinal Herbs" : t('cat1') },
    { id: 'توابل وبهارات', label: lang === 'en' ? "Spices & Seasonings" : t('cat3') },
    { id: 'حبوب وبقوليات', label: lang === 'en' ? "Grains & Legumes" : t('cat4') },
    { id: 'زيوت طبيعية', label: lang === 'en' ? "Natural Oils" : t('cat2') }
  ];


  const cleanProductName = (name) => {
    if (!name) return '';
    return name.replace(/(اعشاب|أعشاب|توابل|بهارات|زيوت|زيت|حبوب|بقوليات|spices|herbs|oil|grains)/gi, '').trim();
  };

  const filteredProducts = selectedCategory === 'All' 
    ? productsData 
    : productsData.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-16">
      <div className="container mx-auto px-4 pt-6">
        

        <div className="relative bg-[#0b422a] text-white py-16 px-6 text-center shadow-lg rounded-3xl overflow-hidden flex flex-col items-center justify-center">
          

          <div className="bg-[#10b981]/20 text-[#10b981] text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full border border-[#10b981]/30 mb-5 animate-pulse">
            🍃 100% Pure & Authentic Quality
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">

            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 font-sans tracking-tight">
              {lang === 'en' ? "Welcome to Oushbat El Attar" : "مرحباً بكم في عشبة العطار"}
              <br />
              <span className="block mt-1">{lang === 'en' ? "Shop" : "للعطارة"}</span>
            </h1>
            

            <p className="text-xs md:text-sm text-stone-300 font-medium leading-relaxed max-w-2xl mx-auto mb-8 opacity-90">
              {lang === 'en' 
                ? "Discover our premium selection of securely sealed spices, rare wild herbs, and pure natural oils. Delivered anywhere in Egypt with full inspection guarantee at your doorstep before payment."
                : "اكتشف تشكيلتنا الفاخرة من التوابل المحكمة الغلق، الأعشاب البرية النادرة، والزيوت الطبيعية النقية. توصيل لأي مكان في مصر مع ضمان الفحص الكامل عند باب منزلك قبل الدفع."
              }
            </p>


            <button 
              onClick={() => {
                const element = document.getElementById('products-display-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#10b981] hover:bg-[#0ea5e9] text-stone-900 font-bold px-6 py-3 rounded-xl text-xs transition-all duration-300 transform hover:scale-102 shadow-md inline-flex items-center gap-1.5"
            >
              {lang === 'en' ? "Browse Products Now 🛒" : "تصفح المنتجات الآن 🛒"}
            </button>
          </div>
        </div>

      </div>


      <div className="container mx-auto px-4 py-12" id="products-display-section">
        <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 mb-10 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all text-xs whitespace-nowrap ${
                selectedCategory === cat.id 
                  ? 'bg-[#0b422a] text-white shadow-md' 
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-stone-100 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              <div className="overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-103 transition duration-500" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <h3 className="text-base font-bold mt-2.5 text-stone-900 line-clamp-1">
                    {cleanProductName(product.name)}
                  </h3>
                  <p className="text-stone-500 text-xs mt-1 leading-relaxed line-clamp-2 h-8">
                    {product.description}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-50 flex items-center justify-between">
                  <span className="text-emerald-800 font-black text-sm">
                    {product.pricePerKg} {t('currency')}
                    <span className="text-[10px] text-stone-400 font-normal"> / {product.category === 'زيوت طبيعية' ? t('perLiter') : t('perKg')}</span>
                  </span>
                  <Link to={`/product/${product.id}`} className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition">
                    {t('detailsBtn')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
