import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { X, ArrowLeft, Minus } from 'lucide-react';

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


  const handleAccumulativeDropdown = (item, fractionVal, fractionTextKey) => {
    const basePrice = Number(item.price || 0);
    const isOil = String(item.category || '').toLowerCase().trim().includes('زيت') || 
                  String(item.category || '').toLowerCase().trim().includes('زيوت') || 
                  String(item.category || '').toLowerCase().trim().includes('oil');

    const baseOriginalUnit = item.initialUnitVal || item.selectedUnit || 1.0;
    const finalUnitVal = baseOriginalUnit + fractionVal;
    const newPrice = basePrice * finalUnitVal;

    const label = isOil ? (lang === 'en' ? 'Liter' : 'لتر') : (lang === 'en' ? 'KG' : 'كيلو');
    const displayQty = finalUnitVal % 1 === 0 ? finalUnitVal.toFixed(0) : finalUnitVal.toFixed(3);
    const text = `${convertNumbers(displayQty)} ${label}`;

    addToCart({
      ...item,
      initialUnitVal: baseOriginalUnit,
    }, finalUnitVal, text, newPrice);
  };

  const handleMinusStep = (item) => {
    const basePrice = Number(item.price || 0);
    const currentUnit = item.selectedUnit || 1.0;
    const isOil = String(item.category || '').toLowerCase().trim().includes('زيت') || 
                  String(item.category || '').toLowerCase().trim().includes('oil');

    const step = 0.25;
    if (currentUnit <= step) {
      removeFromCart(item.id);
      return;
    }

    const finalUnitVal = currentUnit - step;
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
    <div className="container mx-auto px-4 py-12 max-w-2xl animate-fadeIn">
      <h2 className="text-xl font-black text-stone-900 mb-8 border-b pb-4">
        {lang === 'en' ? "Your Shopping Cart" : "عربة التسوق الخاصة بك"}
      </h2>
      
      <div className="space-y-4">
        {cart.map((item) => {
          const categoryText = String(item.category || '').toLowerCase().trim();
          const isOil = categoryText.includes('زيت') || categoryText.includes('زيوت') || categoryText.includes('oil') || categoryText.includes('oils');
          const currentName = lang === 'en' ? item.name_en : item.name_ar;

          return (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-3xs border border-stone-100 grid grid-cols-12 gap-2 items-center relative overflow-hidden pt-7">
              
              <button 
                onClick={() => removeFromCart(item.id)}
                className="absolute top-1.5 right-1.5 ltr:left-auto ltr:right-1.5 rtl:right-auto rtl:left-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-all shadow-3xs cursor-pointer z-20"
                title={lang === 'en' ? "Remove Item" : "حذف المنتج"}
              >
                <X className="w-2.5 h-2.5" strokeWidth={3.5} />
              </button>


              <div className="col-span-12 md:col-span-5 flex items-center gap-3 w-full">
                <img src={item.image_url} alt={currentName} className="w-12 h-14 object-cover rounded-xl border border-stone-100/60 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <h3 className="text-xs font-black text-stone-900 tracking-tight leading-tight truncate">{currentName}</h3>
                  <span className="text-[9px] font-black bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md mt-1 w-fit border border-stone-200/20">
                    {item.quantityText}
                  </span>
                </div>
              </div>


              <div className="col-span-12 sm:col-span-6 md:col-span-4 flex items-center gap-1.5 w-full justify-start md:justify-center">
                <label className="text-[9px] font-bold text-stone-400 whitespace-nowrap">
                  {lang === 'en' ? "Add:" : "إضافة:"}
                </label>
                <select
                  value="" 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    let key = 'customText';
                    if (val === 0.125) key = 'fractionText_1_8';
                    if (val === 0.25) key = 'fractionText_1_4';
                    if (val === 0.5) key = 'fractionText_1_2';
                    if (val === 1.0) key = 'fractionText_1';
                    handleDropdownChange(item, val, key);
                  }}
                  className="w-full max-w-[115px] border border-stone-200 rounded-xl p-1 bg-stone-50 text-[10px] font-black focus:outline-hidden focus:ring-1 focus:ring-emerald-700 cursor-pointer text-stone-700"
                >
                  <option value="" disabled>{lang === 'en' ? "Add weight" : "وزن زائد +"}</option>
                  <option value="0.125">{lang === 'en' ? "1/8 fraction" : "1/8 ثمن"}</option>
                  <option value="0.25">{lang === 'en' ? "1/4 fraction" : "1/4 ربع"}</option>
                  <option value="0.5">{lang === 'en' ? "1/2 fraction" : "1/2 نصف"}</option>
                  <option value="1.0">{isOil ? (lang === 'en' ? "1 Liter" : "1 لتر") : (lang === 'en' ? "1 KG" : "1 كيلو")}</option>
                </select>
              </div>

              <div className="col-span-12 sm:col-span-6 md:col-span-3 flex items-center justify-between md:justify-end gap-2 bg-stone-50 border border-stone-200/40 p-1.5 rounded-xl w-full md:w-auto ltr:md:ml-auto rtl:md:mr-auto min-w-[115px]">
                <button
                  onClick={() => handleMinusStep(item)}
                  className="p-1 rounded-md bg-stone-200 text-stone-600 hover:bg-stone-300 hover:text-stone-900 transition shadow-3xs cursor-pointer"
                  title={lang === 'en' ? "Reduce" : "تنقيص -"}
                >
                  <Minus className="w-2.5 h-2.5" strokeWidth={3.5} />
                </button>
                <p className="text-[11px] font-black text-[#0b422a] whitespace-nowrap">
                  {convertNumbers(item.currentPrice.toFixed(2))} {t('currency')}
                </p>
              </div>

            </div>
          );
        })}
      </div>


      <div className="mt-8 bg-stone-950 text-stone-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md border border-stone-800">
        <div className="text-center sm:text-left rtl:sm:text-right">
          <span className="text-stone-400 block text-[10px] font-medium tracking-wide">{lang === 'en' ? "Total Amount:" : "المجموع الإجمالي الكلي:"}</span>
          <span className="text-lg font-black text-amber-400">
            {convertNumbers(getCartTotal().toFixed(2))} {t('currency')}
          </span>
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/')} 
            className="bg-stone-800 border border-stone-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition hover:bg-stone-700 shadow-2xs cursor-pointer w-1/2 sm:w-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t('continueShopping')}
          </button>
          <button 
            onClick={() => navigate('/checkout')} 
            className="bg-[#0b422a] text-white px-5 py-2 rounded-xl font-black text-xs shadow-md hover:bg-emerald-900 transition w-1/2 sm:w-auto text-center transform hover:scale-101 cursor-pointer"
          >
            {lang === 'en' ? "Checkout 🚀" : "إلى الدفع والشحن 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}
