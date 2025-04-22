"use client";

import React, { useState } from 'react';
import ShopProductCard from './ShopProductCard';
import QuickView from './QuickView';
import { Product } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

interface ShopProductGridProps {
  products: Product[];
  title?: string;
  gridClassName?: string;
}

export function ShopProductGrid({ 
  products, 
  title,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
}: ShopProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleQuickView = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
    }
  };

  return (
    <div className="w-full">
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <div className="h-1 w-20 bg-zinc-800 mt-2"></div>
        </div>
      )}
      
      <div className={gridClassName}>
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShopProductCard
              product={product}
              onQuickView={handleQuickView}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {quickViewProduct && (
          <QuickView 
            product={quickViewProduct} 
            isOpen={!!quickViewProduct} 
            onClose={() => setQuickViewProduct(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ShopProductGrid; 