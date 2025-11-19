
// // import { useQuery } from "@tanstack/react-query";
// // import { RefreshCw } from "lucide-react";
// // import { ProductCard } from "@/components/product/ProductCard";

// // type Product = {
// //   id: string;
// //   name: string;
// //   description: string;
// //   price: number;
// //   image_url: string;
// //   category: string;
// //   brand?: string;
// // };

// // export function ProductList() {
// //   const { data, isLoading, error } = useQuery<{ products: Product[] }>({
// //     queryKey: ["/api/products"],
// //     queryFn: async () => {
// //       const res = await fetch("/api/products");
// //       if (!res.ok) {
// //         throw new Error("Failed to fetch products");
// //       }
// //       return res.json();
// //     }
// //   });

// //   if (isLoading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <RefreshCw className="h-8 w-8 text-primary animate-spin" />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return <div className="text-center text-red-500 mt-8">Error loading products: {error.message}</div>;
// //   }

// //   if (!data?.products?.length) {
// //     return <div className="text-center mt-8">No products found</div>;
// //   }

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <h1 className="text-2xl font-bold mb-6">Our Products</h1>
// //       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //         {data.products.map((product) => (
// //           <ProductCard key={product.id} product={product} />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export default ProductList;


// // import { useParams } from "react-router-dom";
// // import { useQuery } from "@tanstack/react-query";
// // import { RefreshCw } from "lucide-react";
// // import { ProductCard } from "@/components/product/ProductCard";
// // import { supabase } from "@/lib/supabase";

// // type Product = {
// //   id: string;
// //   name: string;
// //   description: string;
// //   price: number;
// //   image_url: string;
// //   category: string; // category_id
// //   brand?: string;
// // };

// // export default function ProductList() {
// //   const { slug } = useParams<{ slug: string }>(); // `slug` is actually the category_id

// //   console.log("category-id",slug)

// //   const { data, isLoading, error } = useQuery({
// //     queryKey: ["products-by-category", slug],
// //     queryFn: async () => {
// //       const { data, error } = await supabase
// //         .from("products")
// //         .select("*")
// //         .eq("id", slug); // Assuming `category` is the foreign key

// //       if (error) {
// //         throw new Error(error.message);
// //       }

// //       return { products: data as Product[] };
// //     },
// //     enabled: !!slug, // only run if slug is present
// //   });

// //   if (isLoading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <RefreshCw className="h-8 w-8 text-primary animate-spin" />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return <div className="text-center text-red-500 mt-8">Error loading products: {error.message}</div>;
// //   }

// //   if (!data?.products?.length) {
// //     return <div className="text-center mt-8">No products found</div>;
// //   }

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <h1 className="text-2xl font-bold mb-6">Products in this Category</h1>
// //       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //         {data.products.map((product) => (
// //           <ProductCard key={product.id} product={product} />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }


// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { RefreshCw } from "lucide-react";
// import { ProductCard } from "@/components/product/ProductCard";
// import { supabase } from "@/lib/supabase";

// type Product = {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image_url: string;
//   category: string; // category_id
//   brand?: string;
// };

// export default function ProductList() {
//   const { slug } = useParams<{ slug: string }>(); // `slug` is the category_id

//   console.log("category-id", slug);

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["products-by-category", slug],
//     queryFn: async () => {
//       const { data, error } = await supabase
//       .from("products")
//       .select("*, product_images(*)", { count: "exact" })
//       .in("category_id", [slug]) // Assuming `category` is the foreign key for category_id

//       if (error) {
//         console.log('error')
//         throw new Error(error.message);
//       }

//       if(data){
//         console.log("products-data",data)
//       }

//       return { products: data as Product[] };
//     },
//     enabled: !!slug, // only run if slug is present
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <RefreshCw className="h-8 w-8 text-primary animate-spin" />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-center text-red-500 mt-8">Error loading products: {error.message}</div>;
//   }

//   if (!data?.products?.length) {
//     return <div className="text-center mt-8">No products found</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Products in this Category</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {data.products.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// }


import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  selling_price: number;
  image_url: string;
  category_id: string;
  brand?: string;
  product_photos?: string[];
};

export default function ProductList() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.trim();

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", slug, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, product_images(*)", { count: "exact" });

      // Handle category filter
      if (slug) {
        query = query.in("category_id", [slug]);
      }

      // Handle search query
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return { products: data as Product[] };
    },
    enabled: !!slug || !!searchQuery || true // Always enabled
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }


  console.log('produc-data-inlist',data)

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        Error loading products: {error.message}
      </div>
    );
  }

  const getHeaderText = () => {
    if (slug) return "Products in this Category";
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    return "All Products";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{getHeaderText()}</h1>
      {!data?.products?.length ? (
        <div className="text-center mt-8">No products found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                image_url: product.product_photos?.[0] || product.image_url
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}