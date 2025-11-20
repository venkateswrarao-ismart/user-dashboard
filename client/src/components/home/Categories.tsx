// // import { useQuery } from "@tanstack/react-query";
// // import { Link } from "wouter";
// // import { cn } from "@/lib/utils";

// // type SubCategory = {
// //   id: string;
// //   name: string;
// //   image_url: string | null;
// // };

// // type Category = {
// //   id: string;
// //   name: string;
// //   slug: string;
// //   image_url: string | null;
// //   description: string | null;
// //   parent_id: string | null;
// //   is_active: boolean;
// //   created_at: string;
// //   updated_at: string;
// //   subcategories?: SubCategory[];
// // };

// // const CategorySkeleton = () => (
// //   <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
// //     <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 relative h-36"></div>
// //     <div className="p-4 text-center space-y-2">
// //       <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto"></div>
// //       <div className="h-3 bg-gray-100 rounded w-1/3 mx-auto"></div>
// //     </div>
// //   </div>
// // );

// // const Categories = () => {
// //   const { data: categories = [], isLoading, error } = useQuery({
// //     queryKey: ['/api/categories'],
// //     queryFn: async () => {
// //       const response = await fetch('/api/categories');
// //       if (!response.ok) {
// //         throw new Error('Failed to fetch categories');
// //       }
// //       return response.json();
// //     },
// //     staleTime: 1000 * 60 * 60, // 1 hour
// //   });
  

// //   console.log("nameofcategory",categories)
// //   return (
// //     <section className="bg-gray-50 py-12">
// //       <div className="container mx-auto px-4">
// //         <div className="flex justify-between items-center mb-8">
// //           <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
// //           <Link href="/products">
// //             <span className="text-primary hover:underline font-medium cursor-pointer">View All</span>
// //           </Link>
// //         </div>
        
// //         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
// //           {isLoading
// //             ? Array(6).fill(0).map((_, index) => <CategorySkeleton key={index} />)
// //             : Array.isArray(categories) && categories.map((category: Category) => (
// //                 <div key={category.id} className="group relative">
// //                   <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform transform hover:scale-105 hover:shadow-md">
// //                     <Link href={`/category/${category.id}`}>
// //                       <div className="block cursor-pointer">
// //                         <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 relative h-36">
// //                           {category.image_url ? (
// //                             <img 
// //                               src={category.image_url} 
// //                               alt={category.name} 
// //                               className="w-full h-full object-cover"
// //                             />
// //                           ) : (
// //                             <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
// //                               <span className="text-2xl font-bold">{category.name.charAt(0)}</span>
// //                             </div>
// //                           )}
// //                         </div>
// //                         <div className="p-4 text-center">
// //                           <h3 className="font-medium text-gray-900 group-hover:text-primary transition">
// //                             {category.name}
// //                           </h3>
// //                           {category.subcategories && category.subcategories.length > 0 && (
// //                             <p className="text-xs text-gray-500 mt-1">
// //                               {category.subcategories.length} subcategories
// //                             </p>
// //                           )}
// //                         </div>
// //                       </div>
// //                     </Link>
// //                   </div>
                  
// //                   {/* Subcategories dropdown on hover */}
// //                   {category.subcategories && category.subcategories.length > 0 && (
// //                     <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-lg shadow-lg p-2 absolute z-10 w-40 left-0">
// //                       <h4 className="text-xs font-semibold text-gray-800 mb-1 px-2">Subcategories</h4>
// //                       <ul className="space-y-1">
// //                         {category.subcategories.map(sub => (
// //                           <li key={sub.id}>
// //                             <Link href={`/subcategory/${sub.id}`}>
// //                               <span className="text-xs text-gray-700 hover:text-primary hover:bg-gray-50 block px-2 py-1 rounded cursor-pointer">
// //                                 {sub.name}
// //                               </span>
// //                             </Link>
// //                           </li>
// //                         ))}
// //                       </ul>
// //                     </div>
// //                   )}
// //                 </div>
// //               ))
// //           }
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default Categories;


// import { useQuery } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import { supabase } from "@/lib/supabase";

// type Category = {
//   id: string;
//   name: string;
//   image_url: string | null;
//   parent_id: string | null;
//   is_active: boolean;
// };

