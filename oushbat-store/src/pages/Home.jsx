import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext'; 

export default function Home({ productsData }) {
  const { t, lang } = useLanguage();
  const { cart } = useCart(); 
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
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-20">
      
      {/* الكافر الغامق المتناسق */}
      <div className="container mx-auto px-4 pt-6">
        <div className="relative bg-[#0b422a] text-white py-14 px-6 text-center shadow-md rounded-3xl overflow-hidden flex flex-col items-center justify-center">
          <div className="bg-[#10b981]/20 text-[#10b981] text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full border border-[#10b981]/30 mb-4 animate-pulse">
            🍃 100% Pure & Authentic Quality
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
            {lang === 'en' ? "Oushbat El Attar Shop" : "متجر عشبة العطار"}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* فلاتر الأقسام بالأعلى */}
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

        {/* الهيكل المنقسم المتوازن */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* عمود كروت المنتجات مع توسيع مكان الوصف وإخفاء الكاتيجوري تماماً */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProducts.map((product) => {
              const currentName = lang === 'en' ? product.name_en : product.name_ar;
              const currentDesc = lang === 'en' ? product.desc_en : product.desc_ar;

              return (
                <div key={product.id} className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5 flex flex-col justify-between overflow-hidden group transition-all duration-300">
                  
                  {/* حاوية الصورة والبادجات الجمالية الداخلية */}
                  <div className="relative rounded-xl overflow-hidden h-48 mb-4 bg-stone-50 border border-stone-100/60">
                    <img src={product.image_url} alt={currentName} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
                    <span className="absolute top-2.5 left-2.5 bg-[#10b981] text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-md shadow-xs">Pure</span>
                    <span className="absolute bottom-2.5 right-2.5 bg-black/60 text-stone-200 font-extrabold text-[9px] px-2.5 py-1 rounded-md backdrop-blur-xs">WILD HERBS</span>
                  </div>

                  {/* نصوص المنتج: تم حذف تصنيف الـ category تماماً ليتطابق مع الصورة وتوسيع مساحة الوصف */}
                  <div className="mb-5">
                    <h3 className="text-base font-black text-stone-900 tracking-tight">{cleanProductName(currentName)}</h3>
                    
                    {/* توسيع مساحة الوصف لـ 3 أسطر كاملة لكي يأخذ راحته في العرض */}
                    <p className="text-stone-500 text-xs mt-2 leading-relaxed line-clamp-3 h-12 antialiased font-medium">
                      {currentDesc || (lang === 'en' ? "Premium organic quality product harvested directly from the pure nature." : "منتج عضوي ذو جودة عالية مستخلص من الطبيعة النظيفة مباشرة.")}
                    </p>
                  </div>

                  {/* الفوتر الخاص بالكارت */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wide">Base Price</span>
                      <span className="text-[#0b422a] font-black text-base mt-0.5">
                        {product.price} <span className="text-xs font-bold text-stone-500">{t('currency')}</span>
                        <span className="text-[10px] text-stone-400 font-normal"> / {product.category === 'زيوت طبيعية' ? t('perLiter') : t('perKg')}</span>
                      </span>
                    </div>
                    
                    <Link 
                      to={`/product/${product.id}`}
                      className="bg-stone-950 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs"
                    >
                      {t('detailsBtn')}
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>

          {/* عمود العربة المؤقتة الجانبية في نفس الصفحة الحية */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs sticky top-28">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-sm font-black text-stone-900 tracking-tight">Temporary Shopping Cart</h3>
              <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">{cart.length} items</span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-14 flex flex-col items-center justify-center">
                <p className="text-stone-400 text-xs font-medium max-w-[200px] leading-relaxed">
                  The cart is currently empty. Add some herbs and spices!
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center border-b border-stone-100 pb-3 justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.image_url} alt={item.name} className="w-11 h-11 object-cover rounded-lg border border-stone-100" />
                      <div>
                        <h4 className="font-bold text-xs text-stone-900">
                          {cleanProductName(lang === 'en' ? item.name_en : item.name_ar)}
                        </h4>
                        <span className="text-[10px] text-stone-400 font-medium block mt-0.5">Weight: {item.quantityText}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-800">{item.currentPrice.toFixed(2)} {t('currency')}</span>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-stone-100">
                  <Link 
                    to="/cart"
                    className="w-full bg-[#0b422a] text-white py-3 rounded-xl text-xs font-black hover:bg-emerald-800 transition text-center shadow-xs block"
                  >
                    Proceed to Full Checkout 🚀
                  </Link>
                </div>
              </div>
            )}
          </div>

            </div>
      </div>
    </div>
  );
}
