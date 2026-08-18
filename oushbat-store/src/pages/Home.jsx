import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react'; 

const CATEGORIES = ['أعشاب طبيعية وعطرية', 'زيوت طبيعية', 'توابل وبهارات', 'حبوب وبقوليات'];

export default function Home({ productsData = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  
  const filteredProducts = selectedCategory === 'الكل' 
    ? productsData 
    : productsData.filter(p => p && p.category === selectedCategory);

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800">
      
      <div className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-stone-100 py-24 px-6 text-center shadow-md overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/20 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center bg-emerald-800/40 p-3 rounded-full mb-4 backdrop-blur-sm border border-emerald-700/30">
            <Leaf className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md tracking-wide">🌿 Oushbat El Attar</h1>
          <p className="text-lg md:text-xl text-emerald-100 font-medium">أجود أنواع الأعشاب الخضراء، التوابل الفاخرة، والزيوت الطبيعية المعصورة</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button 
            onClick={() => setSelectedCategory('الكل')} 
            className={`px-5 py-2.5 rounded-full font-bold transition shadow-sm ${selectedCategory === 'الكل' ? 'bg-amber-500 text-stone-900' : 'bg-white text-emerald-800 border border-stone-200 hover:bg-stone-100'}`}
          >
            كل المنتجات
          </button>
          {CATEGORIES.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              className={`px-5 py-2.5 rounded-full font-bold transition shadow-sm ${selectedCategory === cat ? 'bg-amber-500 text-stone-900' : 'bg-white text-emerald-800 border border-stone-200 hover:bg-stone-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 max-w-xl mx-auto p-8 shadow-sm">
            <Leaf className="w-16 h-16 text-emerald-800 opacity-30 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-stone-700 mb-2">القسم فارغ مؤقتاً!</h3>
            <p className="text-stone-500 text-sm">جاري تحديث وتوفير منتجات هذا القسم من قبل العطار، تفقد الأقسام الأخرى.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-stone-100 flex flex-col justify-between group">
                <div className="overflow-hidden relative bg-stone-100 h-48 flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-50 flex flex-col items-center justify-center text-emerald-800/40">
                      <Leaf className="w-12 h-12 mb-1" />
                      <span className="text-xs font-semibold">صورة قريباً</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 Bird px-2.5 py-1 rounded-full border border-amber-100">{product.category}</span>
                    <h3 className="text-lg font-bold mt-3 text-stone-900">{product.name}</h3>
                    <p className="text-stone-500 text-sm mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-emerald-800 font-black text-lg">
                      {(Number(product.pricePerKg) || 0).toFixed(2)} جنيه 
                      <span className="text-xs text-stone-400 font-normal"> /{product.category === 'زيوت طبيعية' ? 'ليتر' : 'كيلو'}</span>
                    </span>
                    <Link 
                      to={`/product/${product.id}`} 
                      className="bg-emerald-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition"
                    >
                      تفاصيل المنتج
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
