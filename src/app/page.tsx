import Hero from "@/components/home/Hero";
import SignupCarousel from "@/components/home/SignupCarousel";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import Newsletter from "@/components/home/Newsletter";
import RibbonLogos from "@/components/home/RibbonLogos";
import InfiniteMovingCards from "@/components/home/InfiniteMovingCards";
import { collections } from "@/data/collections";
import { products } from "@/data/products";

export default function Home() {
  // Get featured collections (first 3)
  const featuredCollections = collections.slice(0, 3);
  
  // Get trending products for infinite cards (get more products to make the carousel more interesting)
  const trendingProducts = products.slice(0, 10);

  return (
    <>
      <div className="mb-0">
        <Hero
          title="Premium Hat Collection"
          subtitle="Elevate your style with our exclusive hat collection"
          ctaText="Shop Now"
          ctaLink="/collections"
          imageSrc="https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1920&auto=format&fit=crop"
        />
      </div>
      
      <SignupCarousel />
      
      <FeaturedCollections
        collections={featuredCollections}
      />
      
      <RibbonLogos />
      
      <InfiniteMovingCards
        items={trendingProducts}
        speed="slow"
        pauseOnHover={true}
        title="Trending Now"
        subtitle="Our most popular styles this season"
      />
      
      <Newsletter
        title="Join Our Newsletter"
        subtitle="Subscribe for exclusive offers, new arrivals, and style tips"
      />
    </>
  );
}
