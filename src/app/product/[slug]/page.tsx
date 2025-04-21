import React from "react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";

import { products } from "@/data/products";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";
import { EnhancedProductPage } from "@/components/product/EnhancedProductPage";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Hat Store`,
    description: product.description || `Shop our ${product.name} hat`,
    openGraph: {
      title: `${product.name} | Premium Hats & Caps`,
      description: product.description || `Shop our ${product.name} hat`,
      images: [product.images[0]],
      type: 'article',
      url: `https://hatstore.example.com/product/${product.slug}`,
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  // Create structured data for better SEO
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Hat Store',
    },
    offers: {
      '@type': 'Offer',
      url: `https://hatstore.example.com/product/${product.slug}`,
      priceCurrency: 'USD',
      price: product.salePrice || product.price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.5,
      reviewCount: product.reviewCount || 24,
    },
  };

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <div className="min-h-screen pb-16">
        <Suspense fallback={<ProductDetailSkeleton />}>
          <EnhancedProductPage product={product} />
        </Suspense>
      </div>
    </>
  );
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
} 