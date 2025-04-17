"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
  // Create our data with specified categories
  const data = [
    {
      id: "mens",
      title: "MENS",
      href: `/collections/${collections[0]?.slug || "mens"}`,
      image: collections[0]?.image || "https://images.unsplash.com/photo-1552068751-34cb5cf055b3?q=80&w=1920&auto=format&fit=crop",
      logo: "/logo.svg",
      company: "NoCap Club",
    },
    {
      id: "womens",
      title: "WOMENS",
      href: `/collections/${collections[1]?.slug || "womens"}`,
      image: collections[1]?.image || "https://images.unsplash.com/photo-1555619662-99c62a36e8ca?q=80&w=1920&auto=format&fit=crop",
      logo: "/logo.svg",
      company: "NoCap Club",
    },
    {
      id: "small",
      title: "SMALL",
      href: `/collections/${collections[2]?.slug || "small"}`,
      image: collections[2]?.image || "https://images.unsplash.com/photo-1593476087123-36d1de271f08?q=80&w=1920&auto=format&fit=crop",
      logo: "/logo.svg",
      company: "NoCap Club",
    },
  ];

  const [selection, setSelection] = useState(data[0].id);
  
  return (
    <section className="py-16 w-full bg-white overflow-hidden">
      {title && (
        <div className="container mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        </div>
      )}
      <div className="flex flex-col gap-5 lg:aspect-[1336/460] lg:flex-row w-full">
        {data.map((item) => (
          <motion.div
            key={item.id}
            data-state={selection === item.id ? "open" : "closed"}
            className='group relative max-lg:w-full max-lg:flex-1 max-md:h-[280px] md:max-lg:aspect-[1336/420] rounded-md overflow-hidden'
            onMouseEnter={() => {
              setSelection(item.id);
            }}
            initial={{ opacity: 0.9 }}
            animate={{ 
              opacity: 1,
              width: selection === item.id ? "60%" : "20%"
            }}
            transition={{ 
              duration: 0.5, 
              ease: [0.16, 1, 0.3, 1],
              width: { duration: 0.5 }
            }}
            whileHover={{ 
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)" 
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
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
                <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/50 to-transparent" />
              </motion.div>
              
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className='flex items-center gap-2 transition-opacity delay-200 duration-500'>
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">Premium</Badge>
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">Limited</Badge>
                </div>
                
                <div className="z-10">
                  <motion.span 
                    className="block text-white text-4xl font-bold tracking-widest mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ 
                      y: 0, 
                      opacity: selection === item.id ? 1 : 0.7
                    }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {item.title}
                  </motion.span>
                  
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
                      className="flex size-10 items-center justify-center bg-white text-black"
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
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Plus className="size-8 text-black" />
                </motion.div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCollections; 