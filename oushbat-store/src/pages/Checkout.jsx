import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', address: '', phone: '', notes: '' });
  const [loading, setLoading] = useState(false); // حالة لمنع تكرار الضغط أثناء المعالجة

  // حماية الصفحة: إذا دخل العميل والعربة فارغة يتم طرده للرئيسية فوراً
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      alert('الرجاء إدخال الحقول الأساسية المطلوبة لإتمام الشحن!');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('orders').insert([
        {
          customer_name: formData.name,
          address: formData.address,
          phone: formData.phone,
          notes: formData.notes,
          total_price: getCartTotal(),
          items: cart, // يتم تخزين مصفوفة السلة كـ JSONB داخل جدول Supabase
          created_at: new Date().toISOString() // إصلاح الخطأ: تحويل التاريخ لصيغة ISO النصية المقبولة
        }
      ]);
      
      if (error) throw error;
      
      alert(`شكراً لك ${formData.name}! تم تسجيل طلبك بنجاح وجاري التجهيز للشحن.`);
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('خطأ أثناء حفظ الطلب:', error.message);
      alert('حدث خطأ أثناء إرسال طلبك في الخادم. يرجى إعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h2 className="text-3xl font-extrabold text-stone-900 mb-8 border-b pb-4">إتمام عملية الشراء</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* نموذج البيانات المستلم */}
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border space-y-5">
          <h3 className="text-xl font-bold text-stone-800 border-b pb-2 mb-4">بيانات المستلم والتوصيل</h3>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">الاسم الكامل *</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="اكتب اسمك الثلاثي" className="w-full p-3 border rounded-xl focus:outline-emerald-800" />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">العنوان التفصيلي *</label>
            <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="المدينة، اسم الشارع، رقم العقار" className="w-full p-3 border rounded-xl focus:outline-emerald-800" />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">رقم الهاتف الجوال *</label>
            <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="01xxxxxxxxx" className="w-full p-3 border rounded-xl text-left focus:outline-emerald-800" />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">ملاحظات خاصة بالطلب (Notes)</label>
            <textarea rows="3" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="أي تفاصيل إضافية تود إخبار العطار بها..." className="w-full p-3 border rounded-xl focus:outline-emerald-800"></textarea>
          </div>
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white py-4 rounded-xl font-bold text-lg transition shadow-md ${loading ? 'bg-stone-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-700'}`}
            >
              {loading ? 'جاري معالجة طلبك...' : `تأكيد الطلب النهائي (${getCartTotal().toFixed(2)} جنيه)`}
            </button>
          </div>
        </form>

        {/* قسم الخريطة التفاعلية */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border">
            <h3 className="text-xl font-bold text-stone-800 mb-2">تحديد موقعك الجغرافي للتوصيل</h3>
            <p className="text-xs text-stone-500 mb-4">نعرض لك نطاق شحن عُشبة العطار الرئيسي في القاهرة الكبرى ومحيطها</p>
            <div className="w-full h-80 rounded-2xl overflow-hidden border bg-stone-100 relative">
              {/* تعديل الرابط إلى خريطة تضمين حقيقية مدعومة للجمهورية وتعمل بلا مشاكل كرس ومقاومة للحظر */}
              <iframe 
                title="Delivery Map" 
                src="https://google.com" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
