import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  selling_price: number;
  image_url: string;
  brand?: string;
  category_id: string;
  stock?: number;
  product_photos?: string[];
};

const ITEMS_PER_PAGE = 5;

const FeaturedProducts = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const { data } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .limit(20);
      return data?.map((p) => ({
        ...p,
        image_url: p.product_photos?.[0] || p.image_url,
      }));
    },
  });

  const products = data || [];
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const start = currentPage * ITEMS_PER_PAGE;
  const currentProducts = products.slice(start, start + ITEMS_PER_PAGE);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev >= totalPages - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>

          {/* ➤ VIEW ALL BUTTON */}
          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              View All
            </Link>

            <button onClick={handlePrev} disabled={currentPage === 0}>
              <ChevronLeft className="w-10 h-10 bg-gray-100 rounded-full p-2 hover:bg-gray-200" />
            </button>
            <button onClick={handleNext} disabled={currentPage === totalPages - 1}>
              <ChevronRight className="w-10 h-10 bg-gray-100 rounded-full p-2 hover:bg-gray-200" />
            </button>
          </div>
        </div>

        {/* 🎭 ANIMATED PRODUCT GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {currentProducts.map((product) => (
              <motion.div key={product.id} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 200 }}>
                <Link to={`/products/${product.id}`}>
                  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition h-full">

                    {/* 🔧 FIXED IMAGE SIZE */}
                    <img
                      src={product.image_url || "https://via.placeholder.com/300"}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />

                    {/* 🔧 FIX TITLE HEIGHT */}
                    <h3 className="text-lg font-semibold line-clamp-2 min-h-[48px]">
                      {product.name}
                    </h3>

                    {/* 🔧 PRICE AT BOTTOM */}
                    <div className="mt-auto">
                      {product.selling_price < product.price ? (
                        <>
                          <span className="text-xl font-bold">₹{product.selling_price}</span>
                          <span className="line-through text-gray-500 ml-2">₹{product.price}</span>
                          <Badge className="bg-red-500 ml-2">
                            {Math.round((product.price - product.selling_price) / product.price * 100)}% OFF
                          </Badge>
                        </>
                      ) : (
                        <span className="text-xl font-bold">₹{product.price}</span>
                      )}
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedProducts;
