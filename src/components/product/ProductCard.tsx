"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { name, price, images, slug, isNew, isSale, salePrice } = product;

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(!isWishlist);
  };

  // Prevent hydration mismatch by waiting until client-side mount
  if (!isMounted) {
    return (
      <div 
        className={cn(
          "group relative h-full flex flex-col", 
          compact ? "pb-2" : ""
        )}
      >
        <div className="block h-full">
          <div
            className={cn(
              "relative overflow-hidden mb-3 rounded-lg shadow-sm transition-shadow duration-300",
              compact ? "aspect-[3/4]" : "aspect-square"
            )}
          >
            <div className="absolute inset-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={images[0]}
                alt={name}
                fill
                sizes={compact 
                  ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" 
                  : "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                }
                style={{ objectFit: "cover" }}
                priority={isNew}
              />
            </div>
            
            {/* Static labels for server rendering */}
            <div className="absolute top-0 left-0 p-2 flex flex-col gap-1.5 z-10">
              {isNew && (
                <div 
                  className={cn(
                    "bg-black text-white text-xs font-semibold px-2 py-1 rounded-sm",
                    compact && "px-1.5 py-0.5 text-[10px]"
                  )}
                >
                  NEW
                </div>
              )}
              {isSale && (
                <div 
                  className={cn(
                    "bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-sm",
                    compact && "px-1.5 py-0.5 text-[10px]"
                  )}
                >
                  SALE
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 flex-grow">
            <h3 
              className={cn(
                "font-medium line-clamp-1 transition-colors",
                compact ? "text-sm" : "text-base"
              )}
            >
              {name}
            </h3>
            
            <div className={cn(
              "flex items-center",
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
                <span className="font-semibold">
                  {formattedPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={cn(
        "group relative h-full flex flex-col", 
        compact ? "pb-2" : ""
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: compact ? -4 : -8 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/product/${slug}`} className="block h-full">
        <div
          className={cn(
            "relative overflow-hidden mb-3 rounded-lg shadow-sm transition-shadow duration-300",
            isHovered ? "shadow-md" : "",
            compact ? "aspect-[3/4]" : "aspect-square"
          )}
        >
          {/* Main product image with transition effect */}
          <div className="absolute inset-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
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
              priority={isNew}
              onLoad={() => {}}
            />
          </div>
          
          {/* Labels with animated entry */}
          <div className="absolute top-0 left-0 p-2 flex flex-col gap-1.5 z-10">
            {isNew && (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={cn(
                  "bg-black text-white text-xs font-semibold px-2 py-1 rounded-sm",
                  compact && "px-1.5 py-0.5 text-[10px]"
                )}
              >
                NEW
              </motion.div>
            )}
            {isSale && (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={cn(
                  "bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-sm",
                  compact && "px-1.5 py-0.5 text-[10px]"
                )}
              >
                SALE
              </motion.div>
            )}
          </div>
          
          {/* Wishlist button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={cn(
              "absolute top-2 right-2 p-2 rounded-full z-10 transition-colors",
              isWishlist 
                ? "bg-red-500 text-white" 
                : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800"
            )}
            onClick={toggleWishlist}
            aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              size={16} 
              fill={isWishlist ? "currentColor" : "none"} 
              className={isWishlist ? "animate-heartbeat" : ""}
            />
          </motion.button>
          
          {/* Quick actions overlay */}
          <div 
            className={cn(
              "absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-opacity duration-300 p-4",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <motion.div 
              className="flex gap-2 w-full justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/product/${slug}`;
                }}
                className="bg-white text-black p-2 rounded-md hover:bg-black hover:text-white transition-colors flex-1 flex items-center justify-center text-sm font-medium dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
                aria-label="Quick view"
              >
                <Eye size={16} className="mr-1.5" />
                <span>Quick View</span>
              </button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white p-2 rounded-md hover:bg-white hover:text-black transition-colors flex-1 flex items-center justify-center text-sm font-medium dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
                aria-label="Add to cart"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to cart functionality
                }}
              >
                <ShoppingBag size={16} className="mr-1.5" />
                <span>Add to Bag</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
        
        <div className="space-y-2 flex-grow">
          <motion.h3 
            className={cn(
              "font-medium line-clamp-1 transition-colors",
              compact ? "text-sm" : "text-base",
              isHovered && "text-black dark:text-white"
            )}
            animate={{ 
              scale: isHovered ? 1.02 : 1,
              transition: { duration: 0.2 }
            }}
          >
            {name}
          </motion.h3>
          
          <div className={cn(
            "flex items-center",
            compact && "text-sm"
          )}>
            {isSale && salePrice ? (
              <div className="flex items-center flex-wrap">
                <motion.span 
                  className="text-red-600 font-semibold mr-2"
                  animate={{ 
                    scale: isHovered ? 1.05 : 1,
                    transition: { duration: 0.2 }
                  }}
                >
                  {formattedSalePrice}
                </motion.span>
                <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
                  {formattedPrice}
                </span>
              </div>
            ) : (
              <motion.span 
                className="font-semibold"
                animate={{ 
                  scale: isHovered ? 1.05 : 1,
                  transition: { duration: 0.2 }
                }}
              >
                {formattedPrice}
              </motion.span>
            )}
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="relative mt-2 overflow-hidden h-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
          <motion.span 
            className="absolute bottom-0 left-0 h-0.5 bg-black dark:bg-white rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: isHovered ? "100%" : "0%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          ></motion.span>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard; 