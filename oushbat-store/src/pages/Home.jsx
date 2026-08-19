import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Home({ productsData }) {
  const { t, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');


  const CATEGORIES = [
    { id: 'All', label: lang === 'en' ? "All Products" : "كل المنتجات" },
    { id: 'أعشاب طبيعية وعطرية', label: lang === 'en' ? "Medicinal Herbs" : "أعشاب طبيعية وعطرية" },
    { id: 'توابل وبهارات', label: lang === 'en' ? "Spices & Seasonings" : "توابل وبهارات" },
    { id: 'حبوب وبقوليات', label: lang === 'en' ? "Grains & Legumes" : "حبوب وبقوليات" },
    { id: 'زيوت طبيعية', label: lang === 'en' ? "Natural Oils" : "زيوت طبيعية" }
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
        <div className="relative bg-[#0b422a] text-white py-16 px-6 text-center shadow-lg rounded-3xl overflow-hidden flex flex-col items-center justify-center">
          <div className="bg-[#10b981]/20 text-[#10b981] text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full border border-[#10b981]/30 mb-5 animate-pulse">
            🍃 100% Pure & Authentic Quality
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 font-sans tracking-tight">
              {lang === 'en' ? "Welcome to Oushbat El Attar Shop" : "مرحباً بكم في متجر عشبة العطار"}
            </h1>
            <p className="text-xs md:text-sm text-stone-300 font-medium leading-relaxed max-w-2xl mx-auto opacity-90">
              {lang === 'en' 
                ? "Discover our premium selection of securely sealed spices, rare wild herbs, and pure natural oils. Delivered anywhere in Egypt with full inspection guarantee."
                : "اكتشف تشكيلتنا الفاخرة من التوابل المحكمة الغلق، الأعشاب البرية النادرة، والزيوت الطبيعية النقية مع ضمان الفحص الكامل عند باب منزلك قبل الدفع."
              }
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">

        <div className="flex flex-wrap gap-2.5 mb-10 overflow-x-auto pb-2">
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
          {filteredProducts.map((product) => {
            

            const currentName = lang === 'en' ? product.name_en : product.name_ar;
            const currentDesc = lang === 'en' ? product.desc_en : product.desc_ar;
            const currentPrice = product.price; 
            const currentImage = product.image_url || 'https://unsplash.com';


            const categoryLabel = lang === 'en' 
              ? (CATEGORIES.find(c => c.id === product.category)?.label || product.category)
              : product.category;

            return (
              <div key={product.id} className="bg-white rounded-2xl border border-stone-200/60 shadow-2xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 group">
                

                <div className="overflow-hidden rounded-xl h-44 mb-4 bg-stone-50 border border-stone-100">
                  <img 
                    src={currentImage} 
                    alt={currentName} 
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-500" 
                  />
                </div>


                <div className="mb-4">
                  <span className="text-[10px] font-bold text-stone-400 block mb-1">
                    {categoryLabel}
                  </span>
                  

                  <h3 className="text-base font-black text-stone-900 line-clamp-1">
                    {cleanProductName(currentName)}
                  </h3>
                  <p className="text-stone-500 text-xs mt-1 leading-relaxed line-clamp-2 h-8">
                    {currentDesc || (lang === 'en' ? "No description available." : "لا يوجد وصف متاح حالياً.")}
                  </p>
                </div>


                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-stone-900 font-black text-sm">
                    {currentPrice} <span className="text-xs font-bold text-stone-500">{t('currency')}</span>
                    <span className="text-[10px] text-stone-400 font-normal"> / {product.category === 'زيوت طبيعية' ? t('perLiter') : t('perKg')}</span>
                  </span>
                  
                  <Link 
                    to={`/product/${product.id}`} 
                    className="bg-stone-950 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-800 transition shadow-2xs"
                  >
                    {t('detailsBtn')}
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
