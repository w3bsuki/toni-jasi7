"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

// Define the cart item with proper type safety
interface CartItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  selectedSize: string | null;
  quantity: number;
}

// Define the cart store interface
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string | null, quantity: number) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
}

// Create the cart store with zustand
export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      // Add an item to the cart
      addItem: (product, selectedSize, quantity) => {
        // Validate input
        if (!product || !product.id) {
          console.error("Cannot add invalid product to cart");
          return;
        }
        
        set((state) => {
          try {
            // Find if this product with the same size is already in the cart
            const existingItemIndex = state.items.findIndex(
              (item) => item.id === product.id && item.selectedSize === selectedSize
            );

            // If it exists, update quantity
            if (existingItemIndex !== -1) {
              const updatedItems = [...state.items];
              updatedItems[existingItemIndex].quantity += quantity;
              return { items: updatedItems };
            }

            // Otherwise, add as new item with only the properties we need
            const cartItem: CartItem = {
              id: product.id,
              name: product.name || "Unknown Product",
              price: typeof product.price === 'number' ? product.price : 0,
              salePrice: typeof product.salePrice === 'number' ? product.salePrice : null,
              image: Array.isArray(product.images) && product.images.length > 0 
                ? product.images[0] 
                : "/products/hat-placeholder.jpg",
              selectedSize,
              quantity
            };
            
            return { items: [...state.items, cartItem] };
          } catch (err) {
            console.error("Error adding item to cart:", err);
            return state; // Return unchanged state on error
          }
        });
      },
      
      // Remove an item from the cart
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      
      // Update the quantity of an item
      updateItemQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),
      
      // Clear the entire cart
      clearCart: () => set({ items: [] }),
      
      // Calculate the subtotal
      get subtotal() {
        return get().items.reduce((total, item) => {
          try {
            // Use sale price if available, otherwise regular price
            const price = item.salePrice ? item.salePrice : item.price;
            return total + (price * item.quantity);
          } catch (err) {
            console.error("Error calculating subtotal for item:", item, err);
            return total;
          }
        }, 0);
      }
    }),
    {
      name: "cart-storage",
      version: 1, // Increment this if the storage format changes
    }
  )
); 