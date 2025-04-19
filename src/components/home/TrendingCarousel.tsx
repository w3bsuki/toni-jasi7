'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import QuickView from '@/components/shop/QuickView';

interface TrendingCarouselProps {
  products: Product[];
}

export function TrendingCarousel({ products }: TrendingCarouselProps) {
  const [duplicatedProducts, setDuplicatedProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Create enough copies of the products for the carousel
  useEffect(() => {
    if (products.length === 0) return;
    
    // Make sure we have plenty of items for a truly infinite loop
    const duplicated = [];
    // Add 5 full sets of products to ensure it never runs out
    for (let i = 0; i < 5; i++) {
      duplicated.push(...products);
    }
    setDuplicatedProducts(duplicated);
    setIsLoaded(true);
  }, [products]);

  const handleQuickViewClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  // Function to format price with discount
  const formatPrice = (price: number, discount: number = 0): JSX.Element => {
    if (discount > 0) {
      const discountedPrice = price - (price * discount / 100);
      return (
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">${discountedPrice.toFixed(2)}</span>
          <span className="text-gray-400 line-through text-sm">${price.toFixed(2)}</span>
        </div>
      );
    }
    return <span className="text-white font-bold">${price.toFixed(2)}</span>;
  };

  // Function to render star rating
  const renderRating = (rating: number): JSX.Element => {
    return (
      <div className="rating flex items-center gap-0.5">
        <span className="text-yellow-400">★</span>
        <span className="text-sm text-gray-300">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="w-full bg-black overflow-hidden py-16 border-t border-zinc-800 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0 bg-grid-white/3"></div>
      </div>
      
      <div className="flex flex-col items-center justify-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3 opacity-0 animate-fadeInUp uppercase tracking-wide" 
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          Trending Now
        </h2>
        <div className="h-px w-full max-w-[120px] bg-zinc-700 mt-4 relative">
          <div className="absolute h-px bg-white w-0 inset-0 animate-expandWidth" 
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          </div>
        </div>
        <p className="text-zinc-400 mt-4 text-center max-w-md mx-auto text-sm opacity-0 animate-fadeInUp"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          Discover our most popular styles that everyone is wearing right now
        </p>
      </div>

      {isLoaded && (
        <div 
          className="carousel-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`carousel-track ${isPaused ? 'paused' : ''}`}>
            {duplicatedProducts.map((product, index) => (
              <div 
                key={`${product.id}-${index}`}
                className="product-card"
                onMouseEnter={() => setHoveredProduct(`${product.id}-${index}`)}
                onMouseLeave={() => setHoveredProduct(null)}
                data-hovered={hoveredProduct === `${product.id}-${index}`}
              >
                <Link href={`/products/${product.slug}`} className="block h-full">
                  <div className="product-image">
                    {product.images && product.images[0] && (
                      <>
                        {/* Primary image */}
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 240px, 280px"
                          className="primary-image object-cover transition-all duration-500"
                          priority={index < 2}
                        />
                        
                        {/* Secondary image on hover */}
                        {product.images.length > 1 && (
                          <Image
                            src={product.images[1] || product.images[0]}
                            alt={`${product.name} - alternate view`}
                            fill
                            sizes="(max-width: 768px) 240px, 280px"
                            className="secondary-image object-cover transition-all duration-500"
                          />
                        )}
                      </>
                    )}
                    
                    {/* Discount tag */}
                    {product.discount > 0 && (
                      <div className="discount-tag">
                        -{product.discount}%
                      </div>
                    )}
                    
                    {/* New tag */}
                    {product.isNew && (
                      <div className="new-tag">
                        NEW
                      </div>
                    )}
                    
                    {/* Quick view overlay */}
                    <div className="quick-view-overlay">
                      <button 
                        onClick={(e) => handleQuickViewClick(e, product)}
                        className="quick-view-button"
                        aria-label={`Quick view ${product.name}`}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <h4 className="product-title">{product.name}</h4>
                    <div className="price-rating-container">
                      {formatPrice(product.price, product.discount)}
                      {renderRating(product.rating)}
                    </div>
                    {/* Shop Now button for product card */}
                    <div className="product-button">
                      <div className="btn-base flex items-center justify-center relative overflow-hidden">
                        <span className="product-btn-text relative z-10">Shop Now</span>
                        <div className="absolute inset-0 bg-red-600 origin-left scale-x-0 transition-transform duration-300"></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shop Now button below carousel */}
      <div className="flex justify-center mt-14">
        <Link href="/collections" className="shop-all-button">
          <span className="relative inline-flex items-center justify-center">
            <span className="bg-white text-black border border-white px-8 py-3 font-bold tracking-wider text-sm uppercase flex items-center gap-2 transition-all duration-300 hover:bg-black hover:text-white">
              Shop All Trending
              <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </span>
        </Link>
      </div>
      
      {/* QuickView dialog */}
      <QuickView 
        product={quickViewProduct} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />

      <style jsx>{`
        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes infiniteScroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-240px * ${products.length} - (24px * ${products.length})))}
        }
        
        @keyframes borderPulse {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease forwards;
        }
        
        .animate-expandWidth {
          animation: expandWidth 1.2s ease forwards;
        }
        
        /* Carousel Styling */
        .carousel-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 0 24px;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
        }

        .carousel-track {
          display: inline-flex;
          gap: 24px;
          padding: 16px 0;
          animation: infiniteScroll 70s linear infinite;
          animation-fill-mode: forwards;
          will-change: transform;
        }

        .carousel-track.paused {
          animation-play-state: paused;
        }
        
        /* Product Card Styling */
        .product-card {
          position: relative;
          flex-shrink: 0;
          width: 240px;
          height: 400px; /* Increased height for better product presentation */
          transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          background-color: #0f0f0f;
          will-change: transform, box-shadow;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
        }
        
        .product-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border: 0 solid #dc2626;
          opacity: 0;
          z-index: 10;
          pointer-events: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .product-card[data-hovered="true"] {
          transform: translateY(-5px);
          border-color: transparent;
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.4),
            0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        
        .product-card[data-hovered="true"]::before {
          border-width: 1px;
          opacity: 1;
          animation: borderPulse 2s infinite;
        }
        
        /* Product image styling */
        .product-image {
          position: relative;
          width: 100%;
          height: 260px; /* Increased height */
          overflow: hidden;
          transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
          background-color: #0a0a0a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }
        
        .product-card[data-hovered="true"] .product-image {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }
        
        /* Product info */
        .product-info {
          padding: 16px;
          height: 140px;
          background: #0a0a0a;
          transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        
        /* Typography improvements */
        .product-title {
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          margin-bottom: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: rgba(255, 255, 255, 0.95);
          transition: all 300ms ease;
          height: 20px;
        }
        
        .product-card[data-hovered="true"] .product-title {
          color: #dc2626;
        }
        
        /* Price and rating container */
        .price-rating-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 6px 0 12px;
          height: 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          padding-bottom: 10px;
        }
        
        /* Quick view overlay with improved styling */
        .quick-view-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, 
            rgba(0, 0, 0, 0.9) 0%, 
            rgba(0, 0, 0, 0.7) 30%,
            rgba(0, 0, 0, 0) 70%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateY(15px);
          pointer-events: none;
        }
        
        .product-card[data-hovered="true"] .quick-view-overlay {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        
        .quick-view-button {
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background-color: rgba(0, 0, 0, 0.8);
          padding: 0.7rem 1.4rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 300ms ease;
          transform: translateY(10px);
        }
        
        .quick-view-button:hover {
          background-color: #dc2626;
          border-color: #dc2626;
          transform: translateY(5px);
        }
        
        /* Image transition effects */
        .primary-image {
          transition: all 600ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .secondary-image {
          opacity: 0;
          filter: brightness(1.05);
          transition: all 600ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .product-card[data-hovered="true"] .primary-image {
          opacity: 0;
          transform: scale(1.07);
        }
        
        .product-card[data-hovered="true"] .secondary-image {
          opacity: 1;
          transform: scale(1);
        }
        
        /* Enhanced tags */
        .discount-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #dc2626;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.35rem 0.7rem;
          z-index: 10;
        }
        
        .new-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #000;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.35rem 0.7rem;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* Shop Now Button */
        .product-button {
          position: relative;
          margin-top: auto;
          height: 36px;
        }
        
        .btn-base {
          width: 100%;
          height: 100%;
          background-color: #000;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .product-btn-text {
          transition: all 0.3s ease;
        }
        
        .product-card[data-hovered="true"] .btn-base {
          border-color: #dc2626;
          background-color: #dc2626;
        }
        
        .product-card[data-hovered="true"] .btn-base div {
          transform: scaleX(1);
        }
        
        .product-card[data-hovered="true"] .product-btn-text {
          color: white;
        }
        
        /* Media queries for responsiveness */
        @media (max-width: 768px) {
          .carousel-container {
            padding: 0 16px;
          }
          
          .product-card {
            width: 200px;
            height: 380px;
          }
          
          .product-image {
            height: 240px;
          }
        }
        
        @media (max-width: 640px) {
          .product-card {
            width: 180px;
            height: 360px;
          }
          
          .product-image {
            height: 220px;
          }
          
          .quick-view-button {
            padding: 0.6rem 1.2rem;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}

export default TrendingCarousel; 