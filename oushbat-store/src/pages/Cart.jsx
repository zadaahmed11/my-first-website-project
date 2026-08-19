import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { X, ArrowLeft } from 'lucide-react';

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

  const handleDropdownAction = (item, actionType, fractionVal) => {
    const basePrice = Number(item.price || 0);
    const currentUnit = item.selectedUnit || 1.0;
    const isOil = String(item.category || '').toLowerCase().trim().includes('زيت') || 
                  String(item.category || '').toLowerCase().trim().includes('زيوت') || 
                  String(item.category || '').toLowerCase().trim().includes('oil');

    let finalUnitVal = currentUnit;

    if (actionType === 'increase') {
      finalUnitVal = currentUnit + fractionVal;
    } else if (actionType === 'decrease') {
      if (currentUnit <= fractionVal) {
        removeFromCart(item.id);
        return;
      }
      finalUnitVal = currentUnit - fractionVal;
    }

    const newPrice = basePrice * finalUnitVal;
    const label = isOil ? (lang === 'en' ? 'Liter' : 'لتر') : (lang === 'en' ? 'KG' : 'كيلو');
    
    const displayQty = finalUnitVal % 1 === 0 ? finalUnitVal.toFixed(0) : finalUnitVal.toFixed(3);
    const text = `${convertNumbers(displayQty)} ${label}`;

    addToCart(item, finalUnitVal, text, newPrice);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50/40 px-4 py-16 animate-fadeIn">
        <div className="w-56 h-56 relative mb-6 flex items-center justify-center bg-white rounded-full p-4 border border-stone-100 shadow-2xs animate-bounce [animation-duration:3s]">
          <svg viewBox="0 0 24 24" className="w-40 h-40" fill="none" xmlns="http://w3.org">
            <circle cx="12" cy="12" r="10" fill="#fef3c7" />
            <path d="M3 3H5L6.68 14.39C6.8 15.17 7.47 15.75 8.26 15.75H17.74C18.53 15.75 19.2 15.17 19.32 14.39L21 4H6.5" stroke="#0b422a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="20" r="1.5" fill="#f59e0b" stroke="#0b422a" strokeWidth="1.5"/>
            <circle cx="17" cy="20" r="1.5" fill="#f59e0b" stroke="#0b422a" strokeWidth="1.5"/>
            <path d="M12 7V13M9 10H15" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 className="text-xl md:text-2xl font-black text-stone-800 text-center mb-8 tracking-tight">
          {lang === 'en' ? "Your shopping cart is empty, for now." : "عربة التسوق الخاصة بك فارغة، في الوقت الحالي."}
        </h2>

        <button 
          onClick={() => navigate('/')} 
          className="bg-[#0b422a] hover:bg-emerald-900 text-white font-extrabold text-xs md:text-sm px-16 py-3.5 rounded-xl shadow-md transition-all select-none cursor-pointer"
        >
          {lang === 'en' ? "Start shopping" : "ابدأ التسوق الآن 🛒"}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fadeIn">
      <h2 className="text-xl font-black text-stone-900 mb-8 border-b pb-4">
        {lang === 'en' ? "Your Shopping Cart" : "عربة التسوق الخاصة بك"}
      </h2>
      
      <div className="space-y-4">
        {cart.map((item) => {
          const categoryText = String(item.category || '').toLowerCase().trim();
          const isOil = categoryText.includes('زيت') || categoryText.includes('زيوت') || categoryText.includes('oil') || categoryText.includes('oils');
          const currentName = lang === 'en' ? item.name_en : item.name_ar;
          const labelUnit = isOil ? (lang === 'en' ? 'L' : 'لتر') : (lang === 'en' ? 'KG' : 'كيلو');

          return (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-3xs border border-stone-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative overflow-visible pt-8">
              
              <button 
                onClick={() => removeFromCart(item.id)}
                className="absolute top-2 right-2 ltr:left-auto ltr:right-2 rtl:right-auto rtl:left-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-all shadow-3xs cursor-pointer z-20"
                title={lang === 'en' ? "Remove Item" : "حذف المنتج"}
              >
                <X className="w-2.5 h-2.5" strokeWidth={3.5} />
              </button>

              <div className="flex items-center gap-4 w-full md:w-1/3 flex-shrink-0">
                <img src={item.image_url} alt={currentName} className="w-14 h-14 object-cover rounded-xl border border-stone-100/60 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <h3 className="text-sm font-black text-stone-900 tracking-tight leading-tight truncate">{currentName}</h3>
                  <span className="text-[10px] font-black bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-md mt-1 w-fit border border-stone-200/20">
                    {item.quantityText}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-1/3 justify-start md:justify-center flex-shrink-0 relative z-30">
                <label className="text-[10px] font-bold text-stone-400 whitespace-nowrap">
                  {lang === 'en' ? "Add weight:" : "إضافة وزن:"}
                </label>
                <select
                  value="" 
                  onChange={(e) => {
                    const [action, valStr] = e.target.value.split(':');
                    handleDropdownAction(item, action, parseFloat(valStr));
                  }}
                  className="w-full max-w-[140px] border border-stone-200 rounded-xl p-1.5 bg-white text-[11px] font-black focus:outline-hidden focus:ring-1 focus:ring-emerald-700 cursor-pointer text-stone-700 shadow-3xs"
                >
                  <option value="" disabled>{lang === 'en' ? "Modify weight" : "تعديل الوزن"}</option>
                  
                  <optgroup label={lang === 'en' ? "➕ Increase weight" : "➕ زيادة الوزن"}>
                    <option value="increase:0.125">{lang === 'en' ? "+ 1/8 fraction" : "+ ثمن الكيلو"}</option>
                    <option value="increase:0.25">{lang === 'en' ? "+ 1/4 fraction" : "+ ربع كيلو"}</option>
                    <option value="increase:0.5">{lang === 'en' ? "+ 1/2 fraction" : "+ نصف كيلو"}</option>
                    <option value={`increase:1.0`}>{lang === 'en' ? `+ 1 ${labelUnit}` : `+ 1 ${labelUnit}`}</option>
                  </optgroup>

                  <optgroup label={lang === 'en' ? "➖ Decrease weight" : "➖ تنقيص الوزن"}>
                    <option value="decrease:0.125">{lang === 'en' ? "- 1/8 fraction" : "- ثمن الكيلو"}</option>
                    <option value="decrease:0.25">{lang === 'en' ? "- 1/4 fraction" : "- ربع كيلو"}</option>
                    <option value="decrease:0.5">{lang === 'en' ? "- 1/2 fraction" : "- نصف كيلو"}</option>
                    <option value={`decrease:1.0`}>{lang === 'en' ? `- 1 ${labelUnit}` : `- 1 ${labelUnit}`}</option>
                  </optgroup>
                </select>
              </div>

              <div className="flex items-center justify-center md:justify-end bg-stone-50 border border-stone-200/40 py-2 px-4 rounded-xl w-full md:w-auto md:min-w-[120px] flex-shrink-0 shadow-3xs">
                <p className="text-xs font-black text-[#0b422a] whitespace-nowrap tracking-tight">
                  {convertNumbers(item.currentPrice.toFixed(2))} {t('currency')}
                </p>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
