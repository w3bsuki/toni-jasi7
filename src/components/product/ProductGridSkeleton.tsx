"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function ProductGridSkeleton() {
  // Create an array of 8 skeleton items
  const skeletonItems = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {skeletonItems.map((item) => (
        <div key={item} className="animate-pulse">
          <div className="aspect-square rounded-lg bg-gray-200 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
          <div className="h-3 bg-gray-200 rounded mb-2 w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
} 