"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "compact" | "list";
}

export default function ProductCard({
  product,
  viewMode = "grid",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Switch to second image when hovering
  React.useEffect(() => {
    if (isHovered && product.images.length > 1) {
      const timeoutId = setTimeout(() => {
        setCurrentImageIndex(1);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setCurrentImageIndex(0);
    }
  }, [isHovered, product.images.length]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  if (viewMode === "list") {
    return (
      <div 
        className="group relative bg-white border rounded-lg overflow-hidden flex shadow-sm hover:shadow-md transition-shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.slug}`} className="block flex-shrink-0 w-1/3">
          <div className="aspect-square relative">
            <Image
              src={product.images[currentImageIndex] || "/images/hats/placeholder1.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {product.isNew && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </div>
            )}
            {product.isSale && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Sale
              </div>
            )}
          </div>
        </Link>
        <div className="flex-1 p-4 flex flex-col">
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
            <div className="flex items-baseline mb-2">
              {product.salePrice ? (
                <>
                  <span className="text-red-600 font-medium mr-2">${product.salePrice}</span>
                  <span className="text-gray-500 line-through text-sm">${product.price}</span>
                </>
              ) : (
                <span className="text-gray-900 font-medium">${product.price}</span>
              )}
            </div>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
          </Link>
          <div className="mt-auto flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {product.inStock ? "In Stock" : "Out of Stock"}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Heart className="h-4 w-4" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "compact") {
    return (
      <div 
        className="group relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.slug}`} className="block">
          <div className="aspect-[4/3] relative">
            <Image
              src={product.images[currentImageIndex] || "/images/hats/placeholder1.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {product.isNew && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </div>
            )}
            {product.isSale && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Sale
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-gray-900 text-sm mb-1">{product.name}</h3>
            <div className="flex items-baseline">
              {product.salePrice ? (
                <>
                  <span className="text-red-600 font-medium text-sm mr-2">${product.salePrice}</span>
                  <span className="text-gray-500 line-through text-xs">${product.price}</span>
                </>
              ) : (
                <span className="text-gray-900 font-medium text-sm">${product.price}</span>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Default grid view
  return (
    <div 
      className="group relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-square relative">
          <Image
            src={product.images[currentImageIndex] || "/images/hats/placeholder1.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.isNew && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              New
            </div>
          )}
          {product.isSale && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Sale
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-baseline mb-1">
            {product.salePrice ? (
              <>
                <span className="text-red-600 font-medium mr-2">${product.salePrice}</span>
                <span className="text-gray-500 line-through text-sm">${product.price}</span>
              </>
            ) : (
              <span className="text-gray-900 font-medium">${product.price}</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {product.inStock ? "In Stock" : "Out of Stock"}
          </div>
        </div>
      </Link>
      
      {/* Quick action buttons - visible on hover */}
      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white rounded-full flex-grow"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="h-4 w-4 mr-2" />
            Wishlist
          </Button>
          <Button
            size="sm"
            className="flex-grow"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
} 