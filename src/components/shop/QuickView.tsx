"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
    
    // Reset selections when product changes
    if (product) {
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : null);
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  // Format price with discount
  const formatPrice = (price: number, discount: number) => {
    if (discount > 0) {
      const discountedPrice = price - (price * discount / 100);
      return (
        <div className="flex flex-col">
          <span className="text-white font-bold text-2xl">${discountedPrice.toFixed(2)}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-400 line-through text-sm">${price.toFixed(2)}</span>
            <span className="bg-red-600/90 text-white text-xs font-semibold px-2 py-0.5 rounded-sm">
              SAVE {discount}%
            </span>
          </div>
        </div>
      );
    }
    return <span className="text-white font-bold text-2xl">${price.toFixed(2)}</span>;
  };

  // Generate star rating component
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={`star-${i}`}
            className="h-4 w-4 fill-yellow-400 text-yellow-400"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={`star-${i}`} className="relative">
            <Star className="h-4 w-4 text-gray-600" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star
            key={`star-${i}`}
            className="h-4 w-4 text-gray-600"
          />
        );
      }
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-sm text-white ml-2 font-medium">{rating.toFixed(1)}</span>
        <span className="text-sm text-gray-400 ml-1">({product.reviews} reviews)</span>
      </div>
    );
  };

  // Handle image navigation
  const handlePrevImage = () => {
    if (!product.images || product.images.length <= 1) return;
    
    const currentIndex = product.images.findIndex(img => img === selectedImage);
    const prevIndex = currentIndex <= 0 ? product.images.length - 1 : currentIndex - 1;
    setSelectedImage(product.images[prevIndex]);
  };
  
  const handleNextImage = () => {
    if (!product.images || product.images.length <= 1) return;
    
    const currentIndex = product.images.findIndex(img => img === selectedImage);
    const nextIndex = currentIndex >= product.images.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(product.images[nextIndex]);
  };

  // Add to cart animation
  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1000);
    // Here you would also add the actual cart functionality
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-xl shadow-2xl max-h-[80vh]">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-30 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white rounded-full p-1.5 transition-all"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
          {/* Left side - Image - Takes 2 columns out of 5 */}
          <div className="relative md:col-span-2 aspect-[4/3] md:aspect-auto overflow-hidden bg-zinc-950 group">
            {selectedImage && (
              <Image 
                src={selectedImage} 
                alt={product.name} 
                fill 
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            )}
            
            {/* Image navigation */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <div className="flex gap-1.5 bg-black/50 backdrop-blur-md p-1 rounded-lg">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-10 h-10 relative rounded-md overflow-hidden transition-all border ${
                        selectedImage === img ? 'border-white scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title={`View ${product.name} - image ${idx + 1}`}
                      aria-label={`View ${product.name} - image ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - view ${idx + 1}`}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tags */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.discount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-lg">
                  -{product.discount}%
                </span>
              )}
              
              {product.isNew && (
                <span className="bg-zinc-900 text-white text-xs font-bold px-2 py-0.5 rounded-md border border-white/10 shadow-lg backdrop-blur-sm">
                  NEW
                </span>
              )}
            </div>
          </div>
          
          {/* Right side - Product details - Takes 3 columns out of 5 */}
          <div className="p-4 md:p-5 flex flex-col h-full overflow-y-auto hide-scrollbar md:col-span-3">
            <DialogHeader className="mb-3 text-left">
              <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-1">
                {product.categories?.[0] || "Premium Hat"}
              </div>
              
              <DialogTitle className="text-xl md:text-2xl font-bold text-white">
                {product.name}
              </DialogTitle>
              
              <div className="mt-2">
                {renderRating(product.rating)}
              </div>
            </DialogHeader>
            
            <div className="my-3">
              {formatPrice(product.price, product.discount)}
              
              {product.inStock ? (
                <div className="text-emerald-500 text-xs flex items-center mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></div>
                  In Stock
                </div>
              ) : (
                <div className="text-red-500 text-xs flex items-center mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></div>
                  Out of Stock
                </div>
              )}
            </div>
            
            <div className="prose prose-xs text-gray-300 mb-3 max-w-none">
              <p className="text-xs leading-tight">{product.description || "A premium quality hat designed with comfort and style in mind. Perfect for any occasion, this versatile piece will elevate your wardrobe."}</p>
            </div>
            
            <div className="space-y-3 flex-grow">
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-white mb-1.5 flex justify-between">
                    Color: <span className="text-gray-400">{selectedColor}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-7 h-7 rounded-full transition-all ${
                          selectedColor === color 
                            ? 'ring-1 ring-white ring-offset-1 ring-offset-black scale-110' 
                            : 'hover:scale-110'
                        }`}
                        style={{ 
                          backgroundColor: color,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                        }}
                        aria-label={`Select ${color} color`}
                        title={`Select color: ${color}`}
                      >
                        {selectedColor === color && (
                          <motion.div 
                            layoutId="colorSelection"
                            className="absolute inset-0 border-2 border-white rounded-full"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
                
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-white mb-1.5 flex justify-between">
                    Size: <span className="text-gray-400">{selectedSize}</span>
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.map((size, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[36px] h-8 px-1.5 text-center transition-all ${
                          selectedSize === size
                            ? 'bg-white text-black font-bold'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                        } rounded-md text-xs`}
                        title={`Select size: ${size}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity */}
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-white mb-1.5">Quantity:</h4>
                <div className="flex h-8 max-w-[100px]">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-8 bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 text-white rounded-l-md"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <div className="flex-1 bg-zinc-900 flex items-center justify-center text-white text-xs">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-8 bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 text-white rounded-r-md"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
              
            <div className="space-y-2 mt-auto">
              <div className="flex gap-2">
                {/* Add to Cart Button */}
                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 relative h-10 overflow-hidden rounded-md"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`absolute inset-0 bg-white flex items-center justify-center transition-transform duration-300 ${
                    isAdding ? 'translate-y-full' : 'translate-y-0'
                  }`}>
                    <span className="font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5">
                      <ShoppingBag size={13} /> 
                      Add to Cart
                    </span>
                  </div>
                  <div className={`absolute inset-0 bg-emerald-500 flex items-center justify-center transition-transform duration-300 ${
                    isAdding ? 'translate-y-0' : '-translate-y-full'
                  }`}>
                    <span className="font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5">
                      Added to Cart!
                    </span>
                  </div>
                </motion.button>
                  
                {/* Wishlist Button */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white rounded-md"
                >
                  <Heart className="h-4 w-4" />
                </motion.button>
              </div>
              
              {/* View Details Link */}
              <Link 
                href={`/product/${product.slug}`}
                className="w-full block"
              >
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full h-8 border border-white/20 rounded-md flex items-center justify-center text-white hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-xs">View Full Details</span>
                </motion.div>
              </Link>
              
              <div className="text-xs text-gray-400 mt-2 flex gap-3">
                <div className="flex items-start gap-1">
                  <div className="w-3 h-3 mt-0.5 rounded-full border border-gray-500 flex items-center justify-center text-[7px]">✓</div>
                  <p className="text-[9px] leading-tight">Free shipping on orders over $50</p>
                </div>
                <div className="flex items-start gap-1">
                  <div className="w-3 h-3 mt-0.5 rounded-full border border-gray-500 flex items-center justify-center text-[7px]">✓</div>
                  <p className="text-[9px] leading-tight">30-day guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </Dialog>
  );
}

export default QuickView; 