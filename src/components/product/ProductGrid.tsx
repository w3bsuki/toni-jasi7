"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { Rating } from "@/components/ui/rating";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <motion.div 
          key={product.id} 
          className="group"
          variants={item}
        >
          <Link href={`/product/${product.slug}`} className="block">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              {product.salePrice && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Sale
                </div>
              )}
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
            <div className="flex items-center mb-1">
              <Rating value={product.rating} size={14} />
            </div>
            <div className="flex items-center">
              {product.salePrice ? (
                <>
                  <span className="text-gray-900 font-medium mr-2">
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-sm line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-gray-900 font-medium">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
} 