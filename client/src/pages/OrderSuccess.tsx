// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/lib/supabase";
// import { formatCurrency } from "@/lib/utils";
// import { useQuery } from "@tanstack/react-query";
// import {
//   AlertCircle,
//   CheckCircle,
//   ChevronRight,
//   Map,
//   Package,
//   RefreshCw
// } from "lucide-react";
// import { useEffect } from "react";
// import { Helmet } from "react-helmet";
// import { Link, useNavigate, useParams } from "react-router-dom";

// const OrderSuccess = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

//   useEffect(() => {
//     if (!isAuthLoading && !isAuthenticated) {
//       navigate("/");
//     }
//   }, [isAuthLoading, isAuthenticated, navigate]);

//   const { 
//     data: order, 
//     isLoading, 
//     error 
//   } = useQuery({
//     queryKey: [`order-${orderId}`],
//     enabled: isAuthenticated && !!orderId,
//     queryFn: async () => {
//       try {
//         const { data, error } = await supabase
//           .from('orders')
//           .select(`
//             *,
//             order_items:order_items (
//               *,
//               products:products (
//                 *
//               )
//             )
//           `)
//           .eq('id', orderId)
//           .single();

//         if (error) throw error;
//         return data;
//       } catch (error) {
//         console.error('Error fetching order:', error);
//         throw error;
//       }
//     },
//   });

