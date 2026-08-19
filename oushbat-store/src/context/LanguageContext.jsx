import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    logo: "🌿 Oushbat El Attar",
    home: "Home",
    heroTitle: "🌿 Oushbat El Attar",
    heroDesc: "The finest selection of organic herbs, cold-pressed oils, and premium spices harvested with extreme care.",
    allProducts: "All Products",
    detailsBtn: "Product Details",
    perKg: "kg",
    perLiter: "liter",
    currency: "EGP",
    emptyCart: "Your cart is currently empty",
    goShopping: "Go Shopping",
    miniCartTitle: "Mini Shopping Cart",
    viewFullCart: "View Full Shopping Cart",
    cat1: "أعشاب طبيعية وعطرية", 
    cat2: "زيوت طبيعية",
    cat3: "توابل وبهارات",
    cat4: "حبوب وبقوليات"
  },
  ar: {
    logo: "🌿 عشبة العطار",
    home: "الرئيسية",
    heroTitle: "🌿 عشبة العطار",
    heroDesc: "أجود أنواع الأعشاب، التوابل، والزيوت الطبيعية المستخلصة بعناية فائقة من أجلك.",
    allProducts: "كل المنتجات",
    detailsBtn: "تفاصيل المنتج",
    perKg: "كيلو",
    perLiter: "ليتر",
    currency: "جنيه",
    emptyCart: "العربة فارغة حالياً",
    goShopping: "اذهب للتسوق",
    miniCartTitle: "عربة التسوق المصغرة",
    viewFullCart: "عرض سلة المشتريات بالكامل",
    cat1: "أعشاب طبيعية وعطرية",
    cat2: "زيوت طبيعية",
    cat3: "توابل وبهارات",
    cat4: "حبوب وبقوليات"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en'); // الإنجليزية هي الافتراضية بناءً على طلبك

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
