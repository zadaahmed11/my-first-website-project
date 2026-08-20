import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const useProductHelpers = (lang, isOil, unitLabel) => {
  const convertNumbers = (numStr) => {
    if (!numStr) return '';
    if (lang === 'en') return String(numStr);
    const arabicZero = 0x0660;
    return String(numStr).replace(/[0-9]/g, (d) => String.fromCharCode(arabicZero + parseInt(d)));
  };

  const handleArabicInputClean = (val) => {
    if (!val) return '';
    return String(val).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
  };

  const getPresetLabel = (key) => {
    if (key === 'fractionText_1_8') return lang === 'en' ? '1/8' : '١/٨';
    if (key === 'fractionText_1_4') return lang === 'en' ? '1/4' : '١/٤';
    if (key === 'fractionText_1_2') return lang === 'en' ? '1/2' : '١/٢';
    return isOil ? (lang === 'en' ? '1 L' : '١ لتر') : (lang === 'en' ? '1 KG' : '١ كيلو');
  };

  return { convertNumbers, handleArabicInputClean, getPresetLabel };
};

export default function ProductDetails({ productsData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();

  const product = (productsData || []).find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="text-center py-24 text-stone-600 font-bold animate-fadeIn">
        {lang === 'en' ? "Product not found!" : "المنتج غير موجود!"}
      </div>
    );
  }

  const categoryText = String(product.category || '').toLowerCase().trim();
  const isOil = categoryText.includes('زيت') || categoryText.includes('زيوت') || categoryText.includes('oil') || categoryText.includes('oils');
  const unitLabel = isOil ? (lang === 'en' ? 'Liter' : 'لتر') : (lang === 'en' ? 'KG' : 'كيلو');

  const { convertNumbers, handleArabicInputClean, getPresetLabel } = useProductHelpers(lang, isOil, unitLabel);

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
    const labelText = getPresetLabel(fractionTextKey);
    setSelectedPreset({ fraction, fractionText: labelText, key: fractionTextKey });
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
  if (!config) return;

  addToCart(product, config.finalUnitVal, config.finalQtyText, config.finalPrice);
  
  if (target === 'checkout') {
    navigate('/checkout');
  } else {
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
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fadeIn" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8 border border-stone-100">
        
        <ProductInfoSection currentName={currentName} currentDesc={currentDesc} imageUrl={product.image_url} lang={lang} />
        
        <div className="flex flex-col justify-between bg-stone-50 p-6 rounded-2xl border border-stone-200/60 shadow-3xs">
          <ProductPricingForm 
            lang={lang} productPrice={product.price} unitLabel={unitLabel} isOil={isOil}
            selectedPreset={selectedPreset} inputPrice={inputPrice} inputQty={inputQty}
            displayPrice={displayPrice} displayWeightText={displayWeightText}
            convertNumbers={convertNumbers} onPresetSelect={handlePresetSelect}
            onPriceChange={handlePriceChange} onQtyChange={handleQtyChange}
          />
          
          <ProductActionButtons lang={lang} onCartAction={handleCartAction} onNavigate={() => navigate('/')} />
        </div>

      </div>
    </div>
  );
}


function ProductInfoSection({ currentName, currentDesc, imageUrl, lang }) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="relative rounded-2xl overflow-hidden h-80 bg-stone-50 border border-stone-100 shadow-2xs">
          <img src={imageUrl} alt={currentName} className="w-full h-full object-cover" />
          <span className="absolute top-3 left-3 bg-[#10b981] text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-md shadow-xs">Pure</span>
          <span className="absolute bottom-3 right-3 bg-black/60 text-stone-200 font-extrabold text-[9px] px-2.5 py-1 rounded-md backdrop-blur-xs">WILD HERBS</span>
        </div>
        <div className="mt-5">
          <h1 className="text-2xl md:text-3xl font-black text-stone-900 mb-2">{currentName}</h1>
          <p className="text-stone-700 text-sm mt-3 leading-relaxed antialiased font-bold">
            {currentDesc || (lang === 'en' ? "Premium organic quality product harvested directly from pure nature." : "منتج عضوي ذو جودة عالية مستخلص من الطبيعة النظيفة مباشرة إليك.")}
          </p>
        </div>
      </div>
    </div>
  );
}


