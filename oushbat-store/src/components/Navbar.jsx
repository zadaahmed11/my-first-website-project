import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { cart } = useCart();
  const { lang, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-stone-800 p-4 sticky top-0 z-50 shadow-xs border-b border-stone-100">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-emerald-800 tracking-wide">
          {t('logo')}
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-emerald-600 font-bold transition">{t('home')}</Link>
          
          {/* زر تبديل اللغة المطور */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 bg-stone-100 text-stone-700 px-3 py-1.5 rounded-xl text-xs font-black hover:bg-emerald-50 hover:text-emerald-800 transition"
          >
            <Globe className="w-4 h-4" />
            {lang === 'en' ? 'العربية' : 'English'}
          </button>

          {/* أيقونة العربة */}
          <div className="relative cursor-pointer text-stone-700 hover:text-emerald-700 transition" onClick={() => setIsOpen(!isOpen)}>
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-stone-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* الـ Drawer الخاص بالعربة المصغرة */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end text-stone-900">
          <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h3 className="text-xl font-bold text-emerald-800">{t('miniCartTitle')}</h3>
                <button onClick={() => setIsOpen(false)}><X className="w-6 h-6 text-stone-500" /></button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <img src="https://flaticon.com" alt="Empty Cart" className="w-32 h-32 opacity-50 mb-4" />
                  <p className="text-stone-500 mb-6 font-medium">{t('emptyCart')}</p>
                  <Link 
                    to="/" 
                    onClick={() => setIsOpen(false)}
                    className="bg-emerald-800 text-white px-6 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition"
                  >
                    {t('goShopping')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[60vh]">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center border-b pb-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-stone-100" />
                      <div className="flex-1">
                        <h4 className="font-bold text-stone-800">{item.name}</h4>
                        <p className="text-sm text-stone-500">Weight: {item.quantityText}</p>
                        <p className="text-emerald-700 font-bold">{item.currentPrice} {t('currency')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4">
                <Link 
                  to="/cart" 
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-emerald-800 text-white w-full py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
                >
                  {t('viewFullCart')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
