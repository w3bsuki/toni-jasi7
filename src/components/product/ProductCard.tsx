"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { name, price, images, slug, isNew, isSale, salePrice } = product;

  // Switch to the next image on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  // Switch back to the first image when not hovering
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  const formattedSalePrice = salePrice
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(salePrice)
    : null;

  return (
    <div 
      className={cn(
        "group relative h-full", 
        compact ? "pb-2" : ""
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/product/${slug}`} className="block h-full">
        <div
          className={cn(
            "relative overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3",
            compact ? "aspect-[3/4]" : "aspect-square"
          )}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={images[currentImageIndex]}
              alt={name}
              fill
              sizes={compact 
                ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" 
                : "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              }
              style={{ objectFit: "cover" }}
              className={cn(
                "transition-all duration-500",
                isHovered ? "scale-110" : "scale-100"
              )}
            />
          </div>
          
          {/* Labels */}
          <div className="absolute top-0 left-0 p-2 flex flex-col gap-1.5">
            {isNew && (
              <div className={cn(
                "bg-black text-white text-xs font-semibold px-2 py-1 backdrop-blur-sm",
                compact && "px-1.5 py-0.5 text-[10px]"
              )}>
                NEW
              </div>
            )}
            {isSale && (
              <div className={cn(
                "bg-red-600 text-white text-xs font-semibold px-2 py-1 backdrop-blur-sm",
                compact && "px-1.5 py-0.5 text-[10px]"
              )}>
                SALE
              </div>
            )}
          </div>
          
          {/* Quick actions overlay */}
          <div 
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300",
              isHovered ? "bg-black/10 dark:bg-black/40" : "opacity-0"
            )}
          >
            <div className={cn(
              "flex gap-2 transition-all duration-300 transform",
              isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}>
              <Link 
                href={`/product/${slug}`} 
                className="bg-white text-black p-2 rounded-full hover:bg-black hover:text-white transition-colors dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
                aria-label="Quick view"
              >
                <Eye size={18} />
              </Link>
              <button 
                className="bg-white text-black p-2 rounded-full hover:bg-black hover:text-white transition-colors dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
                aria-label="Add to cart"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to cart functionality
                }}
              >
                <ShoppingBag size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className={cn(
            "font-medium line-clamp-1 transition-colors",
            compact ? "text-sm" : "text-base",
            isHovered && "text-black dark:text-white"
          )}>
            {name}
          </h3>
          
          <div className={cn(
            compact && "text-sm"
          )}>
            {isSale && salePrice ? (
              <div className="flex items-center flex-wrap">
                <span className="text-red-600 font-semibold mr-2">
                  {formattedSalePrice}
                </span>
                <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
                  {formattedPrice}
                </span>
              </div>
            ) : (
              <span className="font-semibold">{formattedPrice}</span>
            )}
          </div>
        </div>
        
        {/* Bottom border animation */}
        <div className="relative mt-1 overflow-hidden h-0.5">
          <span className={cn(
            "absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-white transition-transform duration-300 ease-in-out",
            isHovered ? "transform-none" : "translate-x-[-100%]"
          )}></span>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard; 