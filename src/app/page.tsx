import { Suspense } from 'react';
import { Hero } from '@/components/home/Hero';
import { SignupCarousel } from '@/components/home/SignupCarousel';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { EnhancedTrendingCarousel } from '@/components/home/EnhancedTrendingCarousel';
import { Collection, Product } from '@/lib/types';
import { getFeaturedCollections, getTrendingProducts } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Home() {
  const collections = await getFeaturedCollections();
  const trendingProducts = await getTrendingProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Full-width Hero section */}
      <Hero 
        title="Redefine Your Style" 
        subtitle="Discover our premium hat collection crafted with exceptional quality materials and attention to detail."
        ctaText="Shop Now"
        ctaLink="/collections"
        imageUrl="/images/hats/placeholder1.jpg"
      />
      
      {/* Full-width SignupCarousel directly below Hero */}
      <SignupCarousel />
      
      {/* Full-width FeaturedCollections */}
      <FeaturedCollections 
        collections={collections} 
      />

      {/* Enhanced Trending Carousel */}
      <EnhancedTrendingCarousel products={trendingProducts} />
    </div>
  );
}
