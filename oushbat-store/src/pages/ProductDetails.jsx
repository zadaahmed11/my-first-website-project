import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';


const useProductHelpers = (lang, isOil) => {
  const convertNumbers = (numStr) => {
    if (!numStr) return '';
    if (lang === 'en') return String(numStr);
    return String(numStr).replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + parseInt(d)));
  };

  const handleArabicInputClean = (val) => {
    if (!val) return '';
    return String(val).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
  };

  const getPresetLabel = (key) => {
    const labels = {
      'fractionText_1_8': lang === 'en' ? '1/8' : '١/٨',
      'fractionText_1_4': lang === 'en' ? '1/4' : '١/٤',
      'fractionText_1_2': lang === 'en' ? '1/2' : '١/٢',
    };
    return labels[key] || (isOil ? (lang === 'en' ? '1 L' : '١ لتر') : (lang === 'en' ? '1 KG' : '١ كيلو'));
  };

  return { convertNumbers, handleArabicInputClean, getPresetLabel };
};

export default function ProductDetails({ productsData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { lang } = useLanguage();

  const product = (productsData || []).find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] animate-fadeIn">
        <div className="text-center bg-stone-50 border border-stone-200/80 rounded-2xl p-8 max-w-sm shadow-xs">
          <span className="text-3xl block mb-2">⚠️</span>
          <p className="text-stone-600 font-bold text-sm">
            {lang === 'en' ? "Product not found!" : "المنتج غير موجود!"}
          </p>
        </div>
      </div>
    );
  }

  const categoryText = String(product.category || '').toLowerCase().trim();
  const isOil = ['زيت', 'زيوت', 'oil', 'oils'].some(el => categoryText.includes(el));
  const unitLabel = isOil ? (lang === 'en' ? 'Liter' : 'لتر') : (lang === 'en' ? 'KG' : 'كيلو');

  const { convertNumbers, handleArabicInputClean, getPresetLabel } = useProductHelpers(lang, isOil);

  const [inputPrice, setInputPrice] = useState('');
  const [inputQty, setInputQty] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);

  useEffect(() => {
    if (product) {
      setSelectedPreset({ 
        fraction: 1.0, 
        fractionText: isOil ? (lang === 'en' ? '1 L' : '١ لتر') : (lang === 'en' ? '1 KG' : '١ كيلو'), 
        key: 'fractionText_1' 
      });
      setInputPrice('');
      setInputQty('');
    }
  }, [product, isOil, lang]);

  const basePrice = Number(product.price || 0);

  const handlePriceChange = (val) => {
    const cleanVal = handleArabicInputClean(val);
    setInputPrice(cleanVal);
    setSelectedPreset(null);
    if (cleanVal && !isNaN(cleanVal) && basePrice > 0) {
      setInputQty((parseFloat(cleanVal) / basePrice).toFixed(3));
    } else {
      setInputQty('');
    }
  };

  const handleQtyChange = (val) => {
    const cleanVal = handleArabicInputClean(val);
    setInputQty(cleanVal);
    setSelectedPreset(null);
    if (cleanVal && !isNaN(cleanVal) && basePrice > 0) {
      setInputPrice((parseFloat(cleanVal) * basePrice).toFixed(2));
    } else {
      setInputPrice('');
    }
  };

  const handlePresetSelect = (fraction, fractionTextKey) => {
    setSelectedPreset({ fraction, fractionText: getPresetLabel(fractionTextKey), key: fractionTextKey });
    setInputPrice('');
    setInputQty('');
  };

  const getConfiguration = () => {
    if (selectedPreset) {
      return {
        finalPrice: basePrice * selectedPreset.fraction,
        finalQtyText: selectedPreset.key === 'fractionText_1' ? (lang === 'en' ? `1 ${unitLabel}` : `١ ${unitLabel}`) : selectedPreset.fractionText,
        finalUnitVal: selectedPreset.fraction
      };
    } else if (inputQty && inputPrice) {
      return {
        finalPrice: parseFloat(inputPrice),
        finalQtyText: `${inputQty} ${unitLabel}`,
        finalUnitVal: parseFloat(inputQty)
      };
    }
    return null;
  };

  const handleCartAction = (target) => {
    const config = getConfiguration();
    if (!config) {
      alert(lang === 'en' ? 'Please configure weight!' : 'الرجاء تحديد الوزن أولاً!');
      return;
    }
    addToCart(product, config.finalUnitVal, config.finalQtyText, config.finalPrice);
    if (target === 'checkout') {
      navigate('/checkout');
    } else {
      alert(lang === 'en' ? 'Added successfully!' : 'تم إضافة الوزن المختار لعربة التسوق بنجاح!');
      navigate('/');
    }
  };

  let displayPrice = "0.00";
  let displayWeightText = isOil ? (lang === 'en' ? '1 Liter' : '١ لتر') : (lang === 'en' ? '1 KG' : '١ كيلو');

  if (selectedPreset) {
    displayPrice = (basePrice * selectedPreset.fraction).toFixed(2);
    displayWeightText = selectedPreset.key === 'fractionText_1' ? (lang === 'en' ? `[1 ${unitLabel.toUpperCase()}]` : `[١ ${unitLabel}]`) : `[${selectedPreset.fractionText}]`;
  } else if (inputQty && inputPrice) {
    displayPrice = parseFloat(inputPrice).toFixed(2);
    displayWeightText = `[${convertNumbers(inputQty)} ${unitLabel}]`;
  }

  const currentName = lang === 'en' ? (product.name_en || product.name_ar || '') : (product.name_ar || product.name_en || '');
  const currentDesc = lang === 'en' ? (product.desc_en || product.desc_ar || '') : (product.desc_ar || product.desc_en || '');
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fadeIn" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8 border border-stone-100">
        

        <div className="md:col-span-5 flex flex-col justify-between h-full space-y-6">
          <div>
            <div className="relative rounded-2xl overflow-hidden h-80 bg-stone-50 border border-stone-100 shadow-xs group">
              <img 
                src={imageUrl || product.image_url} 
                alt={currentName} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <span className="absolute top-4 left-4 bg-emerald-600 text-white font-black text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-lg shadow-sm">
                Pure
              </span>
              <span className="absolute bottom-4 right-4 bg-stone-900/75 text-stone-100 font-bold text-[10px] tracking-widest px-3 py-1.5 rounded-lg backdrop-blur-xs">
                WILD HERBS
              </span>
            </div>
            
            <div className="mt-6">
              <h1 className="text-2xl font-black text-stone-900 tracking-tight mb-3">{currentName}</h1>
              <p className="text-stone-600 text-sm leading-relaxed antialiased font-medium">
                {currentDesc || (lang === 'en' ? "Premium organic quality product harvested directly from pure nature." : "منتج عضوي ذو جودة عالية مستخلص من الطبيعة النظيفة مباشرة إليك.")}
              </p>
            </div>
          </div>
        </div>


        <div className="md:col-span-7 flex flex-col justify-between bg-stone-50/70 p-6 md:p-7 rounded-2xl border border-stone-200/50 shadow-xs">
          <div>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200/60">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                {lang === 'en' ? 'Original Price' : 'السعر الأصلي'}
              </span>
              <div className="text-stone-800 font-medium text-sm">
                <span className="font-black text-lg text-emerald-700">{convertNumbers(product.price || basePrice)}</span> EGP / {unitLabel}
              </div>
            </div>

            {/* الأوزان المجهزة مسبقاً */}
            <div className="mb-6">
              <label className="block text-xs font-black text-stone-700 mb-3">
                {lang === 'en' ? 'Select Preset Weight:' : 'اختر الوزن المجهز:'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: lang === 'en' ? '1/8' : '١/٨', val: 0.125, key: 'fractionText_1_8' },
                  { label: lang === 'en' ? '1/4' : '١/٤', val: 0.25, key: 'fractionText_1_4' },
                  { label: lang === 'en' ? '1/2' : '١/٢', val: 0.5, key: 'fractionText_1_2' },
                  { label: isOil ? (lang === 'en' ? '1 L' : '١ لتر') : (lang === 'en' ? '1 KG' : '١ كيلو'), val: 1.0, key: 'fractionText_1' }
                ].map((item) => {
                  const isSelected = selectedPreset?.key === item.key;
                  return (
                    <button
                      key={item.key} 
                      type="button" 
                      onClick={() => handlePresetSelect(item.val, item.key)}
                      className={`py-2.5 rounded-xl text-xs font-black border transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-[1.02]' 
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/60">
              <div className="relative">
                <label className="block text-[11px] font-black text-stone-500 mb-1.5 px-1">
                  {lang === 'en' ? 'Enter Price (EGP):' : 'أدخل السعر (جنيه):'}
                </label>
                <input 
                  type="text" 
                  placeholder={lang === 'en' ? "EGP" : "جنيه"} 
                  value={convertNumbers(inputPrice)} 
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-950 transition-all"
                />
              </div>
              <div className="relative">
                <label className="block text-[11px] font-black text-stone-500 mb-1.5 px-1">
                  {lang === 'en' ? `Enter Quantity (${unitLabel}):` : `أدخل الكمية (${unitLabel}):`}
                </label>
                <input 
                  type="text" 
                  placeholder={convertNumbers("0.00")} 
                  value={convertNumbers(inputQty)} 
                  onChange={(e) => handleQtyChange(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-950 transition-all"
                />
              </div>
            </div>


            <div className="mt-6 p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900">
                {lang === 'en' ? 'Current Selection:' : 'الاختيار الحالي:'}
              </span>
              <div className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                <span>{convertNumbers(displayPrice)} {lang === 'en' ? 'EGP' : 'جنيه'}</span>
                <span className="text-emerald-700/80 font-bold text-xs">{displayWeightText}</span>
              </div>
            </div>
          </div>

          {/* الأزرار السفلية الحديثة والمحاذاة السحرية للأيقونات */}
          <div className="mt-8 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button" 
                onClick={() => handleCartAction('cart')}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.99]"
              >
                <span>{lang === 'en' ? 'Add to cart & Shopping' : 'إضافة الي السله وتسوّق'}</span>
                <span className="text-sm">🛒</span>
              </button>

              <button
                type="button" 
                onClick={() => handleCartAction('checkout')}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.99]"
              >
                <span>{lang === 'en' ? 'Proceed to checkout' : 'استمرار والدفع'}</span>
                <span className="text-sm">🚀</span>
              </button>
            </div>

            <button
              type="button" 
              onClick={() => navigate('/')}
              className="w-full bg-stone-200/80 hover:bg-stone-300/90 text-stone-700 text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="text-xs">{lang === 'en' ? '◀ Back to Home' : '◀ العودة للرئيسية'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
