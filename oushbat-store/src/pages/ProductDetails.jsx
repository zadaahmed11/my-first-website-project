import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductDetails({ productsData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = productsData.find((p) => p.id === parseInt(id));

  if (!product) return <div className="text-center py-20 text-xl font-bold">المنتج غير موجود!</div>;

  const isOil = product.category === 'زيوت طبيعية';
  const unitLabel = isOil ? 'ليتر' : 'كيلو';

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

  const handlePresetSelect = (fraction, fractionText) => {
    setSelectedPreset({ fraction, fractionText });
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
      alert('الرجاء تحديد وزن أو كتابة قيمة مخصصة أولاً!');
      return;
    }

    addToCart(product, finalUnitVal, finalQtyText, finalPrice);
    alert('تم إضافة المنتج وتحديث العربة بنجاح!');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 border">
        <div>
          <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded-2xl border" />
          <div className="mt-6">
            <h1 className="text-3xl font-extrabold text-stone-900 mb-2">{product.name}</h1>
            <span className="text-sm font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full">{product.category}</span>
            <p className="text-stone-600 mt-4"><strong>الوصف والفوائد:</strong> {product.description}</p>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-stone-50 p-6 rounded-2xl border">
          <div>
            <h3 className="text-xl font-bold text-stone-800 mb-4 border-b pb-2">تحديد الوزن والسعر</h3>
            <p className="text-sm text-stone-500 mb-4">السعر الأصلي: <span className="font-extrabold text-emerald-800">{product.pricePerKg} جنيه</span> لكل {unitLabel}</p>

            <div className="mb-6">
              <label className="block text-sm font-bold text-stone-700 mb-2">اختر وزناً جاهزاً (مستقل):</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '1/8', val: 0.125, text: 'ثمن' },
                  { label: '1/4', val: 0.25, text: 'ربع' },
                  { label: '1/2', val: 0.5, text: 'نصف' },
                  { label: isOil ? '1 ليتر' : '1 كيلو', val: 1.0, text: '1' }
                ].map((item) => (
                  <button key={item.label} onClick={() => handlePresetSelect(item.val, item.text)} className={`py-2 rounded-xl font-bold border transition ${selectedPreset?.fraction === item.val ? 'bg-amber-500 text-stone-900 border-amber-500' : 'bg-white text-stone-700 hover:bg-stone-100'}`}>{item.label}</button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-stone-700 -mb-2">أو اكتب قيمة مخصصة:</label>
              <div>
                <label className="block text-xs text-stone-500 mb-1">السعر (جنيه):</label>
                <input type="number" value={inputPrice} onChange={(e) => handlePriceChange(e.target.value)} placeholder="مثال: 50" className="w-full p-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">الكمية ({unitLabel}):</label>
                <input type="number" value={inputQty} onChange={(e) => handleQtyChange(e.target.value)} placeholder="مثال: 0.25" className="w-full p-3 border rounded-xl" />
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm font-medium text-emerald-900">الحسبة الحالية: <span className="font-extrabold text-emerald-800 block text-lg mt-1">{selectedPreset ? `${(product.pricePerKg * selectedPreset.fraction).toFixed(2)} جنيه مقابل ${selectedPreset.fractionText} ${unitLabel}` : inputPrice && inputQty ? `${parseFloat(inputPrice).toFixed(2)} جنيه مقابل ${inputQty} ${unitLabel}` : 'قم بالاختيار أو الكتابة أولاً'}</span></p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button onClick={handleAddToCartAction} className="w-full bg-emerald-800 text-white py-3.5 rounded-xl font-bold shadow hover:bg-emerald-700 transition">إضافة وتحديث العربة</button>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/')} className="bg-stone-200 text-stone-800 py-3 rounded-xl font-bold text-sm">مواصلة التسوق</button>
              <button onClick={() => navigate('/cart')} className="bg-amber-500 text-stone-900 py-3 rounded-xl font-bold text-sm">ذهاب للعربة بالكامل</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
