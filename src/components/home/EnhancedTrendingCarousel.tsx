"use client";

import React, { useState, useEffect, useRef } from 'react';
import QuickView from '@/components/shop/QuickView';
import { Product } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import TrendingProductCard from './TrendingProductCard';

interface EnhancedTrendingCarouselProps {
  products: Product[];
  title?: string;
  showShopAll?: boolean;
  autoplaySpeed?: number;
}

export function EnhancedTrendingCarousel({ 
  products, 
  title = "Trending Now", 
  showShopAll = true,
  autoplaySpeed = 60
}: EnhancedTrendingCarouselProps) {
  // State for interactions
  const [isPaused, setIsPaused] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Create a duplicated array for proper infinite scroll
  const duplicatedProducts = [...products, ...products];

  console.log("Trending products in carousel:", products.map(p => ({
    id: p.id, 
    name: p.name, 
    price: p.price, 
    discount: p.discount
  })));

  // Handle opening the quick view dialog
  const handleQuickView = (productId: string) => {
    setQuickViewProductId(productId);
    setHasInteracted(true);
    setIsAutoScrolling(false);
  };

  // Get current product for quick view
  const getCurrentQuickViewProduct = () => {
    if (!quickViewProductId) return null;
    
    const product = products.find(p => p.id === quickViewProductId);
    return product || null;
  };

  // Reset auto-scrolling when user interaction ends
  useEffect(() => {
    if (hasInteracted) {
      const timer = setTimeout(() => {
        setIsAutoScrolling(true);
        setHasInteracted(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

  return (
    <section className="w-full bg-black py-6 lg:py-10 border-t border-zinc-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* Header with title and subtitle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-3 uppercase tracking-wide">
            {title}
          </h2>
          <div className="h-[2px] w-full max-w-[80px] bg-zinc-800 mt-3 relative">
            <motion.div 
              className="absolute h-[2px] bg-white inset-0"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
          <motion.p 
            className="text-zinc-400 mt-3 text-center max-w-md mx-auto text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Discover our most popular styles that everyone is wearing right now
          </motion.p>
        </motion.div>
      </div>

      {/* Enhanced Carousel Container */}
      <div 
        className="carousel-container"
        onMouseEnter={() => {
          setIsPaused(true);
          setHasInteracted(true);
          setIsAutoScrolling(false);
        }}
        onMouseLeave={() => {
          setIsPaused(false);
          setHasInteracted(true);
          // Auto-scrolling will resume after timeout
        }}
        ref={carouselRef}
      >
        <div 
          className={`carousel-track ${isPaused || !isAutoScrolling ? 'paused' : ''}`}
          style={{animationDuration: `${autoplaySpeed}s`}}
        >
          {duplicatedProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              className="product-card-wrapper"
            >
              <TrendingProductCard 
                product={product} 
                index={index % products.length} 
                onQuickView={handleQuickView}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Shop All button */}
      {showShopAll && (
        <div className="flex justify-center mt-8">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              href="/collections/trending" 
              className="shop-all-button group"
            >
              <span className="relative z-10 flex items-center gap-1.5 text-sm">
                Shop All Trending
                <motion.div
                  initial={{ x: 0 }}
                  animate={null}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-4 w-4 transition-transform duration-300" />
                </motion.div>
              </span>
              <div className="button-bg" />
            </Link>
          </motion.div>
        </div>
      )}

      {/* QuickView dialog */}
      <AnimatePresence>
        {quickViewProductId && (
          <QuickView 
            product={getCurrentQuickViewProduct()} 
            isOpen={!!quickViewProductId} 
            onClose={() => {
              setQuickViewProductId(null);
            }} 
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .bg-grid-pattern {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
        
        /* Carousel Styling */
        .carousel-container {
          width: 100%;
          overflow: hidden;
          padding: 24px 0;
          margin-bottom: 10px;
        }

        .carousel-track {
          display: flex;
          gap: 20px;
          padding: 0 40px;
          animation: infiniteScroll 60s linear infinite;
          will-change: transform;
        }

        .carousel-track.paused {
          animation-play-state: paused;
        }
        
        @keyframes infiniteScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        /* Product Card Wrapper */
        .product-card-wrapper {
          flex: 0 0 280px;
          width: 280px;
          height: 430px;
          position: relative;
          z-index: 1;
          padding: 4px;
        }
        
        /* Shop All Button */
        .shop-all-button {
          position: relative;
          overflow: hidden;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }
        
        .shop-all-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: white;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .button-bg {
          position: absolute;
          inset: 0;
          background: white;
          z-index: -1;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .shop-all-button:hover .button-bg {
          transform: scaleX(1);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .carousel-track {
            gap: 16px;
            padding: 0 20px;
          }
          
          .product-card-wrapper {
            flex: 0 0 260px;
            width: 260px;
            height: 410px;
          }
        }
      `}</style>
    </section>
  );
}

export default EnhancedTrendingCarousel; 