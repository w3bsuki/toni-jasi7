import { Collection, Product } from './types';
import { products } from '@/lib/data/products';

/**
 * Fetch featured collections from API
 */
export async function getFeaturedCollections(): Promise<Collection[]> {
  // Mock data for featured collections
  const featuredCollections: Collection[] = [
    {
      id: '1',
      title: 'Summer Collection',
      slug: 'summer-collection',
      description: 'Stay cool and stylish with our summer hat collection.',
      image: '/images/collections/summer-collection.jpg',
      products: []
    },
    {
      id: '2',
      title: 'Winter Essentials',
      slug: 'winter-essentials',
      description: 'Keep warm with our premium winter hats.',
      image: '/images/collections/winter-collection.jpg',
      products: []
    },
    {
      id: '3',
      title: 'Sport Caps',
      slug: 'sport-caps',
      description: 'Performance hats designed for athletes and sport enthusiasts.',
      image: '/images/collections/sport-collection.jpg',
      products: []
    },
    {
      id: '4',
      title: 'Luxury Hats',
      slug: 'luxury-hats',
      description: 'Exclusive designs using premium materials for discerning customers.',
      image: '/images/collections/luxury-collection.jpg',
      products: []
    }
  ];
  
  return featuredCollections;
}

/**
 * Fetch trending products from API
 */
export async function getTrendingProducts(): Promise<Product[]> {
  // Use our products from products.ts with the Unsplash images
  if (products && products.length > 0) {
    // Ensure our products match the expected Product interface
    return products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      discount: product.discount,
      rating: product.rating,
      reviews: 50, // Add a default value for reviews
      images: product.images || [],
      categories: [product.category || 'caps'],
      colors: product.colors || [],
      sizes: product.sizes || [],
      isNew: product.isNew || false,
      isFeatured: true,
      inStock: true
    }));
  }
  
  // Fallback to a simple product with one image if products array is empty
  const fallbackImage = "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1000&auto=format&fit=crop";
  
  return [
    {
      id: '1',
      name: 'Classic White Baseball Cap',
      slug: 'classic-white-baseball-cap',
      description: 'A timeless white baseball cap with a clean design. Perfect for casual outings.',
      price: 29.99,
      discount: 0,
      rating: 4.5,
      reviews: 124,
      images: [fallbackImage],
      categories: ['mens', 'caps'],
      colors: ['white', 'black', 'gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      isNew: true,
      isFeatured: true,
      inStock: true
    }
  ];
} 