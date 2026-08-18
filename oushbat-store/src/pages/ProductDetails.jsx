import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductDetails({ productsData = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = productsData.find((p) => p && p.id === parseInt(id, 10));

  if (!product) {
    return <div className="text-center py-20 text-xl font-bold text-stone-600">المنتج غير موجود!</div>;
  }

  const isOil = product.category === 'زيوت طبيعية';
  const unitLabel = isOil ? 'ليتر' : 'كيلو';

  const [inputPrice, setInputPrice] = useState('');
  const [inputQty, setInputQty] = useState('');

  const [selectedPreset, setSelectedPreset] = useState(null);

  const handlePriceChange = (val) => {
    setInputPrice(val);
    setSelectedPreset(null); 
    if (val && !isNaN(val) && parseFloat(val) > 0) {
      const calculatedQty = (parseFloat(val) / product.pricePerKg).toFixed(3);
      setInputQty(calculatedQty);
    } else {
      setInputQty('');
    }
  };

  const handleQtyChange = (val) => {
    setInputQty(val);
    setSelectedPreset(null);
    if (val && !isNaN(val) && parseFloat(val) > 0) {
      const calculatedPrice = (parseFloat(val) * product.pricePerKg).toFixed(2);
      setInputPrice(calculatedPrice);
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
    let finalPrice = 0;
    let finalUnitVal = 0;

    if (selectedPreset) {
      finalPrice = Number(product.pricePerKg) * selectedPreset.fraction;
      finalUnitVal = selectedPreset.fraction; 

    } else if (inputQty && inputPrice) {
      finalPrice = parseFloat(inputPrice);
      finalUnitVal = parseFloat(parseFloat(inputQty).toFixed(3)); 
      
      if (finalPrice <= 0 || finalUnitVal <= 0) {
        alert('الرجاء إدخال كمية وسعر أعلى من الصفر!');
        return;
      }
    } else {
      alert('الرجاء تحديد كمية أو وزن أو كتابة قيمة معينة أولاً!');
      return;
    }


    addToCart(product, finalUnitVal, "1", finalPrice);
    alert(`تم إضافة ${product.name} بنجاح إلى السلة!`);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 border">
        
        <div>
          <img src={product.image || 'https://placeholder.com'} alt={product.name} className="w-full h-80 object-cover rounded-2xl border" />
          <div className="mt-6">
            <h1 className="text-3xl font-extrabold text-stone-900 mb-2">{product.name}</h1>
            <span className="text-sm font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-100">{product.category}</span>
            <p className="text-stone-600 mt-4 leading-relaxed"><strong className="text-stone-800 block mb-1">الوصف والفوائد:</strong> {product.description}</p>
            <p className="text-stone-600 mt-2"><strong className="text-stone-800 block mb-1">طريقة الاستخدام:</strong> يتم إضافته حسب الرغبة للحصول على أفضل النتائج الطبيعية الفعالة.</p>
          </div>
        </div>


        <div className="flex flex-col justify-between bg-stone-50 p-6 rounded-2xl border border-stone-100">
          <div>
            <h3 className="text-xl font-bold text-stone-800 mb-4 border-b pb-2">تحديد الوزن والسعر</h3>
            <p className="text-sm text-stone-500 mb-4">السعر الأصلي: <span className="font-extrabold text-emerald-800 text-base">{product.pricePerKg} جنيه</span> لكل {unitLabel}</p>

            <div className="mb-6">
              <label className="block text-sm font-bold text-stone-700 mb-2">اختر وزناً جاهزاً (مستقل):</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '1/8', val: 0.125, text: 'ثمن' },
                  { label: '1/4', val: 0.25, text: 'ربع' },
                  { label: '1/2', val: 0.5, text: 'نصف' },
                  { label: isOil ? '1 ليتر' : '1 كيلو', val: 1.0, text: '1' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handlePresetSelect(item.val, item.text)}
                    className={`py-2 rounded-xl font-bold border transition duration-200 ${selectedPreset?.fraction === item.val ? 'bg-amber-500 text-stone-900 border-amber-500 shadow-sm' : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-stone-700 -mb-2">أو اكتب قيمة مخصصة (تحديث متبادل):</label>
              
              <div>
                <label className="block text-xs text-stone-500 mb-1">اكتب السعر (جنيه):</label>
                <input
                  type="number"
                  min="1"
                  value={inputPrice}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="مثال: 50"
                  className="w-full p-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-white font-semibold text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1">اكتب الكمية بالـ ({unitLabel}):</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={inputQty}
                  onChange={(e) => handleQtyChange(e.target.value)}
                  placeholder="مثال: 0.25"
                  className="w-full p-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-white font-semibold text-stone-800"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm font-medium text-emerald-900">
                الحسبة المعتمدة حالياً: 
                <span className="font-extrabold text-emerald-800 block text-lg mt-1">
                  {selectedPreset 
                    ? `${(product.pricePerKg * selectedPreset.fraction).toFixed(2)} جنيه مقابل ${selectedPreset.fractionText} ${unitLabel}`
                    : inputPrice && inputQty 
                    ? `${parseFloat(inputPrice).toFixed(2)} جنيه مقابل ${inputQty} ${unitLabel}`
                    : 'قم بالاختيار أو الكتابة أولاً'}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleAddToCartAction}
              className="w-full bg-emerald-800 text-white py-3.5 rounded-xl font-bold shadow hover:bg-emerald-700 transition duration-200"
            >
              إضافة وتحديث العربة
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/')}
                className="bg-stone-200 text-stone-800 py-3 rounded-xl font-bold hover:bg-stone-300 transition text-center text-sm"
              >
                مواصلة التسوق
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="bg-amber-500 text-stone-900 py-3 rounded-xl font-bold hover:bg-amber-400 transition text-center text-sm shadow-sm"
              >
                ذهاب للعربة بالكامل
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
