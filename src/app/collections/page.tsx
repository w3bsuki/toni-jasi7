"use client";

import { useState, useEffect } from "react";
import { products } from "@/data/products";
import { collections } from "@/data/collections";
import ProductCard from "@/components/product/ProductCard";
import { FilterOptions } from "@/components/shop/ProductFilter";
import { Product } from "@/types/product";
import { ArrowUpDown, Grid, Grid3X3, List, ArrowRight, Sparkles, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CollectionsPage() {
  // Get unique collections for filter options
  const availableCollections = Array.from(
    new Set(products.map((product) => product.collection).filter(Boolean))
  ) as string[];

  // Get unique sizes for filter options
  const availableSizes = Array.from(
    new Set(products.flatMap((product) => product.sizes))
  );

  // State for active filters
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    collections: [],
    priceRanges: [],
    sizes: [],
    inStock: false,
    onSale: false,
    newArrivals: false,
  });

  // State for filtered products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  
  // State for sorted products
  const [sortedProducts, setSortedProducts] = useState<Product[]>(products);
  
  // State for view mode
  const [viewMode, setViewMode] = useState<"grid" | "compact" | "list">("grid");
  
  // State for sort order
  const [sortOrder, setSortOrder] = useState<"default" | "price-asc" | "price-desc">("default");

  // State for mobile filter visibility
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);

  // State for mobile filter drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Reset filters function
  const resetFilters = () => {
    setActiveFilters({
      collections: [],
      priceRanges: [],
      sizes: [],
      inStock: false,
      onSale: false,
      newArrivals: false,
    });
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "default" | "price-asc" | "price-desc");
  };

  // Handle filter changes from ProductFilter component
  const handleFilterChange = (newFilters: FilterOptions) => {
    setActiveFilters(newFilters);
  };

  // Update filtered products whenever activeFilters change
  useEffect(() => {
    const newFilteredProducts = products.filter((product) => {
      // Collection filter
      if (
        activeFilters.collections.length > 0 &&
        !activeFilters.collections.some((c) => {
          // Convert collection names to lowercase and handle both slug and display name format
          const collectionName = c.toLowerCase().replace(' ', '-');
          const productCollection = product.collection ? 
            product.collection.toLowerCase().replace(' ', '-') : '';
          
          // Check product collections array if it exists
          if (Array.isArray(product.collections)) {
            return product.collections.some(pc => 
              pc.toLowerCase().replace(' ', '-').includes(collectionName));
          }
          
          // Check single collection if that's what the product has
          return productCollection.includes(collectionName);
        })
      ) {
        return false;
      }
  
      // Size filter
      if (
        activeFilters.sizes.length > 0 &&
        !activeFilters.sizes.some((size) => product.sizes.includes(size))
      ) {
        return false;
      }
  
      // Price range filter
      if (activeFilters.priceRanges.length > 0) {
        let matchesPrice = false;
        for (const range of activeFilters.priceRanges) {
          if (
            (range === "Under $25" && product.price < 25) ||
            (range === "$25-$35" && product.price >= 25 && product.price <= 35) ||
            (range === "$35-$50" && product.price > 35 && product.price <= 50) ||
            (range === "Over $50" && product.price > 50)
          ) {
            matchesPrice = true;
            break;
          }
        }
        if (!matchesPrice) return false;
      }
  
      // In stock filter
      if (activeFilters.inStock && !product.inStock) {
        return false;
      }
  
      // On sale filter
      if (activeFilters.onSale && !product.isSale) {
        return false;
      }
  
      // New arrivals filter
      if (activeFilters.newArrivals && !product.isNew) {
        return false;
      }
  
      return true;
    });
    
    setFilteredProducts(newFilteredProducts);
  }, [activeFilters, products]);

  // Sort products whenever filteredProducts or sortOrder changes
  useEffect(() => {
    const newSortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortOrder === "price-asc") {
        return a.price - b.price;
      } else if (sortOrder === "price-desc") {
        return b.price - a.price;
      }
      // Default sort (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setSortedProducts(newSortedProducts);
  }, [filteredProducts, sortOrder]);

  // Count active filters
  const activeFilterCount = 
    activeFilters.collections.length +
    activeFilters.priceRanges.length +
    activeFilters.sizes.length +
    (activeFilters.inStock ? 1 : 0) +
    (activeFilters.onSale ? 1 : 0) +
    (activeFilters.newArrivals ? 1 : 0);

  const updateFilter = (
    filterType: keyof FilterOptions,
    value: string | boolean
  ) => {
    setActiveFilters((prev) => {
      // Handle array filters (collections, priceRanges, sizes)
      if (
        filterType === "collections" ||
        filterType === "priceRanges" ||
        filterType === "sizes"
      ) {
        const valueStr = value as string;
        const currentValues = [...prev[filterType]];
        
        // Toggle value in array
        if (currentValues.includes(valueStr)) {
          return {
            ...prev,
            [filterType]: currentValues.filter((item) => item !== valueStr),
          };
        } else {
          return {
            ...prev,
            [filterType]: [...currentValues, valueStr],
          };
        }
      }
      
      // Handle boolean filters (inStock, onSale, newArrivals)
      return {
        ...prev,
        [filterType]: value,
      };
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black dark:text-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[280px] md:h-[350px] overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-center max-w-3xl"
          >
            Shop Our Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-md text-center text-base md:text-lg opacity-90"
          >
            Find the perfect hat for any style or occasion
          </motion.p>
        </div>
      </div>

      {/* Mobile filter button (visible only on mobile) */}
      <div className="lg:hidden sticky top-16 z-20 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 py-3">
        <div className="w-full px-6 md:px-8">
          <button
            className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-black text-sm font-medium"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <span className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1.5 bg-black dark:bg-white text-white dark:text-black text-xs py-0.5 px-1.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full px-6 md:px-8 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Desktop Sidebar Filter (visible from lg breakpoint) */}
          <div className="hidden lg:block sticky top-20 h-fit col-span-1">
            <div className="pr-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                {activeFilterCount > 0 && (
                  <button 
                    onClick={resetFilters}
                    className="text-xs underline text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              {/* Collections Filter */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3 uppercase tracking-wide text-sm">Collections</h3>
                <div className="space-y-2.5">
                  {availableCollections.map((collection) => (
                    <label key={collection} className="flex items-center space-x-2 cursor-pointer group">
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          activeFilters.collections.includes(collection)
                            ? "bg-black border-black dark:bg-white dark:border-white"
                            : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                        }`}
                        onClick={() => updateFilter("collections", collection)}
                      >
                        {activeFilters.collections.includes(collection) && (
                          <Check size={12} className="text-white dark:text-black" />
                        )}
                      </div>
                      <span className="text-sm capitalize group-hover:text-black dark:group-hover:text-white">
                        {collection.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3 uppercase tracking-wide text-sm">Price</h3>
                <div className="space-y-2.5">
                  {["Under $25", "$25-$35", "$35-$50", "Over $50"].map((range) => (
                    <label key={range} className="flex items-center space-x-2 cursor-pointer group">
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          activeFilters.priceRanges.includes(range)
                            ? "bg-black border-black dark:bg-white dark:border-white"
                            : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                        }`}
                        onClick={() => updateFilter("priceRanges", range)}
                      >
                        {activeFilters.priceRanges.includes(range) && (
                          <Check size={12} className="text-white dark:text-black" />
                        )}
                      </div>
                      <span className="text-sm group-hover:text-black dark:group-hover:text-white">{range}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Size Filter */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3 uppercase tracking-wide text-sm">Size</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableSizes.map((size) => (
                    <div
                      key={size}
                      className={`text-center py-2 px-1 border rounded cursor-pointer text-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500 ${
                        activeFilters.sizes.includes(size)
                          ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                          : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                      }`}
                      onClick={() => updateFilter("sizes", size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Additional Filters */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3 uppercase tracking-wide text-sm">Product Status</h3>
                <div className="space-y-2.5">
                  {/* New Arrivals */}
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        activeFilters.newArrivals
                          ? "bg-black border-black dark:bg-white dark:border-white"
                          : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                      }`}
                      onClick={() => updateFilter("newArrivals", !activeFilters.newArrivals)}
                    >
                      {activeFilters.newArrivals && (
                        <Check size={12} className="text-white dark:text-black" />
                      )}
                    </div>
                    <span className="text-sm group-hover:text-black dark:group-hover:text-white">New Arrivals</span>
                  </label>
                  
                  {/* On Sale */}
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        activeFilters.onSale
                          ? "bg-black border-black dark:bg-white dark:border-white"
                          : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                      }`}
                      onClick={() => updateFilter("onSale", !activeFilters.onSale)}
                    >
                      {activeFilters.onSale && (
                        <Check size={12} className="text-white dark:text-black" />
                      )}
                    </div>
                    <span className="text-sm group-hover:text-black dark:group-hover:text-white">On Sale</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid Section */}
          <div className="lg:col-span-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <span className="mr-1 font-medium">
                  {filteredProducts.length} 
                </span>
                <span>
                  {filteredProducts.length === 1 ? 'product' : 'products'} found
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative flex-grow sm:flex-grow-0 min-w-[180px]">
                  <select 
                    className="w-full appearance-none bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                    value={sortOrder}
                    onChange={handleSortChange}
                    aria-label="Sort products by"
                  >
                    <option value="default">Sort by: Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <ArrowUpDown size={16} />
                  </div>
                </div>
                
                {/* Grid View Toggles */}
                <div className="hidden sm:flex items-center border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                  <button
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-white text-gray-700 dark:bg-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                    }`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    className={`p-2 ${
                      viewMode === "compact"
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-white text-gray-700 dark:bg-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                    }`}
                    onClick={() => setViewMode("compact")}
                    aria-label="Compact view"
                  >
                    <Grid size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={cn(
              "grid gap-x-4 gap-y-8 mb-12",
              viewMode === "grid"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5"
            )}>
              <AnimatePresence>
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05 > 0.6 ? 0.6 : index * 0.05 
                    }}
                    layout
                    className="transform-gpu"
                  >
                    <ProductCard product={product} compact={viewMode === "compact"} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="mb-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-full">
                  <Sparkles size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                  Try adjusting your filters or search criteria to find what you're looking for.
                </p>
                <button 
                  onClick={resetFilters}
                  className="bg-black text-white dark:bg-white dark:text-black py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileFilterOpen(false)}></div>
          <div className="relative max-w-xs w-full h-full bg-white dark:bg-black shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-800">
              <h2 className="text-lg font-medium">Filters</h2>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-8">
                {/* Collections Filter */}
                <div>
                  <h3 className="font-semibold mb-3 uppercase tracking-wide text-sm">Collections</h3>
                  <div className="space-y-2.5">
                    {availableCollections.map((collection) => (
                      <label key={collection} className="flex items-center space-x-2 cursor-pointer group">
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            activeFilters.collections.includes(collection)
                              ? "bg-black border-black dark:bg-white dark:border-white"
                              : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                          }`}
                          onClick={() => updateFilter("collections", collection)}
                        >
                          {activeFilters.collections.includes(collection) && (
                            <Check size={12} className="text-white dark:text-black" />
                          )}
                        </div>
                        <span className="text-sm capitalize group-hover:text-black dark:group-hover:text-white">
                          {collection.replace('-', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Price Filter */}
                <div>
                  <h3 className="font-semibold mb-3 uppercase tracking-wide text-sm">Price</h3>
                  <div className="space-y-2.5">
                    {["Under $25", "$25-$35", "$35-$50", "Over $50"].map((range) => (
                      <label key={range} className="flex items-center space-x-2 cursor-pointer group">
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            activeFilters.priceRanges.includes(range)
                              ? "bg-black border-black dark:bg-white dark:border-white"
                              : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                          }`}
                          onClick={() => updateFilter("priceRanges", range)}
                        >
                          {activeFilters.priceRanges.includes(range) && (
                            <Check size={12} className="text-white dark:text-black" />
                          )}
                        </div>
                        <span className="text-sm group-hover:text-black dark:group-hover:text-white">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Size Filter */}
                <div>
                  <h3 className="font-semibold mb-3 uppercase tracking-wide text-sm">Size</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSizes.map((size) => (
                      <div
                        key={size}
                        className={`text-center py-2 px-1 border rounded cursor-pointer text-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500 ${
                          activeFilters.sizes.includes(size)
                            ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                        }`}
                        onClick={() => updateFilter("sizes", size)}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Additional Filters */}
                <div>
                  <h3 className="font-semibold mb-3 uppercase tracking-wide text-sm">Product Status</h3>
                  <div className="space-y-2.5">
                    {/* New Arrivals */}
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          activeFilters.newArrivals
                            ? "bg-black border-black dark:bg-white dark:border-white"
                            : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                        }`}
                        onClick={() => updateFilter("newArrivals", !activeFilters.newArrivals)}
                      >
                        {activeFilters.newArrivals && (
                          <Check size={12} className="text-white dark:text-black" />
                        )}
                      </div>
                      <span className="text-sm group-hover:text-black dark:group-hover:text-white">New Arrivals</span>
                    </label>
                    
                    {/* On Sale */}
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          activeFilters.onSale
                            ? "bg-black border-black dark:bg-white dark:border-white"
                            : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                        }`}
                        onClick={() => updateFilter("onSale", !activeFilters.onSale)}
                      >
                        {activeFilters.onSale && (
                          <Check size={12} className="text-white dark:text-black" />
                        )}
                      </div>
                      <span className="text-sm group-hover:text-black dark:group-hover:text-white">On Sale</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronDown(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
} 