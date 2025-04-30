import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/products', { featured: true }],
    queryFn: async () => {
      const response = await fetch('/api/products?featured=true');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data.products || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const products = data || [];
  
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.isArray(products) && products.map((product: Product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg mb-4">
                    <img 
                      src={product.image_url || 'https://via.placeholder.com/400'} 
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">(42 reviews)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {product.selling_price && product.selling_price < product.price ? (
                        <>
                          <span className="text-xl font-bold text-gray-900">₹{product.selling_price}</span>
                          <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                          <Badge className="bg-red-500">
                            {Math.round(((product.price - product.selling_price) / product.price) * 100)}% OFF
                          </Badge>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Brand:</span> {product.brand}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span> {product.category}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Stock:</span> {product.stock} units
                    </div>
                  </div>
                </div>
              </Link>
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
