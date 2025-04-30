
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

export default function ProductList() {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  // Ensure products is an array before mapping
  const products = Array.isArray(response?.products) ? response.products : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
