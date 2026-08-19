import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    logo: "Oushbat El Attar",
    allProducts: "All Products",
    detailsBtn: "Add to Cart 🛒",
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
    addToCartBtn: "Add to Shopping Cart 🛒",
    continueShopping: "Continue Shopping",
    goToCartPage: "Go To Full Cart",
    productNotFound: "Product not found!",
    basePriceLabel: "Base Price",
    heroTitle: "Welcome to Oushbat El Attar Shop",

    'أعشاب طبيعية وعطرية': "Medicinal Herbs",
    'توابل وبهارات': "Spices & Seasonings",
    'حبوب وبقوليات': "Grains & Legumes",
    'زيوت طبيعية': "Natural Oils"
  },
  ar: {
    logo: "عشبة العطار",
    allProducts: "كل المنتجات",
    detailsBtn: "أضف للعربة 🛒",
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
    addToCartBtn: "أضف لعربة التسوق 🛒",
    continueShopping: "مواصلة التسوق",
    goToCartPage: "ذهاب للعربة بالكامل",
    productNotFound: "المنتج غير موجود!",
    basePriceLabel: "السعر الأساسي",
    heroTitle: "مرحباً بكم في متجر عشبة العطار",
    'أعشاب طبيعية وعطرية': "أعشاب طبيعية وعطرية",
    'توابل وبهارات': "توابل وبهارات",
    'حبوب وبقوليات': "حبوب وبقوليات",
    'زيوت طبيعية': "زيوت طبيعية"
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
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
