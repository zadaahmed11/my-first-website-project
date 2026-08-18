import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function Cart() {
  // جلب دالة الحذف المحدثة التي تقبل الـ id والـ unit
  const { cart, addToCart, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleDropdownChange = (item, fractionVal, fractionText) => {
    removeFromCart(item.id, item.selectedUnit);

    const newPrice = item.pricePerKg * fractionVal;
    const isOil = item.category === 'زيوت طبيعية';
    const newQtyText = `1 (${fractionText} ${isOil ? 'ليتر' : 'كيلو'})`;

    const baseProduct = {
      id: item.id,
      name: item.name,
      image: item.image,
      category: item.category,
      pricePerKg: item.pricePerKg
    };

    addToCart(baseProduct, fractionVal, "1", newPrice);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-700 mb-4">عربة تسوقك فارغة تماماً!</h2>
        <Link to="/" className="inline-block bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold">اذهب للمتجر الآن</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-3xl font-extrabold text-stone-900 mb-8 border-b pb-4">سلة المشتريات</h2>
      <div className="space-y-6">
        {cart.map((item) => {
          const isOil = item.category === 'زيوت طبيعية';
          
          return (
            <div key={item.cartItemId || `${item.id}-${item.selectedUnit}`} className="bg-white p-5 rounded-2xl shadow-sm border flex flex-col sm:flex-row gap-5 items-center justify-between">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border" />
                <div>
                  <h3 className="text-lg font-bold text-stone-900">{item.name}</h3>
                  <p className="text-sm text-stone-400">الكمية المطلوبة: {item.quantityText}</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    الوزن: {item.selectedUnit === 1.0 ? (isOil ? '1 ليتر' : '1 كيلو') : `${item.selectedUnit} من الوحدة`}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-stone-500">تغيير الوزن:</label>
                  <select
                    value={item.selectedUnit || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      let txt = 'مخصص';
                      if (val === 0.125) txt = 'ثمن';
                      if (val === 0.25) txt = 'ربع';
                      if (val === 0.5) txt = 'نصف';
                      if (val === 1.0) txt = '1';
                      handleDropdownChange(item, val, txt);
                    }}
                    className="border rounded-lg p-2 bg-stone-50 text-sm font-semibold cursor-pointer focus:outline-emerald-800"
                  >
                    <option value="" disabled>مخصص/حر</option>
                    <option value="0.125">1/8 (ثمن)</option>
                    <option value="0.25">1/4 (ربع)</option>
                    <option value="0.5">1/2 (نصف)</option>
                    <option value="1.0">{isOil ? '1 ليتر' : '1 كيلو'}</option>
                  </select>
                </div>
                <div className="text-left min-w-[100px]">
                  {/* حساب السعر الإجمالي الفعلي لهذا السطر (السعر الحادي × عدد المرات) */}
                  <p className="text-lg font-extrabold text-emerald-800">
                    {((Number(item.currentPrice) || 0) * (parseInt(item.quantityText, 10) || 1)).toFixed(2)} جنيه
                  </p>
                  <button 
                    onClick={() => removeFromCart(item.id, item.selectedUnit)} 
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs mt-1 transition"
                  >
                    <Trash2 className="w-4 h-4" /> حذف
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-stone-900 text-stone-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-stone-400 block text-sm">إجمالي الحساب الشامل:</span>
          <span className="text-3xl font-black text-amber-400">{getCartTotal().toFixed(2)} جنيه</span>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Link to="/" className="flex-1 md:flex-initial bg-stone-800 border border-stone-700 px-6 py-3.5 rounded-xl text-center text-sm flex items-center justify-center gap-2 hover:bg-stone-700 transition"><ArrowLeft className="w-4 h-4" /> العودة</Link>
          <button onClick={() => navigate('/checkout')} className="flex-1 md:flex-initial bg-amber-500 text-stone-900 px-8 py-3.5 rounded-xl font-extrabold text-sm shadow-lg hover:bg-amber-400 transition">تأكيد الطلب والدفع</button>
        </div>
      </div>
    </div>
  );
}
