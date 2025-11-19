// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/hooks/useAuth";
// import { useCart } from "@/hooks/useCart";
// import { apiRequest } from "@/lib/queryClient";
// import { supabase } from "@/lib/supabase";
// import { formatCurrency } from "@/lib/utils";
// import { useQuery } from "@tanstack/react-query";
// import {
//   AlertCircle,
//   CheckCircle,
//   CreditCard,
//   DollarSign,
//   Home,
//   Plus,
//   RefreshCw,
//   Truck
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Helmet } from "react-helmet";
// import { useNavigate } from "react-router-dom";

// type Address = {
//   id: number;
//   userId: number;
//   addressLine1: string;
//   addressLine2: string | null;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
//   isDefault: boolean;
// };

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { cart, refreshCart } = useCart();
//   const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
//   const { toast } = useToast();
//   const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
//   const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [orderId, setOrderId] = useState<string | null>(null);

//   // Fetch user addresses
//   const { 
//     data: addresses = [], 
//     isLoading: isAddressesLoading,
//     error: addressesError,
//     refetch: refetchAddresses
//   } = useQuery<Address[]>({
//     queryKey: [`user ${user?.id}`],
//     //  ['/api/users/addresses'],
//     enabled: isAuthenticated && !!user?.id,
//     queryFn: async () => {
//       try {
//         const { data, error } = await supabase
//           .from('user_addresses')
//           .select('*')
//           // .neq('id', slug)
//           .eq('user_id', user?.id)
//           // .limit(4);

//         if (error) throw error;

//         return data.map(p => ({
//           ...p,
//           id: p.id != null || p.address ? 
//             (p || [p.address]) : 
//             ['Inavlid Data']
//         }));
//       } catch (error) {
//         console.error('Error fetching related addresses:', error);
//         return [];
//       }
//     },
//   });

//   // Calculate order summary
//   const subtotal = cart?.items.reduce((acc, item) => 
//     acc + (item?.products?.selling_price * item?.quantity), 0) || 0;
//   const shipping = subtotal > 50 ? 0 : 5.99;
//   const discount = 0;
//   const total = subtotal + shipping - discount;

