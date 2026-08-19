import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { cart, addToCart, removeFromCart, getCartTotal } = useCart();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const handleDropdownChange = (item, fractionVal, fractionTextKey) => {
    const basePrice = Number(item.price || 0);
    const isOil = item.category === 'زيوت طبيعية';
    const newPrice = isOil ? (basePrice / 1000) * fractionVal : basePrice * fractionVal;
    
    let text = t(fractionTextKey);
    if (fractionTextKey === 'fractionText_1') {
      text = isOil ? (lang === 'en' ? '250 ml' : '250 ملي') : (lang === 'en' ? '1 KG' : '1 كيلو');
    } else {
      const label = isOil ? (lang === 'en' ? 'ml' : 'ملي') : (lang === 'en' ? 'KG' : 'كيلو');
      text = `${text} ${label}`;
    }
    addToCart(item, fractionVal, text, newPrice);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fadeIn">
        <h2 className="text-xl font-bold text-stone-700 mb-4">{t('emptyCart')}</h2>
        <Link to="/" className="inline-block bg-[#0b422a] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xs hover:bg-emerald-800 transition">
          {t('goShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fadeIn">
      <h2 className="text-2xl font-black text-stone-900 mb-8 border-b pb-4">{t('cartTitle')}</h2>
      <div className="space-y-4">
        {cart.map((item) => {
          const isOil = item.category === 'زيوت طبيعية';
          return (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-2xs border border-stone-200/60 flex flex-col sm:flex-row gap-5 items-center justify-between">
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img src={item.image_url} alt="product" className="w-16 h-16 object-cover rounded-xl border border-stone-100" />
                <div>
                  <h3 className="text-base font-black text-stone-900">{lang === 'en' ? item.name_en : item.name_ar}</h3>
                  <p className="text-xs text-stone-400 mt-0.5">{item.quantityText}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-stone-500">{t('changeWeight')}</label>
                  <select
                    value={item.selectedUnit || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      let key = 'customText';
                      if (val === 0.125 || val === 30) key = 'fractionText_1_8';
                      if (val === 0.25 || val === 50) key = 'fractionText_1_4';
                      if (val === 0.5 || val === 125) key = 'fractionText_1_2';
                      if (val === 1.0 || val === 250) key = 'fractionText_1';
                      handleDropdownChange(item, val, key);
                    }}
                    className="border border-stone-200 rounded-xl p-2 bg-stone-50 text-xs font-black focus:outline-hidden"
                  >
                    <option value="" disabled>{t('customText')}</option>
                    {isOil ? (
                      <>
                        <option value="30">30 ({t('perMl')})</option>
                        <option value="50">50 ({t('perMl')})</option>
                        <option value="125">125 ({t('perMl')})</option>
                        <option value="250">250 ({t('perMl')})</option>
                      </>
                    ) : (
                      <>
                        <option value="0.125">1/8 ({t('fractionText_1_8')})</option>
                        <option value="0.25">1/4 ({t('fractionText_1_4')})</option>
                        <option value="0.5">1/2 ({t('fractionText_1_2')})</option>
                        <option value="1.0">1 ({t('perKg')})</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="text-right flex items-center sm:items-end gap-4 sm:gap-1">
                  <p className="text-base font-black text-emerald-800">{item.currentPrice.toFixed(2)} {t('currency')}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-xs font-bold transition flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> {t('deleteBtn')}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-stone-900 text-stone-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-md">
        <div>
          <span className="text-stone-400 block text-xs">{t('totalAmount')}</span>
          <span className="text-2xl font-black text-amber-400">{getCartTotal().toFixed(2)} {t('currency')}</span>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={() => navigate('/')} className="bg-stone-800 border border-stone-700 px-5 py-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition hover:bg-stone-700">
            <ArrowLeft className="w-4 h-4" /> {t('continueShopping')}
          </button>
          <button onClick={() => navigate('/checkout')} className="bg-amber-500 text-stone-900 px-7 py-3.5 rounded-xl font-black text-xs shadow-md hover:bg-amber-400 transition">
            {t('checkoutBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
