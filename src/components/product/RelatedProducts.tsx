"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { products } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { motion } from "framer-motion";

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
  limit?: number;
}

export default function RelatedProducts({
  category,
  currentProductId,
  limit = 4,
}: RelatedProductsProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Find related products that match the category but exclude the current product
  const relatedProducts = products
    .filter(
      (product) => 
        product.category === category && 
        product.id !== currentProductId
    )
    .slice(0, limit);

  // Fallback to other products if no products in the same category
  const fallbackProducts = products
    .filter((product) => product.id !== currentProductId)
    .slice(0, limit);

  const displayProducts = relatedProducts.length > 0 ? relatedProducts : fallbackProducts;

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Static version for server rendering to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="w-full">
        {displayProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No related products found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {displayProducts.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No related products found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </motion.div>
  );
} 