//   // Set default address when addresses load
//   useEffect(() => {
//     if (addresses.length > 0 && !selectedAddressId) {
//       const defaultAddress = addresses.find(address => address.isDefault);
//       setSelectedAddressId(defaultAddress ? defaultAddress.id : addresses[0].id);
//     }
//   }, [addresses, selectedAddressId]);

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!isAuthLoading && !isAuthenticated) {
//       toast({
//         title: "Authentication required",
//         description: "Please sign in to continue with checkout.",
//         variant: "destructive",
//       });
//       navigate("/");
//     }
//   }, [isAuthLoading, isAuthenticated, navigate, toast]);

//   // Redirect to cart if cart is empty
//   useEffect(() => {
//     if (!cart || cart.items.length === 0) {
//       toast({
//         title: "Empty cart",
//         description: "Your cart is empty. Add some items before checkout.",
//         variant: "destructive",
//       });
//       navigate("/cart");
//     }
//   }, [cart, navigate, toast]);

//   const handlePlaceOrder = async () => {
//     if (!selectedAddressId) {
//       toast({
//         title: "Address required",
//         description: "Please select a shipping address.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!paymentMethod) {
//       toast({
//         title: "Payment method required",
//         description: "Please select a payment method.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsPlacingOrder(true);
    
//     try {
//       const response = await apiRequest("POST", "/api/orders", {
//         items: orderPlaced,
//       deliveryAddress: selectedAddressId,
//       totalAmount: total,
//       // authToken: authToken,
//       paymentMethod: paymentMethod,
//       // paymentStatus: isPaymentSuccess == true ? 'paid' : 'pending',
//       });
      
//       const order = await response.json();
//       setOrderId(order.id);
//       setOrderPlaced(true);
//       refreshCart(); // Clear the cart after successful order
      
//       // Navigate to success page after a short delay
//       setTimeout(() => {
//         navigate(`/order-success/${order.id}`);
//       }, 2000);
      
//     } catch (error) {
//       console.error("Failed to place order:", error);
//       toast({
//         title: "Failed to place order",
//         description: "There was an error processing your order. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsPlacingOrder(false);
//     }
//   };

//   if (isAuthLoading || !isAuthenticated) {
//     return (
//       <div className="bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   if (orderPlaced) {
//     return (
//       <div className="bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
//           <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
//           <p className="text-gray-600 mb-6">
//             Your order has been placed and is being processed. Thank you for your purchase!
//           </p>
//           <p className="text-sm text-gray-500 mb-6">
//             Order ID: {orderId}
//           </p>
//           <Button 
//             className="bg-primary hover:bg-blue-600 w-full"
//             onClick={() => navigate(`/order-success/${orderId}`)}
//           >
//             View Order Details
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Helmet>
//         <title>Checkout | Ismart Grocery</title>
//         <meta name="description" content="Complete your purchase by selecting your shipping address and payment method." />
//       </Helmet>
      
//       <div className="bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
          
//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Main Checkout Form */}
//             <div className="flex-1">
//               {/* Shipping Address */}
//               <Card className="mb-6">
//                 <CardHeader>
//                   <div className="flex items-center">
//                     <Home className="mr-2 h-5 w-5 text-primary" />
//                     <CardTitle>Shipping Address</CardTitle>
//                   </div>
//                   <CardDescription>
//                     Select the address where you want your order delivered
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {isAddressesLoading ? (
//                     <div className="py-4 text-center">
//                       <RefreshCw className="h-6 w-6 text-primary animate-spin mx-auto mb-2" />
//                       <p className="text-gray-500">Loading your addresses...</p>
//                     </div>
//                   ) : addressesError ? (
//                     <div className="py-4 text-center">
//                       <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
//                       <p className="text-red-500">Failed to load addresses</p>
//                       <Button 
//                         variant="outline" 
//                         size="sm" 
//                         className="mt-2"
//                         onClick={() => refetchAddresses()}
//                       >
//                         Retry
//                       </Button>
//                     </div>
//                   ) : addresses.length === 0 ? (
//                     <div className="py-4 text-center">
//                       <p className="text-gray-500 mb-4">You don't have any addresses yet.</p>
//                       <Button 
//                         onClick={() => navigate("/addresses")}
//                         className="bg-primary hover:bg-blue-600"
//                       >
//                         <Plus className="mr-2 h-4 w-4" />
//                         Add New Address
//                       </Button>
//                     </div>
//                   ) : (
//                     <RadioGroup 
//                       value={selectedAddressId?.toString() || ""} 
//                       onValueChange={(value) => setSelectedAddressId(parseInt(value))}
//                       className="space-y-4"
//                     >
//                       {addresses.map((address) => (
//                         <div 
//                           key={address.id} 
//                           className={`border rounded-lg p-4 ${
//                             selectedAddressId === address.id ? 'border-primary bg-blue-50' : 'border-gray-200'
//                           }`}
//                         >
//                           <div className="flex items-start">
//                             <RadioGroupItem 
//                               value={address.id.toString()} 
//                               id={`address-${address.id}`} 
//                               className="mt-1"
//                             />
//                             <div className="ml-3">
//                               <Label 
//                                 htmlFor={`address-${address.id}`}
//                                 className="font-medium text-gray-900 flex items-center"
//                               >
//                                 {address.addressLine1}
//                                 {address.isDefault && (
//                                   <span className="ml-2 text-xs text-white bg-primary px-2 py-0.5 rounded-full">
//                                     Default
//                                   </span>
//                                 )}
//                               </Label>
//                               <div className="text-gray-500 text-sm mt-1">
//                                 {address.addressLine2 && <p>{address.addressLine2}</p>}
//                                 <p>
//                                   {address.city}, {address.state} {address.postalCode}
//                                 </p>
//                                 <p>{address.country}</p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </RadioGroup>
//                   )}
//                 </CardContent>
//                 <CardFooter>
//                   <Button 
//                     variant="outline" 
//                     className="w-full"
//                     onClick={() => navigate("/addresses")}
//                   >
//                     <Plus className="mr-2 h-4 w-4" />
//                     Add New Address
//                   </Button>
//                 </CardFooter>
//               </Card>
              
//               {/* Payment Method */}
//               <Card>
//                 <CardHeader>
//                   <div className="flex items-center">
//                     <CreditCard className="mr-2 h-5 w-5 text-primary" />
//                     <CardTitle>Payment Method</CardTitle>
//                   </div>
//                   <CardDescription>
//                     Select your preferred payment method
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <Tabs defaultValue="cod" onValueChange={setPaymentMethod}>
//                     <TabsList className="grid w-full grid-cols-2">
//                       <TabsTrigger value="cash-on-delivery" className="flex items-center">
//                         <DollarSign className="mr-2 h-4 w-4" />
//                         Cash on Delivery
//                       </TabsTrigger>
//                       <TabsTrigger value="credit-card" disabled className="flex items-center">
//                         <CreditCard className="mr-2 h-4 w-4" />
//                         Credit Card
//                       </TabsTrigger>
//                     </TabsList>
//                     <TabsContent value="cash-on-delivery" className="mt-4">
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-medium text-gray-800 mb-2">Cash on Delivery</h4>
//                         <p className="text-gray-600 text-sm">
//                           Pay with cash when your order is delivered. Please ensure someone is available to receive the package and make the payment.
//                         </p>
//                       </div>
//                     </TabsContent>
//                     <TabsContent value="credit-card" className="mt-4">
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-medium text-gray-800 mb-2">Credit Card Payment</h4>
//                         <p className="text-gray-600 text-sm">
//                           Credit card payment is currently unavailable.
//                         </p>
//                       </div>
//                     </TabsContent>
//                   </Tabs>
//                 </CardContent>
//               </Card>
//             </div>
            
//             {/* Order Summary */}
//             <div className="lg:w-96">
//               <Card className="sticky top-6">
//                 <CardHeader>
//                   <CardTitle>Order Summary</CardTitle>
//                   <CardDescription>
//                     Review your order details
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {/* Order Items */}
//                   <div className="space-y-3">
//                     {cart?.items.map((item) => (
//                       <div key={item.id} className="flex justify-between">
//                         <div className="flex items-start">
//                           <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
//                             <img 
//                               src={item.products.image_url} 
//                               alt={item.products.name} 
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <div className="ml-3">
//                             <p className="text-sm font-medium text-gray-900">{item.products.name}</p>
//                             <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
//                           </div>
//                         </div>
//                         <p className="text-sm font-medium text-gray-900">
//                           {formatCurrency(item.products.selling_price * item.quantity)}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
                  
//                   {/* Pricing Details */}
//                   <div className="border-t border-gray-200 pt-4 space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Subtotal</span>
//                       <span className="font-medium">{formatCurrency(subtotal)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Shipping</span>
//                       <span className="font-medium">
//                         {shipping === 0 ? "Free" : formatCurrency(shipping)}
//                       </span>
//                     </div>
//                     {/* <div className="flex justify-between">
//                       <span className="text-gray-600">Tax</span>
//                       <span className="font-medium">{formatCurrency(tax)}</span>
//                     </div> */}
//                   </div>
                  
//                   {/* Total */}
//                   <div className="border-t border-gray-200 pt-4">
//                     <div className="flex justify-between">
//                       <span className="text-lg font-bold">Total</span>
//                       <span className="text-lg font-bold">{formatCurrency(total)}</span>
//                     </div>
//                   </div>
                  
//                   {/* Delivery Information */}
//                   <div className="bg-gray-50 p-4 rounded-lg mt-4">
//                     <div className="flex items-center mb-2">
//                       <Truck className="h-5 w-5 text-primary mr-2" />
//                       <h4 className="font-medium text-gray-800">Delivery Information</h4>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       Your order will typically be delivered within 3-5 business days.
//                     </p>
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   <Button 
//                     className="w-full bg-primary hover:bg-blue-600"
//                     size="lg"
//                     onClick={handlePlaceOrder}
//                     disabled={isPlacingOrder || !selectedAddressId}
//                   >
//                     {isPlacingOrder ? (
//                       <>
//                         <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       "Place Order"
//                     )}
//                   </Button>
//                 </CardFooter>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Checkout;

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  DollarSign,
  Home,
  Plus,
  RefreshCw,
  Truck
} from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

type Address = {
  id: number;
  userId: number;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

const API_BASE_URL = "https://v0-next-js-and-supabase-app.vercel.app/api";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Fetch user addresses
  const { 
    data: addresses = [], 
    isLoading: isAddressesLoading,
    error: addressesError,
    refetch: refetchAddresses
  } = useQuery<Address[]>({
    queryKey: [`user-addresses-${user?.id}`],
    enabled: isAuthenticated && !!user?.id,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user?.id);

        if (error) throw error;

        return data.map(addr => ({
          id: addr.id,
          userId: addr.user_id,
          addressLine1: addr.address_line1,
          addressLine2: addr.address_line2,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postal_code,
          country: addr.country,
          isDefault: addr.is_default
        }));
      } catch (error) {
        console.error('Error fetching addresses:', error);
        throw error;
      }
    },
  });

  // Calculate order summary
  const subtotal = cart?.items.reduce((acc, item) => 
    acc + (item?.products?.selling_price * item?.quantity), 0) || 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const discount = 0;
  const total = subtotal + shipping - discount;

  // Set default address when addresses load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(address => address.isDefault);
      setSelectedAddressId(defaultAddress ? defaultAddress.id : addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with checkout.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthLoading, isAuthenticated, navigate, toast]);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      // toast({
      //   title: "Empty cart",
      //   description: "Your cart is empty. Add some items before checkout.",
      //   variant: "destructive",
      // });
      navigate("/cart");
    }
  }, [cart, navigate, toast]);

 

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast({
        title: "Address required",
        description: "Please select a shipping address.",
        variant: "destructive",
      });
      return;
    }
  
    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }
  
    setIsPlacingOrder(true);
    
    try {
      const order = await createOrder();
      setOrderId(order.id);
      setOrderPlaced(true);
      refreshCart();

      const { error: deleteCartError } = await supabase
      .from("carts")
      .delete()
      .eq("id", cart?.id);
      if(deleteCartError){
        console.log('cart delete failed',deleteCartError)
      }
      toast({
        title: "Order placed successfully!",
        description: "Your order has been confirmed.",
        variant: "default",
      });
  
      setTimeout(() => {
        navigate(`/order-success/${order.id}`);
      }, 2000);
      
    } catch (error) {
      console.error("Failed to place order:", error);
      toast({
        title: "Failed to place order",
        description: error instanceof Error ? error.message : "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };


  console.log('order-itemsss',cart)
  const createOrder = async () => {
    if (!selectedAddressId || !cart || !user) {
      throw new Error("Missing required data for order creation");
    }
  
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User not authenticated");
    }
  
    const orderItems = cart.items.map(item => ({
      product_id: item?.product_id,
      quantity: item.quantity,
      unit_price: item.products.selling_price,
    }));
  
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddress) {
      throw new Error("Selected address not found");
    }
  
    const deliveryAddress = `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}, ${selectedAddress.country}`;
  
    const { data: configData, error: configError } = await supabase
      .from("store_configurations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
  
    if (configError) {
      console.warn("Error fetching store configuration:", configError.message);
    }
  
    if (configData?.minimum_order_enabled && total < (configData.minimum_order_value || 0)) {
      throw new Error(`Minimum amount to place order is ${configData.minimum_order_value}`);
    }
  
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: session.user.id,
        total_amount: total,
        delivery_address: deliveryAddress,
        status: "pending"
      })
      .select()
      .single();
  
    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }
  
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));
  
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsWithOrderId);
  
    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      throw new Error(`Failed to add order items: ${itemsError.message}`);
    }
  
    // ✅ Delete the cart after successful order creation
    const { error: deleteCartError } = await supabase
      .from("carts")
      .delete()
      .eq("id", cart.id);
  
    if (deleteCartError) {
      console.warn("Order placed, but failed to delete cart:", deleteCartError.message);
      // optionally: notify admin or log this event
    }
  
    return order;
  };
  
  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed and is being processed. Thank you for your purchase!
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Order ID: {orderId}
          </p>
          <Button 
            className="bg-primary hover:bg-blue-600 w-full"
            onClick={() => navigate(`/order-success/${orderId}`)}
          >
            View Order Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | RENTXP</title>
        <meta name="description" content="Complete your purchase by selecting your shipping address and payment method." />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Checkout Form */}
            <div className="flex-1">
              {/* Shipping Address */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center">
                    <Home className="mr-2 h-5 w-5 text-primary" />
                    <CardTitle>Shipping Address</CardTitle>
                  </div>
                  <CardDescription>
                    Select the address where you want your order delivered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isAddressesLoading ? (
                    <div className="py-4 text-center">
                      <RefreshCw className="h-6 w-6 text-primary animate-spin mx-auto mb-2" />
                      <p className="text-gray-500">Loading your addresses...</p>
                    </div>
                  ) : addressesError ? (
                    <div className="py-4 text-center">
                      <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                      <p className="text-red-500">Failed to load addresses</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => refetchAddresses()}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="py-4 text-center">
                      <p className="text-gray-500 mb-4">You don't have any addresses yet.</p>
                      <Button 
                        onClick={() => navigate("/addresses")}
                        className="bg-primary hover:bg-blue-600"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Address
                      </Button>
                    </div>
                  ) : (
                    <RadioGroup 
                      value={selectedAddressId?.toString() || ""} 
                      onValueChange={(value) => setSelectedAddressId(parseInt(value))}
                      className="space-y-4"
                    >
                      {addresses.map((address) => (
                        <div 
                          key={address.id} 
                          className={`border rounded-lg p-4 ${
                            selectedAddressId === address.id ? 'border-primary bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-start">
                            <RadioGroupItem 
                              value={address.id.toString()} 
                              id={`address-${address.id}`} 
                              className="mt-1"
                            />
                            <div className="ml-3">
                              <Label 
                                htmlFor={`address-${address.id}`}
                                className="font-medium text-gray-900 flex items-center"
                              >
                                {address.addressLine1}
                                {address.isDefault && (
                                  <span className="ml-2 text-xs text-white bg-primary px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </Label>
                              <div className="text-gray-500 text-sm mt-1">
                                {address.addressLine2 && <p>{address.addressLine2}</p>}
                                <p>
                                  {address.city}, {address.state} {address.postalCode}
                                </p>
                                <p>{address.country}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/addresses")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Address
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-primary" />
                    <CardTitle>Payment Method</CardTitle>
                  </div>
                  <CardDescription>
                    Select your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="cod" onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="cash-on-delivery" className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Cash on Delivery
                      </TabsTrigger>
                      <TabsTrigger value="credit-card" disabled className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit Card
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="cash-on-delivery" className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Cash on Delivery</h4>
                        <p className="text-gray-600 text-sm">
                          Pay with cash when your order is delivered. Please ensure someone is available to receive the package and make the payment.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="credit-card" className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Credit Card Payment</h4>
                        <p className="text-gray-600 text-sm">
                          Credit card payment is currently unavailable.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-96">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    Review your order details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cart?.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={item.products.image_url} 
                              alt={item.products.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{item.products.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.products.selling_price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pricing Details */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? "Free" : formatCurrency(shipping)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  
                  {/* Delivery Information */}
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <div className="flex items-center mb-2">
                      <Truck className="h-5 w-5 text-primary mr-2" />
                      <h4 className="font-medium text-gray-800">Delivery Information</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your order will typically be delivered within 3-5 business days.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-primary hover:bg-blue-600"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || !selectedAddressId}
                  >
                    {isPlacingOrder ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;