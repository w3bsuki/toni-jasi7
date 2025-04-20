import React from "react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const collection = collections.find((c) => c.slug === params.slug);
  
  if (!collection) {
    return Promise.resolve({
      title: "Collection Not Found",
    });
  }

  return Promise.resolve({
    title: `${collection.name} | Hat Store`,
    description: collection.description || `Shop our ${collection.name} collection`,
  });
}

export default function Page({ params }: { params: { slug: string } }) {
  const collection = collections.find((c) => c.slug === params.slug);
  
  if (!collection) {
    notFound();
  }

  // Filter products that belong to this collection
  const collectionProducts = products.filter(
    (product) => product.collections && product.collections.includes(collection.id)
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          {collection.description && (
            <p className="mt-2 text-gray-600">{collection.description}</p>
          )}
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid products={collectionProducts} />
        </Suspense>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return collections.map((collection) => ({
    slug: collection.slug,
  }));
} 