import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  category_id: string;
  approval_status: string;
  rejection_reason: string | null;
  submitted_at: string;
  approved_at: string | null;
  brand: string;
  hsn_code: string;
  vendor_id: string | null;
  sub_category_id: string;
  selling_price: number;
  gst_percentage: number;
  updated_by: string | null;
};

const FeaturedProducts = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['/api/products', { featured: true }],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <div className="flex space-x-2">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition"
              aria-label="Previous products"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition"
              aria-label="Next products"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 relative h-56"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="flex overflow-x-auto space-x-6 pb-4 hide-scrollbar snap-x"
          >
            {Array.isArray(products) && products.map((product: Product) => (
              <div 
                key={product.id} 
                className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <a 
            href="/products" 
            className="inline-block bg-white border border-primary text-primary hover:bg-primary hover:text-white transition px-6 py-3 rounded-lg font-medium"
          >
            View All Products
          </a>
        </div>
      </div>
      
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
