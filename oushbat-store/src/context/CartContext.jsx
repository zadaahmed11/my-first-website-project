import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, unit, quantityText, price) => {
    const quantity = parseInt(quantityText, 10) || 1;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.selectedUnit === unit
      );

      if (existingItemIndex > -1) {
        // إذا كان موجوداً، نقوم بتحديث الكمية فقط دون مسح العنصر
        const newCart = [...prevCart];
        const currentQty = parseInt(newCart[existingItemIndex].quantityText, 10) || 1;
        newCart[existingItemIndex].quantityText = String(currentQty + quantity);
        return newCart;
      }

      const cartItemId = `${product.id}-${unit}`;

      return [
        ...prevCart,
        { 
          ...product, 
          cartItemId, 
          selectedUnit: unit, 
          quantityText: String(quantity), 
          currentPrice: Number(price) 
        }
      ];
    });
  };

  const removeFromCart = (productId, unit) => {
    setCart((prevCart) => 
      prevCart.filter((item) => !(item.id === productId && item.selectedUnit === unit))
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const qty = parseInt(item.quantityText, 10) || 1;
      const price = Number(item.currentPrice) || 0;
      return total + (price * qty);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
