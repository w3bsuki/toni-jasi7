"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, Truck, Shield, Star, ChevronRight, Heart, Share, Minus, Plus, Check, Ruler, Home, RotateCcw, Info, RefreshCw, Share2, TruckIcon, Package, ThumbsUp, MessageSquare, MoreHorizontal, X } from "lucide-react";
import { Product } from "@/types/product";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rating } from "@/components/ui/rating";
import RelatedProducts from "./RelatedProducts";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductRecommendations } from "@/components/product/ProductRecommendations";

// Fix window reference for SSR
const useCartFallback = () => {
  return {
    addItem: (item: any) => {
      console.log("Added to cart:", item);
    }
  };
};

const useWishlistFallback = () => {
  return {
    addItem: (item: any) => {
      console.log("Added to wishlist:", item);
    },
    items: []
  };
};

const useToastFallback = () => {
  return {
    toast: ({ title, description }: { title: string; description: string }) => {
      console.log(`Toast: ${title} - ${description}`);
    }
  };
};

// Use fallbacks safely without window references for SSR
const useCart = typeof window !== 'undefined' ? (window as any)?.useCart || useCartFallback : useCartFallback;
const useWishlist = typeof window !== 'undefined' ? (window as any)?.useWishlist || useWishlistFallback : useWishlistFallback;
const useToast = typeof window !== 'undefined' ? (window as any)?.useToast || useToastFallback : useToastFallback;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes?.[0] || "One Size"
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'reviews'>('description');
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { addItem, items = [] } = useCart();
  const { addItem: addToWishlist, items: wishlistItems = [] } = useWishlist();
  const { toast } = useToast();
  const isInCart = items?.some?.((item) => item.id === product.id) || false;
  const isInWishlist = wishlistItems?.some?.((item) => item.id === product.id) || false;
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Find related products (same collection + not this product)
  const relatedProducts = products
    .filter(p => p.collection === product.collection && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;
    
    addItem(product, selectedSize, quantity);

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
    setIsWishlistActive(!isWishlistActive);
    
    if (!isInWishlist) {
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (value > 10) return;
    setQuantity(value);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formattedPrice = formatPrice(product.price);
  const formattedSalePrice = product.salePrice ? formatPrice(product.salePrice) : null;
  
  // Calculate savings percentage
  const savingsPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

  return (
    <motion.div 
      className="container max-w-7xl px-4 py-8 mx-auto"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Breadcrumbs */}
      <motion.nav variants={fadeIn} className="flex items-center mb-6 text-sm">
        <Link href="/" className="flex items-center text-gray-500 hover:text-primary transition-colors">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <Link href="/collections" className="text-gray-500 hover:text-primary transition-colors">
          Collections
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <Link 
          href={`/collections?category=${product.category}`} 
          className="text-gray-500 hover:text-primary transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <span className="text-gray-700 font-medium truncate">{product.name}</span>
      </motion.nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="relative"
        >
          <div className="sticky top-24 space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className={cn(
                  "object-cover object-center transition-opacity duration-300",
                  isImageLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setIsImageLoading(false)}
              />
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              )}
              
              {product.isSale && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                  Sale
                </div>
              )}
              
              {product.isNew && (
                <div className="absolute top-4 right-4 z-10 bg-blue-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                  New
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-md bg-gray-100 transition-all hover:ring-2 hover:ring-blue-600",
                      selectedImage === index ? "ring-2 ring-blue-600" : ""
                    )}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1} of product`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      sizes="(min-width: 768px) 10vw, 25vw"
                      className="object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          variants={staggerContainer}
          className="flex flex-col space-y-6"
        >
          <div className="space-y-2">
            <motion.div variants={fadeIn} className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <button 
                onClick={() => handleAddToWishlist()}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isInWishlist ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-500"
                )}
                aria-label="Add to wishlist"
              >
                <Heart className={cn("h-6 w-6", isInWishlist ? "fill-current" : "")} />
              </button>
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex items-center gap-2">
              <Rating value={product.rating || 4.5} size={16} reviewCount={product.reviews || 24} />
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex items-baseline gap-2">
              {product.isSale && product.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm font-medium text-green-600 ml-2">
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">
                  {formatPrice(product.price)}
                </span>
              )}
            </motion.div>
          </div>
          
          <motion.div variants={fadeIn}>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="pt-2">
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Color:</span>
              <span className="text-gray-700">{product.color || "Black"}</span>
            </div>
            
            {product.inStock ? (
              <div className="flex items-center text-green-600">
                <span className="font-medium">In Stock</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2">
                  Ships in 1-2 days
                </span>
              </div>
            ) : (
              <div className="text-red-600 font-medium">Out of Stock</div>
            )}
          </motion.div>
          
          {product.sizes && product.sizes.length > 0 && (
            <motion.div variants={fadeIn}>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "flex h-10 min-w-10 items-center justify-center rounded-md border bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100",
                      selectedSize === size
                        ? "border-black bg-black text-white hover:bg-black/90"
                        : "border-gray-200"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          
          <motion.div variants={fadeIn}>
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handleQuantityChange(quantity - 1)}
                variant="outline"
                size="icon"
                className="h-10 w-10"
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button
                onClick={() => handleQuantityChange(quantity + 1)}
                variant="outline"
                size="icon"
                className="h-10 w-10"
                disabled={quantity >= 10}
              >
                +
              </Button>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full sm:w-2/3 bg-black hover:bg-black/90 text-white"
              disabled={!product.inStock || isInCart}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </Button>
            
            <Button
              onClick={handleAddToWishlist}
              variant="outline"
              size="lg"
              className="w-full sm:w-1/3"
            >
              <Heart className={cn("mr-2 h-5 w-5", isInWishlist ? "fill-red-500 text-red-500" : "")} />
              {isInWishlist ? "Saved" : "Save"}
            </Button>
          </motion.div>
          
          <motion.div variants={fadeIn} className="border-t border-gray-200 pt-6 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <TruckIcon className="h-5 w-5 mr-2 text-gray-600" />
                <span className="text-sm">Free shipping over $50</span>
              </div>
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-gray-600" />
                <span className="text-sm">30-Day returns</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-gray-600" />
                <span className="text-sm">Secure checkout</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Product Details Tabs - One single tabs component with improved styling */}
      <motion.div 
        variants={fadeIn}
        className="mt-12 border-t border-gray-200 pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Tabs defaultValue="description" onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="w-full justify-start border-b mb-8 pb-0 bg-transparent space-x-8">
            <TabsTrigger 
              value="description"
              className={cn(
                "pb-4 text-base font-medium rounded-none border-b-2 transition-colors",
                activeTab === "description" ? "border-black text-black" : "border-transparent text-gray-500"
              )}
            >
              Product Details
            </TabsTrigger>
            <TabsTrigger 
              value="shipping"
              className={cn(
                "pb-4 text-base font-medium rounded-none border-b-2 transition-colors",
                activeTab === "shipping" ? "border-black text-black" : "border-transparent text-gray-500"
              )}
            >
              Shipping & Returns
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className={cn(
                "pb-4 text-base font-medium rounded-none border-b-2 transition-colors",
                activeTab === "reviews" ? "border-black text-black" : "border-transparent text-gray-500"
              )}
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence>
            <TabsContent value="description" className="mt-0">
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="prose max-w-none"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                    <p className="text-gray-700 mb-6">
                      {product.description || `Experience premium quality and style with our ${product.name}. 
                      Crafted with attention to detail, this hat combines comfort, durability, and fashion.`}
                    </p>
                    
                    <h4 className="font-medium text-lg mb-3">Key Features</h4>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>Premium quality materials for exceptional durability</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>Adjustable fit system for maximum comfort</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>Stylish, versatile design for everyday wear</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>Water-resistant finish to protect in light rain</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-2 mt-0.5" />
                        <span>Breathable fabric for all-day comfort</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-lg mb-4">Materials & Care</h4>
                    <div className="space-y-4 mb-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Materials</h5>
                        <p className="text-gray-700">Made from 100% premium cotton with high-quality stitching and hardware.</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Care Instructions</h5>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                          <li>Hand wash with cold water</li>
                          <li>Do not bleach</li>
                          <li>Do not tumble dry</li>
                          <li>Reshape while damp</li>
                          <li>Air dry away from direct sunlight</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Dimensions</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-white p-3 rounded">
                          <p className="text-gray-500">Height</p>
                          <p className="font-medium">4 inches</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="text-gray-500">Brim Width</p>
                          <p className="font-medium">2.75 inches</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="text-gray-500">Weight</p>
                          <p className="font-medium">3.2 oz</p>
                        </div>
                        <div className="bg-white p-3 rounded">
                          <p className="text-gray-500">Adjustable</p>
                          <p className="font-medium">Yes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-0">
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="text-xl font-semibold mb-5">Delivery Options</h3>
                    <div className="space-y-4">
                      <div className="bg-white p-5 border border-gray-100 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">Standard</span>
                            <h4 className="font-medium text-gray-900">Standard Shipping</h4>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">3-5 business days</p>
                          <p className="text-xs text-gray-500 mt-1">Delivered by USPS or UPS</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">$4.99</p>
                          <p className="text-xs text-gray-500 mt-1">Tracking included</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-5 border border-gray-100 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">Expedited</span>
                            <h4 className="font-medium text-gray-900">Express Shipping</h4>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">1-2 business days</p>
                          <p className="text-xs text-gray-500 mt-1">Delivered by FedEx or UPS</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">$9.99</p>
                          <p className="text-xs text-gray-500 mt-1">Priority handling</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-5 border border-green-100 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">Free</span>
                            <h4 className="font-medium text-gray-900">Free Shipping</h4>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">5-7 business days</p>
                          <p className="text-xs text-gray-500 mt-1">On orders over $99</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">FREE</p>
                          <p className="text-xs text-gray-500 mt-1">Standard tracking</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Shipping Notes</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        <li>Orders typically ship within 1 business day</li>
                        <li>Delivery times exclude weekends and holidays</li>
                        <li>International shipping options available at checkout</li>
                        <li>Hawaii, Alaska, and Puerto Rico may have extended delivery times</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-5">Return Policy</h3>
                    <div className="bg-gray-50 p-6 rounded-lg mb-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">30-Day Returns</h4>
                        <span className="text-sm text-green-600 font-medium">Easy Process</span>
                      </div>
                      <p className="text-gray-700 mb-3">
                        We stand behind our products and want you to be completely satisfied with your purchase. If you're not happy for any reason, we accept returns within 30 days of delivery.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-white p-4 rounded-md shadow-sm">
                          <div className="flex items-center mb-2">
                            <RotateCcw className="w-4 h-4 text-primary mr-2" />
                            <h5 className="font-medium text-sm">For Refunds</h5>
                          </div>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Original packaging preferred</li>
                            <li>• Unused condition</li>
                            <li>• Return shipping fee applies</li>
                            <li>• Refund to original payment method</li>
                          </ul>
                        </div>
                        <div className="bg-white p-4 rounded-md shadow-sm">
                          <div className="flex items-center mb-2">
                            <RotateCcw className="w-4 h-4 text-blue-500 mr-2" />
                            <h5 className="font-medium text-sm">For Exchanges</h5>
                          </div>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Original packaging preferred</li>
                            <li>• Unused condition</li>
                            <li>• Free return shipping</li>
                            <li>• Quick processing</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium mb-2">Return Exceptions</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        <li>Sale items can only be exchanged for store credit</li>
                        <li>Personalized or custom-made items cannot be returned</li>
                        <li>Items damaged through normal wear and tear are not eligible</li>
                        <li>Missing original tags or packaging may result in reduced refund</li>
                      </ul>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                          For detailed instructions on how to initiate a return, please visit our <a href="#" className="underline font-medium">Returns Portal</a> or contact our customer service team.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-0">
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Customer Reviews</h3>
                  <Button variant="outline" className="gap-2 bg-primary hover:bg-primary/90 text-white border-primary">
                    <Star className="w-4 h-4" fill="currentColor" />
                    Write a Review
                  </Button>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                  <div className="lg:w-1/3">
                    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center">
                          <p className="text-5xl font-bold mr-3">{product.rating || 4.5}</p>
                          <div className="flex flex-col items-start">
                            <Rating value={product.rating || 4.5} size={16} />
                            <p className="text-sm text-gray-500 mt-1">
                              Based on {product.reviews || 24} reviews
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-4">Ratings Breakdown</h4>
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <div key={`rating-breakdown-${star}`} className="flex items-center gap-2">
                              <span className="text-sm w-8 text-right font-medium">{star}</span>
                              <Star className="w-4 h-4 text-yellow-400" fill={star <= 5 ? "currentColor" : "none"} />
                              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{
                                    width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {star === 5 ? 18 : star === 4 ? 5 : star === 3 ? 1 : star === 2 ? 0 : 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 mt-6 pt-6">
                        <h4 className="font-medium mb-3 text-center">Review Highlights</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">Great Quality</span>
                          <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">Perfect Fit</span>
                          <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">Good Value</span>
                          <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">Fast Shipping</span>
                          <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">As Described</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <h4 className="font-medium text-primary mb-3">Filter Reviews</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium block mb-1.5">Rating</label>
                          <div className="flex flex-wrap gap-2">
                            {[5, 4, 3, 2, 1].map((star) => (
                              <button 
                                key={`filter-button-${star}`}
                                className={cn(
                                  "inline-flex items-center px-3 py-1.5 border rounded-md text-sm transition-all",
                                  "hover:border-primary hover:bg-primary/5",
                                  "focus:outline-none focus:ring-2 focus:ring-primary/30",
                                  selectedRating === star 
                                    ? "bg-primary text-white border-primary font-medium" 
                                    : "bg-white border-gray-200 text-gray-700"
                                )}
                                onClick={() => setSelectedRating(star === selectedRating ? null : star)}
                                aria-pressed={selectedRating === star ? "true" : "false"}
                              >
                                {star} <Star className={cn("w-3.5 h-3.5 ml-1", selectedRating === star ? "text-white" : "text-yellow-400")} fill="currentColor" />
                              </button>
                            ))}
                            {selectedRating && (
                              <button 
                                className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white text-gray-600 hover:bg-gray-50"
                                onClick={() => setSelectedRating(null)}
                              >
                                Clear <X className="w-3.5 h-3.5 ml-1" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium block mb-1.5">By Feature</label>
                          <select 
                            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            aria-label="Filter reviews by feature"
                          >
                            <option>All Features</option>
                            <option>Comfort</option>
                            <option>Material Quality</option>
                            <option>Design</option>
                            <option>Durability</option>
                            <option>Value</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-2/3">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">24 Reviews</h4>
                      <div className="flex gap-2">
                        <select 
                          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
                          aria-label="Sort reviews"
                        >
                          <option>Most Recent</option>
                          <option>Highest Rated</option>
                          <option>Lowest Rated</option>
                          <option>Most Helpful</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Review 1 */}
                      <div className="border border-gray-100 rounded-lg p-5 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">SJ</div>
                              <div>
                                <h5 className="font-medium">Sarah Johnson</h5>
                                <p className="text-xs text-gray-500">Verified Purchase • April 12, 2023</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={`star-review1-rating-${star}`} 
                                  className="w-4 h-4 text-yellow-400" 
                                  fill={star <= 5 ? "currentColor" : "none"} 
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 mt-1">for size L</span>
                          </div>
                        </div>
                        
                        <h6 className="font-semibold mb-2">Perfect fit and great quality!</h6>
                        <p className="text-gray-700 mb-3">
                          I've been looking for the perfect hat for my summer outfits and this one exceeded my expectations. The material is breathable yet durable, and the size L fits perfectly on my head. The adjustable strap is a nice touch for those windier days.
                        </p>
                        
                        <div className="flex gap-3 mb-4">
                          <div className="w-16 h-16 rounded-md bg-gray-100 overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1521369909029-2afed882baee?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                              alt="Customer review image" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="w-16 h-16 rounded-md bg-gray-100 overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1556306535-0f09a537f0a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                              alt="Customer review image" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <div className="flex items-center gap-3">
                            <button className="inline-flex items-center text-sm text-gray-600 hover:text-primary">
                              <ThumbsUp className="w-4 h-4 mr-1" /> Helpful (12)
                            </button>
                            <button className="inline-flex items-center text-sm text-gray-600 hover:text-primary">
                              <MessageSquare className="w-4 h-4 mr-1" /> Reply
                            </button>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Report</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Review 2 */}
                      <div className="border border-gray-100 rounded-lg p-5 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-medium">MD</div>
                              <div>
                                <h5 className="font-medium">Mike Davis</h5>
                                <p className="text-xs text-gray-500">Verified Purchase • March 28, 2023</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center">
                              {[1, 2, 3, 4].map((star) => (
                                <Star 
                                  key={`star-review2-rating-${star}`} 
                                  className="w-4 h-4 text-yellow-400" 
                                  fill="currentColor" 
                                />
                              ))}
                              <Star 
                                key="star-review2-rating-empty" 
                                className="w-4 h-4 text-gray-300" 
                              />
                            </div>
                            <span className="text-xs text-gray-500 mt-1">for size M</span>
                          </div>
                        </div>
                        
                        <h6 className="font-semibold mb-2">Great hat, runs slightly large</h6>
                        <p className="text-gray-700 mb-3">
                          The quality of this hat is excellent, and the design looks just like in the photos. I normally wear size M, but this runs a bit large. I had to use the adjustable strap to make it fit better. Otherwise, it's a great purchase and I've already received compliments when wearing it!
                        </p>
                        
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <div className="flex items-center gap-3">
                            <button className="inline-flex items-center text-sm text-gray-600 hover:text-primary">
                              <ThumbsUp className="w-4 h-4 mr-1" /> Helpful (8)
                            </button>
                            <button className="inline-flex items-center text-sm text-gray-600 hover:text-primary">
                              <MessageSquare className="w-4 h-4 mr-1" /> Reply
                            </button>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Report</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Review 3 */}
                      <div className="border border-gray-100 rounded-lg p-5 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-medium">AT</div>
                              <div>
                                <h5 className="font-medium">Alex Thompson</h5>
                                <p className="text-xs text-gray-500">Verified Purchase • February 15, 2023</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={`star-review3-rating-${star}`} 
                                  className="w-4 h-4 text-yellow-400" 
                                  fill={star <= 5 ? "currentColor" : "none"} 
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 mt-1">for size M</span>
                          </div>
                        </div>
                        
                        <h6 className="font-semibold mb-2">Absolutely love this hat!</h6>
                        <p className="text-gray-700 mb-3">
                          This hat is perfect for my beach vacation. The material is lightweight yet durable, and it provides excellent sun protection. The color is exactly as shown in the pictures. The shipping was faster than expected too. Would definitely recommend!
                        </p>
                        
                        <div className="flex gap-3 mb-4">
                          <div className="w-16 h-16 rounded-md bg-gray-100 overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1622445275576-721325763afe?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                              alt="Customer review image" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <div className="flex items-center gap-3">
                            <button className="inline-flex items-center text-sm text-gray-600 hover:text-primary">
                              <ThumbsUp className="w-4 h-4 mr-1" /> Helpful (15)
                            </button>
                            <button className="inline-flex items-center text-sm text-gray-600 hover:text-primary">
                              <MessageSquare className="w-4 h-4 mr-1" /> Reply
                            </button>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Report</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-center">
                        <Button variant="outline" className="gap-2">
                          <MoreHorizontal className="w-4 h-4" />
                          Load More Reviews
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 border-t border-gray-200 pt-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">You May Also Like</h2>
            <Link href="/collections" className="text-sm font-medium flex items-center hover:underline">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <Link
                key={`related-product-${relatedProduct.id}`}
                href={`/product/${relatedProduct.slug}`}
                className="group"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 relative">
                  <Image
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  
                  {relatedProduct.isSale && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                      Sale
                    </span>
                  )}
                  
                  {relatedProduct.isNew && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                      New
                    </span>
                  )}
                </div>
                
                <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                  {relatedProduct.name}
                </h3>
                
                <div className="flex items-center">
                  {relatedProduct.salePrice ? (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-red-600">
                        {formatPrice(relatedProduct.salePrice)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(relatedProduct.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold">
                      {formatPrice(relatedProduct.price)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 