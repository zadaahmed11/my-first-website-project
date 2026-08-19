import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { t } = useLanguage();
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
          total_price: getCartTotal(),
          items: cart,
          created_at: new Date()
        }
      ]);
      if (error) throw error;
      alert(t('alertSuccess'));
      clearCart();
      navigate('/');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h2 className="text-2xl font-black text-stone-900 mb-8 border-b pb-4">{t('checkoutTitle')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-xs border space-y-4">
          <h3 className="text-base font-bold text-stone-800 border-b pb-2 mb-2">{t('shippingDetails')}</h3>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{t('fullName')}</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t('namePlaceholder')} className="w-full p-3 text-sm border rounded-xl bg-stone-50/50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{t('fullAddress')}</label>
            <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder={t('addressPlaceholder')} className="w-full p-3 text-sm border rounded-xl bg-stone-50/50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{t('phone')}</label>
            <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="01xxxxxxxxx" className="w-full p-3 text-sm border rounded-xl bg-stone-50/50 text-left" />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{t('notes')}</label>
            <textarea rows="3" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder={t('notesPlaceholder')} className="w-full p-3 text-sm border rounded-xl bg-stone-50/50"></textarea>
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-emerald-800 text-white py-3.5 rounded-xl font-bold text-sm shadow hover:bg-emerald-700 transition">{t('confirmOrder')} ({getCartTotal().toFixed(2)} {t('currency')})</button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl shadow-xs border">
            <h3 className="text-base font-bold text-stone-800 mb-2">{t('geoTitle')}</h3>
            <p className="text-[11px] text-stone-400 mb-3">{t('geoDesc')}</p>
            <div className="w-full h-72 rounded-2xl overflow-hidden border bg-stone-100">
              <iframe title="Delivery Map" src="https://google.com" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
            </div>
          </div>
          <div className="bg-stone-50 p-5 rounded-2xl border">
            <h4 className="font-bold text-xs text-stone-700 mb-3">{t('orderSummary')} ({cart.length})</h4>
            <div className="max-h-36 overflow-y-auto space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="text-stone-600">{item.name} ({item.quantityText})</span>
                  <span className="font-bold text-stone-800">{item.currentPrice.toFixed(2)} {t('currency')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

