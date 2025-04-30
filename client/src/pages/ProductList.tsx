
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand?: string;
};

export function ProductList() {
  const { data, isLoading, error } = useQuery<{ products: Product[] }>({
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
    return <div className="text-center text-red-500 mt-8">Error loading products: {error.message}</div>;
  }

  if (!data?.products?.length) {
    return <div className="text-center mt-8">No products found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
