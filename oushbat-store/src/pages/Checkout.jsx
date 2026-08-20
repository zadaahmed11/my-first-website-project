import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Send, ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const { cart, addToCart, removeFromCart, getCartTotal, clearCart } = useCart();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const WHATSAPP_NUMBER = "201121777574"; 

  const [formData, setFormData] = useState({ name: '', address: '', phone: '', notes: '' });
  const [touched, setTouched] = useState({ name: false, address: false, phone: false });

  const convertNumbers = (numStr) => {
    if (!numStr || lang === 'en') return String(numStr || '');
    return String(numStr).replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + parseInt(d)));
  };

  const handleDropdownAction = (item, actionType, fractionVal) => {
    const basePrice = Number(item.price || 0);
    const isOil = String(item.category || '').toLowerCase().match(/زيت|زيوت|oil/);
    const defaultUnit = 1.0; 
    
    let finalUnitVal = actionType === 'increase' ? defaultUnit + fractionVal : defaultUnit - fractionVal;
    if (finalUnitVal <= 0) return removeFromCart(item.id);

    const label = isOil ? (lang === 'en' ? 'Liter' : 'لتر') : (lang === 'en' ? 'KG' : 'كيلو');
    const displayQty = finalUnitVal % 1 === 0 ? finalUnitVal.toFixed(0) : finalUnitVal.toFixed(3);
    const text = `${convertNumbers(displayQty)} ${label}`;

    addToCart(item, finalUnitVal, text, basePrice * finalUnitVal);
  };


  const isNameValid = formData.name.trim().split(/\s+/).length >= 2;
  const isNameInvalid = touched.name && !isNameValid;


  const cleanPhone = formData.phone.replace(/\s+/g, '');
  const isPhoneValid = /^[0-9]{11}$/.test(cleanPhone);
  const isPhoneInvalid = touched.phone && (!isNameValid || !isPhoneValid);


  const isAddressInvalid = touched.address && (!isNameValid || !isPhoneValid || !formData.address.trim());
    const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, address: true });

    if (!isNameValid) {
      alert(lang === 'en' ? 'Please enter a full name (at least two words).' : 'برجاء إدخال الاسم ثنائي على الأقل.');
      return;
    }
    if (!isPhoneValid) {
      alert(lang === 'en' ? 'Phone number must be exactly 11 digits.' : 'رقم الهاتف يجب أن يتكون من 11 رقماً بالضبط.');
      return;
    }
    if (!formData.address.trim()) {
      alert(lang === 'en' ? 'Please enter your address.' : 'برجاء إدخال العنوان.');
      return;
    }


    let message = lang === 'en' ? `*New Order 🛒*\n\n` : `*طلب جديد 🛒*\n\n`;
    message += `${lang === 'en' ? '👤 Name:' : '👤 الاسم:'} ${formData.name}\n`;
    message += `${lang === 'en' ? '📞 Phone:' : '📞 الرقم:'} ${cleanPhone}\n`;
    message += `${lang === 'en' ? '📍 Address:' : '📍 العنوان:'} ${formData.address}\n`;
    if (formData.notes) message += `${lang === 'en' ? '📝 Notes:' : '📝 ملاحظات:'} ${formData.notes}\n\n`;
    message += `${lang === 'en' ? '📦 Requested Products:' : '📦 المنتجات المطلوبة:'}\n`;
    
    cart.forEach((item, index) => {
      const name = lang === 'en' ? item.name_en : item.name_ar;
      message += `${index + 1}. ${name} [${item.quantityText}] -> ${item.currentPrice.toFixed(2)} ${t('currency')}\n`;
    });

    message += `\n${lang === 'en' ? '💰 Final Total:' : '💰 الإجمالي النهائي:'} ${getCartTotal().toFixed(2)} ${t('currency')}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    alert(t('alertSuccess'));
    clearCart(); 
    navigate('/'); 
  };

  const cleanProductName = (name) => {
    if (!name) return '';
    return name.replace(/(اعشاب|أعشاب|توابل|بهارات|زيوت|زيت|حبوب|بقوليات|spices|herbs|oil|grains)/gi, '').trim();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-fadeIn" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      <div className="flex gap-2 mb-6 select-none">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 hover:border-stone-400 text-stone-600 rounded-lg text-[11px] font-black cursor-pointer transition-all bg-white"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {lang === 'en' ? "Home" : "الرئيسية"}
        </button>
        
        <button 
          onClick={() => navigate('/cart')} 
          className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 hover:border-stone-400 text-stone-600 rounded-lg text-[11px] font-black cursor-pointer transition-all bg-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {lang === 'en' ? "Back to Cart" : "العودة للسلة"}
        </button>
      </div>

      <h2 className="text-2xl font-black text-stone-900 mb-8 border-b pb-4">{t('checkoutTitle')}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl shadow-2xs border border-stone-200/60 space-y-4">
          <h3 className="text-base font-bold text-[#0b422a] border-b pb-2 mb-2">{t('shippingDetails')}</h3>
          

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{lang === 'en' ? 'Name' : 'الاسم'}</label>
            <input 
              type="text" 
              value={formData.name} 
              onFocus={() => setTouched(p => ({ ...p, name: true }))}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              placeholder={lang === 'en' ? 'First and Last name...' : 'الاسم الأول واللقب (اسم ثنائي)...'} 
              className={`w-full p-3 text-sm border rounded-xl bg-stone-50/50 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium transition-all ${isNameInvalid ? 'border-red-500 bg-red-50/30' : 'border-stone-200'}`} 
            />
            {isNameInvalid && <span className="text-[10px] text-red-500 font-bold mt-1 block">{lang === 'en' ? 'Please enter at least two names.' : 'برجاء كتابة اسم ثنائي على الأقل.'}</span>}
          </div>
          

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{t('phone')}</label>
            <input 
              type="tel" 
              disabled={!isNameValid}
              value={formData.phone} 
              onFocus={() => setTouched(p => ({ ...p, phone: true }))}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
              placeholder="01xxxxxxxxx" 
              className={`w-full p-3 text-sm border rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-bold transition-all ${!isNameValid ? 'bg-stone-100/80 cursor-not-allowed' : 'bg-stone-50/50'} ${isPhoneInvalid ? 'border-red-500 bg-red-50/30' : 'border-stone-200'}`} 
            />
            {isPhoneInvalid && !isNameValid && <span className="text-[10px] text-red-500 font-bold mt-1 block">{lang === 'en' ? 'Please complete Name correctly first.' : 'يرجى استكمال الاسم بشكل صحيح أولاً.'}</span>}
            {touched.phone && isNameValid && !isPhoneValid && <span className="text-[10px] text-red-500 font-bold mt-1 block">{lang === 'en' ? 'Phone number must be exactly 11 digits.' : 'يجب أن يتكون رقم الهاتف من 11 رقماً بالضبط.'}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{lang === 'en' ? 'Address' : 'العنوان'}</label>
            <input 
              type="text" 
              disabled={!isNameValid || !isPhoneValid}
              value={formData.address} 
              onFocus={() => setTouched(p => ({ ...p, address: true }))}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
              placeholder={(!isNameValid || !isPhoneValid) ? (lang === 'en' ? 'Fill Name and Phone first...' : 'اكتب الاسم والهاتف أولاً للتعديل...') : (lang === 'en' ? 'Enter city, street, building number...' : 'أدخل المدينة، اسم الشارع، رقم المبنى...')} 
              className={`w-full p-3 text-sm border rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium transition-all ${(!isNameValid || !isPhoneValid) ? 'bg-stone-100/80 cursor-not-allowed' : 'bg-stone-50/50'} ${isAddressInvalid ? 'border-red-500 bg-red-50/30' : 'border-stone-200'}`} 
            />
            {isAddressInvalid && (!isNameValid || !isPhoneValid) && <span className="text-[10px] text-red-500 font-bold mt-1 block">{lang === 'en' ? 'You must provide a valid Name and Phone before the address.' : 'يجب إدخال الاسم والهاتف بشكل صحيح قبل حقل العنوان.'}</span>}
            {isAddressInvalid && isNameValid && isPhoneValid && !formData.address.trim() && <span className="text-[10px] text-red-500 font-bold mt-1 block">{lang === 'en' ? 'Address cannot be empty.' : 'العنوان لا يمكن أن يكون فارغاً.'}</span>}
          </div>
          
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{t('notes')}</label>
            <textarea 
              rows="2" value={formData.notes} 
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
              placeholder={t('notesPlaceholder')} 
              className="w-full p-3 text-sm border border-stone-200 rounded-xl bg-stone-50/50 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden font-medium"
            ></textarea>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={cart.length === 0}
              className={`w-full flex items-center justify-center gap-2 text-white py-4 rounded-xl font-black text-sm shadow-md transition transform hover:scale-101 ${cart.length === 0 ? 'bg-stone-400 cursor-not-allowed' : 'bg-[#0b422a] hover:bg-emerald-800'}`}
            >
              <Send className="w-4 h-4" />
              {t('confirmOrder')} ({convertNumbers(getCartTotal().toFixed(2))} {t('currency')})
            </button>
          </div>
        </form>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-stone-200/60 shadow-2xs">
            <h4 className="font-black text-sm text-stone-800 mb-4 border-b pb-2 flex items-center justify-between">
              <span>{t('orderSummary')}</span>
              <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md text-xs">{cart.length}</span>
            </h4>
            
            {cart.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-6">{lang === 'en' ? 'Your cart is empty.' : 'عربة التسوق فارغة تماماً.'}</p>
            ) : (
              <>
                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 border-b pb-4">
                  {cart.map(item => {
                    const isOil = String(item.category || '').toLowerCase().match(/زيت|زيوت|oil/);
                    const labelUnit = isOil ? (lang === 'en' ? 'L' : 'لتر') : (lang === 'en' ? 'KG' : 'كيلو');
                    
                    return (
                      <div key={item.id} className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex flex-col gap-2 relative overflow-visible">
                        <button 
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="absolute top-1.5 right-1.5 ltr:left-auto ltr:right-1.5 rtl:right-auto rtl:left-1.5 w-4 h-4 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-all cursor-pointer z-20"
                        >
                          <X className="w-2.5 h-2.5" strokeWidth={3} />
                        </button>

                        <div className="flex items-center gap-3">
                          <img src={item.image_url} alt="" className="w-10 h-10 object-cover rounded-lg border border-stone-200" />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-stone-800 truncate">{cleanProductName(lang === 'en' ? item.name_en : item.name_ar)}</h5>
                            <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md block w-fit mt-0.5">{item.quantityText}</span>
                          </div>
                          <span className="text-xs font-black text-stone-900 whitespace-nowrap">
                            {convertNumbers(item.currentPrice.toFixed(2))} {t('currency')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1 border-t pt-2 border-stone-200/40">
                          <label className="text-[9px] font-bold text-stone-400 whitespace-nowrap">{lang === 'en' ? "Modify:" : "تعديل الحسبة:"}</label>
                          <select 
                            value="" 
                            onChange={(e) => { 
                              const [action, valStr] = e.target.value.split(':');
                              handleDropdownAction(item, action, parseFloat(valStr)); 
                              e.target.value = ""; 
                            }} 
                            className="w-full text-[10px] p-1 border border-stone-200 rounded-md bg-white cursor-pointer font-bold text-stone-700 focus:outline-hidden"
                          >
                            <option value="" disabled>{lang === 'en' ? "Change weight" : "تغيير الحجم والوزن"}</option>
                            <optgroup label={lang === 'en' ? "➕ Add" : "➕ زيادة وزن"}>
                              <option value="increase:0.125">{lang === 'en' ? "+ 1/8" : "+ ثمن كيلو"}</option>
                              <option value="increase:0.25">{lang === 'en' ? "+ 1/4" : "+ ربع كيلو"}</option>
                              <option value="increase:0.5">{lang === 'en' ? "+ 1/2" : "+ نصف كيلو"}</option>
                              <option value="increase:1.0">{`+ 1 ${labelUnit}`}</option>
                            </optgroup>
                            <optgroup label={lang === 'en' ? "➖ Reduce" : "➖ تنقيص وزن"}>
                              <option value="decrease:0.125">{lang === 'en' ? "- 1/8" : "- ثمن كيلو"}</option>
                              <option value="decrease:0.25">{lang === 'en' ? "- 1/4" : "- ربع كيلو"}</option>
                              <option value="decrease:0.5">{lang === 'en' ? "- 1/2" : "- نصف كيلو"}</option>
                              <option value="decrease:1.0">{`- 1 ${labelUnit}`}</option>
                            </optgroup>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 px-1">
                  <span className="text-xs font-black text-stone-500">
                    {lang === 'en' ? "Total Price:" : "إجمالي سعر الطلب:"}
                  </span>
                  <span className="text-sm font-black text-[#0b422a] bg-stone-50 border border-stone-100 px-3 py-1 rounded-xl">
                    {convertNumbers(getCartTotal().toFixed(2))} {t('currency')}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
