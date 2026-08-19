import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

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
  const isOil = categoryText.includes('زيت') || 
                categoryText.includes('زيوت') || 
                categoryText.includes('oil') || 
                categoryText.includes('oils');

  const unitLabel = isOil ? (lang === 'en' ? 'Liter' : 'لتر') : (lang === 'en' ? 'KG' : 'كيلو');

  const [inputPrice, setInputPrice] = useState('');
  const [inputQty, setInputQty] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);


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


  useEffect(() => {
    if (product) {
      setSelectedPreset({ 
        fraction: 1.0, 
        fractionText: isOil ? (lang === 'en' ? '1 Liter' : '1 لتر') : (lang === 'en' ? '1 KG' : '1 كيلو'), 
        key: 'fractionText_1' 
      });
      setInputPrice('');
      setInputQty('');
    }
  }, [product, isOil, lang]);

  const handlePriceChange = (val) => {
    setInputPrice(val);
    setSelectedPreset(null);
    const basePrice = Number(product.price || 0);
    if (val && !isNaN(val) && basePrice > 0) {
      setInputQty((parseFloat(val) / basePrice).toFixed(3));
    } else {
      setInputQty('');
    }
  };

  const handleQtyChange = (val) => {
    setInputQty(val);
    setSelectedPreset(null);
    const basePrice = Number(product.price || 0);
    if (val && !isNaN(val) && basePrice > 0) {
      setInputPrice((parseFloat(val) * basePrice).toFixed(2));
    } else {
      setInputPrice('');
    }
  };


  const handlePresetSelect = (fraction, fractionTextKey) => {
    let labelText = '';
    if (fractionTextKey === 'fractionText_1_8') labelText = lang === 'en' ? '1/8' : 'ثمن';
    if (fractionTextKey === 'fractionText_1_4') labelText = lang === 'en' ? '1/4' : 'ربع';
    if (fractionTextKey === 'fractionText_1_2') labelText = lang === 'en' ? '1/2' : 'نصف';
    if (fractionTextKey === 'fractionText_1') {
      labelText = isOil ? (lang === 'en' ? '1 Liter' : '1 لتر') : (lang === 'en' ? '1 KG' : '1 كيلو');
    } else if (fractionTextKey !== 'fractionText_1') {
      labelText = lang === 'en' ? `${labelText} ${unitLabel}` : `${labelText} ${unitLabel}`;
    }

    setSelectedPreset({ fraction, fractionText: labelText, key: fractionTextKey });
    setInputPrice('');
    setInputQty('');
  };

  const handleAddToCartAction = () => {
    let finalPrice = 0, finalQtyText = '', finalUnitVal = 0;
    const basePrice = Number(product.price || 0);

    if (selectedPreset) {
      finalPrice = basePrice * selectedPreset.fraction;
      finalQtyText = selectedPreset.fractionText;
      finalUnitVal = selectedPreset.fraction;
    } else if (inputQty && inputPrice) {
      finalPrice = parseFloat(inputPrice);
      finalQtyText = lang === 'en' ? `${inputQty} ${unitLabel}` : `${convertNumbers(inputQty)} ${unitLabel}`;
      finalUnitVal = parseFloat(inputQty);
    } else {
      alert(lang === 'en' ? 'Please configure weight!' : 'الرجاء تحديد الوزن أولاً!');
      return;
    }

    addToCart(product, finalUnitVal, finalQtyText, finalPrice);
    alert(lang === 'en' ? 'Added successfully!' : 'تم إضافة الوزن المختار لعربة التسوق بنجاح!');
    navigate('/'); 
  };

  const currentName = lang === 'en' ? (product.name_en || product.name_ar || '') : (product.name_ar || product.name_en || '');
  const currentDesc = lang === 'en' ? (product.desc_en || product.desc_ar || '') : (product.desc_ar || product.desc_en || '');
  return (

    <div className="container mx-auto px-4 py-12 max-w-2xl animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-5 md:p-6 border border-stone-100">
        

        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="relative rounded-2xl overflow-hidden h-60 bg-stone-50 border border-stone-100 shadow-2xs">
              <img src={product.image_url} alt={currentName} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-[#10b981] text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-md shadow-xs">Pure</span>
              <span className="absolute bottom-3 right-3 bg-black/60 text-stone-200 font-extrabold text-[9px] px-2.5 py-1 rounded-md backdrop-blur-xs">WILD HERBS</span>
            </div>
            
            <div className="mt-4">
              <h1 className="text-xl font-black text-stone-900 mb-2">{currentName}</h1>
              <p className="text-stone-500 text-xs mt-2 leading-relaxed antialiased font-medium">
                {currentDesc || (lang === 'en' ? "Premium organic quality product harvested directly from the pure nature." : "منتج عضوي ذو جودة عالية مستخلص من الطبيعة النظيفة مباشرة إليك.")}
              </p>
            </div>
          </div>
        </div>


        <div className="flex flex-col justify-between bg-stone-50 p-4 rounded-2xl border border-stone-200/60 shadow-3xs">
          <div>
            <h3 className="text-sm font-black text-stone-800 mb-2.5 border-b pb-2 tracking-tight">{t('weightPriceTitle')}</h3>
            <p className="text-xs text-stone-500 mb-4">
              {t('originalPrice')}: <span className="font-black text-[#0b422a] text-sm">{convertNumbers(product.price)} {t('currency')}</span> / {unitLabel}
            </p>


            <div className="mb-4">
              <label className="block text-[11px] font-bold text-stone-600 mb-1.5">{t('choosePreset')}</label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { label: lang === 'en' ? '1/8' : '1/8 ثمن', val: 0.125, key: 'fractionText_1_8' },
                  { label: lang === 'en' ? '1/4' : '1/4 ربع', val: 0.25, key: 'fractionText_1_4' },
                  { label: lang === 'en' ? '1/2' : '1/2 نصف', val: 0.5, key: 'fractionText_1_2' },
                  { label: isOil ? (lang === 'en' ? '1 L' : '1 لتر') : (lang === 'en' ? '1 KG' : '1 كيلو'), val: 1.0, key: 'fractionText_1' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handlePresetSelect(item.val, item.key)}
                    className={`py-1.5 rounded-lg text-xs font-black border transition-all ${
                      selectedPreset?.key === item.key 
                        ? 'bg-[#0b422a] text-white border-[#0b422a] shadow-2xs' 
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>


            <div className="space-y-3 pt-2 border-t border-stone-200/40">
              <div>
                <label className="block text-[9px] font-semibold text-stone-400 mb-0.5">{t('enterPrice')}</label>
                <input 
                  type={lang === 'en' ? "number" : "text"} 
                  value={lang === 'en' ? inputPrice : convertNumbers(inputPrice)} 
                  onChange={(e) => {
                    const cleaned = handleArabicInputClean(e.target.value);
                    handlePriceChange(cleaned);
                  }} 
                  placeholder={lang === 'en' ? "EGP" : "جنيه"} 
                  className="w-full p-2 text-xs border border-stone-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-bold" 
                />
              </div>
              
              <div>
                <label className="block text-[9px] font-semibold text-stone-400 mb-0.5">{t('enterQty')} ({unitLabel})</label>
                <input 
                  type={lang === 'en' ? "number" : "text"} 
                  value={lang === 'en' ? inputQty : convertNumbers(inputQty)} 
                  onChange={(e) => {
                    const cleaned = handleArabicInputClean(e.target.value);
                    handleQtyChange(cleaned);
                  }} 
                  placeholder="0.00" 
                  className="w-full p-2 text-xs border border-stone-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-bold" 
                />
              </div>
            </div>


            <div className="mt-4 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/60 shadow-inner">
              <p className="text-[11px] font-bold text-emerald-900">
                {t('currentCalc')}{' '}
                <span className="font-black text-[#0b422a] block text-xs mt-0.5">
                  {selectedPreset 
                    ? `${convertNumbers(Number(product.price * selectedPreset.fraction).toFixed(2))} ${t('currency')} [${selectedPreset.fractionText}]` 
                    : inputPrice && inputQty 
                    ? `${convertNumbers(parseFloat(inputPrice).toFixed(2))} ${t('currency')} [${lang === 'en' ? inputQty : convertNumbers(inputQty)} ${unitLabel}]` 
                    : '...'}
                </span>
              </p>
            </div>
          </div>


          <div className="mt-5 space-y-2">
            <button 
              onClick={handleAddToCartAction} 
              className="w-full bg-[#0b422a] text-white py-2.5 rounded-xl font-black text-xs shadow-xs hover:bg-emerald-800 transition-all transform hover:scale-101"
            >
              {lang === 'en' ? "Add to Cart & Continue Shopping 🛒" : "أضف للعربة واكمل التسوق 🛒"}
            </button>
            
            <button 
              onClick={() => navigate('/checkout')} 
              className="w-full bg-amber-500 text-stone-900 py-2.5 rounded-xl font-black text-xs hover:bg-amber-400 transition-all shadow-xs text-center block transform hover:scale-101"
            >
              {lang === 'en' ? "Proceed to Checkout & Shipping 🚀" : "الذهاب لصفحة الشحن والدفع 🚀"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
