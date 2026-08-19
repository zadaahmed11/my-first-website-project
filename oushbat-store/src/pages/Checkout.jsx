import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', address: '', phone: '', notes: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) return;

    try {
      const { error } = await supabase.from('orders').insert([
        {
          customer_name: formData.name,
          address: formData.address,
          phone: formData.phone,
          notes: formData.notes,
          total_price: Number(getCartTotal()),
          items: cart, 
          created_at: new Date()
        }
      ]);

      if (error) throw error;

      alert(t('alertSuccess'));
      clearCart(); 
      navigate('/'); 
    } catch (error) {
      console.error('Error saving order:', error.message);
      alert(lang === 'en' ? 'Failed to send your order, please retry.' : 'حدث خطأ أثناء إرسال طلبك، يرجى المحاولة مرة أخرى.');
    }
  };

  const cleanProductName = (name) => {
    if (!name) return '';
    return name.replace(/(اعشاب|أعشاب|توابل|بهارات|زيوت|زيت|حبوب|بقوليات|spices|herbs|oil|grains)/gi, '').trim();
  };
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-fadeIn">
      {/* عنوان الصفحة المترجم حياً */}
      <h2 className="text-2xl font-black text-stone-900 mb-8 border-b pb-4">{t('checkoutTitle')}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* العمود الأيسر: فورم بيانات الشحن المترجم بالكامل */}
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-2xs border border-stone-200/60 space-y-4">
          <h3 className="text-base font-bold text-[#0b422a] border-b pb-2 mb-2">{t('shippingDetails')}</h3>
          
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{t('fullName')}</label>
            <input 
              type="text" required value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              placeholder={t('namePlaceholder')} 
              className="w-full p-3 text-sm border border-stone-200 rounded-xl bg-stone-50/50 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{t('fullAddress')}</label>
            <input 
              type="text" required value={formData.address} 
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
              placeholder={t('addressPlaceholder')} 
              className="w-full p-3 text-sm border border-stone-200 rounded-xl bg-stone-50/50 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium" 
                />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{t('phone')}</label>
            <input 
              type="tel" required value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
              placeholder="01xxxxxxxxx" 
              className="w-full p-3 text-sm border border-stone-200 rounded-xl bg-stone-50/50 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-left font-bold" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{t('notes')}</label>
            <textarea 
              rows="3" value={formData.notes} 
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
              placeholder={t('notesPlaceholder')} 
              className="w-full p-3 text-sm border border-stone-200 rounded-xl bg-stone-50/50 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium"
            ></textarea>
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-[#0b422a] text-white py-3.5 rounded-xl font-black text-sm shadow-md hover:bg-emerald-800 transition transform hover:scale-101"
            >
              {t('confirmOrder')} ({getCartTotal().toFixed(2)} {t('currency')})
            </button>
          </div>
        </form>

        <div className="space-y-6">

          <div className="bg-white p-5 rounded-3xl shadow-2xs border border-stone-200/60">
            <h3 className="text-base font-bold text-stone-800 mb-1">{t('geoTitle')}</h3>
            <p className="text-[11px] text-stone-400 mb-4">{t('geoDesc')}</p>
            
            <div className="w-full h-72 rounded-2xl overflow-hidden border border-stone-100 bg-stone-100 shadow-inner relative">
              <iframe 
                title="Delivery Location Map" 
                src="https://google.com" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>
          </div>

          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/40">
            <h4 className="font-bold text-xs text-stone-700 mb-3 border-b pb-1.5">{t('orderSummary')} ({cart.length})</h4>
            <div className="max-h-40 overflow-y-auto space-y-2.5 pr-1">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <span className="text-stone-600 font-medium">
                    {cleanProductName(lang === 'en' ? item.name_en : item.name_ar)} 
                    <span className="text-[10px] text-stone-400 font-bold block sm:inline sm:mx-1">({item.quantityText})</span>
                  </span>
                  <span className="font-black text-stone-800 whitespace-nowrap">
                    {item.currentPrice.toFixed(2)} {t('currency')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
