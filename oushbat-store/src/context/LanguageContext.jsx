import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    logo: "🌿 Oushbat El Attar",
    allProducts: "All Products",
    detailsBtn: "View Details",
    perKg: "kg",
    perLiter: "liter",
    currency: "EGP",
    emptyCart: "Your shopping cart is currently empty",
    goShopping: "Go Shopping",
    miniCartTitle: "Shopping Cart",
    viewFullCart: "View Full Cart",
    weightPriceTitle: "Weight & Price Settings",

    originalPrice: "Original Price",
    choosePreset: "Select Preset Weight (Independent):",
    customValue: "Or Enter Custom Value (Auto-calculated):",
    enterPrice: "Enter Price (EGP):",
    enterQty: "Enter Quantity:",
    currentCalc: "Current Selection:",
    fractionText_1_8: "1/8",
    fractionText_1_4: "1/4",
    fractionText_1_2: "1/2",
    fractionText_1: "1",
    addToCartBtn: "Add & Update Cart",
    continueShopping: "Continue Shopping",
    goToCartPage: "Go To Full Cart",
    productNotFound: "Product not found!",

    cartTitle: "Your Shopping Cart",
    changeWeight: "Change Weight:",
    totalAmount: "Total Payable Amount:",
    checkoutBtn: "Proceed to Checkout",
    deleteBtn: "Remove",
    customText: "Custom",

    checkoutTitle: "Complete Your Order",
    shippingDetails: "Receiver & Delivery Details",
    fullName: "Full Name *",
    fullAddress: "Detailed Address *",
    phone: "Mobile Phone Number *",
    notes: "Special Delivery Notes",
    confirmOrder: "Confirm Final Order",
    geoTitle: "Select Delivery Location via GPS Map",
    geoDesc: "Please ensure your location service is enabled for accurate delivery:",
    orderSummary: "Order Summary",
    namePlaceholder: "Enter your full name",
    addressPlaceholder: "City, street name, building number",
    notesPlaceholder: "Any extra details you want to tell the Attar...",
    alertSuccess: "Thank you! Your order has been placed successfully in Supabase."
  },
  ar: {
    logo: "🌿 عشبة العطار",
    allProducts: "كل المنتجات",
    detailsBtn: "تفاصيل المنتج",
    perKg: "كيلو",
    perLiter: "ليتر",
    currency: "جنيه",
    emptyCart: "العربة فارغة حالياً",
    goShopping: "اذهب للتسوق",
    miniCartTitle: "عربة التسوق",
    viewFullCart: "عرض السلة بالكامل",

    weightPriceTitle: "تحديد الوزن والسعر",
    originalPrice: "السعر الأصلي",
    choosePreset: "اختر وزناً جاهزاً (مستقل):",
    customValue: "أو اكتب قيمة مخصصة (تحديث متبادل):",
    enterPrice: "اكتب السعر (جنيه):",
    enterQty: "اكتب الكمية:",
    currentCalc: "الحسبة المعتمدة حالياً:",
    fractionText_1_8: "ثمن",
    fractionText_1_4: "ربع",
    fractionText_1_2: "نصف",
    fractionText_1: "1",
    addToCartBtn: "إضافة وتحديث العربة",
    continueShopping: "مواصلة التسوق",
    goToCartPage: "ذهاب للعربة بالكامل",
    productNotFound: "المنتج غير موجود!",

    cartTitle: "سلة المشتريات",
    changeWeight: "تغيير الوزن:",
    totalAmount: "إجمالي الحساب المستحق:",
    checkoutBtn: "تأكيد الطلب والدفع",
    deleteBtn: "حذف",
    customText: "مخصص",
    // صفحة الشحن
    checkoutTitle: "إتمام عملية الشراء",
    shippingDetails: "بيانات المستلم والتوصيل",
    fullName: "الاسم الكامل *",
    fullAddress: "العنوان التفصيلي *",
    phone: "رقم الهاتف الجوال *",
    notes: "ملاحظات خاصة بالطلب (Notes)",
    confirmOrder: "تأكيد الطلب النهائي",
    geoTitle: "تحديد موقعك الجغرافي للتوصيل",
    geoDesc: "يرجى التأكد من تشغيل الـ GPS على الخريطة للحصول على دقة توصيل متناهية:",
    orderSummary: "ملخص الأصناف المختارة",
    namePlaceholder: "اكتب اسمك الثلاثي",
    addressPlaceholder: "المدينة، اسم الشارع، رقم العقار",
    notesPlaceholder: "أي تفاصيل إضافية تود إخبار العطار بها...",
    alertSuccess: "شكراً لك! تم تسجيل طلبك بنجاح في قاعدة البيانات وجاري التجهيز."
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="transition-all duration-300">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
