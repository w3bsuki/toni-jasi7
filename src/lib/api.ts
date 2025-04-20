import { Collection } from './types';
import { Product } from '@/types/product';
import { products as newProducts } from '@/lib/data/products';
import { products as oldProducts } from '@/data/products';

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
  if (newProducts && newProducts.length > 0) {
    // Ensure our products match the expected Product interface
    return newProducts.map(product => ({
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

/**
 * Fetch all products from API - combining both product sets
 */
export async function getAllProducts(): Promise<Product[]> {
  // First process the new products with unsplash images
  const processedNewProducts = newProducts.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || `A premium quality ${product.name} for all occasions.`,
    price: product.price,
    salePrice: product.discount ? product.price * (1 - product.discount / 100) : undefined,
    images: product.images || [],
    collection: product.category,
    sizes: product.sizes || [],
    isNew: product.isNew || false,
    isSale: product.discount ? true : false,
    rating: product.rating,
    reviewCount: Math.floor(Math.random() * 100) + 5,
    thumbnail: product.images[0], // Ensure thumbnail is always set to first image
    category: product.category || "caps",
    colors: product.colors || [],
  }));
  
  // Then process the old products - use placeholder images if needed
  const placeholderImage = "/products/hat-placeholder.jpg";
  const processedOldProducts = oldProducts.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || `A premium quality ${product.name} for all occasions.`,
    price: product.price,
    salePrice: product.salePrice,
    images: product.images.length > 0 ? product.images : [placeholderImage, placeholderImage],
    collection: product.collection || "caps",
    sizes: product.sizes || [],
    isNew: product.isNew || false,
    isSale: product.isSale || false,
    rating: 4.5, // Default rating
    reviewCount: Math.floor(Math.random() * 100) + 5,
    thumbnail: product.images[0] || placeholderImage,
    category: product.collection || "caps",
    colors: ["black", "white", "gray"], // Default colors
  }));
  
  // Combine both product sets
  return [...processedNewProducts, ...processedOldProducts];
}

/**
 * Fetch a product by slug from API
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  console.log("Looking for product with slug:", slug);
  const allProducts = await getAllProducts();
  const product = allProducts.find(product => product.slug === slug);
  
  if (!product) {
    console.warn(`Product with slug "${slug}" not found!`);
    console.log("Available products:", allProducts.map(p => p.slug));
  } else {
    console.log("Found product:", product.name);
  }
  
  return product || null;
} 