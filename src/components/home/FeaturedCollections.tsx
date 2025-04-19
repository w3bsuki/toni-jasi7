"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Collection {
  id: string;
  title: string;
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

  // Set initial selection and loaded state on mount
  useEffect(() => {
    setSelection(data[0].id);
    setIsLoaded(true);
  }, []);

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
      badge2: "BESTSELLERS",
    },
    {
      id: "womens",
      title: "WOMENS",
      description: "Elegant and trendy hats for women",
      href: `/collections/${collections[1]?.slug || "womens"}`,
      bgColor: "bg-rose-900",
      pattern: "bg-gradient-to-br from-rose-800/80 to-rose-950",
      emoji: "🎩",
      badge1: "TRENDING",
      badge2: "LIMITED EDITION",
    },
    {
      id: "accessories",
      title: "ACCESSORIES",
      description: "Complete your look with perfect accessories",
      href: `/collections/${collections[2]?.slug || "accessories"}`,
      bgColor: "bg-amber-900",
      pattern: "bg-gradient-to-br from-amber-800/80 to-amber-950",
      emoji: "🧢",
      badge1: "SPECIAL OFFER",
      badge2: "HANDCRAFTED",
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full lg:aspect-[1336/460] relative">
        {data.map((item, index) => (
          <React.Fragment key={item.id}>
            <motion.div
              data-state={selection === item.id ? "open" : "closed"}
              className='group relative max-lg:w-full max-lg:flex-1 max-md:h-[280px] md:max-lg:aspect-[1336/420] overflow-hidden'
              onMouseEnter={() => {
                setSelection(item.id);
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                width: selection === item.id ? "60%" : "20%"
              }}
              transition={{ 
                duration: 0.5, 
                ease: [0.22, 1, 0.36, 1],
                width: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3 }
              }}
            >
              <Link
                href={item.href}
                className="relative block h-full w-full overflow-hidden bg-black text-white"
              >
                {/* Stylized background with pattern */}
                <div className={`absolute inset-0 ${item.bgColor} ${item.pattern}`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10" 
                    style={{ 
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      backgroundSize: '60px 60px'
                    }} 
                  />
                </div>
                
                {/* Large emoji watermark */}
                <div className="absolute -right-16 -bottom-16 text-white/10 text-[300px] pointer-events-none">
                  {item.emoji}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                  <div className='flex items-center gap-2 transition-opacity duration-300'>
                    <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                      {item.badge1}
                    </Badge>
                    <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                      {item.badge2}
                    </Badge>
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
                      className={`text-white/80 max-w-xs mb-6 transition-opacity duration-300 ${
                        selection === item.id ? "opacity-100" : "opacity-0 md:opacity-70"
                      }`}
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
                      >
                        <ArrowUpRight className="size-5" />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
                
                {selection === item.id && (
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex size-16 items-center justify-center bg-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus className="size-8 text-black" />
                  </motion.div>
                )}
              </Link>
              
              {/* Vertical separator line */}
              {index < data.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[1px] bg-white/10 z-10" />
              )}
            </motion.div>
            
            {/* Mobile separator for non-desktop */}
            {index < data.length - 1 && (
              <div className="lg:hidden h-[1px] w-full bg-white/10" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCollections; 