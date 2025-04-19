"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star } from 'lucide-react';
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
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  if (!product) return null;

  // Format price with discount
  const formatPrice = (price: number, discount: number) => {
    if (discount > 0) {
      const discountedPrice = price - (price * discount / 100);
      return (
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">${discountedPrice.toFixed(2)}</span>
          <span className="text-gray-400 line-through text-sm">${price.toFixed(2)}</span>
        </div>
      );
    }
    return <span className="text-white font-bold text-xl">${price.toFixed(2)}</span>;
  };

  // Generate star rating component
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    return (
      <div className="flex items-center gap-0.5">
        {stars}
        <span className="text-sm text-gray-400 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] bg-black border border-gray-800 p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left side - Image */}
          <div className="relative aspect-square overflow-hidden bg-zinc-900">
            {selectedImage && (
              <Image 
                src={selectedImage} 
                alt={product.name} 
                fill 
                className="object-cover"
              />
            )}
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 relative border-2 transition-all ${
                      selectedImage === img ? 'border-white' : 'border-transparent hover:border-gray-300'
                    }`}
                    title={`View ${product.name} - image ${idx + 1}`}
                    aria-label={`View ${product.name} - image ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Tags */}
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              {product.discount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 shadow-md">
                  -{product.discount}%
                </span>
              )}
              
              {product.isNew && (
                <span className="bg-black text-white text-xs font-bold px-2 py-1 shadow-md border border-gray-800">
                  NEW
                </span>
              )}
            </div>
          </div>
          
          {/* Right side - Product details */}
          <div className="p-6 md:p-8 flex flex-col bg-black">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
              <DialogDescription>
                <div className="flex items-center mt-2">
                  {renderRating(product.rating)}
                  <span className="mx-2 text-gray-500">|</span>
                  <span className="text-sm text-gray-400">SKU: {product.id}</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-4">
              {formatPrice(product.price, product.discount)}
            </div>
            
            <div className="text-gray-300 mb-6">
              <p>{product.description || "A premium quality hat designed with comfort and style in mind. Perfect for any occasion, this versatile piece will elevate your wardrobe."}</p>
            </div>
            
            <div className="mt-auto space-y-4">
              {/* Color options if available */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-200 mb-2">Colors:</h4>
                  <div className="flex gap-2">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        className="w-8 h-8 rounded-full border border-gray-700 focus:ring-2 ring-white"
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${color}`}
                        title={`Select color: ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Size options if available */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-200 mb-2">Size:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, idx) => (
                      <button
                        key={idx}
                        className="min-w-[40px] h-9 px-2 bg-zinc-900 hover:bg-zinc-800 border border-gray-700 text-white text-sm focus:ring-2 ring-white"
                        title={`Select size: ${size}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 mt-6">
                <Link 
                  href={`/products/${product.slug}`}
                  className="flex-1"
                >
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group overflow-hidden"
                  >
                    <div className="bg-white text-black border border-white flex items-center justify-center h-12 relative z-10">
                      <span className="font-bold uppercase tracking-wider text-sm group-hover:text-white transition-colors duration-300">
                        View Details
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </motion.div>
                </Link>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-gray-700 text-white hover:bg-zinc-800"
                >
                  <Heart className="h-5 w-5" />
                </motion.button>
              </div>
              
              <div className="text-xs text-gray-400 mt-4">
                Available for immediate shipping. Usually ships within 24 hours.
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QuickView; 