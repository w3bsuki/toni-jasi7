import { getAllProducts } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default async function ProductListingPage() {
  const products = await getAllProducts();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/product/${encodeURIComponent(product.slug)}`}
            className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {product.isNew && (
                <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                  NEW
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                {product.name}
              </h2>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="font-medium">
                {product.salePrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-primary">${product.salePrice.toFixed(2)}</span>
                    <span className="text-gray-500 text-sm line-through">${product.price.toFixed(2)}</span>
                  </div>
                ) : (
                  <span>${product.price.toFixed(2)}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 