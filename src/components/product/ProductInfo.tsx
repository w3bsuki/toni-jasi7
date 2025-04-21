"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Check, Minus, Plus, StarIcon, Share2, ThumbsUp, Shield, TruckIcon, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Rating } from "@/components/ui/rating";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface ProductInfoProps {
  product: Product;
  onAddToCart: (quantity: number, size: string) => void;
  onAddToWishlist: () => void;
  isInWishlist: boolean;
  isInCart: boolean;
}

export function ProductInfo({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  isInWishlist,
  isInCart
}: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes?.[0] || "One Size"
  );
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Handle quantity changes
  const handleQuantityChange = (value: number) => {
    if (value < 1 || value > 10) return;
    setQuantity(value);
  };

  // Calculate savings
  const savingsAmount = product.salePrice 
    ? product.price - product.salePrice 
    : 0;
  
  const savingsPercentage = savingsAmount 
    ? Math.round((savingsAmount / product.price) * 100) 
    : 0;

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };

  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      variants={staggerItems}
      initial="hidden"
      animate="visible"
      className="flex flex-col space-y-6"
    >
      {/* Product Title and Wishlist */}
      <motion.div variants={fadeIn} className="flex justify-between items-start">
        <div>
          {product.isNew && (
            <span className="inline-block mb-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              New Arrival
            </span>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
        </div>
        <Button
          onClick={onAddToWishlist}
          size="icon"
          variant="ghost"
          className={cn(
            "h-10 w-10 rounded-full transition-colors",
            isInWishlist ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-gray-400 hover:text-gray-500 hover:bg-gray-50"
          )}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-6 w-6", isInWishlist ? "fill-current" : "")} />
        </Button>
      </motion.div>
      
      {/* Rating */}
      <motion.div variants={fadeIn} className="flex items-center gap-2">
        <Rating value={product.rating || 4.5} size={18} />
        <span className="text-sm text-gray-500">
          {product.rating || 4.5} ({product.reviewCount || 24} reviews)
        </span>
      </motion.div>
      
      {/* Price */}
      <motion.div variants={fadeIn}>
        <div className="flex items-center gap-3 mb-1">
          {product.salePrice ? (
            <>
              <span className="text-3xl font-bold text-red-600">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        
        {/* Savings */}
        {product.salePrice && (
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              You save {formatPrice(savingsAmount)} ({savingsPercentage}%)
            </Badge>
            
            {product.isSale && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                Limited Time Offer
              </Badge>
            )}
          </div>
        )}
      </motion.div>
      
      {/* Description */}
      <motion.div variants={fadeIn}>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {product.description}
        </p>
      </motion.div>
      
      {/* Color and Stock */}
      <motion.div variants={fadeIn} className="pt-2">
        {product.colors && product.colors.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Color</span>
              <button 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                onClick={() => {}}
              >
                View all colors
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color, index) => (
                <TooltipProvider key={color}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "w-10 h-10 rounded-full p-0.5 transition-all",
                          "border-2 border-transparent hover:scale-110",
                          color.toLowerCase() === "black" && "bg-black",
                          color.toLowerCase() === "white" && "bg-white",
                          color.toLowerCase() === "blue" && "bg-blue-600",
                          color.toLowerCase() === "red" && "bg-red-600",
                          color.toLowerCase() === "green" && "bg-green-600",
                          color.toLowerCase() === "yellow" && "bg-yellow-500",
                          color.toLowerCase() === "purple" && "bg-purple-600",
                          color.toLowerCase() === "gray" && "bg-gray-500",
                          index === 0 && "ring-2 ring-offset-2 ring-black dark:ring-white"
                        )}
                        aria-label={`Select color ${color}`}
                      >
                        {index === 0 && (
                          <span className="sr-only">Selected</span>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{color}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}
        
        {/* Stock Status */}
        <div className="flex items-center">
          {product.inStock ? (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <Check className="h-5 w-5 mr-1" />
              <span className="font-medium">In Stock</span>
              <span className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium px-2.5 py-0.5 rounded">
                Ready to Ship
              </span>
            </div>
          ) : (
            <div className="text-red-600 dark:text-red-400 font-medium flex items-center">
              <X className="h-5 w-5 mr-1" />
              Out of Stock
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <motion.div variants={fadeIn}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 dark:text-white">Size</h3>
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => setShowSizeGuide(!showSizeGuide)}
            >
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "flex h-11 min-w-11 items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                  selectedSize === size
                    ? "border-black bg-black text-white hover:bg-black/90 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/90"
                    : "border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-black dark:text-gray-100"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Quantity Selection */}
      <motion.div variants={fadeIn}>
        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Quantity</h3>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handleQuantityChange(quantity - 1)}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-md border-gray-200 dark:border-gray-700"
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            onClick={() => handleQuantityChange(quantity + 1)}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-md border-gray-200 dark:border-gray-700"
            disabled={quantity >= 10}
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-gray-500 ml-3">
            {product.inStock ? (
              <>
                {quantity < 5 ? (
                  <>Only <span className="font-medium">{10 - quantity}</span> left in stock!</>
                ) : (
                  <>Maximum of 10 per order</>
                )}
              </>
            ) : 'Currently unavailable'}
          </span>
        </div>
      </motion.div>
      
      {/* Add to Cart Button */}
      <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={() => onAddToCart(quantity, selectedSize || "")}
          size="lg"
          className="w-full sm:w-2/3 bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90"
          disabled={!product.inStock || isInCart || !selectedSize}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          {isInCart ? "Added to Cart" : "Add to Cart"}
        </Button>
        
        <Button
          onClick={onAddToWishlist}
          variant="outline"
          size="lg"
          className="w-full sm:w-1/3 border-gray-300 dark:border-gray-700"
        >
          <Heart className={cn("mr-2 h-5 w-5", isInWishlist ? "fill-red-500 text-red-500" : "")} />
          {isInWishlist ? "Saved" : "Save"}
        </Button>
      </motion.div>
      
      {/* Trust Badges */}
      <motion.div variants={fadeIn} className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center">
            <TruckIcon className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
            <span className="text-sm">Free shipping over $50</span>
          </div>
          <div className="flex items-center">
            <RefreshCw className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
            <span className="text-sm">30-Day returns</span>
          </div>
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
            <span className="text-sm">Secure checkout</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 