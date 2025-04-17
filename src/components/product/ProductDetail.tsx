"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    
    // In a real app, this would dispatch to a cart state/context
    console.log("Added to cart:", {
      product,
      size: selectedSize,
      quantity,
    });
    
    // Show success message
    alert(`Added ${quantity} ${product.name} (${selectedSize}) to cart!`);
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const formattedSalePrice = product.salePrice
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(product.salePrice)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square mb-4 bg-gray-100">
            <Image
              src={product.images[currentImageIndex]}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-md"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative aspect-square bg-gray-100 rounded-md overflow-hidden ${
                  currentImageIndex === index
                    ? "ring-2 ring-black"
                    : "ring-1 ring-gray-200"
                }`}
                aria-label={`View image ${index + 1} of ${product.name}`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="mb-4">
            {product.isSale && formattedSalePrice ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-red-600 mr-2">
                  {formattedSalePrice}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  {formattedPrice}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">{formattedPrice}</span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-4 border ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-gray-700"
                  } rounded-md text-sm font-medium transition-colors`}
                >
                  {size}
                </button>
              ))}
            </div>
            {selectedSize === null && (
              <p className="mt-2 text-sm text-gray-500">Please select a size</p>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-12 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-3 px-6 rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <ShoppingBag size={20} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 