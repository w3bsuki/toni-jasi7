import { notFound } from "next/navigation";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import ProductCard from "@/components/product/ProductCard";

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: CollectionPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const collection = collections.find((c) => c.slug === params.slug);

  if (!collection) {
    return {
      title: "Collection Not Found",
    };
  }

  return {
    title: `${collection.title} | Hat Store`,
    description: collection.description,
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collection = collections.find((c) => c.slug === params.slug);

  if (!collection) {
    notFound();
  }

  // Get products for this collection
  const collectionProducts = products.filter(
    (product) => product.collection === params.slug
  );

  return (
    <div>
      {/* Collection Header */}
      <div className="relative h-[40vh] min-h-[300px]">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-2xl px-4">
            <h1 className="text-4xl font-bold text-white mb-4">
              {collection.title}
            </h1>
            <p className="text-white text-lg">{collection.description}</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium">
              No products found in this collection
            </h2>
            <p className="mt-2 text-gray-600">
              Check back soon for new products!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Generate static pages for all collections
export async function generateStaticParams() {
  return collections.map((collection) => ({
    slug: collection.slug,
  }));
} 