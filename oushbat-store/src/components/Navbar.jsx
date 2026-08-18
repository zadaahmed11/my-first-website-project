import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-emerald-800 text-stone-100 p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">🌿 Oushbat El Attar</Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-emerald-200 transition">الرئيسية</Link>
          <div className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-stone-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end text-stone-900">
          <div className="bg-stone-50 w-full max-w-md h-full p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h3 className="text-xl font-bold text-emerald-800">عربة التسوق</h3>
                <button onClick={() => setIsOpen(false)}><X className="w-6 h-6 text-stone-600" /></button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <img src="https://flaticon.com" alt="Empty" className="w-32 h-32 opacity-60 mb-4" />
                  <p className="text-stone-500 mb-6 font-medium">العربة فارغة حالياً</p>
                  <Link to="/" onClick={() => setIsOpen(false)} className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">
                    Go Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[60vh]">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center border-b pb-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />
                      <div className="flex-1">
                        <h4 className="font-bold text-stone-800">{item.name}</h4>
                        <p className="text-sm text-stone-500">الكمية: {item.quantityText}</p>
                        <p className="text-emerald-700 font-semibold">{item.currentPrice} جنيه</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t pt-4">
                <Link to="/cart" onClick={() => setIsOpen(false)} className="block text-center bg-emerald-700 text-white w-full py-3 rounded-lg font-bold hover:bg-emerald-600 transition">
                  عرض سلة المشتريات بالكامل
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
