import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Home({ productsData }) {
  const { t, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const CATEGORIES = [
    { id: 'All', label: t('allProducts') },
    { id: 'أعشاب طبيعية وعطرية', label: lang === 'en' ? "Natural Herbs" : t('cat1') },
    { id: 'زيوت طبيعية', label: lang === 'en' ? "Natural Oils" : t('cat2') },
    { id: 'توابل وبهارات', label: lang === 'en' ? "Spices & Seasonings" : t('cat3') },
    { id: 'حبوب وبقوليات', label: lang === 'en' ? "Grains & Legumes" : t('cat4') }
  ];


  const cleanProductName = (name) => {
    if (!name) return '';
    return name
      .replace(/(اعشاب|أعشاب|توابل|بهارات|زيوت|زيت|حبوب|بقوليات|spices|herbs|oil|grains)/gi, '')
      .trim();
  };

  const filteredProducts = selectedCategory === 'All' 
    ? productsData 
    : productsData.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-16">
      <div className="container mx-auto px-4 pt-6">
        

        <div className="relative bg-emerald-800 text-white py-20 px-6 text-center shadow-lg rounded-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent animate-pulse"></div>
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-700/40 rounded-full blur-2xl"></div>
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-wide drop-shadow-xs">
              {t('heroTitle')}
            </h1>
            <p className="text-sm md:text-base text-emerald-100 font-medium leading-relaxed max-w-xl mx-auto">
              {t('heroDesc')}
            </p>
          </div>
        </div>

      </div>

      <div className="container mx-auto px-4 py-12">

        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all text-xs ${
                selectedCategory === cat.id 
                  ? 'bg-emerald-800 text-white shadow-md scale-102' 
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-xs border border-stone-100 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
              <div className="overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {lang === 'en' ? 'Premium Quality' : product.category}
                  </span>

                  <h3 className="text-base font-black mt-3 text-stone-900 line-clamp-1">
                    {cleanProductName(product.name)}
                  </h3>
                  <p className="text-stone-500 text-xs mt-1.5 leading-relaxed line-clamp-2 h-8">
                    {product.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-stone-50 flex items-center justify-between">
                  <span className="text-emerald-800 font-extrabold text-base">
                    {product.pricePerKg} {t('currency')}
                    <span className="text-[10px] text-stone-400 font-normal"> / {product.category === 'زيوت طبيعية' ? t('perLiter') : t('perKg')}</span>
                  </span>
                  <Link to={`/product/${product.id}`} className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all shadow-xs">
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
