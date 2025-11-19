// import { useEffect } from "react";
// import { Link, useLocation,useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet";
// import { useQuery } from "@tanstack/react-query";
// import { 
//   RefreshCw, 
//   Package, 
//   ChevronRight, 
//   Search, 
//   FileText, 
//   ShoppingBag 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { useAuth } from "@/hooks/useAuth";
// import { formatCurrency, formatDate } from "@/lib/utils";
// import { useState } from "react";

// const UserOrders = () => {
//   const navigate = useNavigate();
//     const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!isAuthLoading && !isAuthenticated) {
//       navigate("/");
//     }
//   }, [isAuthLoading, isAuthenticated, navigate]);

//   // Fetch user orders
//   const { 
//     data: orders = [], 
//     isLoading: isOrdersLoading, 
//     error: ordersError,
//     refetch: refetchOrders
//   } = useQuery({
//     queryKey: [`/api/users/${user?.id}/orders`],
//     enabled: isAuthenticated && !!user?.id,
//   });

//   const getStatusColor = (status: string) => {
//     switch(status.toLowerCase()) {
//       case 'completed':
//         return 'bg-green-100 text-green-800';
//       case 'processing':
//         return 'bg-blue-100 text-blue-800';
//       case 'shipped':
//         return 'bg-purple-100 text-purple-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Filter orders by search term and status
//   const filteredOrders = orders?.filter((order: any) => {
//     const matchesSearch = searchTerm === "" || 
//       order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = statusFilter === "all" || 
//       order.status.toLowerCase() === statusFilter.toLowerCase();
    
//     return matchesSearch && matchesStatus;
//   });

//   if (isAuthLoading || isOrdersLoading) {
//     return (
//       <div className="bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading your orders...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated || !user) {
//     return null; // Will redirect via useEffect
//   }

//   if (ordersError) {
//     return (
//       <div className="bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
//           <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//             <div className="text-red-500 mb-4">
//               <FileText className="h-12 w-12 mx-auto" />
//             </div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Orders</h2>
//             <p className="text-gray-600 mb-6">There was an error loading your orders. Please try again.</p>
//             <Button 
//               className="bg-primary hover:bg-blue-600"
//               onClick={() => refetchOrders()}
//             >
//               Retry
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Helmet>
//         <title>My Orders | MultiVendor Marketplace</title>
//         <meta name="description" content="View and track your order history, check order status, and manage your purchases." />
//       </Helmet>
      
//       <div className="bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           {/* Breadcrumb */}
//           <div className="flex items-center text-sm text-gray-500 mb-6">
//             <Link to="/">
//               <a className="hover:text-primary">Home</a>
//             </Link>
//             <ChevronRight className="h-4 w-4 mx-2" />
//             <span className="text-gray-700">My Orders</span>
//           </div>
          
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
          
//           {/* Filter and Search */}
//           <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <Input
//                   type="text"
//                   placeholder="Search by order number"
//                   className="pl-9"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <div className="w-full md:w-48">
//                 <Select 
//                   value={statusFilter} 
//                   onValueChange={setStatusFilter}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Filter by status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Orders</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="processing">Processing</SelectItem>
//                     <SelectItem value="shipped">Shipped</SelectItem>
//                     <SelectItem value="completed">Completed</SelectItem>
//                     <SelectItem value="cancelled">Cancelled</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
          
