# 🌿 موقع عطارة زمان (Spice & Herb E-Commerce)

موقع تجارة إلكترونية متكامل ومتجاوب (Responsive) لبيع الأعشاب، التوابل، والزيوت الطبيعية، مبني بالكامل باستخدام **React.js**.

---

## ✨ المميزات الرئيسية (Features)

*   **تصفح المنتجات:** عرض الأقسام المختلفة (توابل، أعشاب علاجية، زيوت، مستحضرات طبيعية).
*   **عربة التسوق (Cart System):** إضافة وتعديل وحذف المنتجات وحساب الإجمالي تلقائيًا.
*   **البحث والتصفية:** إمكانية البحث عن منتج معين أو التصفية حسب القسم أو السعر.
*   **صفحة تفاصيل المنتج:** عرض الفوائد، طريقة الاستخدام، والوزن المتاح.
*   **لوحة تحكم مصغرة:** لإدارة الطلبات ومتابعة حالة الشحن (محاكاة - Mockup).

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

*   **React (Functional Components & Hooks)**
*   **React Router Dom** (للتنقل بين الصفحات)
*   **Context API / Redux Toolkit** (لإدارة حالة عربة التسوق)
*   **Tailwind CSS / Styled Components** (للـ التصميم والتجاوب)
*   **Lucide React / FontAwesome** (للأيقونات)

---

## 📂 هيكلة المجلدات (Project Structure)

```text
src/
├── assets/          # الصور، الأيقونات، والملفات العامة
├── components/      # المكونات المشتركة (Navbar, Footer, ProductCard)
├── context/         # إدارة حالة العربة والمستخدم (CartContext)
├── data/            # بيانات المنتجات التجريبية (productsData.js)
├── pages/           # الصفحات الرئيسية
│   ├── Home.jsx         # الصفحة الرئيسية
│   ├── Shop.jsx         # صفحة المتجر والتصفية
│   ├── ProductDetails.jsx # تفاصيل المنتج والفوائد
│   ├── Cart.jsx         # عربة التسوق
│   └── Checkout.jsx     # صفحة الدفع وتأكيد الطلب
├── App.jsx          # المكون الرئيسي وإعدادات الراوتر
└── main.jsx         # نقطة الانطلاق (Entry Point)
```

---

## 🚀 تشغيل المشروع محليًا (Installation)

### 1. استنساخ المشروع (Clone the Repository)
```bash
git clone https://github.com
cd spice-shop-react
```

### 2. تثبيت الحزم الاعتمادية (Install Dependencies)
```bash
npm install
```

### 3. تشغيل سيرفر التطوير (Run Development Server)
```bash
npm run dev
```
سيفتح الموقع على الرابط المباشر: `http://localhost:5173`

---

## 📦 خطة تطوير المكونات المستقبلي (Roadmap)

- [ ] ربط الموقع بقاعدة بيانات (Firebase أو Node.js/MongoDB).
- [ ] إضافة بوابة دفع إلكتروني حقيقية (Stripe أو PayPal).
- [ ] توفير خاصية تقييم المنتجات وكتابة المراجعات من قبل المشترين.
- [ ] دعم وتفعيل الوضع الداكن (Dark Mode).
