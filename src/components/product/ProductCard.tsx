"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { name, price, images, slug, isNew, isSale, salePrice } = product;

  // Switch to the next image on hover
  const handleMouseEnter = () => {
    if (images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  // Switch back to the first image when not hovering
  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  const formattedSalePrice = salePrice
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(salePrice)
    : null;

  return (
    <div className={cn("group", compact ? "pb-2" : "")}>
      <Link href={`/product/${slug}`}>
        <div
          className={cn(
            "relative overflow-hidden bg-gray-100 mb-3",
            compact ? "aspect-[3/4]" : "aspect-square"
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={images[currentImageIndex]}
            alt={name}
            fill
            sizes={compact 
              ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" 
              : "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            }
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          {isNew && (
            <div className={cn(
              "absolute top-2 left-2 bg-black text-white text-xs font-semibold px-2 py-1",
              compact && "px-1.5 py-0.5 text-[10px]"
            )}>
              NEW
            </div>
          )}
          {isSale && (
            <div className={cn(
              "absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1",
              compact && "px-1.5 py-0.5 text-[10px]"
            )}>
              SALE
            </div>
          )}
        </div>
        <h3 className={cn(
          "font-medium line-clamp-1",
          compact ? "text-sm" : "text-lg"
        )}>
          {name}
        </h3>
        <div className={cn("mt-1", compact && "text-sm")}>
          {isSale && salePrice ? (
            <div className="flex items-center">
              <span className="text-red-600 font-semibold mr-2">
                {formattedSalePrice}
              </span>
              <span className="text-gray-500 line-through text-sm">
                {formattedPrice}
              </span>
            </div>
          ) : (
            <span className="font-semibold">{formattedPrice}</span>
          )}
        </div>
      </Link>
    </div>
  );
}

export default ProductCard; 