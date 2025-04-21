export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  discount?: number;
  images: string[];
  colors?: string[];
  sizes?: string[];
  collection?: string;
  collections?: string[];
  category?: string;
  categories?: string[];
  thumbnail?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  inStock?: boolean;
  rating: number;
  reviews?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
} 