import { notFound } from "next/navigation";
import ProductDetail from "@/components/product/ProductDetail";
import { products } from "@/data/products";
import type { Metadata, ResolvingMetadata } from "next";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Hat Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0], width: 1200, height: 630, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const slug = params.slug;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-4 md:py-8">
      <ProductDetail product={product} />
    </div>
  );
}

// Generate static pages for all products
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
} 