// const CategorySkeleton = () => (
//   <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
//     <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 relative h-36"></div>
//     <div className="p-4 text-center space-y-2">
//       <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto"></div>
//       <div className="h-3 bg-gray-100 rounded w-1/3 mx-auto"></div>
//     </div>
//   </div>
// );

// const Categories = () => {
//   // const { data: categories = [], isLoading } = useQuery({
//   //   queryKey: ["all-categories"],
//   //   queryFn: async () => {
//   //     const { data, error } = await supabase
//   //       .from("categories")
//   //       .select("id, name, image_url, parent_id, is_active")
//   //       .eq("is_active", true);

//   //     if (error) throw new Error(error.message);
//   //     return data as Category[];
//   //   },
//   //   staleTime: 1000 * 60 * 60,
//   // });

//   const { data: categories = [], isLoading } = useQuery({
//     queryKey: ["all-categories"],
//     queryFn: async () => {
//       // const { data, error } = await supabase
//       //   .from("categories")
//       //   .select("id, name, image_url, parent_id, is_active")
//       //   .eq("is_active", true)
//       //   .is("parent_id", null); // This line filters to top-level categories

//       const { data, error } = await supabase
//   .from("categories")
//   .select("id, name, image_url, parent_id, is_active")
//   .eq("is_active", true)
//   .is("parent_id", null)
//   .eq("company", "rentxp");  // Filter only rentxp categories

  
//       if (error) throw new Error(error.message);
//       return data as Category[];
//     },
//     staleTime: 1000 * 60 * 60,
//   });

//   return (
//     // <section className="bg-gray-50 py-12">
//     //   <div className="container mx-auto px-4">
//     //     <div className="flex justify-between items-center mb-8">
//     //       <h2 className="text-2xl font-bold text-gray-800">Browse Categories</h2>
//     //       <Link to="/categories">
//     //         <span className="text-primary hover:underline font-medium cursor-pointer">View All</span>
//     //       </Link>
//     //     </div>

//     //     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
//     //       {isLoading
//     //         ? Array(6).fill(0).map((_, i) => <CategorySkeleton key={i} />)
//     //         : categories.map(category => (
//     //             <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-transform transform hover:scale-105">
//     //               <Link to={`/category/${category.id}`}>
//     //                 <div className="block cursor-pointer">
//     //                   <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 relative h-36">
//     //                     {category.image_url ? (
//     //                       <img
//     //                         src={category.image_url}
//     //                         alt={category.name}
//     //                         className="w-full h-full object-cover"
//     //                       />
//     //                     ) : (
//     //                       <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
//     //                         <span className="text-2xl font-bold">{category.name.charAt(0)}</span>
//     //                       </div>
//     //                     )}
//     //                   </div>
//     //                   <div className="p-4 text-center">
//     //                     <h3 className="font-medium text-gray-900">{category.name}</h3>
//     //                     {category.parent_id && (
//     //                       <p className="text-xs text-gray-500 mt-1">(Subcategory)</p>
//     //                     )}
//     //                   </div>
//     //                 </div>
//     //               </Link>
//     //             </div>
//     //           ))}
//     //     </div>
//     //   </div>
//     // </section>
//     <section className="bg-gray-50 py-12">
//   <div className="container mx-auto px-4">
//     <div className="flex justify-between items-center mb-6">
//       <h2 className="text-2xl font-bold text-gray-800">Browse Categories</h2>
//       <Link to="/categories">
//         <span className="text-primary hover:underline font-medium cursor-pointer">
//           View All
//         </span>
//       </Link>
//     </div>

//     <div
//       className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
//     >
//       {isLoading
//         ? Array(6)
//             .fill(0)
//             .map((_, i) => (
//               <div
//                 key={i}
//                 className="flex flex-col items-center space-y-2 w-24 snap-start"
//               >
//                 <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
//                 <div className="h-4 w-14 bg-gray-200 rounded animate-pulse" />
//               </div>
//             ))
//         : categories.map((category) => (
//             <Link
//               key={category.id}
//               to={`/category/${category.id}`}
//               className="flex flex-col items-center space-y-2 w-24 snap-start"
//             >
//               <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden shadow-sm border">
//                 {category.image_url ? (
//                   <img
//                     src={category.image_url}
//                     alt={category.name}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
//                     <span className="text-xl font-semibold">
//                       {category.name.charAt(0)}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <p className="text-sm font-medium text-gray-800 text-center">
//                 {category.name}
//               </p>
//             </Link>
//           ))}
//     </div>
//   </div>
// </section>

