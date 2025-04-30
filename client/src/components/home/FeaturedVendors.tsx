// import { useQuery } from "@tanstack/react-query";
// import { Link } from "wouter";
// import { Star } from "lucide-react";

// type Vendor = {
//   id: number;
//   businessName: string;
//   description: string;
//   logoUrl: string;
//   coverUrl: string;
//   averageRating: number;
//   totalReviews: number;
// };

// const VendorSkeleton = () => (
//   <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
//     <div className="relative h-32 bg-gray-200"></div>
//     <div className="flex justify-center -mt-10 mb-3">
//       <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200"></div>
//     </div>
//     <div className="px-4 pt-0 pb-5 text-center space-y-3">
//       <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto"></div>
//       <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
//       <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
//       <div className="h-8 bg-gray-100 rounded w-1/2 mx-auto"></div>
//     </div>
//   </div>
// );

// const FeaturedVendors = () => {
//   const { data: vendors = [], isLoading } = useQuery({
//     queryKey: ['/api/vendors/featured'],
//     queryFn: async () => {
//       // This endpoint is not in the API specs, so using a workaround
//       // In a real implementation, this would call the proper endpoint
//       const res = await fetch('/api/products?type=vendors&featured=true');
//       if (!res.ok) {
//         // Return mock data since endpoint might not exist
//         return [
//           {
//             id: 1,
//             businessName: "TechStore",
//             description: "Premium Electronics & Gadgets",
//             logoUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
//             coverUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f",
//             averageRating: 4.8,
//             totalReviews: 243
//           },
//           {
//             id: 2,
//             businessName: "HomeDecor",
//             description: "Modern Home Furnishings",
//             logoUrl: "https://images.unsplash.com/photo-1507138086030-616c3b6dd768",
//             coverUrl: "https://images.unsplash.com/photo-1487700160041-babef9c3cb55",
//             averageRating: 4.7,
//             totalReviews: 187
//           },
//           {
//             id: 3,
//             businessName: "BeautyEssentials",
//             description: "Organic Skincare Products",
//             logoUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
//             coverUrl: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19",
//             averageRating: 4.9,
//             totalReviews: 156
//           },
//           {
//             id: 4,
//             businessName: "FashionWorld",
//             description: "Trendy Apparel & Accessories",
//             logoUrl: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4",
//             coverUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
//             averageRating: 4.6,
//             totalReviews: 215
//           }
//         ];
//       }
//       return res.json();
//     },
//     staleTime: 1000 * 60 * 15, // 15 minutes
//   });
  
//   return (
//     <section className="bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-bold text-gray-800">Our Top Vendors</h2>
//           <Link href="/products?type=vendors">
//             <span className="text-primary hover:underline font-medium cursor-pointer">View All Vendors</span>
//           </Link>
//         </div>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {isLoading
//             ? Array(4).fill(0).map((_, index) => <VendorSkeleton key={index} />)
//             : vendors.map((vendor: Vendor) => (
//                 <div 
//                   key={vendor.id} 
//                   className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition"
//                 >
//                   <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
//                     <img 
//                       src={vendor.coverUrl} 
//                       alt={`${vendor.businessName} Cover`} 
//                       className="w-full h-full object-cover opacity-50"
//                     />
//                   </div>
//                   <div className="flex justify-center -mt-10 mb-3">
//                     <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden">
//                       <img 
//                         src={vendor.logoUrl} 
//                         alt={`${vendor.businessName} Logo`} 
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   </div>
//                   <div className="px-4 pt-0 pb-5 text-center">
//                     <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition">
//                       {vendor.businessName}
//                     </h3>
//                     <p className="text-gray-500 text-sm mb-3">{vendor.description}</p>
//                     <div className="flex items-center justify-center space-x-1 mb-3">
//                       <Star className="text-yellow-400 h-4 w-4 fill-current" />
//                       <span className="text-gray-700 font-medium">{vendor.averageRating}</span>
//                       <span className="text-gray-500 text-sm">({vendor.totalReviews} reviews)</span>
//                     </div>
//                     <Link href={`/vendor/${vendor.id}`}>
//                       <span className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer">
//                         View Shop
//                       </span>
//                     </Link>
//                   </div>
//                 </div>
//               ))
//           }
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedVendors;
