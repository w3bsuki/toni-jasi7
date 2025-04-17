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
      image: collections[0]?.image || "https://images.unsplash.com/photo-1552068751-34cb5cf055b3?q=80&w=1920&auto=format&fit=crop",
      badge1: "NEW ARRIVALS",
      badge2: "BESTSELLERS",
    },
    {
      id: "womens",
      title: "WOMENS",
      description: "Elegant and trendy hats for women",
      href: `/collections/${collections[1]?.slug || "womens"}`,
      image: collections[1]?.image || "https://images.unsplash.com/photo-1555619662-99c62a36e8ca?q=80&w=1920&auto=format&fit=crop",
      badge1: "TRENDING",
      badge2: "LIMITED EDITION",
    },
    {
      id: "accessories",
      title: "ACCESSORIES",
      description: "Complete your look with perfect accessories",
      href: `/collections/${collections[2]?.slug || "accessories"}`,
      image: collections[2]?.image || "https://images.unsplash.com/photo-1593476087123-36d1de271f08?q=80&w=1920&auto=format&fit=crop",
      badge1: "SPECIAL OFFER",
      badge2: "HANDCRAFTED",
    },
  ];

  return (
    <section className="py-16 w-full bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <div className="container mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          {title && (
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">{title || "Featured Collections"}</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-xl">Discover our curated hat collections designed for every style and occasion.</p>
            </div>
          )}
          <Link href="/collections" className="group inline-flex items-center gap-1 text-black dark:text-white text-sm font-medium hover:underline">
            View All Collections
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>

      <div className="flex flex-col gap-5 lg:aspect-[1336/460] lg:flex-row w-full">
        <AnimatePresence>
          {data.map((item) => (
            <motion.div
              key={item.id}
              data-state={selection === item.id ? "open" : "closed"}
              className='group relative max-lg:w-full max-lg:flex-1 max-md:h-[280px] md:max-lg:aspect-[1336/420] rounded-xl overflow-hidden'
              onMouseEnter={() => {
                setSelection(item.id);
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: 1,
                y: 0,
                width: selection === item.id ? "60%" : "20%"
              }}
              transition={{ 
                duration: 0.7, 
                ease: [0.22, 1, 0.36, 1],
                width: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.7 },
                y: { duration: 0.7 }
              }}
              whileHover={{ 
                boxShadow: "0 15px 40px rgba(0,0,0,0.2)" 
              }}
            >
              <Link
                href={item.href}
                className="relative block h-full w-full overflow-hidden bg-black text-white"
              >
                <motion.div 
                  className='absolute inset-0 h-full w-full'
                  initial={{ scale: 1.05 }}
                  animate={{ 
                    scale: selection === item.id ? 1 : 1.05,
                    filter: selection === item.id ? "blur(0px)" : "blur(2px)"
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 mix-blend-multiply group-hover:bg-black/30 transition-all duration-500" />
                  <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/50 to-transparent" />
                </motion.div>
                
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                  <div className='flex items-center gap-2 transition-opacity delay-200 duration-500'>
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
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: selection === item.id ? 1 : 0.7
                      }}
                      transition={{ duration: 0.5, delay: 0.1 }}
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
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: selection === item.id ? 1 : 0.7 
                      }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="text-base font-medium lg:text-lg text-white">
                        Shop Collection
                      </div>
                      <motion.div 
                        className="flex size-10 items-center justify-center bg-white text-black rounded-full group-hover:scale-110 transition-transform"
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex size-16 items-center justify-center bg-white rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Plus className="size-8 text-black" />
                  </motion.div>
                )}
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default FeaturedCollections; 