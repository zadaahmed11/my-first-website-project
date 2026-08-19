import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, unit, quantityText, calculatedPrice) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);

      if (exists) {

        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, selectedUnit: unit, quantityText, currentPrice: calculatedPrice }
            : item
        );
      }


      return [...prevCart, { ...product, selectedUnit: unit, quantityText, currentPrice: calculatedPrice }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);
  
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.currentPrice || 0), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
