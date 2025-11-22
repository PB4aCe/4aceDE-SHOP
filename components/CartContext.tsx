"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  lastAdded: Product | null;
  clearLastAdded: () => void;
  lastRemoved: Product | null;
  clearLastRemoved: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<Product | null>(null);
  const [lastRemoved, setLastRemoved] = useState<Product | null>(null);

  function addToCart(product: Product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      let next: CartItem[];

      if (existing) {
        next = prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        next = [...prev, { product, quantity: 1 }];
      }

      return next;
    });

    setLastAdded(product);
    // optional: letzte "Removed"-Meldung zurücksetzen
    // setLastRemoved(null);
  }

  function removeFromCart(productId: string) {
    setItems((prev) => {
      const target = prev.find((i) => i.product.id === productId);
      if (target) {
        setLastRemoved(target.product);
      }

      return prev
        .map((i) =>
          i.product.id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0);
    });
  }

  function clearCart() {
    setItems([]);
    setLastAdded(null);
    setLastRemoved(null);
  }

  function clearLastAdded() {
    setLastAdded(null);
  }

  function clearLastRemoved() {
    setLastRemoved(null);
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        total,
        itemCount,
        lastAdded,
        clearLastAdded,
        lastRemoved,
        clearLastRemoved,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
