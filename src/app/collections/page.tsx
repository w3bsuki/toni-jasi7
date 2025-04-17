"use client";

import { useState, useEffect } from "react";
import { products } from "@/data/products";
import { collections } from "@/data/collections";
import ProductCard from "@/components/product/ProductCard";
import ProductFilter, { FilterOptions } from "@/components/shop/ProductFilter";
import { Product } from "@/types/product";
import { ArrowUpDown, Grid, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  
  // State for view mode
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  
  // State for sort order
  const [sortOrder, setSortOrder] = useState<"default" | "price-asc" | "price-desc">("default");

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

  // Apply filters and sorting whenever activeFilters or sortOrder changes
  useEffect(() => {
    let filtered = [...products];

    // Filter by collections
    if (activeFilters.collections.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.collection &&
          activeFilters.collections.includes(product.collection)
      );
    }

    // Filter by sizes
    if (activeFilters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes.some((size) => activeFilters.sizes.includes(size))
      );
    }

    // Filter by price range
    if (activeFilters.priceRanges.length > 0) {
      filtered = filtered.filter((product) => {
        const price = product.salePrice || product.price;
        return activeFilters.priceRanges.some((range) => {
          if (range === "Under $25") return price < 25;
          if (range === "$25-$35") return price >= 25 && price < 35;
          if (range === "$35-$50") return price >= 35 && price <= 50;
          if (range === "Over $50") return price > 50;
          return false;
        });
      });
    }

    // Filter by new arrivals
    if (activeFilters.newArrivals) {
      filtered = filtered.filter((product) => product.isNew);
    }

    // Filter by sale items
    if (activeFilters.onSale) {
      filtered = filtered.filter((product) => product.isSale);
    }
    
    // Apply sorting
    if (sortOrder === "price-asc") {
      filtered.sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;
        return priceA - priceB;
      });
    } else if (sortOrder === "price-desc") {
      filtered.sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;
        return priceB - priceA;
      });
    }

    setFilteredProducts(filtered);
  }, [activeFilters, sortOrder]);

  return (
    <div className="min-h-screen bg-white">
      {/* Filter section */}
      <ProductFilter
        availableFilters={{
          collections: availableCollections,
          sizes: availableSizes,
        }}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        resetFilters={resetFilters}
      />

      {/* Products count, view options and results info */}
      <div className="container mx-auto px-4 pt-6 pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Shop All Products</h1>
          
          <div className="flex items-center space-x-4">
            {/* View mode toggle */}
            <div className="flex items-center border rounded overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="h-8 rounded-none px-2"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewMode === "compact" ? "default" : "ghost"}
                size="sm"
                className="h-8 rounded-none px-2"
                onClick={() => setViewMode("compact")}
              >
                <Grid size={16} />
              </Button>
            </div>
            
            {/* Sort dropdown */}
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-sm text-gray-500">Sort by:</label>
              <select 
                id="sort-select"
                name="sort-select"
                aria-label="Sort products by"
                className="text-sm border-b border-gray-300 py-1 pr-6 pl-2 focus:outline-none focus:border-black"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>

        {/* Product grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-gray-200 bg-gray-50 rounded-md">
            <h2 className="text-xl text-gray-600 mb-2">No products match your filters</h2>
            <p className="text-gray-500 mb-4">Try adjusting your selection to find products.</p>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="px-6"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10" 
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          }>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                compact={viewMode === "compact"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 