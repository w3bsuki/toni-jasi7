"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

interface WishlistStore {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: Product) => void;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          if (state.items.some((stateItem) => stateItem.id === item.id)) {
            return state; // Item already exists
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      toggleItem: (item) => {
        const exists = get().items.some((stateItem) => stateItem.id === item.id);
        if (exists) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
    }
  )
); 