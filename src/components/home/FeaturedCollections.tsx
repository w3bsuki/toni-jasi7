"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Plus, ArrowRight, ShoppingBag, Heart, Eye, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Product } from "@/lib/types";
import QuickView from "@/components/shop/QuickView";

interface Collection {
  id: string;
  name: string;
  image: string;
  slug: string;
}

interface FeaturedCollectionsProps {
  title?: string;
  collections: Collection[];
  trendingProducts?: Product[];
}

export function FeaturedCollections({
  title,
  collections,
  trendingProducts = [],
}: FeaturedCollectionsProps) {
  // Local state
  const [selection, setSelection] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Create our data with specified categories
  const data = [
    {
      id: "mens",
      title: "MENS",
      description: "Stylish and modern hats for men",
      href: `/collections/${collections[0]?.slug || "mens"}`,
      bgColor: "bg-blue-900",
      pattern: "bg-gradient-to-br from-blue-800/80 to-blue-950",
      emoji: "👒",
      badge1: "NEW ARRIVALS",
      badge2: "ESSENTIALS",
    },
    {
      id: "bestsellers",
      title: "BESTSELLERS",
      description: "Our most popular and trending styles",
      href: `/collections/${collections[1]?.slug || "bestsellers"}`,
      bgColor: "bg-amber-900",
      pattern: "bg-gradient-to-br from-amber-800/80 to-amber-950",
      emoji: "🧢",
      badge1: "TOP RATED",
      badge2: "CUSTOMER FAVORITES",
    },
    {
      id: "womens",
      title: "WOMENS",
      description: "Elegant and trendy hats for women",
      href: `/collections/${collections[2]?.slug || "womens"}`,
      bgColor: "bg-rose-900",
      pattern: "bg-gradient-to-br from-rose-800/80 to-rose-950",
      emoji: "🎩",
      badge1: "TRENDING",
      badge2: "LIMITED EDITION",
    },
  ];

  // Handle responsive layout and set initial selection
  useEffect(() => {
    // Check if mobile on mount and when window resizes
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkIfMobile();
    setSelection("bestsellers");
    setIsLoaded(true);
    
    // Setup resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Create a duplicated array for proper infinite scroll
  // We only need to duplicate once to create the infinite effect
  const duplicatedProducts = [...trendingProducts, ...trendingProducts];

  // Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  // Item animations
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Handle quick view
  const handleQuickView = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProductId(productId);
  };

  // Handle mouse move for the spotlight effect
  const handleMouseMove = (e: React.MouseEvent) => {
    // Only used for corner accents - no spotlight effect needed
    // This ensures we don't affect card content readability
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

  // Mobile layout - enhanced cards with staggered animation
  if (isMobile) {
    return (
      <section ref={sectionRef} className="w-full bg-white dark:bg-[#0a0a0a] py-6">
        <motion.div 
          className="grid grid-cols-1 gap-4 px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {data.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Link
                href={item.href}
                className={`group relative block w-full h-48 overflow-hidden rounded-lg text-white ${item.bgColor} ${item.pattern}`}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10" 
                  style={{ 
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    backgroundSize: '60px 60px'
                  }}
                />
                  
                {/* Large emoji watermark with subtle animation */}
                <motion.div 
                  className="absolute -right-4 -bottom-4 text-white/10 text-[120px] pointer-events-none"
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.05, 1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 10, 
                    ease: "easeInOut", 
                    repeat: Infinity,
                    repeatType: "mirror" 
                  }}
                >
                  {item.emoji}
                </motion.div>
                  
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className='flex items-center gap-2'>
                    <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                      {item.badge1}
                    </Badge>
                  </div>
                  
                  <div className="z-10">
                    <h3 className="text-white text-3xl font-bold tracking-wider mb-1">
                      {item.title}
                    </h3>
                    
                    <p className="text-white/80 text-sm mb-3">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-base font-medium text-white">
                        Shop Collection
                      </div>
                      <motion.div 
                        className="flex size-8 items-center justify-center bg-white text-black"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowUpRight className="size-4" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Trending Now Carousel - Mobile Version */}
        {trendingProducts.length > 0 && (
          <div className="mt-6 pb-4 mb-[-1rem]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <motion.div 
                className="flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold dark:text-white text-black flex items-center gap-3 uppercase tracking-wide">
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
              </motion.div>
            </div>
            <div className="flex overflow-x-auto pb-4 px-4 gap-4 no-scrollbar">
              {trendingProducts.map((product, index) => (
                <div key={`${product.id}-${index}`} className="flex-none w-[280px] rounded-lg overflow-hidden shadow-md dark:bg-zinc-900 bg-white">
                  <div className="relative h-[280px] overflow-hidden">
                    {product.images && product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="280px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold dark:text-white text-black truncate">{product.name}</h3>
                    <p className="mt-1 dark:text-white text-black font-bold">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Link 
                href="/collections/trending" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white transition-colors bg-zinc-900 rounded-md hover:bg-zinc-800"
              >
                Shop All Trending
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </section>
    );
  }

  // Desktop layout - enhanced interactive animation
  return (
    <section ref={sectionRef} className="w-full bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full lg:aspect-[1336/460] relative">
        <AnimatePresence>
          {data.map((item, index) => (
            <motion.div
              key={item.id}
              data-state={selection === item.id ? "open" : "closed"}
              className='group relative overflow-hidden'
              onMouseEnter={() => {
                setSelection(item.id);
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                flex: selection === item.id ? 3 : 1
              }}
              style={{
                width: selection === item.id ? "60%" : "20%"
              }}
              transition={{ 
                duration: 0.5, 
                ease: [0.22, 1, 0.36, 1],
                flex: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3 }
              }}
            >
              <Link
                href={item.href}
                className="relative block h-full w-full overflow-hidden bg-black text-white"
              >
                {/* Stylized background with pattern and parallax effect */}
                <motion.div 
                  className={`absolute inset-0 ${item.bgColor} ${item.pattern}`}
                  animate={{ 
                    scale: selection === item.id ? 1.05 : 1
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10" 
                    style={{ 
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      backgroundSize: '60px 60px'
                    }} 
                  />
                </motion.div>
                
                {/* Large emoji watermark with animation */}
                <motion.div 
                  className="absolute -right-16 -bottom-16 text-white/10 text-[300px] pointer-events-none"
                  animate={{ 
                    rotate: [0, 2, 0, -2, 0],
                    scale: [1, 1.02, 1, 1.02, 1],
                    x: selection === item.id ? 20 : 0,
                    opacity: selection === item.id ? 0.15 : 0.1
                  }}
                  transition={{ 
                    duration: 8, 
                    ease: "easeInOut", 
                    repeat: Infinity,
                    repeatType: "mirror" 
                  }}
                >
                  {item.emoji}
                </motion.div>
                
                {/* Enhanced gradient overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
                  animate={{ 
                    opacity: selection === item.id ? 0.85 : 0.9
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                  <div className='flex items-center gap-2 transition-opacity duration-300'>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ 
                        opacity: selection === item.id ? 1 : 0.7,
                        y: 0
                      }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                        {item.badge1}
                      </Badge>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ 
                        opacity: selection === item.id ? 1 : 0,
                        y: selection === item.id ? 0 : -10
                      }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                        {item.badge2}
                      </Badge>
                    </motion.div>
                  </div>
                  
                  <div className="z-10">
                    <motion.h3 
                      className="block text-white text-4xl font-bold tracking-wider mb-2 md:mb-4"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: selection === item.id ? 1 : 0.7
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.title}
                    </motion.h3>
                    
                    <motion.p
                      className="text-white/80 max-w-xs mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: selection === item.id ? 1 : 0,
                        y: selection === item.id ? 0 : 10
                      }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      {item.description}
                    </motion.p>
                    
                    <motion.div 
                      className="flex items-center justify-between gap-2"
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: selection === item.id ? 1 : 0.7 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-base font-medium lg:text-lg text-white">
                        Shop Collection
                      </div>
                      <motion.div 
                        className="flex size-10 items-center justify-center bg-white text-black group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ 
                          x: 5, 
                          y: -5,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowUpRight className="size-5" />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
                
                {selection === item.id && (
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex size-16 items-center justify-center bg-white/90 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus className="size-8 text-black" />
                  </motion.div>
                )}
              </Link>
              
              {/* Vertical separator line with animated opacity */}
              {index < data.length - 1 && (
                <motion.div 
                  className="hidden lg:block absolute right-0 top-0 bottom-0 w-[1px] bg-white/10 z-10"
                  animate={{ 
                    opacity: selection === item.id || selection === data[index + 1].id ? 0 : 1 
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Trending Now Carousel - Desktop version */}
      {trendingProducts.length > 0 && (
        <div className="w-full bg-black py-4 lg:py-6 border-t border-zinc-800 relative overflow-hidden mb-[-1.5rem]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-grid-white/5"></div>
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
                    onMouseEnter={(e) => {
                      setHoveredId(product.id + '-' + index);
                      handleMouseMove(e);
                    }}
                    onMouseMove={handleMouseMove}
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
              href="/collections/trending" 
              className="shop-all-button"
            >
              <span className="relative z-10 flex items-center gap-1">
                Shop All Trending
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="button-bg"></div>
            </Link>
          </div>
        </div>
      )}

      {/* QuickView dialog */}
      <AnimatePresence>
        {quickViewProductId && (
          <QuickView 
            product={trendingProducts.find(p => p.id === quickViewProductId) || null} 
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
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: linear-gradient(145deg, rgba(28, 28, 28, 0.7), rgba(18, 18, 18, 0.95));
          backdrop-filter: blur(20px);
          border: none;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          transform: translateY(0);
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          z-index: 1;
        }
        
        .product-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 80% 0%,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%
          );
          opacity: 0.6;
          z-index: 1;
          pointer-events: none;
        }

        /* Create a pseudo-element for the border only */
        .product-card-wrapper {
          position: relative;
          z-index: 1;
          margin: 2px;
        }
        
        /* Pure white border with no background effect */
        .product-card-wrapper::before {
          content: '';
          position: absolute;
          inset: -2px;
          z-index: 0;
          border-radius: 26px;
          opacity: 0;
          transition: opacity 0.3s ease, box-shadow 0.3s ease;
          pointer-events: none;
          border: 2px solid transparent;
        }
        
        /* Simple clean white border with no background */
        .product-card-wrapper:hover::before {
          opacity: 1;
          border: 2px solid #FFFFFF;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
          background: none;
        }
        
        /* Maintain dark gradient on hover without any vertical movement */
        .product-card.hovered {
          transform: translateY(0);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
          background: linear-gradient(145deg, rgba(28, 28, 28, 0.7), rgba(18, 18, 18, 0.95));
        }
        
        /* Remove all corner accents completely */
        .corner-accent {
          display: none;
        }
        
        /* Image Container */
        .image-container {
          position: relative;
          width: 100%;
          height: 380px;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .image-container::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 75%,
            rgba(0, 0, 0, 0.6) 100%
          );
          z-index: 3;
        }
        
        .product-card.hovered .image-container img {
          transform: scale(1.08);
          filter: brightness(1.05) contrast(1.05);
        }
        
        .image-container img {
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          filter: saturate(1.1);
        }
        
        .secondary-image {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.5s ease;
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
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
          z-index: 10;
        }
        
        .product-card.hovered .quick-view-overlay {
          opacity: 1;
          visibility: visible;
        }
        
        .quick-view-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.95);
          color: #111;
          font-weight: 600;
          padding: 14px 24px;
          border-radius: 12px;
          transform: translateY(10px);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          border: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          letter-spacing: 0.02em;
          font-size: 15px;
        }
        
        .product-card.hovered .quick-view-button {
          transform: translateY(0);
        }
        
        .quick-view-button:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }
        
        /* Action Buttons */
        .action-buttons {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 5;
        }
        
        .action-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          color: #111;
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        .product-card.hovered .action-button {
          opacity: 1;
          transform: translateX(0);
        }
        
        .action-button:hover {
          background: white;
          transform: scale(1.1);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .wishlist-button {
          transition-delay: 0.05s;
        }
        
        /* Product Badges */
        .discount-badge, .new-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          padding: 10px 16px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          z-index: 5;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        .discount-badge {
          background: #f02929;
          color: white;
        }
        
        .new-badge {
          background: #10b981;
          color: white;
        }
        
        /* Info Container */
        .info-container {
          padding: 28px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          z-index: 3;
        }
        
        .category {
          color: #9ca3af;
          font-size: 13px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        
        .title {
          color: white;
          font-size: 20px;
          font-weight: 600;
          line-height: 1.4;
          letter-spacing: -0.01em;
          margin-bottom: 4px;
        }
        
        /* Rating Container */
        .rating-container {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .reviews {
          font-size: 13px;
          color: #9ca3af;
        }
        
        /* Price Action Row */
        .price-action {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        
        .price {
          position: relative;
          z-index: 1;
        }
        
        .price span {
          font-size: 20px !important;
          font-weight: 600 !important;
          letter-spacing: -0.01em;
        }
        
        .add-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          color: #111;
          border: none;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          letter-spacing: 0.02em;
        }
        
        .add-button:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
        }
        
        /* Shop All Button */
        .shop-all-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          overflow: hidden;
          border-radius: 8px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .shop-all-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .button-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1));
          opacity: 0;
          transition: opacity 0.3s;
          transform: translateX(-100%);
        }

        .shop-all-button:hover .button-bg {
          opacity: 1;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}

export default FeaturedCollections; 