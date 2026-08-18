import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['أعشاب طبيعية وعطرية', 'زيوت طبيعية', 'توابل وبهارات', 'حبوب وبقوليات'];

export default function Home({ productsData }) {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const filteredProducts = selectedCategory === 'الكل' ? productsData : productsData.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800">
      <div className="relative bg-emerald-900 text-stone-100 py-24 px-6 text-center shadow-inner overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://unsplash.com')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow">🌿 Oushbat El Attar</h1>
          <p className="text-lg md:text-xl text-emerald-100 font-medium">أجود أنواع الأعشاب، التوابل، والزيوت الطبيعية</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button onClick={() => setSelectedCategory('الكل')} className={`px-5 py-2.5 rounded-full font-bold transition ${selectedCategory === 'الكل' ? 'bg-amber-500 text-stone-900' : 'bg-white text-emerald-800 border'}`}>كل المنتجات</button>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2.5 rounded-full font-bold transition ${selectedCategory === cat ? 'bg-amber-500 text-stone-900' : 'bg-white text-emerald-800 border'}`}>{cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden border flex flex-col justify-between">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">{product.category}</span>
                  <h3 className="text-xl font-bold mt-2 text-stone-900">{product.name}</h3>
                  <p className="text-stone-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-emerald-700 font-extrabold text-lg">{product.pricePerKg} جنيه <span className="text-xs text-stone-400">/{product.category === 'زيوت طبيعية' ? 'ليتر' : 'كيلو'}</span></span>
                  <Link to={`/product/${product.id}`} className="bg-emerald-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition">تفاصيل المنتج</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
