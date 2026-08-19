import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Home({ productsData }) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const CATEGORIES = [
    { id: 'All', label: t('allProducts') },
    { id: 'أعشاب طبيعية وعطرية', label: t('cat1') },
    { id: 'زيوت طبيعية', label: t('cat2') },
    { id: 'توابل وبهارات', label: t('cat3') },
    { id: 'حبوب وبقوليات', label: t('cat4') }
  ];

  const filteredProducts = selectedCategory === 'All' 
    ? productsData 
    : productsData.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-16">
      <div className="container mx-auto px-4 pt-6">
        
        {/* الكافر سيكشن المحدث: فاتح، حواف دائرية كبيرة، وبدون أي أيقونات */}
        <div className="relative bg-emerald-50 border border-emerald-100/60 text-stone-800 py-16 px-6 text-center shadow-xs rounded-3xl overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-black text-emerald-900 mb-3">
              {t('heroTitle')}
            </h1>
            <p className="text-base md:text-lg text-emerald-800 font-medium leading-relaxed">
              {t('heroDesc')}
            </p>
          </div>
        </div>

      </div>

      <div className="container mx-auto px-4 py-12">
        {/* أزرار تصفية الأقسام الأربعة الفاخرة */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-xl font-bold transition-all text-sm shadow-2xs ${
                selectedCategory === cat.id 
                  ? 'bg-emerald-800 text-white shadow-md' 
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* شبكة المنتجات الذكية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-xs border border-stone-100 hover:shadow-md transition duration-300 flex flex-col justify-between overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-bold mt-2.5 text-stone-900">{product.name}</h3>
                  <p className="text-stone-500 text-xs mt-1 line-clamp-2">{product.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-50 flex items-center justify-between">
                  <span className="text-emerald-800 font-black text-base">
                    {product.pricePerKg} {t('currency')} 
                    <span className="text-xs text-stone-400 font-normal"> / {product.category === 'زيوت طبيعية' ? t('perLiter') : t('perKg')}</span>
                  </span>
                  <Link to={`/product/${product.id}`} className="bg-stone-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition">
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
