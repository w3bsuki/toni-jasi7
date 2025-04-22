"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronDown, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  collections: string[];
  priceRanges: string[];
  sizes: string[];
  inStock: boolean;
  onSale: boolean;
  newArrivals: boolean;
}

interface ProductFilterProps {
  availableFilters: {
    collections: string[];
    sizes: string[];
    priceRanges: string[];
  };
  activeFilters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  isMobile?: boolean;
}

export default function ProductFilter({
  availableFilters,
  activeFilters,
  onFilterChange,
  isMobile = false,
}: ProductFilterProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(activeFilters);
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [sizeOpen, setSizeOpen] = useState(true);
  
  // Update local filters when activeFilters prop changes
  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const updateFilter = (
    filterType: keyof FilterOptions,
    value: string | boolean
  ) => {
    let updatedFilters: FilterOptions;
    
    if (
      filterType === "collections" ||
      filterType === "priceRanges" ||
      filterType === "sizes"
    ) {
      const valueStr = value as string;
      const currentValues = [...localFilters[filterType]];
      
      // If value exists in array, remove it, otherwise add it
      if (currentValues.includes(valueStr)) {
        updatedFilters = {
          ...localFilters,
          [filterType]: currentValues.filter((item) => item !== valueStr),
        };
      } else {
        updatedFilters = {
          ...localFilters,
          [filterType]: [...currentValues, valueStr],
        };
      }
    } else {
      // Handle boolean filters (inStock, onSale, newArrivals)
      updatedFilters = {
        ...localFilters,
        [filterType]: value,
      };
    }
    
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const resetFilters = () => {
    const emptyFilters: FilterOptions = {
      collections: [],
      priceRanges: [],
      sizes: [],
      inStock: false,
      onSale: false,
      newArrivals: false,
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const priceRanges = ["Under $25", "$25-$35", "$35-$50", "Over $50"];

  // Count active filters
  const activeFilterCount = 
    localFilters.collections.length +
    localFilters.priceRanges.length +
    localFilters.sizes.length +
    (localFilters.inStock ? 1 : 0) +
    (localFilters.onSale ? 1 : 0) +
    (localFilters.newArrivals ? 1 : 0);
    
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
                onClick={() => setCollectionsOpen(!collectionsOpen)}
              >
                Collections
                <ChevronDown size={14} className={cn(
                  "transition-transform",
                  collectionsOpen && "rotate-180"
                )} />
              </Button>
              
              {collectionsOpen && (
                <div className="absolute left-0 top-full mt-1 w-60 bg-white shadow-lg rounded-md py-2 z-20 border border-gray-100">
                  <div className="px-3 py-1 max-h-60 overflow-y-auto">
                    {availableFilters.collections.map((collection) => (
                      <label
                        key={collection}
                        className="flex items-center space-x-2 cursor-pointer py-1.5 hover:bg-gray-50 px-2 rounded"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            localFilters.collections.includes(collection)
                              ? "bg-black border-black"
                              : "border-gray-300"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            updateFilter("collections", collection);
                          }}
                        >
                          {localFilters.collections.includes(collection) && (
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
                onClick={() => setPriceOpen(!priceOpen)}
              >
                Price
                <ChevronDown size={14} className={cn(
                  "transition-transform",
                  priceOpen && "rotate-180"
                )} />
              </Button>
              
              {priceOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md py-2 z-20 border border-gray-100">
                  <div className="px-3 py-1">
                    {priceRanges.map((range) => (
                      <label
                        key={range}
                        className="flex items-center space-x-2 cursor-pointer py-1.5 hover:bg-gray-50 px-2 rounded"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            localFilters.priceRanges.includes(range)
                              ? "bg-black border-black"
                              : "border-gray-300"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            updateFilter("priceRanges", range);
                          }}
                        >
                          {localFilters.priceRanges.includes(range) && (
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
                onClick={() => setSizeOpen(!sizeOpen)}
              >
                Sizes
                <ChevronDown size={14} className={cn(
                  "transition-transform",
                  sizeOpen && "rotate-180"
                )} />
              </Button>
              
              {sizeOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md py-2 z-20 border border-gray-100">
                  <div className="px-3 py-1 max-h-60 overflow-y-auto">
                    {availableFilters.sizes.map((size) => (
                      <label
                        key={size}
                        className="flex items-center space-x-2 cursor-pointer py-1.5 hover:bg-gray-50 px-2 rounded"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            localFilters.sizes.includes(size)
                              ? "bg-black border-black"
                              : "border-gray-300"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            updateFilter("sizes", size);
                          }}
                        >
                          {localFilters.sizes.includes(size) && (
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
                onClick={() => setSizeOpen(!sizeOpen)}
              >
                Status
                <ChevronDown size={14} className={cn(
                  "transition-transform",
                  sizeOpen && "rotate-180"
                )} />
              </Button>
              
              {sizeOpen && (
                <div className="absolute left-0 top-full mt-1 w-44 bg-white shadow-lg rounded-md py-2 z-20 border border-gray-100">
                  <div className="px-3 py-1">
                    <label className="flex items-center space-x-2 cursor-pointer py-1.5 hover:bg-gray-50 px-2 rounded">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          localFilters.newArrivals
                            ? "bg-black border-black"
                            : "border-gray-300"
                        }`}
                        onClick={() =>
                          updateFilter("newArrivals", !localFilters.newArrivals)
                        }
                      >
                        {localFilters.newArrivals && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span className="text-sm">New Arrivals</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer py-1.5 hover:bg-gray-50 px-2 rounded">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          localFilters.onSale
                            ? "bg-black border-black"
                            : "border-gray-300"
                        }`}
                        onClick={() =>
                          updateFilter("onSale", !localFilters.onSale)
                        }
                      >
                        {localFilters.onSale && (
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
            {localFilters.collections.map(collection => (
              <div key={`tag-${collection}`} className="bg-gray-100 text-xs rounded-full px-2.5 py-1 flex items-center">
                {collection}
                <X 
                  size={12} 
                  className="ml-1.5 cursor-pointer" 
                  onClick={() => updateFilter("collections", collection)}
                />
              </div>
            ))}
            {localFilters.priceRanges.map(range => (
              <div key={`tag-${range}`} className="bg-gray-100 text-xs rounded-full px-2.5 py-1 flex items-center">
                {range}
                <X 
                  size={12} 
                  className="ml-1.5 cursor-pointer" 
                  onClick={() => updateFilter("priceRanges", range)}
                />
              </div>
            ))}
            {localFilters.sizes.map(size => (
              <div key={`tag-${size}`} className="bg-gray-100 text-xs rounded-full px-2.5 py-1 flex items-center">
                Size: {size}
                <X 
                  size={12} 
                  className="ml-1.5 cursor-pointer" 
                  onClick={() => updateFilter("sizes", size)}
                />
              </div>
            ))}
            {localFilters.newArrivals && (
              <div className="bg-gray-100 text-xs rounded-full px-2.5 py-1 flex items-center">
                New Arrivals
                <X 
                  size={12} 
                  className="ml-1.5 cursor-pointer" 
                  onClick={() => updateFilter("newArrivals", false)}
                />
              </div>
            )}
            {localFilters.onSale && (
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