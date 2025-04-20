import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";

export default function ProductLoading() {
  return (
    <div className="py-4 md:py-8">
      <ProductDetailSkeleton />
    </div>
  );
} 