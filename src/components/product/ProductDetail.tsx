"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Truck, Shield, Star, ChevronRight, Heart, Share, Minus, Plus, Check, Ruler } from "lucide-react";
import { Product } from "@/types/product";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { products } from "@/data/products";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'reviews'>('description');
  const [isWishlistActive, setIsWishlistActive] = useState(false);

  // Find related products (same collection + not this product)
  const relatedProducts = products
    .filter(p => p.collection === product.collection && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    
    // In a real app, this would dispatch to a cart state/context
    console.log("Added to cart:", {
      product,
      size: selectedSize,
      quantity,
    });
    
    // Show success message (in real app, use a toast notification)
    alert(`Added ${quantity} ${product.name} (${selectedSize}) to cart!`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
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
    <>
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex py-4 text-sm">
          <ol className="flex items-center space-x-1">
            <li>
              <Link href="/" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {product.collection && (
                <Link 
                  href={`/collections/${product.collection}`} 
                  className="ml-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white capitalize"
                >
                  {product.collection}
                </Link>
              )}
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="ml-1 text-gray-900 dark:text-white font-medium truncate max-w-[150px]">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-16">
          {/* Product Images */}
          <div>
            <div 
              className="relative aspect-square mb-4 bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-lg"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  fill
                  style={{ 
                    objectFit: "cover",
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                    transition: isZoomed ? 'none' : 'transform 0.3s ease-out',
                  }}
                  className="rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              
              {/* Labels overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.isNew && (
                  <span className="bg-black text-white text-xs uppercase font-bold px-2 py-1 rounded">
                    New
                  </span>
                )}
                {product.isSale && (
                  <span className="bg-red-600 text-white text-xs uppercase font-bold px-2 py-1 rounded">
                    Sale
                  </span>
                )}
              </div>
            </div>
            
            {/* Thumbnail navigation */}
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden transition-all ${
                    currentImageIndex === index
                      ? "ring-2 ring-black dark:ring-white"
                      : "ring-1 ring-gray-200 dark:ring-gray-700 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image ${index + 1} of ${product.name}`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 20vw, 10vw"
                  />
                </button>
              ))}
              
              {/* Placeholder thumbnails if less than 5 images */}
              {Array.from({ length: Math.max(0, 5 - product.images.length) }).map((_, index) => (
                <div 
                  key={`placeholder-${index}`}
                  className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md opacity-30"
                ></div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Badge and Title */}
            <div className="mb-4">
              {product.collection && (
                <Link 
                  href={`/collections/${product.collection}`}
                  className="inline-block mb-2 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-medium"
                >
                  {product.collection}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">{product.name}</h1>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              {product.isSale && formattedSalePrice ? (
                <div className="flex items-center flex-wrap gap-3">
                  <span className="text-2xl md:text-3xl font-bold text-red-600">
                    {formattedSalePrice}
                  </span>
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    {formattedPrice}
                  </span>
                  {savingsPercentage > 0 && (
                    <span className="ml-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-sm font-medium px-2 py-0.5 rounded">
                      Save {savingsPercentage}%
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{formattedPrice}</span>
              )}
            </div>
            
            {/* Short description */}
            <p className="text-gray-700 dark:text-gray-300 mb-8 text-base leading-relaxed">
              {product.description}
            </p>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-800 mb-6"></div>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">Size</h3>
                <button className="text-sm text-gray-600 dark:text-gray-400 hover:underline flex items-center">
                  <Ruler className="h-3.5 w-3.5 mr-1" />
                  Size Guide
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 border-2 font-medium rounded-md text-sm transition-colors ${
                      selectedSize === size
                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              {selectedSize === null && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please select a size</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-3">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-r-0 border-gray-300 dark:border-gray-700 flex items-center justify-center rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-16 h-10 border-t-2 border-b-2 border-gray-300 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-black text-black dark:text-white font-medium">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border-2 border-l-0 border-gray-300 dark:border-gray-700 flex items-center justify-center rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 px-6 rounded-md flex items-center justify-center hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors text-base font-medium"
              >
                <ShoppingBag size={18} className="mr-2" />
                Add to Cart
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className={`py-3 px-6 rounded-md flex items-center justify-center text-base font-medium border-2 transition-colors ${
                    isWishlistActive 
                      ? "bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" 
                      : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                  }`}
                  onClick={() => setIsWishlistActive(!isWishlistActive)}
                >
                  <Heart size={18} className={`mr-2 ${isWishlistActive ? "fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400" : ""}`} />
                  Wishlist
                </button>
                <button 
                  className="py-3 px-6 rounded-md flex items-center justify-center text-base font-medium border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                >
                  <Share size={18} className="mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* Shipping & Returns */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-4 mb-8">
              <div className="flex gap-4 mb-3">
                <Truck className="h-5 w-5 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">Free Shipping</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Free standard shipping on orders over $50</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Shield className="h-5 w-5 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">Easy Returns</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">30 day return policy. No questions asked.</p>
                </div>
              </div>
            </div>

            {/* Tabs: Description, Shipping, Reviews */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <div className="flex border-b border-gray-200 dark:border-gray-800 mb-4">
                <button
                  className={`pb-3 mr-6 text-sm font-medium uppercase tracking-wider ${
                    activeTab === 'description'
                      ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Details
                </button>
                <button
                  className={`pb-3 mr-6 text-sm font-medium uppercase tracking-wider ${
                    activeTab === 'shipping'
                      ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping
                </button>
                <button
                  className={`pb-3 text-sm font-medium uppercase tracking-wider ${
                    activeTab === 'reviews'
                      ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {product.description} Our hats are crafted with premium materials and attention to detail, ensuring both comfort and style. Each hat is designed to provide a perfect fit while making a statement.
                    </p>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Premium quality materials</li>
                      <li>Adjustable fit for maximum comfort</li>
                      <li>Durable construction built to last</li>
                      <li>Stylish design for everyday wear</li>
                    </ul>
                  </motion.div>
                )}
                
                {activeTab === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Shipping Policy</h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      We offer free standard shipping on all orders over $50. Orders typically ship within 1-2 business days and arrive within 3-5 business days.
                    </p>
                    
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Returns & Exchanges</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging. To initiate a return, please contact our customer service team.
                    </p>
                  </motion.div>
                )}
                
                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        <Star className="h-5 w-5 fill-yellow-400" />
                        <Star className="h-5 w-5 fill-yellow-400" />
                        <Star className="h-5 w-5 fill-yellow-400" />
                        <Star className="h-5 w-5 fill-yellow-400" />
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">5.0 (12 reviews)</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">John D.</span>
                          <div className="flex text-yellow-400">
                            <Star className="h-4 w-4 fill-yellow-400" />
                            <Star className="h-4 w-4 fill-yellow-400" />
                            <Star className="h-4 w-4 fill-yellow-400" />
                            <Star className="h-4 w-4 fill-yellow-400" />
                            <Star className="h-4 w-4 fill-yellow-400" />
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Great quality and exactly as described. Very comfortable and stylish. Would definitely recommend!
                        </p>
                      </div>
                      
                      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">Sarah M.</span>
                          <div className="flex text-yellow-400">
                            <Star className="h-4 w-4 fill-yellow-400" />
                            <Star className="h-4 w-4 fill-yellow-400" />
                            <Star className="h-4 w-4 fill-yellow-400" />
                            <Star className="h-4 w-4 fill-yellow-400" />
                            <Star className="h-4 w-4 fill-yellow-400" />
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Perfect fit and looks even better in person. Shipping was quick too!
                        </p>
                      </div>
                      
                      <button className="text-sm font-medium text-gray-900 dark:text-white hover:underline">
                        Read all 12 reviews →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 pt-12 pb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  href={`/product/${relatedProduct.slug}`} 
                  key={relatedProduct.id}
                  className="group"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3 relative">
                    <Image
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {relatedProduct.isNew && (
                      <span className="absolute top-2 left-2 bg-black text-white text-xs uppercase font-bold px-2 py-1 rounded">
                        New
                      </span>
                    )}
                    {relatedProduct.isSale && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs uppercase font-bold px-2 py-1 rounded">
                        Sale
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:underline transition-all">
                    {relatedProduct.name}
                  </h3>
                  <div>
                    {relatedProduct.isSale && relatedProduct.salePrice ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-red-600">{formatPrice(relatedProduct.salePrice)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">{formatPrice(relatedProduct.price)}</span>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">{formatPrice(relatedProduct.price)}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductDetail; 