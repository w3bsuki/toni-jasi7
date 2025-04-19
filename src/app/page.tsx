import { Suspense } from 'react';
import { Hero } from '@/components/home/Hero';
import { SignupCarousel } from '@/components/home/SignupCarousel';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import TrendingCarousel from '@/components/home/TrendingCarousel';
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
        imageUrl="https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3"
      />
      
      {/* Full-width SignupCarousel directly below Hero */}
      <SignupCarousel />
      
      {/* Full-width FeaturedCollections */}
      <FeaturedCollections collections={collections} />
      
      {/* Full-width TrendingCarousel below FeaturedCollections */}
      <TrendingCarousel products={trendingProducts} />
    </div>
  );
}
