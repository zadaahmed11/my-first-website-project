import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { cart, addToCart, removeFromCart, getCartTotal } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleDropdownChange = (item, fractionVal, fractionTextKey) => {
    const newPrice = item.pricePerKg * fractionVal;
    const isOil = item.category === 'زيوت طبيعية';
    const newQtyText = `${t(fractionTextKey)} ${isOil ? t('perLiter') : t('perKg')}`;
    addToCart(item, fractionVal, newQtyText, newPrice);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-stone-700 mb-4">{t('emptyCart')}</h2>
        <Link to="/" className="inline-block bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold text-sm">{t('goShopping')}</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-2xl font-black text-stone-900 mb-8 border-b pb-4">{t('cartTitle')}</h2>
      <div className="space-y-4">
        {cart.map((item) => {
          const isOil = item.category === 'زيوت طبيعية';
          return (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-xs border flex flex-col sm:flex-row gap-5 items-center justify-between">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border" />
                <div>
                  <h3 className="text-base font-bold text-stone-900">{item.name}</h3>
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
                      if (val === 0.125) key = 'fractionText_1_8';
                      if (val === 0.25) key = 'fractionText_1_4';
                      if (val === 0.5) key = 'fractionText_1_2';
                      if (val === 1.0) key = 'fractionText_1';
                      handleDropdownChange(item, val, key);
                    }}
                    className="border border-stone-200 rounded-lg p-2 bg-stone-50 text-xs font-bold"
                  >
                    <option value="" disabled>{t('customText')}</option>
                    <option value="0.125">1/8 ({t('fractionText_1_8')})</option>
                    <option value="0.25">1/4 ({t('fractionText_1_4')})</option>
                    <option value="0.5">1/2 ({t('fractionText_1_2')})</option>
                    <option value="1.0">{isOil ? `1 ${t('perLiter')}` : `1 ${t('perKg')}`}</option>
                  </select>
                </div>
                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-1">
                  <p className="text-base font-black text-emerald-800">{item.currentPrice.toFixed(2)} {t('currency')}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs font-bold"><Trash2 className="w-3.5 h-3.5" /> {t('deleteBtn')}</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-stone-900 text-stone-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-stone-400 block text-xs">{t('totalAmount')}</span>
          <span className="text-2xl font-black text-amber-400">{getCartTotal().toFixed(2)} {t('currency')}</span>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link to="/" className="flex-1 md:flex-initial bg-stone-800 border border-stone-700 px-5 py-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5"><ArrowLeft className="w-4 h-4" /> {t('continueShopping')}</Link>
          <button onClick={() => navigate('/checkout')} className="flex-1 md:flex-initial bg-amber-500 text-stone-900 px-6 py-3 rounded-xl font-black text-xs shadow-md hover:bg-amber-400 transition">{t('checkoutBtn')}</button>
        </div>
      </div>
    </div>
  );
}
