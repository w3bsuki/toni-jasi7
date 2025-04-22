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
}

export function FeaturedCollections({
  title,
  collections,
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
    </section>
  );
}

export default FeaturedCollections; 