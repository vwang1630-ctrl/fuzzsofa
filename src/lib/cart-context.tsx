"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Product, Region } from "./products";
import { useLanguage } from "./language-context";

export interface CartItem {
  product: Product;
  quantity: number;
  materialType: string;
  materialOption: string;
  region: Region;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productSlug: string) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  region: Region;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { region } = useLanguage();

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.slug === item.product.slug && i.materialOption === item.materialOption
      );
      if (existing) {
        return prev.map((i) =>
          i.product.slug === item.product.slug && i.materialOption === item.materialOption
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productSlug: string) => {
    setItems((prev) => prev.filter((i) => i.product.slug !== productSlug));
  }, []);

  const updateQuantity = useCallback((productSlug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.slug !== productSlug));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.slug === productSlug ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, region }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
