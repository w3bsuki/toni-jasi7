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
      <Hero
        title="Redefine Your Style"
        subtitle="Discover our premium hat collection crafted with exceptional quality materials and attention to detail."
        ctaText="Shop Now"
        ctaLink="/collections"
        secondaryCtaText="View Lookbook"
        secondaryCtaLink="/lookbook"
        imageSrc="https://images.unsplash.com/photo-1517941823-815bea90d291?q=80&w=1920&auto=format&fit=crop"
      />
      
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
