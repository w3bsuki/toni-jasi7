"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  badges?: {
    isNew?: boolean;
    isSale?: boolean;
  };
}

export function ProductGallery({ images, alt, badges = {} }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Handle mouse move for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !mainImageRef.current) return;
    
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  // Handle mouse leave for zoom effect
  const handleMouseLeave = () => {
    if (isZoomed) {
      setIsZoomed(false);
    }
  };

  // Toggle zoom on click
  const toggleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    
    if (!isZoomed) {
      const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setZoomPosition({ x, y });
    }
    
    setIsZoomed(!isZoomed);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') {
          setIsFullscreen(false);
        } else if (e.key === 'ArrowLeft') {
          handlePrevImage();
        } else if (e.key === 'ArrowRight') {
          handleNextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Handle next image
  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handle previous image
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div ref={galleryRef} className="space-y-4">
      {/* Main Image Container */}
      <div 
        ref={mainImageRef}
        className={cn(
          "relative overflow-hidden rounded-xl bg-gray-100 cursor-zoom-in", 
          isZoomed && "cursor-zoom-out",
          isFullscreen ? "fixed inset-0 z-50 flex items-center justify-center bg-black/95" : "aspect-square"
        )}
        onClick={isFullscreen ? undefined : toggleZoom}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={cn(
          "relative w-full h-full transition-transform duration-200", 
          isZoomed && !isFullscreen && "scale-150",
          isFullscreen && "w-auto h-auto max-w-[90vw] max-h-[90vh]"
        )} style={{
          transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : "center center"
        }}>
          <Image
            src={images[selectedImageIndex] || "/products/placeholder.jpg"}
            alt={`${alt} - Image ${selectedImageIndex + 1}`}
            fill={!isFullscreen}
            width={isFullscreen ? 1200 : undefined}
            height={isFullscreen ? 1200 : undefined}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className={cn(
              "object-cover object-center transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100",
              isFullscreen && "!relative !w-auto !h-auto max-w-full max-h-[90vh]"
            )}
            onLoad={() => setIsLoading(false)}
            priority={selectedImageIndex === 0}
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
            </div>
          )}
          
          {/* Product Badges */}
          {!isFullscreen && (
            <>
              {badges.isNew && (
                <div className="absolute top-4 left-4 z-10 bg-blue-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                  New
                </div>
              )}
              
              {badges.isSale && (
                <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                  Sale
                </div>
              )}
            </>
          )}
          
          {/* Fullscreen Controls */}
          {isFullscreen && (
            <>
              <button 
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-20"
              >
                <X size={24} />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-20"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-20"
              >
                <ChevronRight size={24} />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full text-white text-sm z-20">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
        
        {/* Zoom and Fullscreen controls (only visible when not in fullscreen) */}
        {!isFullscreen && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/95 text-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
            >
              {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
            </Button>
            
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/95 text-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(true);
              }}
            >
              <Maximize size={16} />
            </Button>
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && !isFullscreen && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative min-w-16 h-16 overflow-hidden rounded-md bg-gray-100 transition-all hover:ring-2 hover:ring-blue-600",
                selectedImageIndex === index ? "ring-2 ring-blue-600" : "opacity-70 hover:opacity-100"
              )}
              onClick={() => setSelectedImageIndex(index)}
              aria-label={`View image ${index + 1} of product`}
            >
              <Image
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 