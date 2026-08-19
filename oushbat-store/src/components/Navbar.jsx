import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { cart } = useCart();
  const { lang, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white text-stone-800 py-5 px-8 sticky top-0 z-50 shadow-2xs border-b border-stone-100">
      <div className="container mx-auto flex justify-between items-center">
        
        <div className="flex items-center gap-3">
          <span className="text-4xl text-emerald-700 font-bold">🌿</span>
          <div className="flex flex-col">
            <Link to="/" className="text-xl font-black text-emerald-900 tracking-wide leading-none">
              {t('logo')}
            </Link>
            <span className="text-[10px] text-stone-400 mt-1 font-medium">
              {lang === 'en' ? "Pure nature and authentic quality straight to your doorstep" : "الطبيعة النقية مباشرة إلى باب منزلك"}
            </span>
          </div>
        </div>
        

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-stone-500">
            <span>{lang === 'en' ? "Cash on Delivery 🤝" : "الدفع عند الاستلام 🤝"}</span>
            <span className="text-stone-300">|</span>
            <span>{lang === 'en' ? "Fast shipping 📦" : "شحن سريع وآمن 📦"}</span>
          </div>


          <button 
            onClick={toggleLanguage}
            className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all"
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>


          <div 
            className="relative p-2.5 bg-stone-50 hover:bg-emerald-50 rounded-xl cursor-pointer text-stone-700 hover:text-emerald-800 transition-all border border-stone-100/60"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </div>


      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end text-stone-900 animate-fadeIn">
          <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h3 className="text-lg font-bold text-emerald-800">{t('miniCartTitle')}</h3>
                <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-stone-400" /></button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <p className="text-stone-500 mb-6 text-sm font-medium">{t('emptyCart')}</p>
                  <button onClick={() => { setIsOpen(false); navigate('/'); }} className="bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition">{t('goShopping')}</button>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[65vh]">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center border-b pb-3">
                      <img src={item.image_url} alt="product" className="w-14 h-14 object-cover rounded-xl border" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-stone-800">{lang === 'en' ? item.name_en : item.name_ar}</h4>
                        <p className="text-xs text-stone-400">{item.quantityText}</p>
                        <p className="text-emerald-700 text-xs font-bold mt-0.5">{item.currentPrice.toFixed(2)} {t('currency')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t pt-4">
                <button onClick={() => { setIsOpen(false); navigate('/cart'); }} className="block text-center bg-emerald-800 text-white w-full py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition">{t('viewFullCart')}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