//           {/* Orders List */}
//           {filteredOrders.length === 0 ? (
//             <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//               <div className="text-gray-400 mb-4">
//                 <ShoppingBag className="h-12 w-12 mx-auto" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h2>
//               <p className="text-gray-600 mb-6">
//                 {orders.length === 0 
//                   ? "You haven't placed any orders yet." 
//                   : "No orders match your current filters."}
//               </p>
//               <Button 
//                 className="bg-primary hover:bg-blue-600"
//                 onClick={() => navigate("/products")}
//               >
//                 Browse Products
//               </Button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredOrders.map((order: any) => (
//                 <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
//                   <div className="p-4 md:p-6 border-b border-gray-100">
//                     <div className="flex flex-col md:flex-row justify-between gap-4">
//                       <div>
//                         <span className="text-sm text-gray-500">Order Number</span>
//                         <h3 className="font-medium">{order.orderNumber}</h3>
//                       </div>
//                       <div>
//                         <span className="text-sm text-gray-500">Date</span>
//                         <p className="font-medium">{formatDate(order.createdAt)}</p>
//                       </div>
//                       <div>
//                         <span className="text-sm text-gray-500">Total</span>
//                         <p className="font-medium">{formatCurrency(order.total)}</p>
//                       </div>
//                       <div>
//                         <span className="text-sm text-gray-500">Status</span>
//                         <div className="mt-1">
//                           <Badge className={getStatusColor(order.status)}>
//                             {order.status}
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="p-4 md:p-6 bg-gray-50">
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                       <div className="flex items-center">
//                         <Package className="h-5 w-5 text-primary mr-2" />
//                         <span className="text-sm text-gray-600">
//                           {`Payment Method: ${order.paymentMethod === 'cash-on-delivery' ? 'Cash on Delivery' : order.paymentMethod}`}
//                         </span>
//                       </div>
//                       <Button 
//                         className="bg-primary hover:bg-blue-600"
//                         onClick={() => navigate(`/order-success/${order.id}`)}
//                       >
//                         View Details
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
          
//           {/* Pagination - Static for now */}
//           {filteredOrders.length > 0 && (
//             <div className="mt-6 flex justify-center">
//               <nav className="flex items-center space-x-1">
//                 <Button variant="outline" size="sm" disabled>
//                   Previous
//                 </Button>
//                 <Button variant="outline" size="sm" className="bg-primary text-white">
//                   1
//                 </Button>
//                 <Button variant="outline" size="sm" disabled>
//                   Next
//                 </Button>
//               </nav>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserOrders;


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  FileText,
  RefreshCw,
  Search,
  ShoppingBag
} from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

const UserOrders = () => {
  const navigate = useNavigate();
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  console.log('user-auth-id',user?.id)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  // Fetch user orders
  const { 
    data: orders = [], 
    isLoading: isOrdersLoading, 
    error: ordersError,
    refetch: refetchOrders
  } = useQuery({
    queryKey: [`user ${user?.id}`],
    //  ['/api/users/addresses'],
    enabled: isAuthenticated && !!user?.id,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          // .neq('id', slug)
          .eq('customer_id', user?.id).order('created_at', { ascending: false });
          // .limit(4);

        if (error) throw error;

        return data.map(p => ({
          ...p,
          id: p.id != null || p.customer_id ? 
            (p || [p.customer_id]) : 
            ['Inavlid Data']
        }));
      } catch (error) {
        console.error('Error fetching related addresses:', error);
        return [];
      }
    },
  });


 
  

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter orders by search term and status
  const filteredOrders = orders?.filter((order: any) => {
    const matchesSearch = searchTerm === "" || 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  if (isAuthLoading || isOrdersLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }


  console.log('order-details',filteredOrders)
  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  if (ordersError) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-500 mb-4">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Orders</h2>
            <p className="text-gray-600 mb-6">There was an error loading your orders. Please try again.</p>
            <Button 
              className="bg-primary hover:bg-blue-600"
              onClick={() => refetchOrders()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders | RENTXP</title>
        <meta name="description" content="View and track your order history, check order status, and manage your purchases." />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/">
              <a className="hover:text-primary">Home</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700">My Orders</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
          
          {/* Filter and Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by order number"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <ShoppingBag className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h2>
              <p className="text-gray-600 mb-6">
                {orders.length === 0 
                  ? "You haven't placed any orders yet." 
                  : "No orders match your current filters."}
              </p>
              <Button 
                className="bg-primary hover:bg-blue-600"
                onClick={() => navigate("/products")}
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order: any) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 md:p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Order Number</span>
                        <h3 className="font-medium">{order?.id?.id}</h3>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Date</span>
                        <p className="font-medium">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Total</span>
                        <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status</span>
                        <div className="mt-1">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 bg-gray-50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      {/* <div className="flex items-center">
                        <Package className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm text-gray-600">
                          {`Payment Method: ${order.paymentMethod === 'cash-on-delivery' ? 'Cash on Delivery' : order.paymentMethod}`}
                        </span>
                      </div> */}
                      <Button 
                        className="bg-primary hover:bg-blue-600"
                        onClick={() => navigate(`/order-success/${order?.id?.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination - Static for now */}
          {filteredOrders.length > 0 && (
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center space-x-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-white">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserOrders;