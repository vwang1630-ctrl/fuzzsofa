"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Product, Region } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
  materialType: string;
  materialOption: string;
  region: Region;
  selected: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productSlug: string, materialOption?: string) => void;
  updateQuantity: (productSlug: string, materialOption: string, quantity: number) => void;
  toggleSelect: (productSlug: string, materialOption: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  clearCart: () => void;
  totalItems: number;
  selectedItems: CartItem[];
  selectedTotal: number;
  allSelected: boolean;
  region: Region;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/** Get the unit price for a product in the given region (uses the low end of priceRange) */
function getUnitPrice(product: Product, region: Region): number {
  const range = product.priceRange[region] || product.priceRange.americas;
  return range[0]; // Use the low end of the price range as the unit price
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const region = "americas" as Region; // Default region; could be derived from language context

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
      return [...prev, { ...item, selected: item.selected ?? true }];
    });
  }, []);

  const removeItem = useCallback((productSlug: string, materialOption?: string) => {
    setItems((prev) =>
      prev.filter((i) => {
        if (materialOption) {
          return !(i.product.slug === productSlug && i.materialOption === materialOption);
        }
        return i.product.slug !== productSlug;
      })
    );
  }, []);

  const updateQuantity = useCallback((productSlug: string, materialOption: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) =>
        prev.filter((i) => !(i.product.slug === productSlug && i.materialOption === materialOption))
      );
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.slug === productSlug && i.materialOption === materialOption
          ? { ...i, quantity }
          : i
      )
    );
  }, []);

  const toggleSelect = useCallback((productSlug: string, materialOption: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.slug === productSlug && i.materialOption === materialOption
          ? { ...i, selected: !i.selected }
          : i
      )
    );
  }, []);

  const toggleSelectAll = useCallback((selected: boolean) => {
    setItems((prev) => prev.map((i) => ({ ...i, selected })));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const selectedItems = items.filter((i) => i.selected);
  const selectedTotal = selectedItems.reduce((sum, i) => {
    const price = getUnitPrice(i.product, i.region);
    return sum + price * i.quantity;
  }, 0);
  const allSelected = items.length > 0 && items.every((i) => i.selected);

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQuantity, toggleSelect, toggleSelectAll,
        clearCart, totalItems, selectedItems, selectedTotal, allSelected, region,
      }}
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

export { getUnitPrice };
