"use client";

import React, { useState } from "react";
import { Check, ChevronDown, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FilterOptions = {
  collections: string[];
  priceRanges: string[];
  sizes: string[];
  inStock: boolean;
  onSale: boolean;
  newArrivals: boolean;
};

interface ProductFilterProps {
  availableFilters: {
    collections: string[];
    sizes: string[];
  };
  activeFilters: FilterOptions;
  setActiveFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
}

export function ProductFilter({
  availableFilters,
  activeFilters,
  setActiveFilters,
  resetFilters,
}: ProductFilterProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const updateFilter = (
    filterType: keyof FilterOptions,
    value: string | boolean
  ) => {
    setActiveFilters((prev) => {
      if (
        typeof value === "string" &&
        Array.isArray(prev[filterType as keyof typeof prev])
      ) {
        // Handle array-based filters (collections, sizes, priceRanges)
        const currentValues = prev[filterType as keyof typeof prev] as string[];
        
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [filterType]: currentValues.filter((v) => v !== value),
          };
        } else {
          return {
            ...prev,
            [filterType]: [...currentValues, value],
          };
        }
      } else {
        // Handle boolean filters (inStock, onSale, newArrivals)
        return {
          ...prev,
          [filterType]: value,
        };
      }
    });
  };

  const priceRanges = ["Under $25", "$25-$35", "$35-$50", "Over $50"];

  // Count active filters
  const activeFilterCount = 
    activeFilters.collections.length +
    activeFilters.priceRanges.length +
    activeFilters.sizes.length +
    (activeFilters.inStock ? 1 : 0) +
    (activeFilters.onSale ? 1 : 0) +
    (activeFilters.newArrivals ? 1 : 0);
    
  return (
    <div className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1.5 py-1 h-auto text-sm font-medium" 
                onClick={() => toggleDropdown('collections')}
              >
                Collections
                <ChevronDown size={14} className={cn(
                  "transition-transform",
                  openDropdown === 'collections' && "rotate-180"
                )} />
              </Button>
              
              {openDropdown === 'collections' && (
                <div className="absolute left-0 top-full mt-1 w-60 bg-white shadow-lg rounded-md py-2 z-20 border border-gray-100">
                  <div className="px-3 py-1 max-h-60 overflow-y-auto">
                    {availableFilters.collections.map((collection) => (
                      <label
                        key={collection}
                        className="flex items-center space-x-2 cursor-pointer py-1.5 hover:bg-gray-50 px-2 rounded"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            activeFilters.collections.includes(collection)
                              ? "bg-black border-black"
                              : "border-gray-300"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            updateFilter("collections", collection);
                          }}
                        >
                          {activeFilters.collections.includes(collection) && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                        <span className="text-sm capitalize">{collection}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1.5 py-1 h-auto text-sm font-medium" 
                onClick={() => toggleDropdown('price')}
              >
                Price
                <ChevronDown size={14} className={cn(
                  "transition-transform",
                  openDropdown === 'price' && "rotate-180"
                )} />
              </Button>
              
              {openDropdown === 'price' && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md py-2 z-20 border border-gray-100">
                  <div className="px-3 py-1">
                    {priceRanges.map((range) => (
                      <label
                        key={range}
                        className="flex items-center space-x-2 cursor-pointer py-1.5 hover:bg-gray-50 px-2 rounded"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            activeFilters.priceRanges.includes(range)
                              ? "bg-black border-black"
                              : "border-gray-300"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            updateFilter("priceRanges", range);
                          }}
                        >
                          {activeFilters.priceRanges.includes(range) && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                        <span className="text-sm">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1.5 py-1 h-auto text-sm font-medium" 
                onClick={() => toggleDropdown('sizes')}
              >
                Sizes
                <ChevronDown size={14} className={cn(
                  "transition-transform",
                  openDropdown === 'sizes' && "rotate-180"
                )} />
              </Button>
              
              {openDropdown === 'sizes' && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md py-2 z-20 border border-gray-100">
                  <div className="px-3 py-1 max-h-60 overflow-y-auto">
                    {availableFilters.sizes.map((size) => (
                      <label
                        key={size}
                        className="flex items-center space-x-2 cursor-pointer py-1.5 hover:bg-gray-50 px-2 rounded"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            activeFilters.sizes.includes(size)
                              ? "bg-black border-black"
                              : "border-gray-300"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            updateFilter("sizes", size);
                          }}
                        >
                          {activeFilters.sizes.includes(size) && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1.5 py-1 h-auto text-sm font-medium" 
                onClick={() => toggleDropdown('status')}
              >
                Status
                <ChevronDown size={14} className={cn(
                  "transition-transform",
                  openDropdown === 'status' && "rotate-180"
                )} />
              </Button>
              
              {openDropdown === 'status' && (
                <div className="absolute left-0 top-full mt-1 w-44 bg-white shadow-lg rounded-md py-2 z-20 border border-gray-100">
                  <div className="px-3 py-1">
                    <label className="flex items-center space-x-2 cursor-pointer py-1.5 hover:bg-gray-50 px-2 rounded">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          activeFilters.newArrivals
                            ? "bg-black border-black"
                            : "border-gray-300"
                        }`}
                        onClick={() =>
                          updateFilter("newArrivals", !activeFilters.newArrivals)
                        }
                      >
                        {activeFilters.newArrivals && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span className="text-sm">New Arrivals</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer py-1.5 hover:bg-gray-50 px-2 rounded">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          activeFilters.onSale
                            ? "bg-black border-black"
                            : "border-gray-300"
                        }`}
                        onClick={() =>
                          updateFilter("onSale", !activeFilters.onSale)
                        }
                      >
                        {activeFilters.onSale && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span className="text-sm">On Sale</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-gray-600 hover:text-black text-sm py-1 h-auto"
            >
              <X size={14} className="mr-1" /> Clear filters ({activeFilterCount})
            </Button>
          )}
        </div>
        
        {/* Active filter tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activeFilters.collections.map(collection => (
              <div key={`tag-${collection}`} className="bg-gray-100 text-xs rounded-full px-2.5 py-1 flex items-center">
                {collection}
                <X 
                  size={12} 
                  className="ml-1.5 cursor-pointer" 
                  onClick={() => updateFilter("collections", collection)}
                />
              </div>
            ))}
            {activeFilters.priceRanges.map(range => (
              <div key={`tag-${range}`} className="bg-gray-100 text-xs rounded-full px-2.5 py-1 flex items-center">
                {range}
                <X 
                  size={12} 
                  className="ml-1.5 cursor-pointer" 
                  onClick={() => updateFilter("priceRanges", range)}
                />
              </div>
            ))}
            {activeFilters.sizes.map(size => (
              <div key={`tag-${size}`} className="bg-gray-100 text-xs rounded-full px-2.5 py-1 flex items-center">
                Size: {size}
                <X 
                  size={12} 
                  className="ml-1.5 cursor-pointer" 
                  onClick={() => updateFilter("sizes", size)}
                />
              </div>
            ))}
            {activeFilters.newArrivals && (
              <div className="bg-gray-100 text-xs rounded-full px-2.5 py-1 flex items-center">
                New Arrivals
                <X 
                  size={12} 
                  className="ml-1.5 cursor-pointer" 
                  onClick={() => updateFilter("newArrivals", false)}
                />
              </div>
            )}
            {activeFilters.onSale && (
              <div className="bg-gray-100 text-xs rounded-full px-2.5 py-1 flex items-center">
                On Sale
                <X 
                  size={12} 
                  className="ml-1.5 cursor-pointer" 
                  onClick={() => updateFilter("onSale", false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductFilter; 