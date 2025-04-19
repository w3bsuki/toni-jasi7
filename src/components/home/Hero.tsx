"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles, Star, TrendingUp } from "lucide-react";
import SignupCarousel from "./SignupCarousel";
import { Button } from "@/components/ui/button";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

export function Hero({
  title = "Premium Hat Collection",
  subtitle = "Discover our premium hat collection crafted with exceptional quality materials and attention to detail.",
  ctaText = "Shop Now",
  ctaLink = "/collections",
  imageUrl = "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3"
}: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-5 dark:opacity-[0.03] z-0"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full">
        {/* Left Column - Text and CTA */}
        <div className="relative h-[500px] md:h-[650px] flex flex-col justify-end px-6 md:px-12 pb-12 md:pb-16 z-10 overflow-hidden">
          {/* Men's image in background with overlay */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3" 
              alt="Stylish man in hat" 
              fill 
              style={{ objectFit: 'cover' }}
              className="brightness-[0.85]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30"></div>
          </div>
          
          {/* Text content */}
          <div className="relative z-10 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-3"
            >
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm text-white rounded-md border border-white/20">
                New Season Collection
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            >
              {title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-base md:text-lg max-w-md text-gray-200 mb-8"
            >
              {subtitle}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              {/* Premium animated CTA button */}
              <div className="relative">
                <motion.div
                  className="group relative"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  initial="initial"
                  whileHover="hover"
                >
                  <Link href={ctaLink} className="block">
                    <div className="relative overflow-hidden">
                      {/* Base button */}
                      <div className="bg-white py-4 px-8 flex items-center justify-between min-w-[160px]">
                        <motion.span 
                          className="text-black uppercase font-bold tracking-wider text-sm relative z-10"
                          animate={{
                            color: isHovered ? "#FFFFFF" : "#000000",
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {ctaText}
                        </motion.span>
                        
                        <motion.div
                          animate={{
                            x: isHovered ? 5 : 0,
                            color: isHovered ? "#FFFFFF" : "#000000"
                          }}
                          transition={{ duration: 0.3 }}
                          className="relative z-10"
                        >
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </motion.div>
                      </div>
                      
                      {/* Animated overlay */}
                      <motion.div 
                        className="absolute inset-0 bg-black origin-left" 
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: isHovered ? 1 : 0,
                        }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      />

                      {/* Border animation */}
                      <motion.div 
                        className="absolute inset-0 border-2 border-white"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: isHovered ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Corner accents */}
                      <motion.div
                        className="absolute h-[8px] w-[8px] border-t-2 border-l-2 border-white top-0 left-0"
                        initial={{ opacity: 0, x: -5, y: -5 }}
                        animate={{ 
                          opacity: isHovered ? 1 : 0,
                          x: isHovered ? 0 : -5,
                          y: isHovered ? 0 : -5,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute h-[8px] w-[8px] border-t-2 border-r-2 border-white top-0 right-0"
                        initial={{ opacity: 0, x: 5, y: -5 }}
                        animate={{ 
                          opacity: isHovered ? 1 : 0,
                          x: isHovered ? 0 : 5,
                          y: isHovered ? 0 : -5,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute h-[8px] w-[8px] border-b-2 border-l-2 border-white bottom-0 left-0"
                        initial={{ opacity: 0, x: -5, y: 5 }}
                        animate={{ 
                          opacity: isHovered ? 1 : 0,
                          x: isHovered ? 0 : -5,
                          y: isHovered ? 0 : 5,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute h-[8px] w-[8px] border-b-2 border-r-2 border-white bottom-0 right-0"
                        initial={{ opacity: 0, x: 5, y: 5 }}
                        animate={{ 
                          opacity: isHovered ? 1 : 0,
                          x: isHovered ? 0 : 5,
                          y: isHovered ? 0 : 5,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Right Column - Image */}
        <div className="relative h-[500px] md:h-[650px] overflow-hidden hidden md:block">
          <Image 
            src={imageUrl}
            alt="Hat collection"
            fill
            style={{ objectFit: 'cover' }}
            className="brightness-[0.95]"
            priority
          />
        </div>
      </div>
    </section>
  );
}

export default Hero; 