//   );
// };

// export default Categories;


// import { useQuery } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import { supabase } from "@/lib/supabase";
// import { useEffect, useRef } from "react";

// type Category = {
//   id: string;
//   name: string;
//   image_url: string | null;
//   parent_id: string | null;
//   is_active: boolean;
// };

// const CategorySkeleton = () => (
//   <div className="flex flex-col items-center space-y-2 w-24 snap-start">
//     <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
//     <div className="h-4 w-14 bg-gray-200 rounded animate-pulse"></div>
//   </div>
// );

// const Categories = () => {
//   const sliderRef = useRef<HTMLDivElement | null>(null);

//   const { data: categories = [], isLoading } = useQuery({
//     queryKey: ["all-categories"],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("categories")
//         .select("id, name, image_url, parent_id, is_active")
//         .eq("is_active", true)
//         .is("parent_id", null)
//         .eq("company", "rentxp"); // rentxp filter

//       if (error) throw new Error(error.message);
//       return data as Category[];
//     },
//     staleTime: 1000 * 60 * 60,
//   });

//   // Auto-slide logic
//   useEffect(() => {
//     const slider = sliderRef.current;
//     if (!slider) return;

//     let index = 0;

//     const interval = setInterval(() => {
//       const childrenCount = slider.children.length;
//       if (childrenCount === 0) return;

//       index = (index + 1) % childrenCount;

//       slider.scrollTo({
//         left: index * 110, // 110px card width
//         behavior: "smooth",
//       });
//     }, 2000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Browse Categories</h2>
//           {/* <Link to="/categories">
//             <span className="text-primary hover:underline font-medium cursor-pointer">
//               View All
//             </span>
//           </Link> */}
//         </div>

//         {/* Auto slider container */}
//         <div
//           ref={sliderRef}
//           className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
//         >
//           {isLoading
//             ? Array(6)
//                 .fill(0)
//                 .map((_, i) => <CategorySkeleton key={i} />)
//             : categories.map((category) => (
//                 <Link
//                   key={category.id}
//                   to={`/category/${category.id}`}
//                   className="flex flex-col items-center space-y-2 w-24 snap-start"
//                 >
//                   {/* Rounded Image */}
//                   <div className="w-20 h-20 rounded-full bg-gray-200 border overflow-hidden shadow-sm">
//                     {category.image_url ? (
//                       <img
//                         src={category.image_url}
//                         alt={category.name}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).src =
//                             "https://via.placeholder.com/100?text=Image";
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
//                         <span className="text-xl font-bold">
//                           {category.name.charAt(0)}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   <p className="text-sm font-medium text-gray-800 text-center">
//                     {category.name}
//                   </p>
//                 </Link>
//               ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Categories;

import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useEffect, useRef } from "react";

type Category = {
  id: string;
  name: string;
  image_url: string | null;
  parent_id: string | null;
  is_active: boolean;
};

const CategorySkeleton = () => (
  <div className="flex flex-col items-center space-y-3 w-28 snap-start">
    <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

const Categories = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["all-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, image_url, parent_id, is_active")
        .eq("is_active", true)
        .is("parent_id", null)
        .eq("company", "rentxp");

      if (error) throw new Error(error.message);
      return data as Category[];
    },
    staleTime: 1000 * 60 * 60,
  });

  // Auto-slide logic
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let index = 0;

    const interval = setInterval(() => {
      const childrenCount = slider.children.length;
      if (childrenCount === 0) return;

      index = (index + 1) % childrenCount;

      slider.scrollTo({
        left: index * 140, // bigger space for cards
        behavior: "smooth",
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Browse Categories</h2>
        </div>

        {/* Auto slider container */}
        <div
  ref={sliderRef}
  className="flex space-x-8 overflow-x-auto snap-x snap-mandatory pb-3 px-1"
>

          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => <CategorySkeleton key={i} />)
            : categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="flex flex-col items-center space-y-3 w-28 snap-start"
                >
                  {/* Rounded Image */}
                  <div className="w-24 h-24 rounded-full bg-gray-200 border overflow-hidden shadow">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/100?text=Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                        <span className="text-xl font-bold">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm font-medium text-gray-800 text-center">
                    {category.name}
                  </p>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
