import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import coverImage from '../assets/cover.png';


export default function Home({ productsData }) {
  const { t, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const productsSectionRef = useRef(null);

  const CATEGORIES = [
    { id: 'All', label: lang === 'en' ? "All Products" : "كل المنتجات" },
    { id: 'herbs', label: lang === 'en' ? "Medicinal Herbs" : "أعشاب طبيعية وعطرية" },
    { id: 'spices', label: lang === 'en' ? "Spices & Seasonings" : "توابل وبهارات" },
    { id: 'grains', label: lang === 'en' ? "Grains & Legumes" : "حبوب وبقوليات" },
    { id: 'oils', label: lang === 'en' ? "Natural Oils" : "زيوت طبيعية" }
  ];

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '';
    if (lang === 'en') return num;
    return String(num).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  };

  const cleanProductName = (name) => {
    if (!name) return '';
    return name
      .replace(/(اعشاب|أعشاب|عشبة|عشبة العطار|توابل|بهارات|زيوت|زيت|حبوب|بقوليات|spices|herbs|oil|grains|oshbat)/gi, '')
      .trim();
  };

  const normalizeArabic = (text) => {
    if (!text) return '';
    return String(text)
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/\s+/g, ' ');
  };

  const filteredProducts = selectedCategory === 'All' 
    ? productsData 
    : (productsData || []).filter(p => {
        const dbCat = String(p.category || '').toLowerCase().trim();
        const dbCatNorm = normalizeArabic(p.category);

        if (selectedCategory === 'herbs') {
          return dbCat.includes('herb') || dbCat.includes('medicinal') || dbCatNorm.includes('اعشاب') || dbCatNorm.includes('عطريه');
        }
        if (selectedCategory === 'spices') {
          return dbCat.includes('spice') || dbCat.includes('seasoning') || dbCatNorm.includes('توابل') || dbCatNorm.includes('بهارات');
        }
        if (selectedCategory === 'grains') {
          return dbCat.includes('grain') || dbCat.includes('legume') || dbCatNorm.includes('حبوب') || dbCatNorm.includes('بقوليات');
        }
        if (selectedCategory === 'oils') {
          return dbCat.includes('oil') || dbCatNorm.includes('زيوت') || dbCatNorm.includes('زيت');
        }
        return false;
      });

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-20">
      
      <div className="container mx-auto px-4 pt-6">
        <div className="w-full shadow-lg rounded-3xl overflow-hidden border border-stone-200">
          <img 
            src={coverImage} 
            alt="Oshbat El Attar Banner Design" 
            className="w-full h-auto object-cover block"
          />
        </div>
      </div>

      <div ref={productsSectionRef} className="container mx-auto px-4 py-10 scroll-mt-6">
        
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all text-xs whitespace-nowrap ${
                selectedCategory === cat.id ? 'bg-[#0b422a] text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
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

            return (
              <div key={product.id} className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-4 flex flex-col justify-between overflow-hidden group transition-all duration-300">
                
                <div className="relative rounded-xl overflow-hidden h-44 mb-3 bg-stone-50 border border-stone-100/60">
                  <img src={product.image_url} alt={currentName} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
                  
                  <span className="absolute top-2 left-2 bg-[#10b981] text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-md shadow-xs">
                    {lang === 'en' ? "Pure" : "نقي"}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-black/60 text-stone-200 font-extrabold text-[9px] px-2.5 py-1 rounded-md backdrop-blur-xs">
                    {lang === 'en' ? "WILD HERBS" : "أعشاب برية"}
                  </span>
                </div>

                <div className="mb-3">
                  <h3 className="text-sm font-black text-stone-900 tracking-tight leading-tight">{cleanProductName(currentName)}</h3>
                  <p className="text-stone-500 text-[11px] mt-1 leading-normal line-clamp-2 h-9 antialiased font-medium">
                    {currentDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex flex-col min-w-max">
                    <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wide">
                      {lang === 'en' ? "Base Price" : "السعر الأساسي"}
                    </span>
                    <span className="text-[#0b422a] font-black text-sm mt-0.5">
                      {formatNumber(product.price)} <span className="text-[10px] font-bold text-stone-500">{lang === 'en' ? "EGP" : "جنيه"}</span>
                      <span className="text-[9px] text-stone-400 font-normal">
                        {' '}/ {String(product.category).trim() === 'زيوت طبيعية' 
                          ? (lang === 'en' ? "Liter" : "لتر") 
                          : (lang === 'en' ? "Kg" : "كيلو")}
                      </span>
                    </span>
                  </div>
                  
                  <Link 
                    to={`/product/${product.id}`}
                    className="bg-stone-100 hover:bg-[#10b981] hover:text-white transition-all text-stone-700 font-bold text-[11px] px-4 py-2 rounded-xl"
                  >
                    {lang === 'en' ? "Details" : "التفاصيل"}
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
