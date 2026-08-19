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
      <div className="text-center py-24 text-stone-600 font-bold">
        {t ? t('productNotFound') : "Product not found!"}
      </div>
    );
  }

  const isOil = product.category === 'زيوت طبيعية';
  const unitLabel = isOil ? (lang === 'en' ? 'Liter' : 'لتر') : (lang === 'en' ? 'KG' : 'كيلو');

  const [inputPrice, setInputPrice] = useState('');
  const [inputQty, setInputQty] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);

  useEffect(() => {
    if (product) {
      setSelectedPreset({ 
        fraction: 1.0, 
        fractionText: isOil ? (lang === 'en' ? '1 Liter' : '1 لتر') : (lang === 'en' ? '1_KG' : '1 كيلو'), 
        key: 'fractionText_1' 
      });
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
    let text = lang === 'en' ? fractionTextKey.replace('fractionText_', '') : fractionTextKey;
    if (fractionTextKey === 'fractionText_1_8') text = lang === 'en' ? '1/8' : 'ثمن';
    if (fractionTextKey === 'fractionText_1_4') text = lang === 'en' ? '1/4' : 'ربع';
    if (fractionTextKey === 'fractionText_1_2') text = lang === 'en' ? '1/2' : 'نصف';
    if (fractionTextKey === 'fractionText_1') {
      text = isOil ? (lang === 'en' ? '1 Liter' : '1 لتر') : (lang === 'en' ? '1 KG' : '1 كيلو');
    }
    setSelectedPreset({ fraction, fractionText: text, key: fractionTextKey });
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
      finalQtyText = `${inputQty} ${unitLabel}`;
      finalUnitVal = parseFloat(inputQty);
    } else {
      alert(lang === 'en' ? 'Please configure your weight!' : 'الرجاء تحديد الوزن أولاً!');
      return;
    }

    addToCart(product, finalUnitVal, finalQtyText, finalPrice);
    alert(lang === 'en' ? 'Added successfully to your cart!' : 'تم إضافة الوزن المختار إلى عربة التسوق بنجاح!');
  };

  const currentName = String(lang === 'en' ? (product.name_en || product.name_ar || '') : (product.name_ar || product.name_en || ''));
  const currentDesc = String(lang === 'en' ? (product.desc_en || product.desc_ar || '') : (product.desc_ar || product.desc_en || ''));
    return (
    <div className="container mx-auto px-4 py-16 max-w-5xl animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 border border-stone-100">
        
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="relative rounded-2xl overflow-hidden h-80 bg-stone-50 border border-stone-100 shadow-xs">
              <img src={product.image_url} alt={currentName} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-[#10b981] text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-md shadow-xs">Pure</span>
              <span className="absolute bottom-3 right-3 bg-black/60 text-stone-200 font-extrabold text-[10px] px-3 py-1.5 rounded-md backdrop-blur-xs">WILD HERBS</span>
            </div>
            
            <div className="mt-6">
              <h1 className="text-2xl font-black text-stone-900 mb-2">{currentName}</h1>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-100/40">
                {product.category}
              </span>
              <p className="text-stone-600 mt-5 text-sm leading-relaxed antialiased font-medium">
                {currentDesc || (lang === 'en' ? "Premium organic quality product harvested directly from the pure nature." : "منتج عضوي ذو جودة عالية مستخلص من الطبيعة النظيفة مباشرة إليك.")}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-stone-100 hidden md:block">
            <button 
              onClick={() => navigate('/')} 
              className="text-stone-400 hover:text-emerald-800 font-bold text-xs transition-colors"
            >
              ← {t ? t('continueShopping') : (lang === 'en' ? 'Continue Shopping' : 'مواصلة التسوق')}
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-stone-50 p-6 md:p-8 rounded-2xl border border-stone-200/60 shadow-xs">
          <div>
            <h3 className="text-lg font-black text-stone-800 mb-4 border-b pb-2 tracking-tight">
              {t ? t('weightPriceTitle') : (lang === 'en' ? 'Weight & Price Settings' : 'تحديد الوزن والسعر')}
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              {t ? t('originalPrice') : (lang === 'en' ? 'Original Price' : 'السعر الأصلي')}: <span className="font-black text-[#0b422a] text-sm">{product.price} {t ? t('currency') : (lang === 'en' ? 'EGP' : 'جنيه')}</span> / {unitLabel}
            </p>

            <div className="mb-6">
              <label className="block text-xs font-bold text-stone-700 mb-2.5">
                {t ? t('choosePreset') : (lang === 'en' ? 'Select Preset Weight:' : 'اختر وزناً جاهزاً:')}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '1/8', val: 0.125, key: 'fractionText_1_8' },
                  { label: '1/4', val: 0.25, key: 'fractionText_1_4' },
                  { label: '1/2', val: 0.5, key: 'fractionText_1_2' },
                  { label: isOil ? '1 L' : '1 KG', val: 1.0, key: 'fractionText_1' }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handlePresetSelect(item.val, item.key)}
                    className={`py-2.5 rounded-xl text-xs font-black border transition-all ${
                      selectedPreset?.key === item.key 
                        ? 'bg-[#0b422a] text-white border-[#0b422a] shadow-xs' 
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-stone-200/40">
              <label className="block text-xs font-bold text-stone-700 mb-2">
                {t ? t('customValue') : (lang === 'en' ? 'Or Enter Custom Value:' : 'أو اكتب قيمة مخصصة:')}
              </label>
              
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 mb-1">
                  {t ? t('enterPrice') : (lang === 'en' ? 'Enter Price (EGP):' : 'اكتب السعر (جنيه):')}
                </label>
                <input 
                  type="number" 
                  value={inputPrice} 
                  onChange={(e) => handlePriceChange(e.target.value)} 
                  placeholder="EGP" 
                  className="w-full p-3 text-sm border border-stone-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-bold" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 mb-1">
                  {t ? t('enterQty') : (lang === 'en' ? 'Enter Quantity:' : 'اكتب الكمية:')}({unitLabel})
                </label>
                <input 
                  type="number" 
                  value={inputQty} 
                  onChange={(e) => handleQtyChange(e.target.value)} 
                  placeholder="0.00" 
                  className="w-full p-3 text-sm border border-stone-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-bold" 
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-50/60 rounded-xl border border-emerald-100/60 shadow-inner">
              <p className="text-xs font-bold text-emerald-900">
                {t ? t('currentCalc') : (lang === 'en' ? 'Current Selection:' : 'الحسبة المعتمدة حالياً:')}{' '}
                <span className="font-black text-[#0b422a] block text-base mt-1">
                  {selectedPreset 
                    ? `${(Number(product.price || 0) * selectedPreset.fraction).toFixed(2)} ${t ? t('currency') : (lang === 'en' ? 'EGP' : 'جنيه')} [${selectedPreset.fractionText}]` 
                    : inputPrice && inputQty 
                    ? `${parseFloat(inputPrice).toFixed(2)} ${t ? t('currency') : (lang === 'en' ? 'EGP' : 'جنيه')} [${inputQty} ${unitLabel}]` 
                    : '...'}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-2.5">
            <button 
              onClick={handleAddToCartAction} 
              className="w-full bg-[#0b422a] text-white py-3.5 rounded-xl font-black text-sm shadow-md hover:bg-emerald-800 transition-all"
            >
              {lang === 'en' ? "Add to Cart 🛒" : "أضف لعربة التسوق 🛒"}
            </button>
            
            <div className="grid grid-cols-2 gap-2.5">
              <button 
                onClick={() => navigate('/')} 
                className="md:hidden bg-stone-200 text-stone-800 py-3 rounded-xl font-bold text-xs hover:bg-stone-300 transition"
              >
                {t ? t('continueShopping') : (lang === 'en' ? 'Continue' : 'رجوع')}
              </button>
              <button 
                onClick={() => navigate('/cart')} 
                className="col-span-2 sm:col-span-1 bg-amber-500 text-stone-900 py-3 rounded-xl font-black text-xs hover:bg-amber-400 transition text-center shadow-xs"
              >
                {t ? t('goToCartPage') : (lang === 'en' ? 'Go to Cart' : 'العربة بالكامل')}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

