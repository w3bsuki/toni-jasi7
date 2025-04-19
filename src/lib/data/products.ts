// Replace the image URLs with high-quality hat mockup images from Unsplash
const hatImages = [
  "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1000&auto=format&fit=crop",  // White cap on gray
  "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop", // White cap on white
  "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1000&auto=format&fit=crop", // Red cap
  "https://images.unsplash.com/photo-1560774358-d727658f457c?q=80&w=1000&auto=format&fit=crop",  // RVCA grey cap
  "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop", // Gray cap on white
  "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=1000&auto=format&fit=crop", // Blue cap
  "https://images.unsplash.com/photo-1620231109648-302d034cb29b?q=80&w=1000&auto=format&fit=crop", // Black and white cap
  "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1000&auto=format&fit=crop"  // Blue faded cap
];

// Update the products to use these images
export const products: Product[] = [
  {
    id: "1",
    name: "Classic White Baseball Cap",
    slug: "classic-white-baseball-cap",
    description: "A timeless white baseball cap with a clean design. Perfect for casual outings.",
    images: [hatImages[0], hatImages[1]],
    price: 29.99,
    discount: 0,
    rating: 4.5,
    isNew: true,
    category: "caps",
    tags: ["baseball", "white", "casual"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["white", "black", "gray"]
  },
  {
    id: "2",
    name: "Premium Red Fitted Cap",
    slug: "premium-red-fitted-cap",
    description: "A bold red fitted cap that makes a statement. High-quality materials and excellent craftsmanship.",
    images: [hatImages[2], hatImages[0]],
    price: 34.99,
    discount: 10,
    rating: 4.8,
    isNew: false,
    category: "caps",
    tags: ["fitted", "red", "premium"],
    sizes: ["S", "M", "L"],
    colors: ["red", "black", "navy"]
  },
  {
    id: "3",
    name: "RVCA Gray Snapback",
    slug: "rvca-gray-snapback",
    description: "A trendy gray snapback with adjustable sizing. Urban style with a comfortable fit.",
    images: [hatImages[3], hatImages[4]],
    price: 39.99,
    discount: 15,
    rating: 4.2,
    isNew: true,
    category: "snapbacks",
    tags: ["snapback", "gray", "urban"],
    sizes: ["One Size"],
    colors: ["gray", "black", "white"]
  },
  {
    id: "4",
    name: "Modern Blue Cap",
    slug: "modern-blue-cap",
    description: "A sleek blue cap with a modern design. Perfect for both athletic and casual wear.",
    images: [hatImages[5], hatImages[7]],
    price: 32.99,
    discount: 0,
    rating: 4.6,
    isNew: false,
    category: "caps",
    tags: ["blue", "modern", "athletic"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["blue", "black", "white"]
  },
  {
    id: "5",
    name: "Vintage Black & White Cap",
    slug: "vintage-black-white-cap",
    description: "A vintage-style black and white cap with a distressed finish. Adds a retro vibe to any outfit.",
    images: [hatImages[6], hatImages[3]],
    price: 36.99,
    discount: 20,
    rating: 4.9,
    isNew: true,
    category: "vintage",
    tags: ["vintage", "black", "white", "distressed"],
    sizes: ["One Size"],
    colors: ["black/white", "blue/white", "red/white"]
  }
]; 