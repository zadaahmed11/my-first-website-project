import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { cart, addToCart, removeFromCart, getCartTotal } = useCart();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const convertNumbers = (numStr) => {
    if (!numStr) return '';
    if (lang === 'en') return String(numStr);
    const arabicZero = 0x0660;
    return String(numStr).replace(/[0-9]/g, (d) => String.fromCharCode(arabicZero + parseInt(d)));
  };

  const handleDropdownChange = (item, fractionVal, fractionTextKey) => {
    const basePrice = Number(item.price || 0);
    const isOil = String(item.category || '').toLowerCase().trim().includes('زيت') || 
                  String(item.category || '').toLowerCase().trim().includes('زيوت') || 
                  String(item.category || '').toLowerCase().trim().includes('oil');
                  
    const newPrice = basePrice * fractionVal;
    
    let text = t(fractionTextKey);
    if (fractionTextKey === 'fractionText_1') {
      text = isOil ? (lang === 'en' ? '1 Liter' : '1 لتر') : (lang === 'en' ? '1 KG' : '1 كيلو');
    } else {
      const fractionLabel = fractionTextKey === 'fractionText_1_8' ? '1/8' : fractionTextKey === 'fractionText_1_4' ? '1/4' : '1/2';
      const label = isOil ? (lang === 'en' ? 'Liter' : 'لتر') : (lang === 'en' ? 'KG' : 'كيلو');
      text = lang === 'en' ? `${fractionLabel} ${label}` : `${fractionLabel} ${text}`;
    }
    addToCart(item, fractionVal, text, newPrice);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50/40 px-4 py-16 animate-fadeIn">
        
        <div className="w-56 h-56 relative mb-6 drop-shadow-xs flex items-center justify-center bg-white rounded-full p-4 border border-stone-100 shadow-2xs">
          <img 
            src="https://i.pinimg.com/736x/7e/e4/de/7ee4de44590df3aed123b49639148bb7.jpg" 
            alt="Empty Cart" 
            className="w-full h-full object-contain animate-bounce [animation-duration:3s]" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-black text-stone-800 text-center mb-8 tracking-tight">
          {lang === 'en' ? "Your shopping cart is empty, for now." : "عربة التسوق الخاصة بك فارغة، في الوقت الحالي."}
        </h2>

        <button 
          onClick={() => navigate('/')} 
          className="bg-[#2a344a] hover:bg-stone-900 text-white font-extrabold text-xs md:text-sm px-16 py-3.5 rounded-xl shadow-md transition-all transform hover:scale-101 select-none"
        >
          {lang === 'en' ? "Start shopping" : "ابدأ التسوق الآن 🛒"}
        </button>

      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fadeIn">
      <h2 className="text-2xl font-black text-stone-900 mb-8 border-b pb-4">
        {lang === 'en' ? "Your Shopping Cart" : "عربة التسوق الخاصة بك"}
      </h2>
      
      <div className="space-y-4">
        {cart.map((item) => {
          const categoryText = String(item.category || '').toLowerCase().trim();
          const isOil = categoryText.includes('زيت') || 
                        categoryText.includes('زيوت') || 
                        categoryText.includes('oil') || 
                        categoryText.includes('oils');
          const currentName = lang === 'en' ? item.name_en : item.name_ar;

          return (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-2xs border border-stone-200/60 flex flex-col sm:flex-row gap-5 items-center justify-between">
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img src={item.image_url} alt={currentName} className="w-16 h-16 object-cover rounded-xl border border-stone-100" />
                <div>
                  <h3 className="text-base font-black text-stone-900">{currentName}</h3>
                  <p className="text-xs text-stone-400 mt-0.5">{item.quantityText}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-stone-500">
                    {lang === 'en' ? "Change weight:" : "تعديل الوزن:"}
                  </label>
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
                    className="border border-stone-200 rounded-xl p-2 bg-stone-50 text-xs font-black focus:outline-hidden"
                  >
                    <option value="" disabled>{lang === 'en' ? "Custom" : "مخصص"}</option>
                    <option value="0.125">{lang === 'en' ? "1/8" : "1/8 ثمن"}</option>
                    <option value="0.25">{lang === 'en' ? "1/4" : "1/4 ربع"}</option>
                    <option value="0.5">{lang === 'en' ? "1/2" : "1/2 نصف"}</option>
                    <option value="1.0">{isOil ? (lang === 'en' ? "1 Liter" : "1 لتر") : (lang === 'en' ? "1 KG" : "1 كيلو")}</option>
                  </select>
                </div>

                <div className="text-right flex items-center sm:items-end gap-4 sm:gap-1">
                  <p className="text-base font-black text-emerald-800">
                    {convertNumbers(item.currentPrice.toFixed(2))} {t('currency')}
                  </p>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="text-red-500 hover:text-red-700 text-xs font-bold transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> {lang === 'en' ? "Remove" : "حذف"}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-stone-900 text-stone-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-md">
        <div>
          <span className="text-stone-400 block text-xs">{lang === 'en' ? "Total Amount:" : "المجموع الإجمالي الكلي:"}</span>
          <span className="text-2xl font-black text-amber-400">
            {convertNumbers(getCartTotal().toFixed(2))} {t('currency')}
          </span>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => navigate('/')} 
            className="bg-stone-800 border border-stone-700 px-5 py-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition hover:bg-stone-700"
          >
            <ArrowLeft className="w-4 h-4" /> {t('continueShopping')}
          </button>
          <button 
            onClick={() => navigate('/checkout')} 
            className="bg-amber-500 text-stone-900 px-7 py-3.5 rounded-xl font-black text-xs shadow-md hover:bg-amber-400 transition"
          >
            {lang === 'en' ? "Proceed to Checkout 🚀" : "الذهاب لصفحة الدفع والشحن 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}
