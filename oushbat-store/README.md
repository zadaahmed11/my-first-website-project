# 🌿 Oushbat El Attar (E-Commerce SPA)

A premium, production-ready e-commerce web application specialized in selling herbs, spices, and natural oils. Built using **React 19**, **Tailwind CSS v4**, and fully integrated with **Supabase** for real-time cloud data storage.

---

## ✨ Features

*   **Dynamic Product Browsing:** Categorized product showcase with color-gradient hero section and automated state filtering.
*   **Weight & Price Calculator:** Multi-mode pricing interaction on the product details page, supporting predefined fractional choices (1/8, 1/4, 1/2, 1 Kg/Liter) and dynamic custom inputs without mathematical rounding issues.
*   **Advanced Cart Infrastructure:** Multi-unit item grouping based on safe composite IDs (`cartItemId`), preventing product overlap in the sidebar and main cart view.
*   **Live Cloud Integration:** Dynamic data fetching for inventories and secure asynchronous storage for customer checkout forms inside **Supabase**.
*   **Security & Guardrails:** Hardened architecture protected by client-side environment variable routing (`.env.local`), precise `.gitignore` blocks, and ultra-fast static analysis via **Oxlint**.

---

## 🛠️ Tech Stack

*   **Frontend Core:** React 19 (Functional Hooks & Context API)
*   **Routing System:** React Router Dom v6 (with automated ScrollToTop restoration)
*   **Styling Engine:** Tailwind CSS v4.0 (CSS-first directive layer implementation)
*   **Database & Backend:** Supabase (PostgreSQL Cloud Platform)
*   **Linter & Code Quality:** Oxlint (Rust-powered ultra-fast static analysis)
*   **Bundler:** Vite v6

---

## 📂 Project Structure

```text
src/
├── components/      # Shared reusable UI elements (Navbar)
├── context/         # Global shopping cart state architecture (CartContext.jsx)
├── pages/           # Main application view modules
│   ├── Home.jsx           # Clean grid display with responsive zero-state handling
│   ├── ProductDetails.jsx # Secure dual-input item pricing view
│   ├── Cart.jsx           # Granular unit management & item removal interface
│   └── Checkout.jsx       # Supabase transaction pipeline & regional map embed
├── App.jsx          # Central route configuration and initialization block
├── main.jsx         # Clean DOM entry point configuration
├── index.css        # Tailwind v4 configuration and custom webkit layouts
└── supabaseClient.js# Hardened cloud platform client connector
```

---

## 🚀 Installation & Local Setup

### 1. Clone & Navigate
```bash
git clone https://github.com/zadaahmed11/my-first-website-project.git
cd oushbat-store
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and add your secure keys:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install & Launch
```bash
# Clean install matching package.json specifications
npm install

# Run the development compiler
npm run dev
```
Open your browser and navigate to: `http://localhost:5173`

---

## 📦 Future Development Roadmap

- [ ] Integrate a live secure payment gateway (Stripe, PayPal, or local providers like Fawry).
- [ ] Establish an Admin Dashboard page (`/admin`) to read incoming Supabase orders natively.
- [ ] Implement an automatic dark-mode context toggle matching premium design frameworks.
- [ ] Add an authenticated user profile setup using Supabase Auth.