//   if (isLoading || isAuthLoading) {
//     return (
//       <div className="bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading your order details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !order) {
//     return (
//       <div className="bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
//           <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
//           <p className="text-gray-600 mb-6">
//             We couldn't find the order details you're looking for.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <Button 
//               variant="outline"
//               onClick={() => navigate("/orders")}
//             >
//               View All Orders
//             </Button>
//             <Button 
//               className="bg-primary hover:bg-blue-600"
//               onClick={() => navigate("/")}
//             >
//               Continue Shopping
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const getStatusColor = (status: string) => {
//     switch(status) {
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

//   const totalItems = order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

//   return (
//     <>
//       <Helmet>
//         <title>Order Confirmation | RENTXP</title>
//         <meta name="description" content={`Thank you for your order! Your order #${orderId} has been received and is being processed.`} />
//       </Helmet>
      
//       <div className="bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center text-sm text-gray-500 mb-6">
//             <Link to="/" className="hover:text-primary">Home</Link>
//             <ChevronRight className="h-4 w-4 mx-2" />
//             <Link to="/orders" className="hover:text-primary">Orders</Link>
//             <ChevronRight className="h-4 w-4 mx-2" />
//             <span className="text-gray-700">Order #{orderId}</span>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6 text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="h-10 w-10 text-green-600" />
//             </div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
//             <p className="text-gray-600 mb-4">
//               Thank you for your purchase. Your order has been received and is being processed.
//             </p>
//             <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
//               Order #{orderId}
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
//               <div className="border border-gray-200 rounded-lg p-4">
//                 <div className="flex flex-col items-center">
//                   <Package className="h-6 w-6 text-primary mb-2" />
//                   <h3 className="font-medium">Order Status</h3>
//                   <span className={`mt-1 text-sm px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
//                     {order.status}
//                   </span>
//                 </div>
//               </div>
//               <div className="border border-gray-200 rounded-lg p-4">
//                 <div className="flex flex-col items-center">
//                   <Package className="h-6 w-6 text-primary mb-2" />
//                   <h3 className="font-medium">Total Items</h3>
//                   <span className="mt-1 text-sm text-gray-600">
//                     {totalItems} items
//                   </span>
//                 </div>
//               </div>
//               <div className="border border-gray-200 rounded-lg p-4">
//                 <div className="flex flex-col items-center">
//                   <Map className="h-6 w-6 text-primary mb-2" />
//                   <h3 className="font-medium">Delivery Address</h3>
//                   <span className="mt-1 text-sm text-gray-600">
//                     {order.delivery_address || 'Address not available'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="p-6 border-b border-gray-100">
//                   <h2 className="text-xl font-semibold">Order Items</h2>
//                 </div>
                
//                 <div className="divide-y divide-gray-100">
//                   {order.order_items?.map((item: any) => (
//                     <div key={item.id} className="p-6 flex flex-col sm:flex-row">
//                       <div className="w-full sm:w-20 h-20 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
//                         <img 
//                           src={item.products?.image_url || '/placeholder-product.jpg'} 
//                           alt={item.products?.name} 
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="flex-1 sm:ml-4">
//                         <div className="flex flex-col sm:flex-row justify-between">
//                           <div>
//                             <h3 className="font-medium text-gray-900">{item.products?.name}</h3>
//                             <p className="text-sm text-gray-500">
//                               SKU: {item.products?.sku || 'N/A'}
//                             </p>
//                           </div>
//                           <div className="text-right mt-2 sm:mt-0">
//                             <p className="font-bold text-gray-900">
//                               {formatCurrency(item.unit_price * item.quantity)}
//                             </p>
//                             <p className="text-sm text-gray-500">
//                               {formatCurrency(item.unit_price)} x {item.quantity}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
            
//             <div className="space-y-6">
//               <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="p-6 border-b border-gray-100">
//                   <h2 className="text-xl font-semibold">Order Summary</h2>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium">
//                       {formatCurrency(order.total_amount)}
//                     </span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between font-bold">
//                     <span>Total</span>
//                     <span>{formatCurrency(order.total_amount)}</span>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="p-6 border-b border-gray-100">
//                   <div className="flex items-center">
//                     <Map className="h-5 w-5 text-primary mr-2" />
//                     <h2 className="text-xl font-semibold">Delivery Address</h2>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <p className="text-gray-600 whitespace-pre-wrap">
//                     {order.delivery_address || 'Address information not available'}
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex flex-col space-y-3">
//                 <Button 
//                   className="bg-primary hover:bg-blue-600"
//                   onClick={() => navigate("/orders")}
//                 >
//                   View All Orders
//                 </Button>
//                 <Button 
//                   variant="outline"
//                   onClick={() => navigate("/")}
//                 >
//                   Continue Shopping
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OrderSuccess;

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Map,
  Package,
  RefreshCw,
  Truck,
  Zap
} from "lucide-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrderExtension from "@/components/OrderExtension/OrderExtension";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  const { 
    data: order, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: [`order-${orderId}`],
    enabled: isAuthenticated && !!orderId,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items:order_items (
              *,
              products:products (
                *
              )
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
      }
    },
  });

  if (isLoading || isAuthLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the order details you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline"
              onClick={() => navigate("/orders")}
            >
              View All Orders
            </Button>
            <Button 
              className="bg-primary hover:bg-blue-600"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
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

  const getDeliveryTimeSlotMessage = () => {
    if (!order.delivery_time_slot) return "Delivery time not specified";
    
    const timeSlots: Record<string, string> = {
      "3-6": "3 PM to 6 PM",
      "6-9": "6 PM to 9 PM"
    };
    
    return `Delivery scheduled for ${timeSlots[order.delivery_time_slot] || order.delivery_time_slot}`;
  };

  const calculateRentalPeriod = () => {
    const startDate = order.start_date ? new Date(order.start_date) : null;
    const endDate = order.end_date ? new Date(order.end_date) : null;
    const rentalDays = order.rental_days || 1;
    
    if (startDate && endDate) {
      return {
        start: formatDate(startDate),
        end: formatDate(endDate),
        days: rentalDays
      };
    }
    
    return {
      start: "Not specified",
      end: "Not specified",
      days: rentalDays
    };
  };

  const rentalPeriod = calculateRentalPeriod();
  const totalItems = order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
  
  // Calculate total from order items if needed
  const calculateItemTotal = () => {
    if (order.order_items && order.order_items.length > 0) {
      return order.order_items.reduce((total: number, item: any) => {
        const rentalDays = item.rental_days || order.rental_days || 1;
        return total + (item.unit_price * item.quantity * rentalDays);
      }, 0);
    }
    return order.total_amount || 0;
  };

  const itemTotal = calculateItemTotal();
  const finalTotal = order.final_total || itemTotal;

  return (
    <>
      <Helmet>
        <title>Order Confirmation | RENTXP Gaming Zone</title>
        <meta name="description" content={`Thank you for your rental order! Your order #${orderId} has been received and is being processed.`} />
      </Helmet>

      {/* Add Extension Section - Insert this after the main grid */}

      
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/orders" className="hover:text-primary">Orders</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700">Order #{orderId}</span>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                    Rental Order Confirmed!
                  </h1>
                  <p className="text-gray-600">
                    Thank you for renting with us. Your equipment will be delivered as scheduled.
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                <span>Order #{orderId}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col items-center">
                  <Package className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Order Status</h3>
                  <span className={`mt-1 text-sm px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col items-center">
                  <Calendar className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Rental Period</h3>
                  <div className="mt-1 text-sm text-gray-600 text-center">
                    <p>{rentalPeriod.days} day{rentalPeriod.days > 1 ? 's' : ''}</p>
                    <p className="text-xs">{rentalPeriod.start} to {rentalPeriod.end}</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col items-center">
                  <Clock className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Delivery Slot</h3>
                  <span className="mt-1 text-sm text-gray-600 text-center">
                    {getDeliveryTimeSlotMessage()}
                  </span>
                  {order.is_instant_delivery && (
                    <span className="mt-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                      ⚡ Instant Delivery
                    </span>
                  )}
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col items-center">
                  <Map className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Delivery Address</h3>
                  <span className="mt-1 text-sm text-gray-600 text-center line-clamp-2">
                    {order.delivery_address?.split(',')[0] || 'Address'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">Rental Equipment</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Rental period: {rentalPeriod.start} to {rentalPeriod.end} ({rentalPeriod.days} day{rentalPeriod.days > 1 ? 's' : ''})
                  </p>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {order.order_items?.map((item: any) => {
                    const itemRentalDays = item.rental_days || order.rental_days || 1;
                    const itemTotalPrice = item.unit_price * item.quantity * itemRentalDays;
                    
                    return (
                      <div key={item.id} className="p-6">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 md:mb-0">
                            <img 
                              src={item.products?.image_url || '/placeholder-product.jpg'} 
                              alt={item.products?.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 md:ml-6">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{item.products?.name}</h3>
                                <p className="text-sm text-gray-500">
                                  SKU: {item.products?.sku || 'N/A'}
                                </p>
                                <div className="flex items-center mt-2 text-sm text-gray-600">
                                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded mr-2">
                                    {itemRentalDays} day{itemRentalDays > 1 ? 's' : ''} rental
                                  </span>
                                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    Qty: {item.quantity}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-4 md:mt-0 md:text-right">
                                <p className="font-bold text-gray-900 text-lg">
                                  {formatCurrency(itemTotalPrice)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatCurrency(item.unit_price)} × {item.quantity} × {itemRentalDays} day{itemRentalDays > 1 ? 's' : ''}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Per 24 hours: {formatCurrency(item.unit_price)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Important Rental Information */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Truck className="h-5 w-5 text-primary mr-2" />
                    Rental & Delivery Information
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Delivery Time</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {getDeliveryTimeSlotMessage()}
                        {order.is_instant_delivery && (
                          <span className="ml-2 inline-flex items-center text-yellow-600 font-medium">
                            <Zap className="h-3 w-3 mr-1" />
                            Instant Delivery (within 60 minutes)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Rental Period</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {rentalPeriod.start} to {rentalPeriod.end} ({rentalPeriod.days} day{rentalPeriod.days > 1 ? 's' : ''})
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Equipment must be returned by end of rental period. Late returns may incur additional charges.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <Package className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Pickup Instructions</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Our delivery agent will contact you 30 minutes before arrival. Please ensure someone is available to receive and inspect the equipment.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Important Notes</h4>
                      <ul className="text-gray-600 text-sm mt-1 list-disc list-inside space-y-1">
                        <li>Please inspect equipment upon delivery</li>
                        <li>Report any damages immediately</li>
                        <li>Keep equipment in safe, dry conditions</li>
                        <li>Return equipment in the same condition</li>
                        <li>Security deposit (if any) will be refunded upon safe return</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rental Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(order.total_amount || itemTotal)}
                    </span>
                  </div>
                  
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({order.rental_days > 5 ? '20%' : 'Special'})</span>
                      <span className="font-medium">-{formatCurrency(order.discount_amount)}</span>
                    </div>
                  )}
                  
                  {order.instant_delivery_charge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                        Instant Delivery
                      </span>
                      <span className="font-medium">{formatCurrency(order.instant_delivery_charge)}</span>
                    </div>
                  )}
                  
                  {order.late_night_charge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Late Night Charge</span>
                      <span className="font-medium">{formatCurrency(order.late_night_charge)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Final Total</span>
                    <span>{formatCurrency(order.final_total || finalTotal)}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <p className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="font-medium">{order.payment_method || 'Cash on Delivery'}</span>
                    </p>
                    <p className="flex justify-between mt-1">
                      <span>Payment Status:</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        order.payment_status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.payment_status || 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <Map className="h-5 w-5 text-primary mr-2" />
                    <h2 className="text-xl font-semibold">Delivery Address</h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 whitespace-pre-wrap mb-4">
                    {order.delivery_address || 'Address information not available'}
                  </p>
                  {order.sales_agent_name && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Contact Person</h4>
                      <p className="text-sm text-gray-600">
                        {order.sales_agent_name}
                        {order.sales_agent_phone && (
                          <span className="block">Phone: {order.sales_agent_phone}</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-primary mr-2" />
                    <h2 className="text-xl font-semibold">Payment Details</h2>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium">{order.payment_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Razorpay Order ID:</span>
                    <span className="font-medium">{order.razorpay_order_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">{formatDate(new Date(order.created_at))}</span>
                  </div>
                  {order.comments && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-2">Order Comments</h4>
                      <p className="text-sm text-gray-600">{order.comments}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  className="bg-primary hover:bg-blue-600"
                  onClick={() => navigate("/orders")}
                >
                  View All Orders
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.print()}
                >
                  Print Order Details
                </Button>
              </div>
              
              {/* Need Help Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
                <p className="text-blue-600 text-sm mb-3">
                  For any questions about your rental order or delivery, contact our support team.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={() => navigate("/contact")}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Add Extension Section - Insert this after the main grid */}
<div className="mt-8">
  <OrderExtension />
</div>
      </div>
    </>
  );
};

export default OrderSuccess;