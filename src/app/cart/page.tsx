"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  // In a real app, this would come from a cart context/state
  const [cartItems, setCartItems] = useState<Array<{
    id: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
    image: string;
  }>>([
    {
      id: "1",
      name: "Classic Black Snapback",
      price: 29.99,
      size: "L",
      quantity: 1,
      image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "5",
      name: "Winter Beanie",
      price: 22.99,
      size: "One Size",
      quantity: 2,
      image: "https://images.unsplash.com/photo-1511231683436-44b8e3c7fb40?q=80&w=500&auto=format&fit=crop",
    },
  ]);

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border-b border-gray-200 pb-4 mb-4 hidden md:grid md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <span className="font-medium">Product</span>
              </div>
              <div className="md:col-span-2 text-center">
                <span className="font-medium">Price</span>
              </div>
              <div className="md:col-span-2 text-center">
                <span className="font-medium">Quantity</span>
              </div>
              <div className="md:col-span-2 text-right">
                <span className="font-medium">Total</span>
              </div>
            </div>

            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="border-b border-gray-200 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-6 flex items-center">
                  <div className="relative w-20 h-20 flex-shrink-0 mr-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 text-sm flex items-center mt-1 md:hidden"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 text-center">
                  <p className="md:hidden inline-block mr-2 font-medium">Price:</p>
                  ${item.price.toFixed(2)}
                </div>

                <div className="md:col-span-2 flex items-center md:justify-center">
                  <p className="md:hidden inline-block mr-2 font-medium">Quantity:</p>
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center border-l border-r border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 text-right flex justify-between md:block">
                  <p className="md:hidden font-medium">Total:</p>
                  <div className="flex items-center justify-end">
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-4 text-gray-500 hover:text-red-600 hidden md:block"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors">
                Proceed to Checkout
              </button>
              
              <div className="mt-4 text-center">
                <Link href="/collections" className="text-sm text-gray-600 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            href="/collections"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
} 