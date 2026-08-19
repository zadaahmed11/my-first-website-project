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

    const originalUnit = item.baseUnitVal || 1.0; 
    
    const finalUnitVal = originalUnit + fractionVal;
    const newPrice = basePrice * finalUnitVal;

    const label = isOil ? (lang === 'en' ? 'Liter' : 'لتر') : (lang === 'en' ? 'KG' : 'كيلو');
    const displayQty = finalUnitVal % 1 === 0 ? finalUnitVal.toFixed(0) : finalUnitVal.toFixed(3);
    const text = `${convertNumbers(displayQty)} ${label}`;

    addToCart({
      ...item,
      baseUnitVal: originalUnit, 
      lastAddedDropdownVal: fractionVal,
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

    addToCart({
      ...item,
      baseUnitVal: finalUnitVal,
    }, finalUnitVal, text, newPrice);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50/40 px-4 py-16 animate-fadeIn">
        
        <div className="w-56 h-56 relative mb-6 drop-shadow-xs flex items-center justify-center bg-white rounded-full p-4 border border-stone-100 shadow-2xs">
          <img 
            src="../assests/cart-empty.png" 
            alt="Empty Cart" 
            className="w-full h-full object-contain animate-bounce [animation-duration:3s]" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-black text-stone-800 text-center mb-8 tracking-tight">
          {lang === 'en' ? "Your shopping cart is empty, for now." : "عربة التسوق الخاصة بك فارغة، في الوقت الحالي."}
        </h2>

        <button 
          onClick={() => navigate('/')} 
          className="bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold text-xs md:text-sm px-16 py-3.5 rounded-xl shadow-md transition-all transform hover:scale-101 select-none"
        >
          {lang === 'en' ? "Start shopping" : "ابدأ التسوق الآن 🛒"}
        </button>

      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl animate-fadeIn">
      <h2 className="text-xl font-black text-stone-900 mb-8 border-b pb-4">
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

            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-2xs border border-stone-100 flex flex-col sm:flex-row gap-5 items-center justify-between relative overflow-hidden group">
              

              <button 
                onClick={() => removeFromCart(item.id)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-all shadow-3xs cursor-pointer"
                title={lang === 'en' ? "Remove Item" : "حذف المنتج"}
              >
                <X className="w-3.5 h-3.5" strokeWidth={3} />
              </button>


              <div className="flex items-center gap-4 w-full sm:w-auto pt-2 sm:pt-0">
                <img src={item.image_url} alt={currentName} className="w-16 h-16 object-cover rounded-xl border border-stone-100" />
                <div>
                  <h3 className="text-base font-black text-stone-900 tracking-tight">{currentName}</h3>

                  <span className="text-[10px] font-black bg-stone-100/80 text-stone-700 px-2 py-0.5 rounded-md mt-1 inline-block border border-stone-200/40">
                    {item.quantityText}
                  </span>
                </div>
              </div>


              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-stone-500">
                    {lang === 'en' ? "Add weight:" : "إضافة وزن زائد:"}
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
                      handleAccumulativeDropdown(item, val, key);
                    }}
                    className="border border-stone-200 rounded-xl p-2 bg-stone-50 text-xs font-black focus:outline-hidden focus:ring-1 focus:ring-emerald-700 cursor-pointer"
                  >
                    <option value="" disabled>{lang === 'en' ? "Select to Add" : "اختر للزيادة +"}</option>
                    <option value="0.125">{lang === 'en' ? "+1/8 ثمن" : "+ 1/8 ثمن"}</option>
                    <option value="0.25">{lang === 'en' ? "+1/4 ربع" : "+ 1/4 ربع"}</option>
                    <option value="0.5">{lang === 'en' ? "+1/2 نصف" : "+ 1/2 نصف"}</option>
                    <option value="1.0">{isOil ? (lang === 'en' ? "+1 Liter" : "+ 1 لتر") : (lang === 'en' ? "+1 KG" : "+ 1 كيلو")}</option>
                  </select>
                </div>


                <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/60 p-2.5 rounded-xl shadow-3xs">

                  <button
                    onClick={() => handleMinusStep(item)}
                    className="p-1 rounded-md bg-stone-200 text-stone-700 hover:bg-stone-300 hover:text-stone-900 transition shadow-3xs cursor-pointer"
                    title={lang === 'en' ? "Reduce weight" : "تنقيص الوزن -"}
                  >
                    <Minus className="w-3 h-3" strokeWidth={3} />
                  </button>
                  

                  <p className="text-sm font-black text-emerald-800 whitespace-nowrap px-1">
                    {convertNumbers(item.currentPrice.toFixed(2))} {t('currency')}
                  </p>
                </div>

              </div>

            </div>
          );
        })}
      </div>


      <div className="mt-8 bg-stone-950 text-stone-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-md border border-stone-800">
        <div>
          <span className="text-stone-400 block text-xs tracking-wide">{lang === 'en' ? "Total Order Amount:" : "إجمالي قيمة الطلب الحالي:"}</span>
          <span className="text-2xl font-black text-amber-400 tracking-tight">
            {convertNumbers(getCartTotal().toFixed(2))} {t('currency')}
          </span>
        </div>
        <div className="flex gap-3 w-full md:w-auto">

          <button 
            onClick={() => navigate('/')} 
            className="bg-stone-800 border border-stone-700 px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition hover:bg-stone-700 shadow-2xs cursor-pointer w-1/2 md:w-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t('continueShopping')}
          </button>
          

          <button 
            onClick={() => navigate('/checkout')} 
            className="bg-emerald-800 text-white px-7 py-3 rounded-xl font-black text-xs shadow-md hover:bg-emerald-950 transition-all transform hover:scale-101 cursor-pointer text-center w-1/2 md:w-auto"
          >
            {lang === 'en' ? "Proceed to Checkout 🚀" : "الذهاب لصفحة الدفع والشحن 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}
