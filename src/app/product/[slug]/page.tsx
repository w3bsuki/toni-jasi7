import React from "react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";

import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";
import { products } from "@/data/products";

export function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return Promise.resolve({
      title: "Product Not Found",
    });
  }

  return Promise.resolve({
    title: `${product.name} | Hat Store`,
    description: product.description || `Shop our ${product.name} hat`,
    openGraph: {
      images: [product.images[0]],
    },
  });
}

export default function Page({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail product={product} />
      </Suspense>
    </div>
  );
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
} 