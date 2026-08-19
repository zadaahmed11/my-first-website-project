import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProductDetails({ productsData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();

  const product = productsData.find((p) => p.id === parseInt(id));

  if (!product) return <div className="text-center py-20 text-xl font-bold">{t('productNotFound')}</div>;

  const isOil = product.category === 'زيوت طبيعية';
  const unitLabel = isOil ? t('perLiter') : t('perKg');

  const [inputPrice, setInputPrice] = useState('');
  const [inputQty, setInputQty] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handlePriceChange = (val) => {
    setInputPrice(val);
    setSelectedPreset(null);
    if (val && !isNaN(val)) {
      setInputQty((parseFloat(val) / product.pricePerKg).toFixed(3));
    } else {
      setInputQty('');
    }
  };

  const handleQtyChange = (val) => {
    setInputQty(val);
    setSelectedPreset(null);
    if (val && !isNaN(val)) {
      setInputPrice((parseFloat(val) * product.pricePerKg).toFixed(2));
    } else {
      setInputPrice('');
    }
  };

  const handlePresetSelect = (fraction, fractionTextKey) => {
    setSelectedPreset({ fraction, fractionText: t(fractionTextKey) });
    setInputPrice('');
    setInputQty('');
  };

  const handleAddToCartAction = () => {
    let finalPrice = 0, finalQtyText = '', finalUnitVal = 0;

    if (selectedPreset) {
      finalPrice = product.pricePerKg * selectedPreset.fraction;
      finalQtyText = `${selectedPreset.fractionText} ${unitLabel}`;
      finalUnitVal = selectedPreset.fraction;
    } else if (inputQty && inputPrice) {
      finalPrice = parseFloat(inputPrice);
      finalQtyText = `${inputQty} ${unitLabel}`;
      finalUnitVal = parseFloat(inputQty);
    } else {
      alert(lang === 'en' ? 'Please select a weight or enter custom value!' : 'الرجاء تحديد وزن أو كتابة قيمة مخصصة أولاً!');
      return;
    }

    addToCart(product, finalUnitVal, finalQtyText, finalPrice);
    alert(lang === 'en' ? 'Cart updated successfully!' : 'تم إضافة المنتج وتحديث العربة بنجاح!');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 border border-stone-100">
        <div>
          <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded-2xl border" />
          <div className="mt-6">
            <h1 className="text-2xl font-black text-stone-900 mb-2">{product.name}</h1>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg">{product.category}</span>
            <p className="text-stone-600 mt-5 text-sm leading-relaxed">{product.description}</p>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-stone-50 p-6 rounded-2xl border border-stone-100">
          <div>
            <h3 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">{t('weightPriceTitle')}</h3>
            <p className="text-xs text-stone-500 mb-4">{t('originalPrice')}: <span className="font-black text-emerald-800 text-sm">{product.pricePerKg} {t('currency')}</span> / {unitLabel}</p>

            <div className="mb-6">
              <label className="block text-xs font-bold text-stone-700 mb-2">{t('choosePreset')}</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '1/8', val: 0.125, key: 'fractionText_1_8' },
                  { label: '1/4', val: 0.25, key: 'fractionText_1_4' },
                  { label: '1/2', val: 0.5, key: 'fractionText_1_2' },
                  { label: isOil ? '1 L' : '1 KG', val: 1.0, key: 'fractionText_1' }
                ].map((item) => (
                  <button key={item.label} onClick={() => handlePresetSelect(item.val, item.key)} className={`py-2.5 rounded-xl text-xs font-black border transition-all ${selectedPreset?.fraction === item.val ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs' : 'bg-white text-stone-700 hover:bg-stone-100'}`}>{item.label}</button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-stone-700 -mb-2">{t('customValue')}</label>
              <div>
                <label className="block text-[10px] text-stone-400 mb-1">{t('enterPrice')}</label>
                <input type="number" value={inputPrice} onChange={(e) => handlePriceChange(e.target.value)} placeholder="50" className="w-full p-3 text-sm border rounded-xl bg-white" />
              </div>
              <div>
                <label className="block text-[10px] text-stone-400 mb-1">{t('enterQty')} ({unitLabel})</label>
                <input type="number" value={inputQty} onChange={(e) => handleQtyChange(e.target.value)} placeholder="0.25" className="w-full p-3 text-sm border rounded-xl bg-white" />
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100/60">
              <p className="text-xs font-medium text-emerald-900">{t('currentCalc')} <span className="font-black text-emerald-800 block text-base mt-1">{selectedPreset ? `${(product.pricePerKg * selectedPreset.fraction).toFixed(2)} ${t('currency')} [${selectedPreset.fractionText} ${unitLabel}]` : inputPrice && inputQty ? `${parseFloat(inputPrice).toFixed(2)} ${t('currency')} [${inputQty} ${unitLabel}]` : '...'}</span></p>
            </div>
          </div>

          <div className="mt-8 space-y-2.5">
            <button onClick={handleAddToCartAction} className="w-full bg-emerald-800 text-white py-3.5 rounded-xl font-bold text-sm shadow hover:bg-emerald-700 transition-all">{t('addToCartBtn')}</button>
            <div className="grid grid-cols-2 gap-2.5">
              <button onClick={() => navigate('/')} className="bg-stone-200 text-stone-800 py-3 rounded-xl font-bold text-xs hover:bg-stone-300 transition">{t('continueShopping')}</button>
              <button onClick={() => navigate('/cart')} className="bg-amber-500 text-stone-900 py-3 rounded-xl font-black text-xs hover:bg-amber-400 transition">{t('goToCartPage')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
