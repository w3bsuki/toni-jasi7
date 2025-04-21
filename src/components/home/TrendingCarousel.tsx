'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight, ShoppingBag, Heart, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import QuickView from '@/components/shop/QuickView';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendingCarouselProps {
  products: Product[];
}

export function TrendingCarousel({ products }: TrendingCarouselProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  const handleQuickView = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProductId(productId);
  };

  // Function to format price with discount
  const formatPrice = (price: number, discount: number = 0): JSX.Element => {
    if (discount > 0) {
      const discountedPrice = price - (price * discount / 100);
      return (
        <div className="flex items-end gap-2">
          <span className="text-white font-bold text-lg">${discountedPrice.toFixed(2)}</span>
          <span className="text-gray-400 line-through text-sm">${price.toFixed(2)}</span>
          <span className="text-red-500 text-sm font-medium ml-1">({discount}% OFF)</span>
        </div>
      );
    }
    return <span className="text-white font-bold text-lg">${price.toFixed(2)}</span>;
  };

  // Function to render star rating
  const renderRating = (rating: number): JSX.Element => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex">
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) {
              return <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />;
            } else if (i === fullStars && hasHalfStar) {
              return (
                <div key={i} className="relative">
                  <Star className="w-3.5 h-3.5 text-gray-600" />
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              );
            } else {
              return <Star key={i} className="w-3.5 h-3.5 text-gray-600" />;
            }
          })}
        </div>
        <span className="text-xs text-white font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Create a duplicated array for proper infinite scroll
  // We only need to duplicate once to create the infinite effect
  const duplicatedProducts = [...products, ...products];

  return (
    <section className="w-full bg-black py-12 lg:py-16 border-t border-zinc-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-white/5"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-3 uppercase tracking-wide">
            Trending Now
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

      {/* Infinite Carousel */}
      <div 
        className="carousel-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`carousel-track ${isPaused ? 'paused' : ''}`}>
          {duplicatedProducts.map((product, index) => {
            const isHovered = hoveredId === product.id + '-' + index;
            
            return (
              <div 
                key={`${product.id}-${index}`} 
                className="product-card-wrapper"
                onMouseEnter={() => setHoveredId(product.id + '-' + index)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`product-card ${isHovered ? 'hovered' : ''}`}>
                  <div className="image-container">
                    {product.images && product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 380px"
                        className="object-cover transition-transform duration-500"
                        priority={index < 4}
                      />
                    )}
                    
                    {/* Secondary image */}
                    {product.images && product.images.length > 1 && isHovered && (
                      <div className="secondary-image">
                        <Image
                          src={product.images[1]}
                          alt={`${product.name} - alternate view`}
                          fill
                          sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 380px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Quick View Button */}
                    <div className="quick-view-overlay">
                      <button 
                        className="quick-view-button"
                        onClick={(e) => handleQuickView(product.id, e)}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Quick View</span>
                      </button>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="action-buttons">
                      <button
                        className="action-button wishlist-button"
                        aria-label="Add to wishlist"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Product Labels */}
                    {product.discount > 0 ? (
                      <div className="discount-badge">
                        {product.discount}% OFF
                      </div>
                    ) : product.isNew ? (
                      <div className="new-badge">
                        NEW
                      </div>
                    ) : null}
                  </div>
                  
                  <div className="info-container">
                    {product.categories && product.categories.length > 0 && (
                      <div className="category">
                        {product.categories[0]}
                      </div>
                    )}
                    
                    <h3 className="title">
                      {product.name}
                    </h3>
                    
                    <div className="rating-container">
                      {renderRating(product.rating)}
                      {product.reviews > 0 && (
                        <span className="reviews">({product.reviews})</span>
                      )}
                    </div>
                    
                    <div className="price-action">
                      <div className="price">
                        {formatPrice(product.price, product.discount)}
                      </div>
                      
                      <button 
                        className="add-button"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shop All button */}
      <div className="flex justify-center mt-10">
        <Link 
          href="/collections" 
          className="shop-all-button"
        >
          <span className="relative z-10 flex items-center gap-1">
            Shop All Trending
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <div className="button-bg"></div>
        </Link>
      </div>
      
      {/* QuickView dialog */}
      <AnimatePresence>
        {quickViewProductId && (
          <QuickView 
            product={products.find(p => p.id === quickViewProductId) || null} 
            isOpen={!!quickViewProductId} 
            onClose={() => setQuickViewProductId(null)} 
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .bg-grid-white\/5 {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
        
        /* Carousel Styling */
        .carousel-container {
          width: 100%;
          overflow: hidden;
          padding: 20px 0;
          margin-bottom: 10px;
        }

        .carousel-track {
          display: flex;
          gap: 24px;
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
          flex: 0 0 400px;
          width: 400px;
          height: 560px;
        }
        
        /* Product Card */
        .product-card {
          width: 100%;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: linear-gradient(to bottom, rgba(30, 30, 30, 0.4), rgba(10, 10, 10, 0.8));
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.3),
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
          transform: translateY(0);
        }
        
        .product-card.hovered {
          transform: translateY(-8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 15px 40px rgba(0, 0, 0, 0.4), 
            0 0 20px rgba(255, 255, 255, 0.05),
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        /* Image Container */
        .image-container {
          position: relative;
          width: 100%;
          height: 380px;
          overflow: hidden;
        }
        
        .product-card.hovered .image-container img {
          transform: scale(1.1);
        }
        
        .image-container img {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .secondary-image {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        }
        
        .product-card.hovered .secondary-image {
          opacity: 1;
        }
        
        /* Quick View Overlay */
        .quick-view-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(3px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 10;
        }
        
        .product-card.hovered .quick-view-overlay {
          opacity: 1;
          visibility: visible;
        }
        
        .quick-view-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 8px;
          transform: translateY(20px);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
        }
        
        .product-card.hovered .quick-view-button {
          transform: translateY(0);
        }
        
        .quick-view-button:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }
        
        /* Product Badges */
        .discount-badge, .new-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 6px 12px;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: bold;
          z-index: 5;
          letter-spacing: 0.03em;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 1px rgba(255, 255, 255, 0.05);
        }
        
        .discount-badge {
          background: rgba(0, 0, 0, 0.8);
          color: white;
        }
        
        .new-badge {
          background: rgba(20, 20, 20, 0.8);
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        /* Action Buttons */
        .action-buttons {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 5;
        }
        
        .action-button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(20, 20, 20, 0.8);
          color: white;
          opacity: 0;
          transform: translateX(20px);
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 1px rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .product-card.hovered .action-button {
          opacity: 1;
          transform: translateX(0);
        }
        
        .action-button:hover {
          background: rgba(40, 40, 40, 0.9);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
        }
        
        /* Info Container */
        .info-container {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .category {
          font-size: 0.75rem;
          color: #a1a1aa;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        
        .title {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin-bottom: 8px;
          height: 48px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .rating-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .reviews {
          font-size: 0.75rem;
          color: #a1a1aa;
        }
        
        .price-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .price {
          display: flex;
          flex-direction: column;
        }
        
        .add-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(10, 10, 10, 0.9);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 1px rgba(255, 255, 255, 0.05);
        }
        
        .add-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
          background: rgba(30, 30, 30, 0.9);
        }
        
        /* Shop All Button */
        .shop-all-button {
          position: relative;
          overflow: hidden;
          background: transparent;
          border: 1px solid white;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }
        
        .shop-all-button:hover {
          color: black;
        }
        
        .button-bg {
          position: absolute;
          inset: 0;
          background: white;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .shop-all-button:hover .button-bg {
          transform: scaleX(1);
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          .carousel-track {
            gap: 16px;
            padding: 0 20px;
          }
          
          .product-card-wrapper {
            flex: 0 0 360px;
            width: 360px;
            height: 540px;
          }
          
          .image-container {
            height: 360px;
          }
          
          .quick-view-button {
            padding: 8px 14px;
            font-size: 0.875rem;
          }
        }
        
        @media (max-width: 639px) {
          .carousel-track {
            gap: 12px;
            padding: 0 16px;
          }
          
          .product-card-wrapper {
            flex: 0 0 320px;
            width: 320px;
            height: 500px;
          }
          
          .image-container {
            height: 320px;
          }
          
          .info-container {
            padding: 12px;
          }
          
          .title {
            font-size: 1rem;
            height: 44px;
          }
          
          .quick-view-button {
            padding: 6px 12px;
            font-size: 0.75rem;
          }
          
          .action-button {
            width: 32px;
            height: 32px;
          }
          
          .product-card.hovered {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </section>
  );
}

export default TrendingCarousel; 