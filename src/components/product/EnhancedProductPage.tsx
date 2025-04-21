"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Home, Heart, ShoppingBag, Share2, AlertTriangle } from "lucide-react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductSpecs } from "./ProductSpecs";
import { ProductReviews } from "./ProductReviews";
import { RelatedProducts } from "./RelatedProducts";
import { products } from "@/data/products";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

// Fix window reference for SSR
const useCartFallback = () => {
  return {
    addItem: (item: any) => {
      console.log("Added to cart:", item);
    },
    items: []
  };
};

const useWishlistFallback = () => {
  return {
    addItem: (item: any) => {
      console.log("Added to wishlist:", item);
    },
    removeItem: (id: string) => {
      console.log("Removed from wishlist:", id);
    },
    items: []
  };
};

interface EnhancedProductPageProps {
  product: Product;
}

export function EnhancedProductPage({ product }: EnhancedProductPageProps) {
  const [isClient, setIsClient] = useState(false);
  const [showStockAlert, setShowStockAlert] = useState(false);
  
  // Initialize cart and wishlist with fallbacks for SSR
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const isInCart = cartItems.some?.((item) => item.id === product.id) || false;
  const isInWishlist = wishlistItems.some?.((item) => item.id === product.id) || false;
  
  // Get recently viewed products from localStorage
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  
  useEffect(() => {
    setIsClient(true);
    
    // Initialize cart and wishlist on client
    const cart = typeof window !== 'undefined' ? (window as any)?.useCart : useCartFallback;
    const wishlist = typeof window !== 'undefined' ? (window as any)?.useWishlist : useWishlistFallback;
    
    if (cart?.items) {
      setCartItems(cart.items);
    }
    
    if (wishlist?.items) {
      setWishlistItems(wishlist.items);
    }
    
    // Store current product in recently viewed
    if (typeof window !== 'undefined') {
      // Try to get existing recently viewed products
      try {
        const storedItems = localStorage.getItem('recentlyViewed');
        let recentItems: string[] = storedItems ? JSON.parse(storedItems) : [];
        
        // Remove current product if it exists
        recentItems = recentItems.filter(id => id !== product.id);
        
        // Add current product to the beginning
        recentItems.unshift(product.id);
        
        // Keep only the last 4 items
        recentItems = recentItems.slice(0, 4);
        
        // Save back to localStorage
        localStorage.setItem('recentlyViewed', JSON.stringify(recentItems));
        
        // Get the actual product data
        const recentProducts = recentItems
          .map(id => products.find(p => p.id === id))
          .filter(Boolean) as Product[];
        
        setRecentlyViewed(recentProducts);
      } catch (error) {
        console.error('Error storing recently viewed items:', error);
      }
    }
  }, [product.id]);
  
  // Handle add to cart
  const handleAddToCart = (quantity: number, size: string) => {
    if (!product.inStock) {
      setShowStockAlert(true);
      return;
    }
    
    const cart = typeof window !== 'undefined' ? (window as any)?.useCart : null;
    
    if (cart?.addItem) {
      cart.addItem({
        ...product,
        quantity,
        selectedSize: size,
      });
      
      // Update local state
      setCartItems(prev => [...prev, { id: product.id }]);
      
      // Show toast notification
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    }
  };
  
  // Handle add to wishlist
  const handleAddToWishlist = () => {
    const wishlist = typeof window !== 'undefined' ? (window as any)?.useWishlist : null;
    
    if (wishlist) {
      if (isInWishlist && wishlist.removeItem) {
        wishlist.removeItem(product.id);
        setWishlistItems(prev => prev.filter(item => item.id !== product.id));
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist`,
        });
      } else if (wishlist.addItem) {
        wishlist.addItem(product);
        setWishlistItems(prev => [...prev, { id: product.id }]);
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist`,
        });
      }
    }
  };
  
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4 } },
  };
  
  // Find the category/collection of the product
  const mainCategory = product.collections && product.collections.length > 0
    ? product.collections[0]
    : undefined;

  return (
    <div className="bg-white dark:bg-black">
      <div className="container max-w-screen-xl mx-auto">
        {/* Breadcrumbs */}
        <motion.nav 
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="flex items-center py-4 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide"
        >
          <Link href="/" className="flex items-center text-gray-500 hover:text-primary transition-colors">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <Link href="/collections" className="text-gray-500 hover:text-primary transition-colors">
            Collections
          </Link>
          
          {mainCategory && (
            <>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              <Link 
                href={`/collection/${mainCategory}`} 
                className="text-gray-500 hover:text-primary transition-colors"
              >
                {mainCategory}
              </Link>
            </>
          )}
          
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-medium truncate">
            {product.name}
          </span>
        </motion.nav>
        
        {/* Product Detail Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pb-8">
          {/* Product Gallery */}
          <div className="relative">
            <ProductGallery 
              images={product.images} 
              alt={product.name}
              badges={{ 
                isNew: product.isNew,
                isSale: product.isSale
              }}
            />
            
            {/* Social Sharing */}
            <div className="hidden md:flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Share:
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:text-blue-600"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href,
                    }).catch(console.error);
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Product Info */}
          <ProductInfo 
            product={product}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            isInWishlist={isInWishlist}
            isInCart={isInCart}
          />
        </div>
        
        {/* Product Details Tabs */}
        <motion.div 
          className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b mb-8 pb-0 bg-transparent h-auto">
              <TabsTrigger 
                value="description"
                className="pb-4 text-base font-medium rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-none border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger 
                value="shipping"
                className="pb-4 text-base font-medium rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-none border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
              >
                Shipping & Returns
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="pb-4 text-base font-medium rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-none border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
            
            <TabsContent 
              value="description" 
              className="mt-4 focus-visible:outline-none focus-visible:ring-0"
            >
              <ProductSpecs product={product} />
            </TabsContent>
            
            <TabsContent 
              value="shipping" 
              className="mt-4 focus-visible:outline-none focus-visible:ring-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/80 to-primary/20 rounded-full"></div>
                    <h3 className="text-xl font-semibold mb-5 flex items-center">
                      Delivery Options
                    </h3>
                    
                    {/* Shipping content would go here */}
                    <p className="text-gray-600 dark:text-gray-400">
                      We offer various shipping options to ensure your hat arrives safely and on time.
                    </p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent 
              value="reviews" 
              className="mt-4 focus-visible:outline-none focus-visible:ring-0"
            >
              <ProductReviews product={product} />
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Related Products */}
        <RelatedProducts 
          currentProductId={product.id}
          category={mainCategory}
          products={products}
          title="You Might Also Like"
        />
        
        {/* Recently Viewed */}
        {isClient && recentlyViewed.length > 1 && (
          <RelatedProducts 
            currentProductId={product.id}
            products={recentlyViewed}
            title="Recently Viewed"
          />
        )}
      </div>
      
      {/* Out of Stock Alert */}
      <AlertDialog open={showStockAlert} onOpenChange={setShowStockAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Out of Stock
            </AlertDialogTitle>
            <AlertDialogDescription>
              We're sorry, but {product.name} is currently out of stock. Would you like us to notify you when it's back in stock?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, thanks</AlertDialogCancel>
            <AlertDialogAction>Notify Me</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Mobile Sticky Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-950 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)] p-4 md:hidden border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {product.salePrice ? (
                <>
                  <span className="text-red-600 dark:text-red-500">${product.salePrice.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <>${product.price.toFixed(2)}</>
              )}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {product.inStock ? "In Stock" : "Out of Stock"}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAddToWishlist}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
            >
              <Heart className={cn("h-5 w-5", isInWishlist ? "fill-red-500 text-red-500" : "")} />
            </Button>
            <Button
              onClick={() => handleAddToCart(1, product.sizes[0] || "One Size")}
              disabled={!product.inStock || isInCart}
              size="lg"
              className="h-12 gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              {isInCart ? "Added" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 