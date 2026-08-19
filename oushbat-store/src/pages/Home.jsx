import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Home({ productsData }) {
  const { t, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  

  const productsSectionRef = useRef(null);

  const CATEGORIES = [
    { id: 'All', label: lang === 'en' ? "All Products" : "كل المنتجات" },
    { id: 'أعشاب طبيعية وعطرية', label: lang === 'en' ? "Medicinal Herbs" : "أعشاب طبيعية وعطرية" },
    { id: 'توابل وبهارات', label: lang === 'en' ? "Spices & Seasonings" : "توابل وبهارات" },
    { id: 'حبوب وبقوليات', label: lang === 'en' ? "Grains & Legumes" : "حبوب وبقوليات" },
    { id: 'زيوت طبيعية', label: lang === 'en' ? "Natural Oils" : "زيوت طبيعية" }
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

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProducts = selectedCategory === 'All' 
    ? productsData 
    : (productsData || []).filter(p => {
        const dbCat = String(p.category || '').trim();
        const activeCat = String(selectedCategory).trim();
        return dbCat === activeCat || dbCat.toLowerCase().includes(activeCat.toLowerCase());
      });

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-20">
      

      <div className="container mx-auto px-4 pt-6">
        <div 
          className="relative text-white py-16 px-6 text-center shadow-lg rounded-3xl overflow-hidden flex flex-col items-center justify-center border border-[#10b981]/10"
          style={{ backgroundImage: 'radial-gradient(circle at center, #0e5234 0%, #0b422a 65%, #07301e 100%)' }}
        >
          

          <div className="bg-[#10b981]/20 text-[#10b981] text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full border border-[#10b981]/30 mb-4 animate-pulse">
            {lang === 'en' ? "🍃 100% Pure & Authentic Quality" : `🍃 جودة نقية وأصلية ${formatNumber(100)}%`}
          </div>


          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight max-w-4xl mx-auto leading-tight drop-shadow-md">
            {lang === 'en' ? "Welcome to Oshbat El Attar Shop" : "مرحباً بكم في محل عشبة العطار"}
          </h1>


          <p className="text-xs md:text-sm text-stone-300 font-medium leading-relaxed max-w-2xl mx-auto opacity-90 drop-shadow-xs">
            {lang === 'en' 
              ? "Discover our premium selection of securely sealed spices, rare wild herbs, and pure natural oils. Delivered anywhere in Egypt with full inspection guarantee at your doorstep before payment."
              : "اكتشف تشكيلتنا الفاخرة من التوابل المحكمة الغلق، الأعشاب البرية النادرة، والزيوت الطبيعية النقية. نشحن لكافة أنحاء الجمهورية مع ضمان الفحص الكامل عند باب بيتك قبل الدفع."
            }
          </p>


          <button 
            onClick={scrollToProducts}
            className="mt-6 bg-[#10b981] hover:bg-emerald-400 hover:scale-103 text-stone-900 font-black text-xs px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            {lang === 'en' ? "Browse Products Now 🛒" : "تصفح المنتجات الآن 🛒"}
          </button>

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
                    className="bg-[#0b422a] hover:bg-emerald-800 text-white px-3.5 py-2 rounded-lg text-[11px] font-black transition-all shadow-2xs text-center whitespace-nowrap"
                  >
                    {lang === 'en' ? "Add to Cart 🛒" : "أضف للعربة 🛒"}
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
