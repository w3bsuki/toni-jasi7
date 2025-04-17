export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  images: string[];
  collection?: string;
  description: string;
  sizes: string[];
  isNew?: boolean;
  isSale?: boolean;
} 