function ProductPricingForm({
  lang, productPrice, unitLabel, isOil, selectedPreset, inputPrice, inputQty, 
  displayPrice, displayWeightText, convertNumbers, onPresetSelect, onPriceChange, onQtyChange
}) {
  return (
    <div>
      <p className="text-xs text-stone-400 mb-4">
        {lang === 'en' ? 'Original Price:' : 'السعر الأصلي:'} <span className="font-bold text-stone-700">{convertNumbers(productPrice)} EGP</span> / {unitLabel}
      </p>

      <div className="mb-5">
        <label className="block text-[11px] font-bold text-stone-600 mb-2">
          {lang === 'en' ? 'Select Preset Weight:' : 'اختر الوزن المجهز:'}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: lang === 'en' ? '1/8' : '١/٨', val: 0.125, key: 'fractionText_1_8' },
            { label: lang === 'en' ? '1/4' : '١/٤', val: 0.25, key: 'fractionText_1_4' },
            { label: lang === 'en' ? '1/2' : '١/٢', val: 0.5, key: 'fractionText_1_2' },
            { label: isOil ? (lang === 'en' ? '1 L' : '١ لتر') : (lang === 'en' ? '1 KG' : '١ كيلو'), val: 1.0, key: 'fractionText_1' }
          ].map((item) => (
            <button
              key={item.key} type="button" onClick={() => onPresetSelect(item.val, item.key)}
              className={`py-2.5 rounded-lg text-xs font-black border transition-all ${
                selectedPreset?.key === item.key ? 'bg-[#0b291b] text-white border-[#0b291b] shadow-sm' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-stone-200/60">
        <div>
          <label className="block text-[10px] font-bold text-stone-400 mb-1">{lang === 'en' ? 'Enter Price (EGP):' : 'أدخل السعر (جنيه):'}</label>
          <input 
            type="text" placeholder={lang === 'en' ? "EGP" : "جنيه"} value={convertNumbers(inputPrice)} 
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-stone-400"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-400 mb-1">{lang === 'en' ? `Enter Quantity (${unitLabel}):` : `أدخل الكمية (${unitLabel}):`}</label>
          <input 
            type="text" placeholder={convertNumbers("0.00")} value={convertNumbers(inputQty)} 
            onChange={(e) => onQtyChange(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-stone-400"
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-stone-200/60">
        <span className="block text-[11px] font-bold text-stone-700 mb-1">{lang === 'en' ? 'Current Selection:' : 'الاختيار الحالي:'}</span>
        <div className="text-sm font-black text-stone-900">
          {convertNumbers(displayPrice)} {lang === 'en' ? 'EGP' : 'جنيه مصري'} <span className="text-stone-500 font-bold">{displayWeightText}</span>
        </div>
      </div>
    </div>
  );
}


function ProductActionButtons({ onCartAction, onNavigate }) {
  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button" onClick={() => onCartAction('cart')}
          className="w-full bg-[#0b291b] text-white text-xs md:text-sm font-black py-3.5 rounded-xl hover:bg-[#071d13] transition-all flex items-center justify-center text-center shadow-md active:scale-[0.99] cursor-pointer min-h-[48px] whitespace-nowrap"
        >
          Add & Shop
        </button>

        <button
          type="button" onClick={() => onCartAction('checkout')}
          className="w-full bg-[#d97706] text-white text-xs md:text-sm font-black py-3.5 rounded-xl hover:bg-[#b45309] transition-all flex items-center justify-center text-center shadow-md active:scale-[0.99] cursor-pointer min-h-[48px] whitespace-nowrap"
        >
          Checkout
        </button>
      </div>

      <button
        type="button" onClick={onNavigate}
        className="w-full bg-stone-200 text-stone-700 text-xs font-bold py-3 rounded-xl hover:bg-stone-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        ◀ Back to Home
      </button>
    </div>
  );
}
