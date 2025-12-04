// // // import { Button } from "@/components/ui/button";
// // // import {
// // //   Card,
// // //   CardContent,
// // //   CardDescription,
// // //   CardFooter,
// // //   CardHeader,
// // //   CardTitle,
// // // } from "@/components/ui/card";
// // // import { Label } from "@/components/ui/label";
// // // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // // import { useToast } from "@/hooks/use-toast";
// // // import { useAuth } from "@/hooks/useAuth";
// // // import { useCart } from "@/hooks/useCart";
// // // import { apiRequest } from "@/lib/queryClient";
// // // import { supabase } from "@/lib/supabase";
// // // import { formatCurrency } from "@/lib/utils";
// // // import { useQuery } from "@tanstack/react-query";
// // // import {
// // //   AlertCircle,
// // //   CheckCircle,
// // //   CreditCard,
// // //   DollarSign,
// // //   Home,
// // //   Plus,
// // //   RefreshCw,
// // //   Truck
// // // } from "lucide-react";
// // // import { useEffect, useState } from "react";
// // // import { Helmet } from "react-helmet";
// // // import { useNavigate } from "react-router-dom";

// // // type Address = {
// // //   id: number;
// // //   userId: number;
// // //   addressLine1: string;
// // //   addressLine2: string | null;
// // //   city: string;
// // //   state: string;
// // //   postalCode: string;
// // //   country: string;
// // //   isDefault: boolean;
// // // };

// // // const Checkout = () => {
// // //   const navigate = useNavigate();
// // //   const { cart, refreshCart } = useCart();
// // //   const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
// // //   const { toast } = useToast();
// // //   const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
// // //   const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
// // //   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
// // //   const [orderPlaced, setOrderPlaced] = useState(false);
// // //   const [orderId, setOrderId] = useState<string | null>(null);

// // //   // Fetch user addresses
// // //   const { 
// // //     data: addresses = [], 
// // //     isLoading: isAddressesLoading,
// // //     error: addressesError,
// // //     refetch: refetchAddresses
// // //   } = useQuery<Address[]>({
// // //     queryKey: [`user ${user?.id}`],
// // //     //  ['/api/users/addresses'],
// // //     enabled: isAuthenticated && !!user?.id,
// // //     queryFn: async () => {
// // //       try {
// // //         const { data, error } = await supabase
// // //           .from('user_addresses')
// // //           .select('*')
// // //           // .neq('id', slug)
// // //           .eq('user_id', user?.id)
// // //           // .limit(4);

// // //         if (error) throw error;

// // //         return data.map(p => ({
// // //           ...p,
// // //           id: p.id != null || p.address ? 
// // //             (p || [p.address]) : 
// // //             ['Inavlid Data']
// // //         }));
// // //       } catch (error) {
// // //         console.error('Error fetching related addresses:', error);
// // //         return [];
// // //       }
// // //     },
// // //   });

// // //   // Calculate order summary
// // //   const subtotal = cart?.items.reduce((acc, item) => 
// // //     acc + (item?.products?.selling_price * item?.quantity), 0) || 0;
// // //   const shipping = subtotal > 50 ? 0 : 5.99;
// // //   const discount = 0;
// // //   const total = subtotal + shipping - discount;

// // //   // Set default address when addresses load
// // //   useEffect(() => {
// // //     if (addresses.length > 0 && !selectedAddressId) {
// // //       const defaultAddress = addresses.find(address => address.isDefault);
// // //       setSelectedAddressId(defaultAddress ? defaultAddress.id : addresses[0].id);
// // //     }
// // //   }, [addresses, selectedAddressId]);

// // //   // Redirect to login if not authenticated
// // //   useEffect(() => {
// // //     if (!isAuthLoading && !isAuthenticated) {
// // //       toast({
// // //         title: "Authentication required",
// // //         description: "Please sign in to continue with checkout.",
// // //         variant: "destructive",
// // //       });
// // //       navigate("/");
// // //     }
// // //   }, [isAuthLoading, isAuthenticated, navigate, toast]);

// // //   // Redirect to cart if cart is empty
// // //   useEffect(() => {
// // //     if (!cart || cart.items.length === 0) {
// // //       toast({
// // //         title: "Empty cart",
// // //         description: "Your cart is empty. Add some items before checkout.",
// // //         variant: "destructive",
// // //       });
// // //       navigate("/cart");
// // //     }
// // //   }, [cart, navigate, toast]);

// // //   const handlePlaceOrder = async () => {
// // //     if (!selectedAddressId) {
// // //       toast({
// // //         title: "Address required",
// // //         description: "Please select a shipping address.",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     if (!paymentMethod) {
// // //       toast({
// // //         title: "Payment method required",
// // //         description: "Please select a payment method.",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     setIsPlacingOrder(true);
    
// // //     try {
// // //       const response = await apiRequest("POST", "/api/orders", {
// // //         items: orderPlaced,
// // //       deliveryAddress: selectedAddressId,
// // //       totalAmount: total,
// // //       // authToken: authToken,
// // //       paymentMethod: paymentMethod,
// // //       // paymentStatus: isPaymentSuccess == true ? 'paid' : 'pending',
// // //       });
      
// // //       const order = await response.json();
// // //       setOrderId(order.id);
// // //       setOrderPlaced(true);
// // //       refreshCart(); // Clear the cart after successful order
      
// // //       // Navigate to success page after a short delay
// // //       setTimeout(() => {
// // //         navigate(`/order-success/${order.id}`);
// // //       }, 2000);
      
// // //     } catch (error) {
// // //       console.error("Failed to place order:", error);
// // //       toast({
// // //         title: "Failed to place order",
// // //         description: "There was an error processing your order. Please try again.",
// // //         variant: "destructive",
// // //       });
// // //     } finally {
// // //       setIsPlacingOrder(false);
// // //     }
// // //   };

// // //   if (isAuthLoading || !isAuthenticated) {
// // //     return (
// // //       <div className="bg-gray-50 min-h-screen flex items-center justify-center">
// // //         <div className="text-center">
// // //           <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
// // //           <p className="text-gray-600">Checking authentication...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (orderPlaced) {
// // //     return (
// // //       <div className="bg-gray-50 min-h-screen flex items-center justify-center">
// // //         <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
// // //           <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
// // //           <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
// // //           <p className="text-gray-600 mb-6">
// // //             Your order has been placed and is being processed. Thank you for your purchase!
// // //           </p>
// // //           <p className="text-sm text-gray-500 mb-6">
// // //             Order ID: {orderId}
// // //           </p>
// // //           <Button 
// // //             className="bg-primary hover:bg-blue-600 w-full"
// // //             onClick={() => navigate(`/order-success/${orderId}`)}
// // //           >
// // //             View Order Details
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <>
// // //       <Helmet>
// // //         <title>Checkout | Ismart Grocery</title>
// // //         <meta name="description" content="Complete your purchase by selecting your shipping address and payment method." />
// // //       </Helmet>
      
// // //       <div className="bg-gray-50 py-8">
// // //         <div className="container mx-auto px-4">
// // //           <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
          
// // //           <div className="flex flex-col lg:flex-row gap-8">
// // //             {/* Main Checkout Form */}
// // //             <div className="flex-1">
// // //               {/* Shipping Address */}
// // //               <Card className="mb-6">
// // //                 <CardHeader>
// // //                   <div className="flex items-center">
// // //                     <Home className="mr-2 h-5 w-5 text-primary" />
// // //                     <CardTitle>Shipping Address</CardTitle>
// // //                   </div>
// // //                   <CardDescription>
// // //                     Select the address where you want your order delivered
// // //                   </CardDescription>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   {isAddressesLoading ? (
// // //                     <div className="py-4 text-center">
// // //                       <RefreshCw className="h-6 w-6 text-primary animate-spin mx-auto mb-2" />
// // //                       <p className="text-gray-500">Loading your addresses...</p>
// // //                     </div>
// // //                   ) : addressesError ? (
// // //                     <div className="py-4 text-center">
// // //                       <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
// // //                       <p className="text-red-500">Failed to load addresses</p>
// // //                       <Button 
// // //                         variant="outline" 
// // //                         size="sm" 
// // //                         className="mt-2"
// // //                         onClick={() => refetchAddresses()}
// // //                       >
// // //                         Retry
// // //                       </Button>
// // //                     </div>
// // //                   ) : addresses.length === 0 ? (
// // //                     <div className="py-4 text-center">
// // //                       <p className="text-gray-500 mb-4">You don't have any addresses yet.</p>
// // //                       <Button 
// // //                         onClick={() => navigate("/addresses")}
// // //                         className="bg-primary hover:bg-blue-600"
// // //                       >
// // //                         <Plus className="mr-2 h-4 w-4" />
// // //                         Add New Address
// // //                       </Button>
// // //                     </div>
// // //                   ) : (
// // //                     <RadioGroup 
// // //                       value={selectedAddressId?.toString() || ""} 
// // //                       onValueChange={(value) => setSelectedAddressId(parseInt(value))}
// // //                       className="space-y-4"
// // //                     >
// // //                       {addresses.map((address) => (
// // //                         <div 
// // //                           key={address.id} 
// // //                           className={`border rounded-lg p-4 ${
// // //                             selectedAddressId === address.id ? 'border-primary bg-blue-50' : 'border-gray-200'
// // //                           }`}
// // //                         >
// // //                           <div className="flex items-start">
// // //                             <RadioGroupItem 
// // //                               value={address.id.toString()} 
// // //                               id={`address-${address.id}`} 
// // //                               className="mt-1"
// // //                             />
// // //                             <div className="ml-3">
// // //                               <Label 
// // //                                 htmlFor={`address-${address.id}`}
// // //                                 className="font-medium text-gray-900 flex items-center"
// // //                               >
// // //                                 {address.addressLine1}
// // //                                 {address.isDefault && (
// // //                                   <span className="ml-2 text-xs text-white bg-primary px-2 py-0.5 rounded-full">
// // //                                     Default
// // //                                   </span>
// // //                                 )}
// // //                               </Label>
// // //                               <div className="text-gray-500 text-sm mt-1">
// // //                                 {address.addressLine2 && <p>{address.addressLine2}</p>}
// // //                                 <p>
// // //                                   {address.city}, {address.state} {address.postalCode}
// // //                                 </p>
// // //                                 <p>{address.country}</p>
// // //                               </div>
// // //                             </div>
// // //                           </div>
// // //                         </div>
// // //                       ))}
// // //                     </RadioGroup>
// // //                   )}
// // //                 </CardContent>
// // //                 <CardFooter>
// // //                   <Button 
// // //                     variant="outline" 
// // //                     className="w-full"
// // //                     onClick={() => navigate("/addresses")}
// // //                   >
// // //                     <Plus className="mr-2 h-4 w-4" />
// // //                     Add New Address
// // //                   </Button>
// // //                 </CardFooter>
// // //               </Card>
              
// // //               {/* Payment Method */}
// // //               <Card>
// // //                 <CardHeader>
// // //                   <div className="flex items-center">
// // //                     <CreditCard className="mr-2 h-5 w-5 text-primary" />
// // //                     <CardTitle>Payment Method</CardTitle>
// // //                   </div>
// // //                   <CardDescription>
// // //                     Select your preferred payment method
// // //                   </CardDescription>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <Tabs defaultValue="cod" onValueChange={setPaymentMethod}>
// // //                     <TabsList className="grid w-full grid-cols-2">
// // //                       <TabsTrigger value="cash-on-delivery" className="flex items-center">
// // //                         <DollarSign className="mr-2 h-4 w-4" />
// // //                         Cash on Delivery
// // //                       </TabsTrigger>
// // //                       <TabsTrigger value="credit-card" disabled className="flex items-center">
// // //                         <CreditCard className="mr-2 h-4 w-4" />
// // //                         Credit Card
// // //                       </TabsTrigger>
// // //                     </TabsList>
// // //                     <TabsContent value="cash-on-delivery" className="mt-4">
// // //                       <div className="bg-gray-50 p-4 rounded-lg">
// // //                         <h4 className="font-medium text-gray-800 mb-2">Cash on Delivery</h4>
// // //                         <p className="text-gray-600 text-sm">
// // //                           Pay with cash when your order is delivered. Please ensure someone is available to receive the package and make the payment.
// // //                         </p>
// // //                       </div>
// // //                     </TabsContent>
// // //                     <TabsContent value="credit-card" className="mt-4">
// // //                       <div className="bg-gray-50 p-4 rounded-lg">
// // //                         <h4 className="font-medium text-gray-800 mb-2">Credit Card Payment</h4>
// // //                         <p className="text-gray-600 text-sm">
// // //                           Credit card payment is currently unavailable.
// // //                         </p>
// // //                       </div>
// // //                     </TabsContent>
// // //                   </Tabs>
// // //                 </CardContent>
// // //               </Card>
// // //             </div>
            
// // //             {/* Order Summary */}
// // //             <div className="lg:w-96">
// // //               <Card className="sticky top-6">
// // //                 <CardHeader>
// // //                   <CardTitle>Order Summary</CardTitle>
// // //                   <CardDescription>
// // //                     Review your order details
// // //                   </CardDescription>
// // //                 </CardHeader>
// // //                 <CardContent className="space-y-4">
// // //                   {/* Order Items */}
// // //                   <div className="space-y-3">
// // //                     {cart?.items.map((item) => (
// // //                       <div key={item.id} className="flex justify-between">
// // //                         <div className="flex items-start">
// // //                           <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
// // //                             <img 
// // //                               src={item.products.image_url} 
// // //                               alt={item.products.name} 
// // //                               className="w-full h-full object-cover"
// // //                             />
// // //                           </div>
// // //                           <div className="ml-3">
// // //                             <p className="text-sm font-medium text-gray-900">{item.products.name}</p>
// // //                             <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
// // //                           </div>
// // //                         </div>
// // //                         <p className="text-sm font-medium text-gray-900">
// // //                           {formatCurrency(item.products.selling_price * item.quantity)}
// // //                         </p>
// // //                       </div>
// // //                     ))}
// // //                   </div>
                  
// // //                   {/* Pricing Details */}
// // //                   <div className="border-t border-gray-200 pt-4 space-y-2">
// // //                     <div className="flex justify-between">
// // //                       <span className="text-gray-600">Subtotal</span>
// // //                       <span className="font-medium">{formatCurrency(subtotal)}</span>
// // //                     </div>
// // //                     <div className="flex justify-between">
// // //                       <span className="text-gray-600">Shipping</span>
// // //                       <span className="font-medium">
// // //                         {shipping === 0 ? "Free" : formatCurrency(shipping)}
// // //                       </span>
// // //                     </div>
// // //                     {/* <div className="flex justify-between">
// // //                       <span className="text-gray-600">Tax</span>
// // //                       <span className="font-medium">{formatCurrency(tax)}</span>
// // //                     </div> */}
// // //                   </div>
                  
// // //                   {/* Total */}
// // //                   <div className="border-t border-gray-200 pt-4">
// // //                     <div className="flex justify-between">
// // //                       <span className="text-lg font-bold">Total</span>
// // //                       <span className="text-lg font-bold">{formatCurrency(total)}</span>
// // //                     </div>
// // //                   </div>
                  
// // //                   {/* Delivery Information */}
// // //                   <div className="bg-gray-50 p-4 rounded-lg mt-4">
// // //                     <div className="flex items-center mb-2">
// // //                       <Truck className="h-5 w-5 text-primary mr-2" />
// // //                       <h4 className="font-medium text-gray-800">Delivery Information</h4>
// // //                     </div>
// // //                     <p className="text-sm text-gray-600">
// // //                       Your order will typically be delivered within 3-5 business days.
// // //                     </p>
// // //                   </div>
// // //                 </CardContent>
// // //                 <CardFooter>
// // //                   <Button 
// // //                     className="w-full bg-primary hover:bg-blue-600"
// // //                     size="lg"
// // //                     onClick={handlePlaceOrder}
// // //                     disabled={isPlacingOrder || !selectedAddressId}
// // //                   >
// // //                     {isPlacingOrder ? (
// // //                       <>
// // //                         <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
// // //                         Processing...
// // //                       </>
// // //                     ) : (
// // //                       "Place Order"
// // //                     )}
// // //                   </Button>
// // //                 </CardFooter>
// // //               </Card>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default Checkout;

// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Label } from "@/components/ui/label";
// // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { useToast } from "@/hooks/use-toast";
// // import { useAuth } from "@/hooks/useAuth";
// // import { useCart } from "@/hooks/useCart";
// // import { supabase } from "@/lib/supabase";
// // import { formatCurrency } from "@/lib/utils";
// // import { useQuery } from "@tanstack/react-query";
// // import {
// //   AlertCircle,
// //   CheckCircle,
// //   CreditCard,
// //   DollarSign,
// //   Home,
// //   Plus,
// //   RefreshCw,
// //   Truck
// // } from "lucide-react";
// // import { useEffect, useState } from "react";
// // import { Helmet } from "react-helmet";
// // import { useNavigate } from "react-router-dom";

// // type Address = {
// //   id: number;
// //   userId: number;
// //   addressLine1: string;
// //   addressLine2: string | null;
// //   city: string;
// //   state: string;
// //   postalCode: string;
// //   country: string;
// //   isDefault: boolean;
// // };

// // const API_BASE_URL = "https://v0-next-js-and-supabase-app.vercel.app/api";

// // const Checkout = () => {
// //   const navigate = useNavigate();
// //   const { cart, refreshCart } = useCart();
// //   const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
// //   const { toast } = useToast();
// //   const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
// //   const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
// //   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
// //   const [orderPlaced, setOrderPlaced] = useState(false);
// //   const [orderId, setOrderId] = useState<string | null>(null);

// //   // Fetch user addresses
// //   const { 
// //     data: addresses = [], 
// //     isLoading: isAddressesLoading,
// //     error: addressesError,
// //     refetch: refetchAddresses
// //   } = useQuery<Address[]>({
// //     queryKey: [`user-addresses-${user?.id}`],
// //     enabled: isAuthenticated && !!user?.id,
// //     queryFn: async () => {
// //       try {
// //         const { data, error } = await supabase
// //           .from('user_addresses')
// //           .select('*')
// //           .eq('user_id', user?.id);

// //         if (error) throw error;

// //         return data.map(addr => ({
// //           id: addr.id,
// //           userId: addr.user_id,
// //           addressLine1: addr.address_line1,
// //           addressLine2: addr.address_line2,
// //           city: addr.city,
// //           state: addr.state,
// //           postalCode: addr.postal_code,
// //           country: addr.country,
// //           isDefault: addr.is_default
// //         }));
// //       } catch (error) {
// //         console.error('Error fetching addresses:', error);
// //         throw error;
// //       }
// //     },
// //   });

// //   // Calculate order summary
// //   const subtotal = cart?.items.reduce((acc, item) => 
// //     acc + (item?.products?.selling_price * item?.quantity), 0) || 0;
// //   const shipping = subtotal > 50 ? 0 : 5.99;
// //   const discount = 0;
// //   const total = subtotal + shipping - discount;

// //   // Set default address when addresses load
// //   useEffect(() => {
// //     if (addresses.length > 0 && !selectedAddressId) {
// //       const defaultAddress = addresses.find(address => address.isDefault);
// //       setSelectedAddressId(defaultAddress ? defaultAddress.id : addresses[0].id);
// //     }
// //   }, [addresses, selectedAddressId]);

// //   // Redirect to login if not authenticated
// //   useEffect(() => {
// //     if (!isAuthLoading && !isAuthenticated) {
// //       toast({
// //         title: "Authentication required",
// //         description: "Please sign in to continue with checkout.",
// //         variant: "destructive",
// //       });
// //       navigate("/");
// //     }
// //   }, [isAuthLoading, isAuthenticated, navigate, toast]);

// //   // Redirect to cart if cart is empty
// //   useEffect(() => {
// //     if (!cart || cart.items.length === 0) {
// //       // toast({
// //       //   title: "Empty cart",
// //       //   description: "Your cart is empty. Add some items before checkout.",
// //       //   variant: "destructive",
// //       // });
// //       navigate("/cart");
// //     }
// //   }, [cart, navigate, toast]);

 

// //   const handlePlaceOrder = async () => {
// //     if (!selectedAddressId) {
// //       toast({
// //         title: "Address required",
// //         description: "Please select a shipping address.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }
  
// //     if (!paymentMethod) {
// //       toast({
// //         title: "Payment method required",
// //         description: "Please select a payment method.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }
  
// //     setIsPlacingOrder(true);
    
// //     try {
// //       const order = await createOrder();
// //       setOrderId(order.id);
// //       setOrderPlaced(true);
// //       refreshCart();

// //       const { error: deleteCartError } = await supabase
// //       .from("carts")
// //       .delete()
// //       .eq("id", cart?.id);
// //       if(deleteCartError){
// //         console.log('cart delete failed',deleteCartError)
// //       }
// //       toast({
// //         title: "Order placed successfully!",
// //         description: "Your order has been confirmed.",
// //         variant: "default",
// //       });
  
// //       setTimeout(() => {
// //         navigate(`/order-success/${order.id}`);
// //       }, 2000);
      
// //     } catch (error) {
// //       console.error("Failed to place order:", error);
// //       toast({
// //         title: "Failed to place order",
// //         description: error instanceof Error ? error.message : "There was an error processing your order. Please try again.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsPlacingOrder(false);
// //     }
// //   };


// //   console.log('order-itemsss',cart)
// //   const createOrder = async () => {
// //     if (!selectedAddressId || !cart || !user) {
// //       throw new Error("Missing required data for order creation");
// //     }
  
// //     const { data: { session } } = await supabase.auth.getSession();
// //     if (!session) {
// //       throw new Error("User not authenticated");
// //     }
  
// //     const orderItems = cart.items.map(item => ({
// //       product_id: item?.product_id,
// //       quantity: item.quantity,
// //       unit_price: item.products.selling_price,
// //     }));
  
// //     const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
// //     if (!selectedAddress) {
// //       throw new Error("Selected address not found");
// //     }
  
// //     const deliveryAddress = `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}, ${selectedAddress.country}`;
  
// //     const { data: configData, error: configError } = await supabase
// //       .from("store_configurations")
// //       .select("*")
// //       .order("created_at", { ascending: false })
// //       .limit(1)
// //       .single();
  
// //     if (configError) {
// //       console.warn("Error fetching store configuration:", configError.message);
// //     }
  
// //     if (configData?.minimum_order_enabled && total < (configData.minimum_order_value || 0)) {
// //       throw new Error(`Minimum amount to place order is ${configData.minimum_order_value}`);
// //     }
  
// //     const { data: order, error: orderError } = await supabase
// //       .from("orders")
// //       .insert({
// //         customer_id: session.user.id,
// //         total_amount: total,
// //         delivery_address: deliveryAddress,
// //         status: "pending"
// //       })
// //       .select()
// //       .single();
  
// //     if (orderError) {
// //       throw new Error(`Failed to create order: ${orderError.message}`);
// //     }
  
// //     const orderItemsWithOrderId = orderItems.map(item => ({
// //       ...item,
// //       order_id: order.id,
// //     }));
  
// //     const { error: itemsError } = await supabase
// //       .from("order_items")
// //       .insert(orderItemsWithOrderId);
  
// //     if (itemsError) {
// //       await supabase.from("orders").delete().eq("id", order.id);
// //       throw new Error(`Failed to add order items: ${itemsError.message}`);
// //     }
  
// //     // ✅ Delete the cart after successful order creation
// //     const { error: deleteCartError } = await supabase
// //       .from("carts")
// //       .delete()
// //       .eq("id", cart.id);
  
// //     if (deleteCartError) {
// //       console.warn("Order placed, but failed to delete cart:", deleteCartError.message);
// //       // optionally: notify admin or log this event
// //     }
  
// //     return order;
// //   };
  
// //   if (isAuthLoading || !isAuthenticated) {
// //     return (
// //       <div className="bg-gray-50 min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
// //           <p className="text-gray-600">Checking authentication...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (orderPlaced) {
// //     return (
// //       <div className="bg-gray-50 min-h-screen flex items-center justify-center">
// //         <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
// //           <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
// //           <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
// //           <p className="text-gray-600 mb-6">
// //             Your order has been placed and is being processed. Thank you for your purchase!
// //           </p>
// //           <p className="text-sm text-gray-500 mb-6">
// //             Order ID: {orderId}
// //           </p>
// //           <Button 
// //             className="bg-primary hover:bg-blue-600 w-full"
// //             onClick={() => navigate(`/order-success/${orderId}`)}
// //           >
// //             View Order Details
// //           </Button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       <Helmet>
// //         <title>Checkout | RENTXP</title>
// //         <meta name="description" content="Complete your purchase by selecting your shipping address and payment method." />
// //       </Helmet>
      
// //       <div className="bg-gray-50 py-8">
// //         <div className="container mx-auto px-4">
// //           <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
          
// //           <div className="flex flex-col lg:flex-row gap-8">
// //             {/* Main Checkout Form */}
// //             <div className="flex-1">
// //               {/* Shipping Address */}
// //               <Card className="mb-6">
// //                 <CardHeader>
// //                   <div className="flex items-center">
// //                     <Home className="mr-2 h-5 w-5 text-primary" />
// //                     <CardTitle>Shipping Address</CardTitle>
// //                   </div>
// //                   <CardDescription>
// //                     Select the address where you want your order delivered
// //                   </CardDescription>
// //                 </CardHeader>
// //                 <CardContent>
// //                   {isAddressesLoading ? (
// //                     <div className="py-4 text-center">
// //                       <RefreshCw className="h-6 w-6 text-primary animate-spin mx-auto mb-2" />
// //                       <p className="text-gray-500">Loading your addresses...</p>
// //                     </div>
// //                   ) : addressesError ? (
// //                     <div className="py-4 text-center">
// //                       <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
// //                       <p className="text-red-500">Failed to load addresses</p>
// //                       <Button 
// //                         variant="outline" 
// //                         size="sm" 
// //                         className="mt-2"
// //                         onClick={() => refetchAddresses()}
// //                       >
// //                         Retry
// //                       </Button>
// //                     </div>
// //                   ) : addresses.length === 0 ? (
// //                     <div className="py-4 text-center">
// //                       <p className="text-gray-500 mb-4">You don't have any addresses yet.</p>
// //                       <Button 
// //                         onClick={() => navigate("/addresses")}
// //                         className="bg-primary hover:bg-blue-600"
// //                       >
// //                         <Plus className="mr-2 h-4 w-4" />
// //                         Add New Address
// //                       </Button>
// //                     </div>
// //                   ) : (
// //                     <RadioGroup 
// //                       value={selectedAddressId?.toString() || ""} 
// //                       onValueChange={(value) => setSelectedAddressId(parseInt(value))}
// //                       className="space-y-4"
// //                     >
// //                       {addresses.map((address) => (
// //                         <div 
// //                           key={address.id} 
// //                           className={`border rounded-lg p-4 ${
// //                             selectedAddressId === address.id ? 'border-primary bg-blue-50' : 'border-gray-200'
// //                           }`}
// //                         >
// //                           <div className="flex items-start">
// //                             <RadioGroupItem 
// //                               value={address.id.toString()} 
// //                               id={`address-${address.id}`} 
// //                               className="mt-1"
// //                             />
// //                             <div className="ml-3">
// //                               <Label 
// //                                 htmlFor={`address-${address.id}`}
// //                                 className="font-medium text-gray-900 flex items-center"
// //                               >
// //                                 {address.addressLine1}
// //                                 {address.isDefault && (
// //                                   <span className="ml-2 text-xs text-white bg-primary px-2 py-0.5 rounded-full">
// //                                     Default
// //                                   </span>
// //                                 )}
// //                               </Label>
// //                               <div className="text-gray-500 text-sm mt-1">
// //                                 {address.addressLine2 && <p>{address.addressLine2}</p>}
// //                                 <p>
// //                                   {address.city}, {address.state} {address.postalCode}
// //                                 </p>
// //                                 <p>{address.country}</p>
// //                               </div>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </RadioGroup>
// //                   )}
// //                 </CardContent>
// //                 <CardFooter>
// //                   <Button 
// //                     variant="outline" 
// //                     className="w-full"
// //                     onClick={() => navigate("/addresses")}
// //                   >
// //                     <Plus className="mr-2 h-4 w-4" />
// //                     Add New Address
// //                   </Button>
// //                 </CardFooter>
// //               </Card>
              
// //               {/* Payment Method */}
// //               <Card>
// //                 <CardHeader>
// //                   <div className="flex items-center">
// //                     <CreditCard className="mr-2 h-5 w-5 text-primary" />
// //                     <CardTitle>Payment Method</CardTitle>
// //                   </div>
// //                   <CardDescription>
// //                     Select your preferred payment method
// //                   </CardDescription>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <Tabs defaultValue="cod" onValueChange={setPaymentMethod}>
// //                     <TabsList className="grid w-full grid-cols-2">
// //                       <TabsTrigger value="cash-on-delivery" className="flex items-center">
// //                         <DollarSign className="mr-2 h-4 w-4" />
// //                         Cash on Delivery
// //                       </TabsTrigger>
// //                       <TabsTrigger value="credit-card" disabled className="flex items-center">
// //                         <CreditCard className="mr-2 h-4 w-4" />
// //                         Credit Card
// //                       </TabsTrigger>
// //                     </TabsList>
// //                     <TabsContent value="cash-on-delivery" className="mt-4">
// //                       <div className="bg-gray-50 p-4 rounded-lg">
// //                         <h4 className="font-medium text-gray-800 mb-2">Cash on Delivery</h4>
// //                         <p className="text-gray-600 text-sm">
// //                           Pay with cash when your order is delivered. Please ensure someone is available to receive the package and make the payment.
// //                         </p>
// //                       </div>
// //                     </TabsContent>
// //                     <TabsContent value="credit-card" className="mt-4">
// //                       <div className="bg-gray-50 p-4 rounded-lg">
// //                         <h4 className="font-medium text-gray-800 mb-2">Credit Card Payment</h4>
// //                         <p className="text-gray-600 text-sm">
// //                           Credit card payment is currently unavailable.
// //                         </p>
// //                       </div>
// //                     </TabsContent>
// //                   </Tabs>
// //                 </CardContent>
// //               </Card>
// //             </div>
            
// //             {/* Order Summary */}
// //             <div className="lg:w-96">
// //               <Card className="sticky top-6">
// //                 <CardHeader>
// //                   <CardTitle>Order Summary</CardTitle>
// //                   <CardDescription>
// //                     Review your order details
// //                   </CardDescription>
// //                 </CardHeader>
// //                 <CardContent className="space-y-4">
// //                   {/* Order Items */}
// //                   <div className="space-y-3">
// //                     {cart?.items.map((item) => (
// //                       <div key={item.id} className="flex justify-between">
// //                         <div className="flex items-start">
// //                           <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
// //                             <img 
// //                               src={item.products.image_url} 
// //                               alt={item.products.name} 
// //                               className="w-full h-full object-cover"
// //                             />
// //                           </div>
// //                           <div className="ml-3">
// //                             <p className="text-sm font-medium text-gray-900">{item.products.name}</p>
// //                             <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
// //                           </div>
// //                         </div>
// //                         <p className="text-sm font-medium text-gray-900">
// //                           {formatCurrency(item.products.selling_price * item.quantity)}
// //                         </p>
// //                       </div>
// //                     ))}
// //                   </div>
                  
// //                   {/* Pricing Details */}
// //                   <div className="border-t border-gray-200 pt-4 space-y-2">
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">Subtotal</span>
// //                       <span className="font-medium">{formatCurrency(subtotal)}</span>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">Shipping</span>
// //                       <span className="font-medium">
// //                         {shipping === 0 ? "Free" : formatCurrency(shipping)}
// //                       </span>
// //                     </div>
// //                   </div>
                  
// //                   {/* Total */}
// //                   <div className="border-t border-gray-200 pt-4">
// //                     <div className="flex justify-between">
// //                       <span className="text-lg font-bold">Total</span>
// //                       <span className="text-lg font-bold">{formatCurrency(total)}</span>
// //                     </div>
// //                   </div>
                  
// //                   {/* Delivery Information */}
// //                   <div className="bg-gray-50 p-4 rounded-lg mt-4">
// //                     <div className="flex items-center mb-2">
// //                       <Truck className="h-5 w-5 text-primary mr-2" />
// //                       <h4 className="font-medium text-gray-800">Delivery Information</h4>
// //                     </div>
// //                     <p className="text-sm text-gray-600">
// //                       Your order will typically be delivered within 3-5 business days.
// //                     </p>
// //                   </div>
// //                 </CardContent>
// //                 <CardFooter>
// //                   <Button 
// //                     className="w-full bg-primary hover:bg-blue-600"
// //                     size="lg"
// //                     onClick={handlePlaceOrder}
// //                     disabled={isPlacingOrder || !selectedAddressId}
// //                   >
// //                     {isPlacingOrder ? (
// //                       <>
// //                         <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
// //                         Processing...
// //                       </>
// //                     ) : (
// //                       "Place Order"
// //                     )}
// //                   </Button>
// //                 </CardFooter>
// //               </Card>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default Checkout;

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

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

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
//   const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);

//   // Fetch user addresses
//   const { 
//     data: addresses = [], 
//     isLoading: isAddressesLoading,
//     error: addressesError,
//     refetch: refetchAddresses
//   } = useQuery<Address[]>({
//     queryKey: [`user-addresses-${user?.id}`],
//     enabled: isAuthenticated && !!user?.id,
//     queryFn: async () => {
//       try {
//         const { data, error } = await supabase
//           .from('user_addresses')
//           .select('*')
//           .eq('user_id', user?.id);

//         if (error) throw error;

//         return data.map(addr => ({
//           id: addr.id,
//           userId: addr.user_id,
//           addressLine1: addr.address_line1,
//           addressLine2: addr.address_line2,
//           city: addr.city,
//           state: addr.state,
//           postalCode: addr.postal_code,
//           country: addr.country,
//           isDefault: addr.is_default
//         }));
//       } catch (error) {
//         console.error('Error fetching addresses:', error);
//         throw error;
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
//       navigate("/cart");
//     }
//   }, [cart, navigate, toast]);

//   // Load Razorpay script
//   useEffect(() => {
//     const loadRazorpay = () => {
//       return new Promise((resolve) => {
//         if (window.Razorpay) {
//           resolve(true);
//           return;
//         }

//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.async = true;
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });
//     };

//     if (paymentMethod === 'razorpay') {
//       loadRazorpay();
//     }
//   }, [paymentMethod]);

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

//     if (paymentMethod === 'razorpay') {
//       await handleRazorpayPayment();
//     } else {
//       await handleCashOnDelivery();
//     }
//   };

//   const handleCashOnDelivery = async () => {
//     setIsPlacingOrder(true);
    
//     try {
//       const order = await createOrder('pending', 'cash-on-delivery');
//       setOrderId(order.id);
//       setOrderPlaced(true);
//       refreshCart();

//       const { error: deleteCartError } = await supabase
//         .from("carts")
//         .delete()
//         .eq("id", cart?.id);
      
//       if (deleteCartError) {
//         console.log('Cart delete failed', deleteCartError);
//       }

//       toast({
//         title: "Order placed successfully!",
//         description: "Your order has been confirmed.",
//         variant: "default",
//       });

//       setTimeout(() => {
//         navigate(`/order-success/${order.id}`);
//       }, 2000);
      
//     } catch (error) {
//       console.error("Failed to place order:", error);
//       toast({
//         title: "Failed to place order",
//         description: error instanceof Error ? error.message : "There was an error processing your order. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsPlacingOrder(false);
//     }
//   };

//   const handleRazorpayPayment = async () => {
//     if (!window.Razorpay) {
//       toast({
//         title: "Payment gateway not loaded",
//         description: "Please wait for the payment gateway to load and try again.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsRazorpayLoading(true);

//     try {
//       // Create order first with pending status
//       const order = await createOrder('pending', 'razorpay');
      
//       // Create Razorpay order
//       const { data: razorpayOrder, error: razorpayError } = await supabase.functions.invoke('create-razorpay-order', {
//         body: { 
//           amount: Math.round(total * 100), // Convert to paise
//           currency: 'INR',
//           receipt: order.id
//         }
//       });

//       if (razorpayError) {
//         throw new Error(`Failed to create Razorpay order: ${razorpayError.message}`);
//       }

//       const options = {
//         key: "rzp_test_RkOZhJqDvQpZWQ",
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//         name: "RENTXP",
//         description: "Order Payment",
//         order_id: razorpayOrder.id,
//         handler: async (response: any) => {
//           try {
//             // Verify payment on server
//             const { data: verification, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
//               body: {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature
//               }
//             });

//             if (verifyError || !verification?.success) {
//               throw new Error('Payment verification failed');
//             }

//             // Update order status to paid
//             await updateOrderStatus(order.id, 'paid', response.razorpay_payment_id);
            
//             setOrderId(order.id);
//             setOrderPlaced(true);
//             refreshCart();

//             // Delete cart
//             await supabase.from("carts").delete().eq("id", cart?.id);

//             toast({
//               title: "Payment Successful!",
//               description: "Your order has been placed successfully.",
//               variant: "default",
//             });

//             setTimeout(() => {
//               navigate(`/order-success/${order.id}`);
//             }, 2000);

//           } catch (error) {
//             console.error("Payment verification failed:", error);
//             toast({
//               title: "Payment Failed",
//               description: "Payment verification failed. Please try again.",
//               variant: "destructive",
//             });
//             // Update order status to failed
//             await updateOrderStatus(order.id, 'failed');
//           }
//         },
//         prefill: {
//           name: user?.username || '',
//           email: user?.email || '',
//           contact: user?.phone || ''
//         },
//         theme: {
//           color: "#3B82F6"
//         },
//         modal: {
//           ondismiss: async () => {
//             // Update order status to cancelled if user closes the modal
//             await updateOrderStatus(order.id, 'cancelled');
//             setIsRazorpayLoading(false);
//           }
//         }
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();

//     } catch (error) {
//       console.error("Razorpay payment failed:", error);
//       toast({
//         title: "Payment Failed",
//         description: error instanceof Error ? error.message : "There was an error processing your payment.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsRazorpayLoading(false);
//     }
//   };

//   const createOrder = async (status: string, paymentMethod: string) => {
//     if (!selectedAddressId || !cart || !user) {
//       throw new Error("Missing required data for order creation");
//     }

//     const { data: { session } } = await supabase.auth.getSession();
//     if (!session) {
//       throw new Error("User not authenticated");
//     }

//     const orderItems = cart.items.map(item => ({
//       product_id: item?.product_id,
//       quantity: item.quantity,
//       unit_price: item.products.selling_price,
//     }));

//     const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
//     if (!selectedAddress) {
//       throw new Error("Selected address not found");
//     }

//     const deliveryAddress = `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}, ${selectedAddress.country}`;

//     const { data: configData, error: configError } = await supabase
//       .from("store_configurations")
//       .select("*")
//       .order("created_at", { ascending: false })
//       .limit(1)
//       .single();

//     if (configError) {
//       console.warn("Error fetching store configuration:", configError.message);
//     }

//     if (configData?.minimum_order_enabled && total < (configData.minimum_order_value || 0)) {
//       throw new Error(`Minimum amount to place order is ${configData.minimum_order_value}`);
//     }

//     const { data: order, error: orderError } = await supabase
//       .from("orders")
//       .insert({
//         customer_id: session.user.id,
//         total_amount: total,
//         delivery_address: deliveryAddress,
//         status: status,
//         payment_method: paymentMethod,
//         payment_status: paymentMethod === 'cash-on-delivery' ? 'pending' : status
//       })
//       .select()
//       .single();

//     if (orderError) {
//       throw new Error(`Failed to create order: ${orderError.message}`);
//     }

//     const orderItemsWithOrderId = orderItems.map(item => ({
//       ...item,
//       order_id: order.id,
//     }));

//     const { error: itemsError } = await supabase
//       .from("order_items")
//       .insert(orderItemsWithOrderId);

//     if (itemsError) {
//       await supabase.from("orders").delete().eq("id", order.id);
//       throw new Error(`Failed to add order items: ${itemsError.message}`);
//     }

//     return order;
//   };

//   const updateOrderStatus = async (orderId: string, status: string, paymentId?: string) => {
//     const updateData: any = {
//       status: status,
//       payment_status: status === 'paid' ? 'paid' : status
//     };

//     if (paymentId) {
//       updateData.payment_id = paymentId;
//     }

//     const { error } = await supabase
//       .from("orders")
//       .update(updateData)
//       .eq("id", orderId);

//     if (error) {
//       console.error("Failed to update order status:", error);
//       throw error;
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

//   const isProcessing = isPlacingOrder || isRazorpayLoading;

//   return (
//     <>
//       <Helmet>
//         <title>Checkout | RENTXP</title>
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
//                   <Tabs defaultValue="cash-on-delivery" onValueChange={setPaymentMethod}>
//                     <TabsList className="grid w-full grid-cols-2">
//                       <TabsTrigger value="cash-on-delivery" className="flex items-center">
//                         <DollarSign className="mr-2 h-4 w-4" />
//                         Cash on Delivery
//                       </TabsTrigger>
//                       <TabsTrigger value="razorpay" className="flex items-center">
//                         <CreditCard className="mr-2 h-4 w-4" />
//                         Razorpay
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
//                     <TabsContent value="razorpay" className="mt-4">
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-medium text-gray-800 mb-2">Secure Online Payment</h4>
//                         <p className="text-gray-600 text-sm">
//                           Pay securely using Razorpay. You can use credit/debit cards, UPI, net banking, and other payment methods.
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
//                     disabled={isProcessing || !selectedAddressId}
//                   >
//                     {isProcessing ? (
//                       <>
//                         <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                         {paymentMethod === 'razorpay' ? 'Opening Payment...' : 'Processing...'}
//                       </>
//                     ) : (
//                       paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'
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

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

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
//   const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);

//   // Fetch user addresses
//   const { 
//     data: addresses = [], 
//     isLoading: isAddressesLoading,
//     error: addressesError,
//     refetch: refetchAddresses
//   } = useQuery<Address[]>({
//     queryKey: [`user-addresses-${user?.id}`],
//     enabled: isAuthenticated && !!user?.id,
//     queryFn: async () => {
//       try {
//         const { data, error } = await supabase
//           .from('user_addresses')
//           .select('*')
//           .eq('user_id', user?.id);

//         if (error) throw error;

//         return data.map(addr => ({
//           id: addr.id,
//           userId: addr.user_id,
//           addressLine1: addr.address_line1,
//           addressLine2: addr.address_line2,
//           city: addr.city,
//           state: addr.state,
//           postalCode: addr.postal_code,
//           country: addr.country,
//           isDefault: addr.is_default
//         }));
//       } catch (error) {
//         console.error('Error fetching addresses:', error);
//         throw error;
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
//       navigate("/cart");
//     }
//   }, [cart, navigate, toast]);

//   // Load Razorpay script
//   useEffect(() => {
//     const loadRazorpay = () => {
//       return new Promise((resolve) => {
//         if (window.Razorpay) {
//           resolve(true);
//           return;
//         }

//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.async = true;
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });
//     };

//     if (paymentMethod === 'razorpay') {
//       loadRazorpay();
//     }
//   }, [paymentMethod]);

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

//     if (paymentMethod === 'razorpay') {
//       await handleRazorpayPayment();
//     } else {
//       await handleCashOnDelivery();
//     }
//   };

//   const handleCashOnDelivery = async () => {
//     setIsPlacingOrder(true);
    
//     try {
//       const order = await createOrder('pending', 'cash-on-delivery');
//       setOrderId(order.id);
//       setOrderPlaced(true);
//       refreshCart();

//       const { error: deleteCartError } = await supabase
//         .from("carts")
//         .delete()
//         .eq("id", cart?.id);
      
//       if (deleteCartError) {
//         console.log('Cart delete failed', deleteCartError);
//       }

//       toast({
//         title: "Order placed successfully!",
//         description: "Your order has been confirmed.",
//         variant: "default",
//       });

//       setTimeout(() => {
//         navigate(`/order-success/${order.id}`);
//       }, 2000);
      
//     } catch (error) {
//       console.error("Failed to place order:", error);
//       toast({
//         title: "Failed to place order",
//         description: error instanceof Error ? error.message : "There was an error processing your order. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsPlacingOrder(false);
//     }
//   };

//   // In your handleRazorpayPayment function, update the error handling:

// const handleRazorpayPayment = async () => {
//   if (!window.Razorpay) {
//     toast({
//       title: "Payment gateway not loaded",
//       description: "Please wait for the payment gateway to load and try again.",
//       variant: "destructive",
//     });
//     return;
//   }

//   setIsRazorpayLoading(true);

//   try {
//     // Create order first with pending status
//     const order = await createOrder('pending', 'razorpay');
    
//     // Create Razorpay order
//     const { data: razorpayOrder, error: razorpayError } = await supabase.functions.invoke('create-razorpay-order', {
//       body: { 
//         amount: 100, // Convert to paise
//         currency: 'INR',
//         receipt: order.id
//       }
//     });

//     if (razorpayError) {
//       console.error('Razorpay order creation error:', razorpayError);
//       throw new Error(razorpayError.message || `Failed to create Razorpay order: ${razorpayError.message}`);
//     }

//     if (!razorpayOrder) {
//       throw new Error('No response from payment gateway');
//     }

//     // Rest of your code...
//   } catch (error) {
//     console.error("Razorpay payment failed:", error);
//     toast({
//       title: "Payment Failed",
//       description: error instanceof Error ? error.message : "There was an error processing your payment.",
//       variant: "destructive",
//     });
//   } finally {
//     setIsRazorpayLoading(false);
//   }
// };

//   const createOrder = async (status: string, paymentMethod: string) => {
//     if (!selectedAddressId || !cart || !user) {
//       throw new Error("Missing required data for order creation");
//     }

//     const { data: { session } } = await supabase.auth.getSession();
//     if (!session) {
//       throw new Error("User not authenticated");
//     }

//     const orderItems = cart.items.map(item => ({
//       product_id: item?.product_id,
//       quantity: item.quantity,
//       unit_price: item.products.selling_price,
//     }));

//     const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
//     if (!selectedAddress) {
//       throw new Error("Selected address not found");
//     }

//     const deliveryAddress = `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}, ${selectedAddress.country}`;

//     const { data: configData, error: configError } = await supabase
//       .from("store_configurations")
//       .select("*")
//       .order("created_at", { ascending: false })
//       .limit(1)
//       .single();

//     if (configError) {
//       console.warn("Error fetching store configuration:", configError.message);
//     }

//     if (configData?.minimum_order_enabled && total < (configData.minimum_order_value || 0)) {
//       throw new Error(`Minimum amount to place order is ${configData.minimum_order_value}`);
//     }

//     // Create order with your actual table structure
//     const { data: order, error: orderError } = await supabase
//       .from("orders")
//       .insert({
//         customer_id: session.user.id,
//         total_amount: total,
//         delivery_address: deliveryAddress,
//         status: status,
//         payment_method: paymentMethod,
//         payment_status: paymentMethod === 'cash-on-delivery' ? 'pending' : 'paid'
//       })
//       .select()
//       .single();

//     if (orderError) {
//       throw new Error(`Failed to create order: ${orderError.message}`);
//     }

//     const orderItemsWithOrderId = orderItems.map(item => ({
//       ...item,
//       order_id: order.id,
//     }));

//     const { error: itemsError } = await supabase
//       .from("order_items")
//       .insert(orderItemsWithOrderId);

//     if (itemsError) {
//       await supabase.from("orders").delete().eq("id", order.id);
//       throw new Error(`Failed to add order items: ${itemsError.message}`);
//     }

//     return order;
//   };

//   const updateOrderStatus = async (orderId: string, status: string, paymentId?: string, razorpayOrderId?: string) => {
//     const updateData: any = {
//       status: status,
//       payment_status: status === 'confirmed' ? 'paid' : status
//     };

//     if (paymentId) {
//       updateData.payment_id = paymentId;
//     }

//     if (razorpayOrderId) {
//       updateData.razorpay_order_id = razorpayOrderId;
//     }

//     const { error } = await supabase
//       .from("orders")
//       .update(updateData)
//       .eq("id", orderId);

//     if (error) {
//       console.error("Failed to update order status:", error);
//       throw error;
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

//   const isProcessing = isPlacingOrder || isRazorpayLoading;

//   return (
//     <>
//       <Helmet>
//         <title>Checkout | RENTXP</title>
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
//                   <Tabs defaultValue="cash-on-delivery" onValueChange={setPaymentMethod}>
//                     <TabsList className="grid w-full grid-cols-2">
//                       <TabsTrigger value="cash-on-delivery" className="flex items-center">
//                         <DollarSign className="mr-2 h-4 w-4" />
//                         Cash on Delivery
//                       </TabsTrigger>
//                       <TabsTrigger value="razorpay" className="flex items-center">
//                         <CreditCard className="mr-2 h-4 w-4" />
//                         Razorpay
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
//                     <TabsContent value="razorpay" className="mt-4">
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-medium text-gray-800 mb-2">Secure Online Payment</h4>
//                         <p className="text-gray-600 text-sm">
//                           Pay securely using Razorpay. You can use credit/debit cards, UPI, net banking, and other payment methods.
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
//                     disabled={isProcessing || !selectedAddressId}
//                   >
//                     {isProcessing ? (
//                       <>
//                         <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                         {paymentMethod === 'razorpay' ? 'Opening Payment...' : 'Processing...'}
//                       </>
//                     ) : (
//                       paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/hooks/useAuth";
// import { useCart } from "@/hooks/useCart";
// import { supabase } from "@/lib/supabase";
// import { formatCurrency } from "@/lib/utils";
// import { useQuery } from "@tanstack/react-query";
// import {
//   AlertCircle,
//   Calendar,
//   CheckCircle,
//   Clock,
//   CreditCard,
//   DollarSign,
//   Home,
//   Plus,
//   RefreshCw,
//   Truck,
//   Zap
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

// type DeliveryOption = "standard" | "instant";
// type TimeSlot = "3-6" | "6-9";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { cart, refreshCart } = useCart();
//   const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
//   const { toast } = useToast();
  
//   // State declarations
//   const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
//   const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [orderId, setOrderId] = useState<string | null>(null);
//   const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  
//   // New state for rental features
//   const [rentalDays, setRentalDays] = useState<number>(1);
//   const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("standard");
//   const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<TimeSlot>("3-6");
//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");

//   // Fetch user addresses
//   const { 
//     data: addresses = [], 
//     isLoading: isAddressesLoading,
//     error: addressesError,
//     refetch: refetchAddresses
//   } = useQuery<Address[]>({
//     queryKey: [`user-addresses-${user?.id}`],
//     enabled: isAuthenticated && !!user?.id,
//     queryFn: async () => {
//       try {
//         const { data, error } = await supabase
//           .from('user_addresses')
//           .select('*')
//           .eq('user_id', user?.id);

//         if (error) throw error;

//         return data.map(addr => ({
//           id: addr.id,
//           userId: addr.user_id,
//           addressLine1: addr.address_line1,
//           addressLine2: addr.address_line2,
//           city: addr.city,
//           state: addr.state,
//           postalCode: addr.postal_code,
//           country: addr.country,
//           isDefault: addr.is_default
//         }));
//       } catch (error) {
//         console.error('Error fetching addresses:', error);
//         throw error;
//       }
//     },
//   });

//   // Calculate rental period based on selected days
//   useEffect(() => {
//     const today = new Date();
//     const end = new Date(today);
//     end.setDate(today.getDate() + rentalDays);
    
//     setStartDate(today.toISOString().split('T')[0]);
//     setEndDate(end.toISOString().split('T')[0]);
//   }, [rentalDays]);

//   // Determine delivery time slot based on current time
//   useEffect(() => {
//     const currentHour = new Date().getHours();
//     if (currentHour < 15) {
//       setDeliveryTimeSlot("3-6");
//     } else if (currentHour < 21) {
//       setDeliveryTimeSlot("6-9");
//     } else {
//       setDeliveryTimeSlot("6-9");
//     }
//   }, []);

//   // Calculate order summary with all charges
//   const calculateOrderSummary = () => {
//     const subtotal = cart?.items.reduce((acc, item) => 
//       acc + (item?.products?.selling_price * item?.quantity * rentalDays), 0) || 0;
    
//     const shipping = subtotal > 50 ? 0 : 5.99;
    
//     // Calculate discount for rentals > 5 days
//     let discount = 0;
//     if (rentalDays > 5) {
//       discount = subtotal * 0.20; // 20% discount
//     }
    
//     // Late night charge (after 9 PM)
//     const currentHour = new Date().getHours();
//     const lateNightCharge = currentHour >= 21 ? 100 : 0;
    
//     // Instant delivery charge
//     const instantDeliveryCharge = deliveryOption === "instant" ? 100 : 0;
    
//     const totalBeforeCharges = subtotal + shipping - discount;
//     const total = totalBeforeCharges + lateNightCharge + instantDeliveryCharge;
    
//     return {
//       subtotal,
//       shipping,
//       discount,
//       lateNightCharge,
//       instantDeliveryCharge,
//       total,
//       rentalDays
//     };
//   };

//   const {
//     subtotal,
//     shipping,
//     discount,
//     lateNightCharge,
//     instantDeliveryCharge,
//     total,
//   } = calculateOrderSummary();

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
//       navigate("/cart");
//     }
//   }, [cart, navigate, toast]);

//   // Load Razorpay script
//   useEffect(() => {
//     const loadRazorpay = () => {
//       return new Promise((resolve) => {
//         if (window.Razorpay) {
//           resolve(true);
//           return;
//         }

//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.async = true;
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });
//     };

//     if (paymentMethod === 'razorpay') {
//       loadRazorpay();
//     }
//   }, [paymentMethod]);

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

//     // Show delivery time message
//     const currentHour = new Date().getHours();
//     let deliveryMessage = "";
//     if (currentHour < 15) {
//       deliveryMessage = "Your order will be delivered between 3 PM and 6 PM";
//     } else if (currentHour < 21) {
//       deliveryMessage = "Your order will be delivered between 6 PM and 9 PM";
//     } else {
//       deliveryMessage = "Your order will be delivered between 6 PM and 9 PM tomorrow";
//     }

//     toast({
//       title: "Delivery Information",
//       description: deliveryMessage,
//       variant: "default",
//     });

//     if (paymentMethod === 'razorpay') {
//       await handleRazorpayPayment();
//     } else {
//       await handleCashOnDelivery();
//     }
//   };

//   const handleCashOnDelivery = async () => {
//     setIsPlacingOrder(true);
    
//     try {
//       const order = await createOrder('pending', 'cash-on-delivery');
//       setOrderId(order.id);
//       setOrderPlaced(true);
//       refreshCart();

//       const { error: deleteCartError } = await supabase
//         .from("carts")
//         .delete()
//         .eq("id", cart?.id);
      
//       if (deleteCartError) {
//         console.log('Cart delete failed', deleteCartError);
//       }

//       toast({
//         title: "Order placed successfully!",
//         description: "Your order has been confirmed.",
//         variant: "default",
//       });

//       setTimeout(() => {
//         navigate(`/order-success/${order.id}`);
//       }, 2000);
      
//     } catch (error) {
//       console.error("Failed to place order:", error);
//       toast({
//         title: "Failed to place order",
//         description: error instanceof Error ? error.message : "There was an error processing your order. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsPlacingOrder(false);
//     }
//   };

//   const handleRazorpayPayment = async () => {
//     if (!window.Razorpay) {
//       toast({
//         title: "Payment gateway not loaded",
//         description: "Please wait for the payment gateway to load and try again.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsRazorpayLoading(true);

//     try {
//       const order = await createOrder('pending', 'razorpay');
      
//       const { data: razorpayOrder, error: razorpayError } = await supabase.functions.invoke('create-razorpay-order', {
//         body: { 
//           amount: Math.round(total * 100), // Convert to paise
//           currency: 'INR',
//           receipt: order.id
//         }
//       });

//       if (razorpayError) {
//         console.error('Razorpay order creation error:', razorpayError);
//         throw new Error(razorpayError.message || `Failed to create Razorpay order: ${razorpayError.message}`);
//       }

//       if (!razorpayOrder) {
//         throw new Error('No response from payment gateway');
//       }

//       const options = {
//         key: razorpayOrder.key_id,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//         name: 'RENTXP Gaming Zone',
//         description: `Order for ${cart?.items.length} items`,
//         order_id: razorpayOrder.id,
//         handler: async (response: any) => {
//           try {
//             await updateOrderStatus(
//               order.id,
//               'confirmed',
//               response.razorpay_payment_id,
//               response.razorpay_order_id
//             );
            
//             setOrderId(order.id);
//             setOrderPlaced(true);
//             refreshCart();

//             const { error: deleteCartError } = await supabase
//               .from("carts")
//               .delete()
//               .eq("id", cart?.id);
            
//             if (deleteCartError) {
//               console.log('Cart delete failed', deleteCartError);
//             }

//             toast({
//               title: "Payment Successful!",
//               description: "Your order has been confirmed.",
//               variant: "default",
//             });

//             setTimeout(() => {
//               navigate(`/order-success/${order.id}`);
//             }, 2000);
            
//           } catch (error) {
//             console.error("Payment verification failed:", error);
//             toast({
//               title: "Payment Verification Failed",
//               description: "Please contact support with your payment ID.",
//               variant: "destructive",
//             });
//           }
//         },
//         prefill: {
//           name: user?.user_metadata?.full_name || '',
//           email: user?.email || '',
//         },
//         theme: {
//           color: '#4F46E5'
//         }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
      
//     } catch (error) {
//       console.error("Razorpay payment failed:", error);
//       toast({
//         title: "Payment Failed",
//         description: error instanceof Error ? error.message : "There was an error processing your payment.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsRazorpayLoading(false);
//     }
//   };

//   const createOrder = async (status: string, paymentMethod: string) => {
//     if (!selectedAddressId || !cart || !user) {
//       throw new Error("Missing required data for order creation");
//     }

//     const { data: { session } } = await supabase.auth.getSession();
//     if (!session) {
//       throw new Error("User not authenticated");
//     }

//     const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
//     if (!selectedAddress) {
//       throw new Error("Selected address not found");
//     }

//     const deliveryAddress = `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}, ${selectedAddress.country}`;

//     const { data: configData, error: configError } = await supabase
//       .from("store_configurations")
//       .select("*")
//       .order("created_at", { ascending: false })
//       .limit(1)
//       .single();

//     if (configError) {
//       console.warn("Error fetching store configuration:", configError.message);
//     }

//     if (configData?.minimum_order_enabled && total < (configData.minimum_order_value || 0)) {
//       throw new Error(`Minimum amount to place order is ${configData.minimum_order_value}`);
//     }

//     // Create order with rental details
//     const { data: order, error: orderError } = await supabase
//       .from("orders")
//       .insert({
//         customer_id: session.user.id,
//         total_amount: subtotal,
//         final_total: total,
//         delivery_address: deliveryAddress,
//         status: status,
//         payment_method: paymentMethod,
//         payment_status: paymentMethod === 'cash-on-delivery' ? 'pending' : 'paid',
//         start_date: startDate,
//         end_date: endDate,
//         rental_days: rentalDays,
//         delivery_time_slot: deliveryTimeSlot,
//         is_instant_delivery: deliveryOption === "instant",
//         late_night_charge: lateNightCharge,
//         instant_delivery_charge: instantDeliveryCharge,
//         discount_amount: discount
//       })
//       .select()
//       .single();

//     if (orderError) {
//       throw new Error(`Failed to create order: ${orderError.message}`);
//     }

//     // Create order items with rental days
//     const orderItemsWithOrderId = cart.items.map(item => ({
//       product_id: item?.product_id,
//       quantity: item.quantity,
//       unit_price: item.products.selling_price,
//       order_id: order.id,
//       rental_days: rentalDays,
//       vendor_id: item.products.vendor_id
//     }));

//     const { error: itemsError } = await supabase
//       .from("order_items")
//       .insert(orderItemsWithOrderId);

//     if (itemsError) {
//       await supabase.from("orders").delete().eq("id", order.id);
//       throw new Error(`Failed to add order items: ${itemsError.message}`);
//     }

//     return order;
//   };

//   const updateOrderStatus = async (orderId: string, status: string, paymentId?: string, razorpayOrderId?: string) => {
//     const updateData: any = {
//       status: status,
//       payment_status: status === 'confirmed' ? 'paid' : status
//     };

//     if (paymentId) {
//       updateData.payment_id = paymentId;
//     }

//     if (razorpayOrderId) {
//       updateData.razorpay_order_id = razorpayOrderId;
//     }

//     const { error } = await supabase
//       .from("orders")
//       .update(updateData)
//       .eq("id", orderId);

//     if (error) {
//       console.error("Failed to update order status:", error);
//       throw error;
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

//   const isProcessing = isPlacingOrder || isRazorpayLoading;
//   const currentHour = new Date().getHours();

//   return (
//     <>
//       <Helmet>
//         <title>Checkout | RENTXP</title>
//         <meta name="description" content="Complete your rental purchase by selecting rental period and delivery options." />
//       </Helmet>
      
//       <div className="bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout - Rental Gaming Zone</h1>
          
//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Main Checkout Form */}
//             <div className="flex-1">
//               {/* Rental Period */}
//               <Card className="mb-6">
//                 <CardHeader>
//                   <div className="flex items-center">
//                     <Calendar className="mr-2 h-5 w-5 text-primary" />
//                     <CardTitle>Rental Period</CardTitle>
//                   </div>
//                   <CardDescription>
//                     Select how many days you want to rent the equipment
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor="rental-days">Rental Duration (Days)</Label>
//                       <Select
//                         value={rentalDays.toString()}
//                         onValueChange={(value) => setRentalDays(parseInt(value))}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select days" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {[1, 2, 3, 4, 5, 6, 7, 14, 30].map((days) => (
//                             <SelectItem key={days} value={days.toString()}>
//                               {days} day{days > 1 ? 's' : ''}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <p className="text-sm text-gray-500 mt-2">
//                         Price shown is per 24 hours. {rentalDays > 1 ? `${rentalDays} days = ${rentalDays} x 24 hours` : ''}
//                       </p>
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="start-date">Start Date</Label>
//                         <input
//                           type="date"
//                           id="start-date"
//                           value={startDate}
//                           readOnly
//                           className="w-full p-2 border rounded-md bg-gray-50"
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="end-date">End Date</Label>
//                         <input
//                           type="date"
//                           id="end-date"
//                           value={endDate}
//                           readOnly
//                           className="w-full p-2 border rounded-md bg-gray-50"
//                         />
//                       </div>
//                     </div>
                    
//                     {rentalDays > 5 && (
//                       <div className="bg-green-50 border border-green-200 rounded-md p-3">
//                         <p className="text-green-700 font-medium">
//                           🎉 You qualify for 20% discount on rental for more than 5 days!
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
              
//               {/* Delivery Options */}
//               <Card className="mb-6">
//                 <CardHeader>
//                   <div className="flex items-center">
//                     <Truck className="mr-2 h-5 w-5 text-primary" />
//                     <CardTitle>Delivery Options</CardTitle>
//                   </div>
//                   <CardDescription>
//                     Choose your preferred delivery method
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <RadioGroup 
//                       value={deliveryOption} 
//                       onValueChange={(value) => setDeliveryOption(value as DeliveryOption)}
//                       className="space-y-4"
//                     >
//                       <div className={`border rounded-lg p-4 ${
//                         deliveryOption === "standard" ? 'border-primary bg-blue-50' : 'border-gray-200'
//                       }`}>
//                         <div className="flex items-start">
//                           <RadioGroupItem 
//                             value="standard" 
//                             id="standard-delivery" 
//                             className="mt-1"
//                           />
//                           <div className="ml-3">
//                             <Label 
//                               htmlFor="standard-delivery"
//                               className="font-medium text-gray-900 flex items-center"
//                             >
//                               Standard Delivery
//                               <span className="ml-2 text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
//                                 Free
//                               </span>
//                             </Label>
//                             <p className="text-gray-600 text-sm mt-1">
//                               Delivered within the scheduled time slot
//                             </p>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className={`border rounded-lg p-4 ${
//                         deliveryOption === "instant" ? 'border-primary bg-blue-50' : 'border-gray-200'
//                       }`}>
//                         <div className="flex items-start">
//                           <RadioGroupItem 
//                             value="instant" 
//                             id="instant-delivery" 
//                             className="mt-1"
//                           />
//                           <div className="ml-3">
//                             <Label 
//                               htmlFor="instant-delivery"
//                               className="font-medium text-gray-900 flex items-center"
//                             >
//                               <Zap className="h-4 w-4 text-yellow-500 mr-1" />
//                               Instant Delivery
//                               <span className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">
//                                 + ₹100
//                               </span>
//                             </Label>
//                             <p className="text-gray-600 text-sm mt-1">
//                               Delivered within 60 minutes (Extra charge applies)
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </RadioGroup>
                    
//                     <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
//                       <div className="flex items-center">
//                         <Clock className="h-5 w-5 text-blue-500 mr-2" />
//                         <div>
//                           <p className="font-medium text-blue-800">Delivery Time Slot</p>
//                           <p className="text-blue-600 text-sm">
//                             {currentHour < 15 
//                               ? "Your order will be delivered between 3 PM and 6 PM" 
//                               : currentHour < 21 
//                                 ? "Your order will be delivered between 6 PM and 9 PM" 
//                                 : "Your order will be delivered between 6 PM and 9 PM tomorrow (₹100 late night charge applied)"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
              
//               {/* Shipping Address */}
//               <Card className="mb-6">
//                 <CardHeader>
//                   <div className="flex items-center">
//                     <Home className="mr-2 h-5 w-5 text-primary" />
//                     <CardTitle>Delivery Address</CardTitle>
//                   </div>
//                   <CardDescription>
//                     Select where you want the equipment delivered
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
//                   <Tabs defaultValue="cash-on-delivery" onValueChange={setPaymentMethod}>
//                     <TabsList className="grid w-full grid-cols-2">
//                       <TabsTrigger value="cash-on-delivery" className="flex items-center">
//                         <DollarSign className="mr-2 h-4 w-4" />
//                         Cash on Delivery
//                       </TabsTrigger>
//                       <TabsTrigger value="razorpay" className="flex items-center">
//                         <CreditCard className="mr-2 h-4 w-4" />
//                         Razorpay
//                       </TabsTrigger>
//                     </TabsList>
//                     <TabsContent value="cash-on-delivery" className="mt-4">
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-medium text-gray-800 mb-2">Cash on Delivery</h4>
//                         <p className="text-gray-600 text-sm">
//                           Pay with cash when your equipment is delivered. Please ensure someone is available to receive and inspect the equipment.
//                         </p>
//                       </div>
//                     </TabsContent>
//                     <TabsContent value="razorpay" className="mt-4">
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-medium text-gray-800 mb-2">Secure Online Payment</h4>
//                         <p className="text-gray-600 text-sm">
//                           Pay securely using Razorpay. You can use credit/debit cards, UPI, net banking, and other payment methods.
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
//                     Review your rental details
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
//                             <p className="text-xs text-gray-500">
//                               Qty: {item.quantity} × {rentalDays} day{rentalDays > 1 ? 's' : ''}
//                             </p>
//                           </div>
//                         </div>
//                         <p className="text-sm font-medium text-gray-900">
//                           {formatCurrency(item.products.selling_price * item.quantity * rentalDays)}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
                  
//                   {/* Pricing Details */}
//                   <div className="border-t border-gray-200 pt-4 space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Subtotal ({rentalDays} day{rentalDays > 1 ? 's' : ''})</span>
//                       <span className="font-medium">{formatCurrency(subtotal)}</span>
//                     </div>
                    
//                     {shipping > 0 && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Shipping</span>
//                         <span className="font-medium">{formatCurrency(shipping)}</span>
//                       </div>
//                     )}
                    
//                     {discount > 0 && (
//                       <div className="flex justify-between text-green-600">
//                         <span>20% Discount ({rentalDays} days+)</span>
//                         <span className="font-medium">-{formatCurrency(discount)}</span>
//                       </div>
//                     )}
                    
//                     {instantDeliveryCharge > 0 && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-600 flex items-center">
//                           <Zap className="h-3 w-3 mr-1 text-yellow-500" />
//                           Instant Delivery
//                         </span>
//                         <span className="font-medium">{formatCurrency(instantDeliveryCharge)}</span>
//                       </div>
//                     )}
                    
//                     {lateNightCharge > 0 && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Late Night Charge</span>
//                         <span className="font-medium">{formatCurrency(lateNightCharge)}</span>
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Total */}
//                   <div className="border-t border-gray-200 pt-4">
//                     <div className="flex justify-between">
//                       <span className="text-lg font-bold">Total</span>
//                       <span className="text-lg font-bold">{formatCurrency(total)}</span>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Rental period: {startDate} to {endDate} ({rentalDays} day{rentalDays > 1 ? 's' : ''})
//                     </p>
//                   </div>
                  
//                   {/* Delivery Information */}
//                   <div className="bg-gray-50 p-4 rounded-lg mt-4">
//                     <div className="flex items-center mb-2">
//                       <Truck className="h-5 w-5 text-primary mr-2" />
//                       <h4 className="font-medium text-gray-800">Delivery Information</h4>
//                     </div>
//                     <p className="text-sm text-gray-600 mb-2">
//                       {currentHour < 15 
//                         ? "Your equipment will be delivered between 3 PM and 6 PM today" 
//                         : currentHour < 21 
//                           ? "Your equipment will be delivered between 6 PM and 9 PM today" 
//                           : "Your equipment will be delivered between 6 PM and 9 PM tomorrow (late night charge applied)"}
//                     </p>
//                     {deliveryOption === "instant" && (
//                       <p className="text-sm text-yellow-600 font-medium">
//                         ⚡ Instant delivery selected - Equipment will arrive within 60 minutes
//                       </p>
//                     )}
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   <Button 
//                     className="w-full bg-primary hover:bg-blue-600"
//                     size="lg"
//                     onClick={handlePlaceOrder}
//                     disabled={isProcessing || !selectedAddressId}
//                   >
//                     {isProcessing ? (
//                       <>
//                         <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                         {paymentMethod === 'razorpay' ? 'Opening Payment...' : 'Processing...'}
//                       </>
//                     ) : (
//                       paymentMethod === 'razorpay' ? `Pay ${formatCurrency(total)}` : `Place Order ${formatCurrency(total)}`
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/hooks/useAuth";
// import { useCart } from "@/hooks/useCart";
// import { supabase } from "@/lib/supabase";
// import { formatCurrency } from "@/lib/utils";
// import { useQuery } from "@tanstack/react-query";
// import {
//   AlertCircle,
//   Calendar,
//   CheckCircle,
//   Clock,
//   CreditCard,
//   DollarSign,
//   Home,
//   Plus,
//   RefreshCw,
//   Truck,
//   Zap
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

// type DeliveryOption = "standard" | "instant";
// type TimeSlot = "3-6" | "6-9" | "9-12" | "12-3";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { cart, refreshCart } = useCart();
//   const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
//   const { toast } = useToast();
  
//   // State declarations
//   const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
//   const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [orderId, setOrderId] = useState<string | null>(null);
//   const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  
//   // Rental states
//   const [rentalDays, setRentalDays] = useState<number>(1);
//   const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("standard");
//   const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<TimeSlot>("3-6");
  
//   // Date and time states
//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");
//   const [startTime, setStartTime] = useState<string>("10:00");
//   const [endTime, setEndTime] = useState<string>("18:00");
  
//   // Available time slots
//   const timeSlots = [
//     { value: "9-12", label: "9 AM - 12 PM" },
//     { value: "12-3", label: "12 PM - 3 PM" },
//     { value: "3-6", label: "3 PM - 6 PM" },
//     { value: "6-9", label: "6 PM - 9 PM" },
//   ];

//   // In your Checkout component, update the useQuery call:
// const { 
//   data: addresses = [], 
//   isLoading: isAddressesLoading,
//   error: addressesError,
//   refetch: refetchAddresses
// } = useQuery<Address[]>({
//   queryKey: [`user-addresses-${user?.id}`],
//   enabled: isAuthenticated && !!user?.id,
//   queryFn: async () => {
//     try {
//       const { data, error } = await supabase
//         .from('user_addresses')
//         .select('*')
//         .eq('user_id', user?.id)
//         .order('is_default', { ascending: false });

//       if (error) throw error;

//       return data.map(addr => ({
//         id: addr.id,
//         userId: addr.user_id,
//         addressLine1: addr.address_line1 || '',
//         addressLine2: addr.address_line2 || null,
//         city: addr.city || '',
//         state: addr.state || '',
//         postalCode: addr.postal_code || '',
//         country: addr.country || '',
//         isDefault: addr.is_default || false,
//         name: addr.name || 'Untitled Address',
//         phone: addr.phone || '',
//         addressType: addr.address_type || 'home',
//         landmark: addr.landmark || null
//       }));
//     } catch (error) {
//       console.error('Error fetching addresses:', error);
//       throw error;
//     }
//   },
// });


//   useEffect(() => {
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);
    
//     setStartDate(today.toISOString().split('T')[0]);
//     setEndDate(tomorrow.toISOString().split('T')[0]);
    
//     // Set default times
//     setStartTime("10:00");
//     setEndTime("18:00");
//   }, []);

//   // Calculate rental period based on selected dates
//   useEffect(() => {
//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       const timeDiff = end.getTime() - start.getTime();
//       const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
//       // Ensure at least 1 day
//       setRentalDays(daysDiff >= 1 ? daysDiff : 1);
//     }
//   }, [startDate, endDate]);

//   // Determine delivery time slot based on current time
//   useEffect(() => {
//     const currentHour = new Date().getHours();
//     if (currentHour < 9) {
//       setDeliveryTimeSlot("9-12");
//     } else if (currentHour < 12) {
//       setDeliveryTimeSlot("12-3");
//     } else if (currentHour < 15) {
//       setDeliveryTimeSlot("3-6");
//     } else if (currentHour < 21) {
//       setDeliveryTimeSlot("6-9");
//     } else {
//       setDeliveryTimeSlot("9-12");
//     }
//   }, []);

//   // Calculate exact rental hours between start and end datetime
//   const calculateRentalHours = () => {
//     if (!startDate || !endDate || !startTime || !endTime) return 0;
    
//     const startDateTime = new Date(`${startDate}T${startTime}`);
//     const endDateTime = new Date(`${endDate}T${endTime}`);
    
//     // Calculate difference in milliseconds
//     const timeDiff = endDateTime.getTime() - startDateTime.getTime();
    
//     // Convert to hours
//     const hoursDiff = Math.ceil(timeDiff / (1000 * 3600));
    
//     // Ensure minimum of 24 hours (1 day)
//     return hoursDiff >= 24 ? hoursDiff : 24;
//   };

//   // Calculate rental days based on hours (24 hours = 1 day)
//   const calculateRentalDaysFromHours = (hours: number) => {
//     return Math.ceil(hours / 24);
//   };

//   // Calculate order summary with all charges
//   const calculateOrderSummary = () => {
//     const rentalHours = calculateRentalHours();
//     const effectiveRentalDays = calculateRentalDaysFromHours(rentalHours);
    
//     const subtotal = cart?.items.reduce((acc, item) => 
//       acc + (item?.products?.selling_price * item?.quantity * effectiveRentalDays), 0) || 0;
    
//     const shipping = subtotal > 50 ? 0 : 5.99;
    
//     // Calculate discount for rentals > 5 days
//     let discount = 0;
//     if (effectiveRentalDays > 5) {
//       discount = subtotal * 0.20; // 20% discount
//     }
    
//     // Late night charge (after 9 PM)
//     const currentHour = new Date().getHours();
//     const lateNightCharge = currentHour >= 21 ? 100 : 0;
    
//     // Instant delivery charge
//     const instantDeliveryCharge = deliveryOption === "instant" ? 100 : 0;
    
//     const totalBeforeCharges = subtotal + shipping - discount;
//     const total = totalBeforeCharges + lateNightCharge + instantDeliveryCharge;
    
//     return {
//       subtotal,
//       shipping,
//       discount,
//       lateNightCharge,
//       instantDeliveryCharge,
//       total,
//       rentalDays: effectiveRentalDays,
//       rentalHours,
//       effectiveRentalDays
//     };
//   };

//   const {
//     subtotal,
//     shipping,
//     discount,
//     lateNightCharge,
//     instantDeliveryCharge,
//     total,
//     rentalHours,
//     effectiveRentalDays
//   } = calculateOrderSummary();

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
//       navigate("/cart");
//     }
//   }, [cart, navigate, toast]);

//   // Load Razorpay script
//   useEffect(() => {
//     const loadRazorpay = () => {
//       return new Promise((resolve) => {
//         if (window.Razorpay) {
//           resolve(true);
//           return;
//         }

//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.async = true;
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });
//     };

//     if (paymentMethod === 'razorpay') {
//       loadRazorpay();
//     }
//   }, [paymentMethod]);

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

//     // Validate dates
//     const startDateTime = new Date(`${startDate}T${startTime}`);
//     const endDateTime = new Date(`${endDate}T${endTime}`);
    
//     if (endDateTime <= startDateTime) {
//       toast({
//         title: "Invalid rental period",
//         description: "End date/time must be after start date/time.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Show delivery time message
//     const currentHour = new Date().getHours();
//     let deliveryMessage = "";
//     if (currentHour < 9) {
//       deliveryMessage = "Your order will be delivered between 9 AM and 12 PM";
//     } else if (currentHour < 12) {
//       deliveryMessage = "Your order will be delivered between 12 PM and 3 PM";
//     } else if (currentHour < 15) {
//       deliveryMessage = "Your order will be delivered between 3 PM and 6 PM";
//     } else if (currentHour < 21) {
//       deliveryMessage = "Your order will be delivered between 6 PM and 9 PM";
//     } else {
//       deliveryMessage = "Your order will be delivered between 9 AM and 12 PM tomorrow";
//     }

//     toast({
//       title: "Delivery Information",
//       description: deliveryMessage,
//       variant: "default",
//     });

//     if (paymentMethod === 'razorpay') {
//       await handleRazorpayPayment();
//     } else {
//       await handleCashOnDelivery();
//     }
//   };

//   const handleCashOnDelivery = async () => {
//     setIsPlacingOrder(true);
    
//     try {
//       const order = await createOrder('pending', 'cash-on-delivery');
//       setOrderId(order.id);
//       setOrderPlaced(true);
//       refreshCart();

//       const { error: deleteCartError } = await supabase
//         .from("carts")
//         .delete()
//         .eq("id", cart?.id);
      
//       if (deleteCartError) {
//         console.log('Cart delete failed', deleteCartError);
//       }

//       toast({
//         title: "Order placed successfully!",
//         description: "Your order has been confirmed.",
//         variant: "default",
//       });

//       setTimeout(() => {
//         navigate(`/order-success/${order.id}`);
//       }, 2000);
      
//     } catch (error) {
//       console.error("Failed to place order:", error);
//       toast({
//         title: "Failed to place order",
//         description: error instanceof Error ? error.message : "There was an error processing your order. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsPlacingOrder(false);
//     }
//   };

//   const handleRazorpayPayment = async () => {
//     if (!window.Razorpay) {
//       toast({
//         title: "Payment gateway not loaded",
//         description: "Please wait for the payment gateway to load and try again.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsRazorpayLoading(true);

//     try {
//       const order = await createOrder('pending', 'razorpay');
      
//       const { data: razorpayOrder, error: razorpayError } = await supabase.functions.invoke('create-razorpay-order', {
//         body: { 
//           amount: Math.round(total * 100), // Convert to paise
//           currency: 'INR',
//           receipt: order.id
//         }
//       });

//       if (razorpayError) {
//         console.error('Razorpay order creation error:', razorpayError);
//         throw new Error(razorpayError.message || `Failed to create Razorpay order: ${razorpayError.message}`);
//       }

//       if (!razorpayOrder) {
//         throw new Error('No response from payment gateway');
//       }

//       const options = {
//         key: razorpayOrder.key_id,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//         name: 'RENTXP Gaming Zone',
//         description: `Order for ${cart?.items.length} items`,
//         order_id: razorpayOrder.id,
//         handler: async (response: any) => {
//           try {
//             await updateOrderStatus(
//               order.id,
//               'confirmed',
//               response.razorpay_payment_id,
//               response.razorpay_order_id
//             );
            
//             setOrderId(order.id);
//             setOrderPlaced(true);
//             refreshCart();

//             const { error: deleteCartError } = await supabase
//               .from("carts")
//               .delete()
//               .eq("id", cart?.id);
            
//             if (deleteCartError) {
//               console.log('Cart delete failed', deleteCartError);
//             }

//             toast({
//               title: "Payment Successful!",
//               description: "Your order has been confirmed.",
//               variant: "default",
//             });

//             setTimeout(() => {
//               navigate(`/order-success/${order.id}`);
//             }, 2000);
            
//           } catch (error) {
//             console.error("Payment verification failed:", error);
//             toast({
//               title: "Payment Verification Failed",
//               description: "Please contact support with your payment ID.",
//               variant: "destructive",
//             });
//           }
//         },
//         prefill: {
//           name: user?.user_metadata?.full_name || '',
//           email: user?.email || '',
//         },
//         theme: {
//           color: '#4F46E5'
//         }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
      
//     } catch (error) {
//       console.error("Razorpay payment failed:", error);
//       toast({
//         title: "Payment Failed",
//         description: error instanceof Error ? error.message : "There was an error processing your payment.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsRazorpayLoading(false);
//     }
//   };

//   const createOrder = async (status: string, paymentMethod: string) => {
//     if (!selectedAddressId || !cart || !user) {
//       throw new Error("Missing required data for order creation");
//     }

//     const { data: { session } } = await supabase.auth.getSession();
//     if (!session) {
//       throw new Error("User not authenticated");
//     }

//     const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
//     if (!selectedAddress) {
//       throw new Error("Selected address not found");
//     }

//     const deliveryAddress = `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}, ${selectedAddress.country}`;

//     const { data: configData, error: configError } = await supabase
//       .from("store_configurations")
//       .select("*")
//       .order("created_at", { ascending: false })
//       .limit(1)
//       .single();

//     if (configError) {
//       console.warn("Error fetching store configuration:", configError.message);
//     }

//     if (configData?.minimum_order_enabled && total < (configData.minimum_order_value || 0)) {
//       throw new Error(`Minimum amount to place order is ${configData.minimum_order_value}`);
//     }

//     // Format datetime for database
//     const startDateTime = new Date(`${startDate}T${startTime}`);
//     const endDateTime = new Date(`${endDate}T${endTime}`);

//     // Create order with rental details
//     const { data: order, error: orderError } = await supabase
//       .from("orders")
//       .insert({
//         customer_id: session.user.id,
//         total_amount: subtotal,
//         final_total: total,
//         delivery_address: deliveryAddress,
//         status: status,
//         payment_method: paymentMethod,
//         payment_status: paymentMethod === 'cash-on-delivery' ? 'pending' : 'paid',
//         start_date: startDate,
//         end_date: endDate,
//         start_time: startTime,
//         end_time: endTime,
//         rental_days: effectiveRentalDays,
//         rental_hours: rentalHours,
//         delivery_time_slot: deliveryTimeSlot,
//         is_instant_delivery: deliveryOption === "instant",
//         late_night_charge: lateNightCharge,
//         instant_delivery_charge: instantDeliveryCharge,
//         discount_amount: discount,
//         rental_start_datetime: startDateTime.toISOString(),
//         rental_end_datetime: endDateTime.toISOString()
//       })
//       .select()
//       .single();

//     if (orderError) {
//       throw new Error(`Failed to create order: ${orderError.message}`);
//     }

//     // Create order items with rental days
//     const orderItemsWithOrderId = cart.items.map(item => ({
//       product_id: item?.product_id,
//       quantity: item.quantity,
//       unit_price: item.products.selling_price,
//       order_id: order.id,
//       rental_days: effectiveRentalDays,
//       rental_hours: rentalHours,
//       vendor_id: item.products.vendor_id
//     }));

//     const { error: itemsError } = await supabase
//       .from("order_items")
//       .insert(orderItemsWithOrderId);

//     if (itemsError) {
//       await supabase.from("orders").delete().eq("id", order.id);
//       throw new Error(`Failed to add order items: ${itemsError.message}`);
//     }

//     return order;
//   };

//   const updateOrderStatus = async (orderId: string, status: string, paymentId?: string, razorpayOrderId?: string) => {
//     const updateData: any = {
//       status: status,
//       payment_status: status === 'confirmed' ? 'paid' : status
//     };

//     if (paymentId) {
//       updateData.payment_id = paymentId;
//     }

//     if (razorpayOrderId) {
//       updateData.razorpay_order_id = razorpayOrderId;
//     }

//     const { error } = await supabase
//       .from("orders")
//       .update(updateData)
//       .eq("id", orderId);

//     if (error) {
//       console.error("Failed to update order status:", error);
//       throw error;
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

//   const isProcessing = isPlacingOrder || isRazorpayLoading;
//   const currentHour = new Date().getHours();

//   return (
//     <>
//       <Helmet>
//         <title>Checkout | RENTXP</title>
//         <meta name="description" content="Complete your rental purchase by selecting rental period and delivery options." />
//       </Helmet>
      
//       <div className="bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout - Rental Gaming Zone</h1>
          
//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Main Checkout Form */}
//             <div className="flex-1">
//               {/* Rental Period */}
//               <Card className="mb-6">
//                 <CardHeader>
//                   <div className="flex items-center">
//                     <Calendar className="mr-2 h-5 w-5 text-primary" />
//                     <CardTitle>Rental Period</CardTitle>
//                   </div>
//                   <CardDescription>
//                     Select your rental start and end dates with specific times
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-6">
//                     {/* Start Date & Time */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="start-date">Start Date</Label>
//                         <input
//                           type="date"
//                           id="start-date"
//                           value={startDate}
//                           min={new Date().toISOString().split('T')[0]}
//                           onChange={(e) => setStartDate(e.target.value)}
//                           className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="start-time">Start Time</Label>
//                         <Select
//                           value={startTime}
//                           onValueChange={setStartTime}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select start time" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {Array.from({ length: 12 }, (_, i) => {
//                               const hour = i + 8; // 8 AM to 7 PM
//                               return hour <= 19 && [
//                                 <SelectItem key={`${hour}:00`} value={`${hour.toString().padStart(2, '0')}:00`}>
//                                   {hour}:00 {hour < 12 ? 'AM' : hour === 12 ? 'PM' : hour - 12 < 12 ? 'PM' : 'AM'}
//                                 </SelectItem>,
//                                 <SelectItem key={`${hour}:30`} value={`${hour.toString().padStart(2, '0')}:30`}>
//                                   {hour}:30 {hour < 12 ? 'AM' : hour === 12 ? 'PM' : hour - 12 < 12 ? 'PM' : 'AM'}
//                                 </SelectItem>
//                               ];
//                             }).flat()}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
                    
//                     {/* End Date & Time */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="end-date">End Date</Label>
//                         <input
//                           type="date"
//                           id="end-date"
//                           value={endDate}
//                           min={startDate || new Date().toISOString().split('T')[0]}
//                           onChange={(e) => setEndDate(e.target.value)}
//                           className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="end-time">End Time</Label>
//                         <Select
//                           value={endTime}
//                           onValueChange={setEndTime}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select end time" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {Array.from({ length: 12 }, (_, i) => {
//                               const hour = i + 8; // 8 AM to 7 PM
//                               return hour <= 19 && [
//                                 <SelectItem key={`${hour}:00`} value={`${hour.toString().padStart(2, '0')}:00`}>
//                                   {hour}:00 {hour < 12 ? 'AM' : hour === 12 ? 'PM' : hour - 12 < 12 ? 'PM' : 'AM'}
//                                 </SelectItem>,
//                                 <SelectItem key={`${hour}:30`} value={`${hour.toString().padStart(2, '0')}:30`}>
//                                   {hour}:30 {hour < 12 ? 'AM' : hour === 12 ? 'PM' : hour - 12 < 12 ? 'PM' : 'AM'}
//                                 </SelectItem>
//                               ];
//                             }).flat()}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
                    
//                     {/* Rental Summary */}
//                     <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h4 className="font-medium text-blue-800">Rental Summary</h4>
//                           <p className="text-blue-600 text-sm mt-1">
//                             From: {new Date(`${startDate}T${startTime}`).toLocaleString()} 
//                             <br />
//                             To: {new Date(`${endDate}T${endTime}`).toLocaleString()}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-bold text-blue-800">
//                             {rentalHours} hours ({effectiveRentalDays} day{effectiveRentalDays > 1 ? 's' : ''})
//                           </p>
//                           <p className="text-blue-600 text-sm">
//                             {Math.floor(rentalHours / 24)} day{Math.floor(rentalHours / 24) > 1 ? 's' : ''} {rentalHours % 24} hour{rentalHours % 24 > 1 ? 's' : ''}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {effectiveRentalDays > 5 && (
//                       <div className="bg-green-50 border border-green-200 rounded-md p-3">
//                         <p className="text-green-700 font-medium">
//                           🎉 You qualify for 20% discount on rental for more than 5 days!
//                         </p>
//                       </div>
//                     )}
                    
//                     {/* Validation message */}
//                     {startDate && endDate && startTime && endTime && (
//                       (() => {
//                         const startDateTime = new Date(`${startDate}T${startTime}`);
//                         const endDateTime = new Date(`${endDate}T${endTime}`);
//                         const isValid = endDateTime > startDateTime;
                        
//                         return !isValid && (
//                           <div className="bg-red-50 border border-red-200 rounded-md p-3">
//                             <p className="text-red-700 font-medium">
//                               ⚠️ End date/time must be after start date/time
//                             </p>
//                           </div>
//                         );
//                       })()
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
              
//               {/* Delivery Options */}
//               <Card className="mb-6">
//                 <CardHeader>
//                   <div className="flex items-center">
//                     <Truck className="mr-2 h-5 w-5 text-primary" />
//                     <CardTitle>Delivery Options</CardTitle>
//                   </div>
//                   <CardDescription>
//                     Choose your preferred delivery method
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <RadioGroup 
//                       value={deliveryOption} 
//                       onValueChange={(value) => setDeliveryOption(value as DeliveryOption)}
//                       className="space-y-4"
//                     >
//                       <div className={`border rounded-lg p-4 ${
//                         deliveryOption === "standard" ? 'border-primary bg-blue-50' : 'border-gray-200'
//                       }`}>
//                         <div className="flex items-start">
//                           <RadioGroupItem 
//                             value="standard" 
//                             id="standard-delivery" 
//                             className="mt-1"
//                           />
//                           <div className="ml-3">
//                             <Label 
//                               htmlFor="standard-delivery"
//                               className="font-medium text-gray-900 flex items-center"
//                             >
//                               Standard Delivery
//                               <span className="ml-2 text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
//                                 Free
//                               </span>
//                             </Label>
//                             <p className="text-gray-600 text-sm mt-1">
//                               Delivered within the scheduled time slot
//                             </p>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className={`border rounded-lg p-4 ${
//                         deliveryOption === "instant" ? 'border-primary bg-blue-50' : 'border-gray-200'
//                       }`}>
//                         <div className="flex items-start">
//                           <RadioGroupItem 
//                             value="instant" 
//                             id="instant-delivery" 
//                             className="mt-1"
//                           />
//                           <div className="ml-3">
//                             <Label 
//                               htmlFor="instant-delivery"
//                               className="font-medium text-gray-900 flex items-center"
//                             >
//                               <Zap className="h-4 w-4 text-yellow-500 mr-1" />
//                               Instant Delivery
//                               <span className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">
//                                 + ₹100
//                               </span>
//                             </Label>
//                             <p className="text-gray-600 text-sm mt-1">
//                               Delivered within 60 minutes (Extra charge applies)
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </RadioGroup>
                    
//                     <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
//                       <div className="flex items-center">
//                         <Clock className="h-5 w-5 text-blue-500 mr-2" />
//                         <div>
//                           <p className="font-medium text-blue-800">Delivery Time Slot</p>
//                           <Select
//                             value={deliveryTimeSlot}
//                             onValueChange={(value) => setDeliveryTimeSlot(value as TimeSlot)}
//                           >
//                             <SelectTrigger className="w-full mt-2">
//                               <SelectValue placeholder="Select delivery time" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {timeSlots.map((slot) => (
//                                 <SelectItem key={slot.value} value={slot.value}>
//                                   {slot.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <p className="text-blue-600 text-sm mt-2">
//                             {currentHour < 9 
//                               ? "Available for delivery today" 
//                               : currentHour < 21 
//                                 ? "Available for delivery today" 
//                                 : "Will be delivered tomorrow morning"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
              
//               {/* Shipping Address */}
//               <Card className="mb-6">
//                 <CardHeader>
//                   <div className="flex items-center">
//                     <Home className="mr-2 h-5 w-5 text-primary" />
//                     <CardTitle>Delivery Address</CardTitle>
//                   </div>
//                   <CardDescription>
//                     Select where you want the equipment delivered
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
//   variant="outline" 
//   className="w-full"
//   onClick={() => navigate("/addresses")}
// >
//   <Plus className="mr-2 h-4 w-4" />
//   Add New Address
// </Button>
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
//                   <Tabs defaultValue="cash-on-delivery" onValueChange={setPaymentMethod}>
//                     <TabsList className="grid w-full grid-cols-2">
//                       <TabsTrigger value="cash-on-delivery" className="flex items-center">
//                         <DollarSign className="mr-2 h-4 w-4" />
//                         Cash on Delivery
//                       </TabsTrigger>
//                       <TabsTrigger value="razorpay" className="flex items-center">
//                         <CreditCard className="mr-2 h-4 w-4" />
//                         Razorpay
//                       </TabsTrigger>
//                     </TabsList>
//                     <TabsContent value="cash-on-delivery" className="mt-4">
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-medium text-gray-800 mb-2">Cash on Delivery</h4>
//                         <p className="text-gray-600 text-sm">
//                           Pay with cash when your equipment is delivered. Please ensure someone is available to receive and inspect the equipment.
//                         </p>
//                       </div>
//                     </TabsContent>
//                     <TabsContent value="razorpay" className="mt-4">
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-medium text-gray-800 mb-2">Secure Online Payment</h4>
//                         <p className="text-gray-600 text-sm">
//                           Pay securely using Razorpay. You can use credit/debit cards, UPI, net banking, and other payment methods.
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
//                     Review your rental details
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
//                             <p className="text-xs text-gray-500">
//                               Qty: {item.quantity} × {effectiveRentalDays} day{effectiveRentalDays > 1 ? 's' : ''}
//                             </p>
//                             <p className="text-xs text-gray-400">
//                               ({rentalHours} hours total)
//                             </p>
//                           </div>
//                         </div>
//                         <p className="text-sm font-medium text-gray-900">
//                           {formatCurrency(item.products.selling_price * item.quantity * effectiveRentalDays)}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
                  
//                   {/* Pricing Details */}
//                   <div className="border-t border-gray-200 pt-4 space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Subtotal ({effectiveRentalDays} day{effectiveRentalDays > 1 ? 's' : ''})</span>
//                       <span className="font-medium">{formatCurrency(subtotal)}</span>
//                     </div>
                    
//                     {shipping > 0 && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Shipping</span>
//                         <span className="font-medium">{formatCurrency(shipping)}</span>
//                       </div>
//                     )}
                    
//                     {discount > 0 && (
//                       <div className="flex justify-between text-green-600">
//                         <span>20% Discount ({effectiveRentalDays} days+)</span>
//                         <span className="font-medium">-{formatCurrency(discount)}</span>
//                       </div>
//                     )}
                    
//                     {instantDeliveryCharge > 0 && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-600 flex items-center">
//                           <Zap className="h-3 w-3 mr-1 text-yellow-500" />
//                           Instant Delivery
//                         </span>
//                         <span className="font-medium">{formatCurrency(instantDeliveryCharge)}</span>
//                       </div>
//                     )}
                    
//                     {lateNightCharge > 0 && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Late Night Charge</span>
//                         <span className="font-medium">{formatCurrency(lateNightCharge)}</span>
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Total */}
//                   <div className="border-t border-gray-200 pt-4">
//                     <div className="flex justify-between">
//                       <span className="text-lg font-bold">Total</span>
//                       <span className="text-lg font-bold">{formatCurrency(total)}</span>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Rental period: {new Date(`${startDate}T${startTime}`).toLocaleString()} 
//                       <br />
//                       to {new Date(`${endDate}T${endTime}`).toLocaleString()}
//                       <br />
//                       ({effectiveRentalDays} day{effectiveRentalDays > 1 ? 's' : ''} / {rentalHours} hours)
//                     </p>
//                   </div>
                  
//                   {/* Delivery Information */}
//                   <div className="bg-gray-50 p-4 rounded-lg mt-4">
//                     <div className="flex items-center mb-2">
//                       <Truck className="h-5 w-5 text-primary mr-2" />
//                       <h4 className="font-medium text-gray-800">Delivery Information</h4>
//                     </div>
//                     <p className="text-sm text-gray-600 mb-2">
//                       {currentHour < 9 
//                         ? "Your equipment will be delivered between 9 AM and 12 PM today" 
//                         : currentHour < 12
//                           ? "Your equipment will be delivered between 12 PM and 3 PM today"
//                           : currentHour < 15 
//                             ? "Your equipment will be delivered between 3 PM and 6 PM today" 
//                             : currentHour < 21 
//                               ? "Your equipment will be delivered between 6 PM and 9 PM today" 
//                               : "Your equipment will be delivered between 9 AM and 12 PM tomorrow (late night charge applied)"}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Selected time slot: {timeSlots.find(slot => slot.value === deliveryTimeSlot)?.label}
//                     </p>
//                     {deliveryOption === "instant" && (
//                       <p className="text-sm text-yellow-600 font-medium mt-2">
//                         ⚡ Instant delivery selected - Equipment will arrive within 60 minutes
//                       </p>
//                     )}
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   <Button 
//                     className="w-full bg-primary hover:bg-blue-600"
//                     size="lg"
//                     onClick={handlePlaceOrder}
//                     disabled={isProcessing || !selectedAddressId}
//                   >
//                     {isProcessing ? (
//                       <>
//                         <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                         {paymentMethod === 'razorpay' ? 'Opening Payment...' : 'Processing...'}
//                       </>
//                     ) : (
//                       paymentMethod === 'razorpay' ? `Pay ${formatCurrency(total)}` : `Place Order ${formatCurrency(total)}`
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Home,
  Plus,
  RefreshCw,
  Truck,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useForceRefresh } from '@/hooks/useForceRefresh';

type Address = {
  id: string; // Changed from number to string (UUID)
  userId: string; // Changed from number to string
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  name: string;
  phone: string;
  addressType: string;
  landmark: string | null;
};

type DeliveryOption = "standard" | "instant";
type TimeSlot = "3-6" | "6-9" | "9-12" | "12-3";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  
  // State declarations
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null); // Changed from number to string
  const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  
  // Rental states
  const [rentalDays, setRentalDays] = useState<number>(1);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("standard");
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<TimeSlot>("3-6");
  
  // Date and time states
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("18:00");

   const forceRefreshKey = useForceRefresh();
  
  // Add this to your main useEffect dependencies
  useEffect(() => {
    // Your initialization logic here
    if (user?.id) {
      refetchAddresses();
    }
  }, [forceRefreshKey, user?.id]);
  
  // Available time slots
  const timeSlots = [
    { value: "9-12", label: "9 AM - 12 PM" },
    { value: "12-3", label: "12 PM - 3 PM" },
    { value: "3-6", label: "3 PM - 6 PM" },
    { value: "6-9", label: "6 PM - 9 PM" },
  ];

  // Fetch addresses
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
          .eq('user_id', user?.id)
          .order('is_default', { ascending: false });

        if (error) throw error;

        return data.map(addr => ({
          id: addr.id, // This is a string (UUID)
          userId: addr.user_id, // This is a string (UUID)
          addressLine1: addr.address_line1 || '',
          addressLine2: addr.address_line2 || null,
          city: addr.city || '',
          state: addr.state || '',
          postalCode: addr.postal_code || '',
          country: addr.country || '',
          isDefault: addr.is_default || false,
          name: addr.name || 'Untitled Address',
          phone: addr.phone || '',
          addressType: addr.address_type || 'home',
          landmark: addr.landmark || null
        }));
      } catch (error) {
        console.error('Error fetching addresses:', error);
        throw error;
      }
    },
  });

  // Refresh addresses when returning from addresses page
  useEffect(() => {
    if (user?.id) {
      refetchAddresses();
    }
  }, [user?.id]);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(tomorrow.toISOString().split('T')[0]);
    
    // Set default times
    setStartTime("10:00");
    setEndTime("18:00");
  }, []);

  // Calculate rental period based on selected dates
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Ensure at least 1 day
      setRentalDays(daysDiff >= 1 ? daysDiff : 1);
    }
  }, [startDate, endDate]);

  // Determine delivery time slot based on current time
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 9) {
      setDeliveryTimeSlot("9-12");
    } else if (currentHour < 12) {
      setDeliveryTimeSlot("12-3");
    } else if (currentHour < 15) {
      setDeliveryTimeSlot("3-6");
    } else if (currentHour < 21) {
      setDeliveryTimeSlot("6-9");
    } else {
      setDeliveryTimeSlot("9-12");
    }
  }, []);

  // Calculate exact rental hours between start and end datetime
  const calculateRentalHours = () => {
    if (!startDate || !endDate || !startTime || !endTime) return 0;
    
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    // Calculate difference in milliseconds
    const timeDiff = endDateTime.getTime() - startDateTime.getTime();
    
    // Convert to hours
    const hoursDiff = Math.ceil(timeDiff / (1000 * 3600));
    
    // Ensure minimum of 24 hours (1 day)
    return hoursDiff >= 24 ? hoursDiff : 24;
  };

  // Calculate rental days based on hours (24 hours = 1 day)
  const calculateRentalDaysFromHours = (hours: number) => {
    return Math.ceil(hours / 24);
  };

  // Calculate order summary with all charges
  const calculateOrderSummary = () => {
    const rentalHours = calculateRentalHours();
    const effectiveRentalDays = calculateRentalDaysFromHours(rentalHours);
    
    const subtotal = cart?.items.reduce((acc, item) => 
      acc + (item?.products?.selling_price * item?.quantity * effectiveRentalDays), 0) || 0;
    
    const shipping = subtotal > 50 ? 0 : 5.99;
    
    // Calculate discount for rentals > 5 days
    let discount = 0;
    if (effectiveRentalDays > 5) {
      discount = subtotal * 0.20; // 20% discount
    }
    
    // Late night charge (after 9 PM)
    const currentHour = new Date().getHours();
    const lateNightCharge = currentHour >= 21 ? 100 : 0;
    
    // Instant delivery charge
    const instantDeliveryCharge = deliveryOption === "instant" ? 100 : 0;
    
    const totalBeforeCharges = subtotal + shipping - discount;
    const total = totalBeforeCharges + lateNightCharge + instantDeliveryCharge;
    
    return {
      subtotal,
      shipping,
      discount,
      lateNightCharge,
      instantDeliveryCharge,
      total,
      rentalDays: effectiveRentalDays,
      rentalHours,
      effectiveRentalDays
    };
  };

  const {
    subtotal,
    shipping,
    discount,
    lateNightCharge,
    instantDeliveryCharge,
    total,
    rentalHours,
    effectiveRentalDays
  } = calculateOrderSummary();

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
      navigate("/cart");
    }
  }, [cart, navigate, toast]);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    if (paymentMethod === 'razorpay') {
      loadRazorpay();
    }
  }, [paymentMethod]);

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

    // Validate dates
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    if (endDateTime <= startDateTime) {
      toast({
        title: "Invalid rental period",
        description: "End date/time must be after start date/time.",
        variant: "destructive",
      });
      return;
    }

    // Show delivery time message
    const currentHour = new Date().getHours();
    let deliveryMessage = "";
    if (currentHour < 9) {
      deliveryMessage = "Your order will be delivered between 9 AM and 12 PM";
    } else if (currentHour < 12) {
      deliveryMessage = "Your order will be delivered between 12 PM and 3 PM";
    } else if (currentHour < 15) {
      deliveryMessage = "Your order will be delivered between 3 PM and 6 PM";
    } else if (currentHour < 21) {
      deliveryMessage = "Your order will be delivered between 6 PM and 9 PM";
    } else {
      deliveryMessage = "Your order will be delivered between 9 AM and 12 PM tomorrow";
    }

    toast({
      title: "Delivery Information",
      description: deliveryMessage,
      variant: "default",
    });

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      await handleCashOnDelivery();
    }
  };

  const handleCashOnDelivery = async () => {
    setIsPlacingOrder(true);
    
    try {
      const order = await createOrder('pending', 'cash-on-delivery');
      setOrderId(order.id);
      setOrderPlaced(true);
      refreshCart();

      const { error: deleteCartError } = await supabase
        .from("carts")
        .delete()
        .eq("id", cart?.id);
      
      if (deleteCartError) {
        console.log('Cart delete failed', deleteCartError);
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

  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      toast({
        title: "Payment gateway not loaded",
        description: "Please wait for the payment gateway to load and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsRazorpayLoading(true);

    try {
      const order = await createOrder('pending', 'razorpay');
      
      const { data: razorpayOrder, error: razorpayError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { 
          amount: Math.round(total * 100), // Convert to paise
          currency: 'INR',
          receipt: order.id
        }
      });

      if (razorpayError) {
        console.error('Razorpay order creation error:', razorpayError);
        throw new Error(razorpayError.message || `Failed to create Razorpay order: ${razorpayError.message}`);
      }

      if (!razorpayOrder) {
        throw new Error('No response from payment gateway');
      }

      const options = {
        key: razorpayOrder.key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'RENTXP Gaming Zone',
        description: `Order for ${cart?.items.length} items`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            await updateOrderStatus(
              order.id,
              'confirmed',
              response.razorpay_payment_id,
              response.razorpay_order_id
            );
            
            setOrderId(order.id);
            setOrderPlaced(true);
            refreshCart();

            const { error: deleteCartError } = await supabase
              .from("carts")
              .delete()
              .eq("id", cart?.id);
            
            if (deleteCartError) {
              console.log('Cart delete failed', deleteCartError);
            }

            toast({
              title: "Payment Successful!",
              description: "Your order has been confirmed.",
              variant: "default",
            });

            setTimeout(() => {
              navigate(`/order-success/${order.id}`);
            }, 2000);
            
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support with your payment ID.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#4F46E5'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error("Razorpay payment failed:", error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "There was an error processing your payment.",
        variant: "destructive",
      });
    } finally {
      setIsRazorpayLoading(false);
    }
  };

 const createOrder = async (status: string, paymentMethod: string) => {
  if (!selectedAddressId || !cart || !user) {
    throw new Error("Missing required data for order creation");
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("User not authenticated");
  }

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

  // Format datetime for database - combine date and time into timestamp
  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);

  const orderData: any = {
    customer_id: session.user.id,
    total_amount: subtotal,
    final_total: total,
    delivery_address: deliveryAddress,
    status: status,
    payment_method: paymentMethod,
    payment_status: paymentMethod === 'cash-on-delivery' ? 'pending' : 'paid',
    start_date: startDateTime.toISOString(),
    end_date: endDateTime.toISOString(),
    rental_days: effectiveRentalDays,
    delivery_time_slot: deliveryTimeSlot,
    is_instant_delivery: deliveryOption === "instant",
    late_night_charge: lateNightCharge,
    instant_delivery_charge: instantDeliveryCharge,
    discount_amount: discount,
    rental_hours: rentalHours,
    rental_start_datetime: startDateTime.toISOString(),
    rental_end_datetime: endDateTime.toISOString()
  };

  // Create order with rental details
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (orderError) {
    console.error('Order creation error:', orderError);
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  // Create order items WITHOUT rental_hours (since it doesn't exist in order_items table)
  const orderItemsWithOrderId = cart.items.map(item => ({
    product_id: item?.product_id,
    quantity: item.quantity,
    unit_price: item.products.selling_price,
    order_id: order.id,
    rental_days: effectiveRentalDays,
    vendor_id: item.products.vendor_id
    // Remove rental_hours since it doesn't exist in order_items table
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsWithOrderId);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    throw new Error(`Failed to add order items: ${itemsError.message}`);
  }

  return order;
};

  const updateOrderStatus = async (orderId: string, status: string, paymentId?: string, razorpayOrderId?: string) => {
    const updateData: any = {
      status: status,
      payment_status: status === 'confirmed' ? 'paid' : status
    };

    if (paymentId) {
      updateData.payment_id = paymentId;
    }

    if (razorpayOrderId) {
      updateData.razorpay_order_id = razorpayOrderId;
    }

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error) {
      console.error("Failed to update order status:", error);
      throw error;
    }
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

  const isProcessing = isPlacingOrder || isRazorpayLoading;
  const currentHour = new Date().getHours();

  return (
    <>
      <Helmet>
        <title>Checkout | RENTXP</title>
        <meta name="description" content="Complete your rental purchase by selecting rental period and delivery options." />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout - Rental Gaming Zone</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Checkout Form */}
            <div className="flex-1">
              {/* Rental Period */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    <CardTitle>Rental Period</CardTitle>
                  </div>
                  <CardDescription>
                    Select your rental start and end dates with specific times
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Start Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-date">Start Date</Label>
                        <input
                          type="date"
                          id="start-date"
                          value={startDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <Label htmlFor="start-time">Start Time</Label>
                        <Select
                          value={startTime}
                          onValueChange={setStartTime}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => {
                              const hour = i + 8; // 8 AM to 7 PM
                              return hour <= 19 && [
                                <SelectItem key={`${hour}:00`} value={`${hour.toString().padStart(2, '0')}:00`}>
                                  {hour}:00 {hour < 12 ? 'AM' : hour === 12 ? 'PM' : hour - 12 < 12 ? 'PM' : 'AM'}
                                </SelectItem>,
                                <SelectItem key={`${hour}:30`} value={`${hour.toString().padStart(2, '0')}:30`}>
                                  {hour}:30 {hour < 12 ? 'AM' : hour === 12 ? 'PM' : hour - 12 < 12 ? 'PM' : 'AM'}
                                </SelectItem>
                              ];
                            }).flat()}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* End Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="end-date">End Date</Label>
                        <input
                          type="date"
                          id="end-date"
                          value={endDate}
                          min={startDate || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-time">End Time</Label>
                        <Select
                          value={endTime}
                          onValueChange={setEndTime}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select end time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => {
                              const hour = i + 8; // 8 AM to 7 PM
                              return hour <= 19 && [
                                <SelectItem key={`${hour}:00`} value={`${hour.toString().padStart(2, '0')}:00`}>
                                  {hour}:00 {hour < 12 ? 'AM' : hour === 12 ? 'PM' : hour - 12 < 12 ? 'PM' : 'AM'}
                                </SelectItem>,
                                <SelectItem key={`${hour}:30`} value={`${hour.toString().padStart(2, '0')}:30`}>
                                  {hour}:30 {hour < 12 ? 'AM' : hour === 12 ? 'PM' : hour - 12 < 12 ? 'PM' : 'AM'}
                                </SelectItem>
                              ];
                            }).flat()}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Rental Summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-blue-800">Rental Summary</h4>
                          <p className="text-blue-600 text-sm mt-1">
                            From: {new Date(`${startDate}T${startTime}`).toLocaleString()} 
                            <br />
                            To: {new Date(`${endDate}T${endTime}`).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-800">
                            {rentalHours} hours ({effectiveRentalDays} day{effectiveRentalDays > 1 ? 's' : ''})
                          </p>
                          <p className="text-blue-600 text-sm">
                            {Math.floor(rentalHours / 24)} day{Math.floor(rentalHours / 24) > 1 ? 's' : ''} {rentalHours % 24} hour{rentalHours % 24 > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {effectiveRentalDays > 5 && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <p className="text-green-700 font-medium">
                          🎉 You qualify for 20% discount on rental for more than 5 days!
                        </p>
                      </div>
                    )}
                    
                    {/* Validation message */}
                    {startDate && endDate && startTime && endTime && (
                      (() => {
                        const startDateTime = new Date(`${startDate}T${startTime}`);
                        const endDateTime = new Date(`${endDate}T${endTime}`);
                        const isValid = endDateTime > startDateTime;
                        
                        return !isValid && (
                          <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-700 font-medium">
                              ⚠️ End date/time must be after start date/time
                            </p>
                          </div>
                        );
                      })()
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Delivery Options */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center">
                    <Truck className="mr-2 h-5 w-5 text-primary" />
                    <CardTitle>Delivery Options</CardTitle>
                  </div>
                  <CardDescription>
                    Choose your preferred delivery method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <RadioGroup 
                      value={deliveryOption} 
                      onValueChange={(value) => setDeliveryOption(value as DeliveryOption)}
                      className="space-y-4"
                    >
                      <div className={`border rounded-lg p-4 ${
                        deliveryOption === "standard" ? 'border-primary bg-blue-50' : 'border-gray-200'
                      }`}>
                        <div className="flex items-start">
                          <RadioGroupItem 
                            value="standard" 
                            id="standard-delivery" 
                            className="mt-1"
                          />
                          <div className="ml-3">
                            <Label 
                              htmlFor="standard-delivery"
                              className="font-medium text-gray-900 flex items-center"
                            >
                              Standard Delivery
                              <span className="ml-2 text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
                                Free
                              </span>
                            </Label>
                            <p className="text-gray-600 text-sm mt-1">
                              Delivered within the scheduled time slot
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`border rounded-lg p-4 ${
                        deliveryOption === "instant" ? 'border-primary bg-blue-50' : 'border-gray-200'
                      }`}>
                        <div className="flex items-start">
                          <RadioGroupItem 
                            value="instant" 
                            id="instant-delivery" 
                            className="mt-1"
                          />
                          <div className="ml-3">
                            <Label 
                              htmlFor="instant-delivery"
                              className="font-medium text-gray-900 flex items-center"
                            >
                              <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                              Instant Delivery
                              <span className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">
                                + ₹100
                              </span>
                            </Label>
                            <p className="text-gray-600 text-sm mt-1">
                              Delivered within 60 minutes (Extra charge applies)
                            </p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium text-blue-800">Delivery Time Slot</p>
                          <Select
                            value={deliveryTimeSlot}
                            onValueChange={(value) => setDeliveryTimeSlot(value as TimeSlot)}
                          >
                            <SelectTrigger className="w-full mt-2">
                              <SelectValue placeholder="Select delivery time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot.value} value={slot.value}>
                                  {slot.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-blue-600 text-sm mt-2">
                            {currentHour < 9 
                              ? "Available for delivery today" 
                              : currentHour < 21 
                                ? "Available for delivery today" 
                                : "Will be delivered tomorrow morning"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Shipping Address */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center">
                    <Home className="mr-2 h-5 w-5 text-primary" />
                    <CardTitle>Delivery Address</CardTitle>
                  </div>
                  <CardDescription>
                    Select where you want the equipment delivered
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
                        onClick={() => navigate("/addresses", { 
                          state: { 
                            fromCheckout: true, 
                            redirectTo: "/checkout" 
                          } 
                        })}
                        className="bg-primary hover:bg-blue-600"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Address
                      </Button>
                    </div>
                  ) : (
                    <RadioGroup 
                      value={selectedAddressId || ""} 
                      onValueChange={(value) => setSelectedAddressId(value)}
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
                              value={address.id} 
                              id={`address-${address.id}`} 
                              className="mt-1"
                            />
                            <div className="ml-3">
                              <Label 
                                htmlFor={`address-${address.id}`}
                                className="font-medium text-gray-900 flex items-center"
                              >
                                {address.name || address.addressLine1}
                                {address.isDefault && (
                                  <span className="ml-2 text-xs text-white bg-primary px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </Label>
                              <div className="text-gray-500 text-sm mt-1">
                                <p>{address.addressLine1}</p>
                                {address.addressLine2 && <p>{address.addressLine2}</p>}
                                <p>
                                  {address.city}, {address.state} {address.postalCode}
                                </p>
                                <p>{address.country}</p>
                                {address.phone && <p className="text-xs">Phone: {address.phone}</p>}
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
                    onClick={() => navigate("/addresses", { 
                      state: { 
                        fromCheckout: true, 
                        redirectTo: "/checkout" 
                      } 
                    })}
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
                  <Tabs defaultValue="cash-on-delivery" onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="cash-on-delivery" className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Cash on Delivery
                      </TabsTrigger>
                      {/* <TabsTrigger value="razorpay" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Razorpay
                      </TabsTrigger> */}
                    </TabsList>
                    <TabsContent value="cash-on-delivery" className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Cash on Delivery</h4>
                        <p className="text-gray-600 text-sm">
                          Pay with cash when your equipment is delivered. Please ensure someone is available to receive and inspect the equipment.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="razorpay" className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Secure Online Payment</h4>
                        <p className="text-gray-600 text-sm">
                          Pay securely using Razorpay. You can use credit/debit cards, UPI, net banking, and other payment methods.
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
                    Review your rental details
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
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} × {effectiveRentalDays} day{effectiveRentalDays > 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-gray-400">
                              ({rentalHours} hours total)
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.products.selling_price * item.quantity * effectiveRentalDays)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pricing Details */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({effectiveRentalDays} day{effectiveRentalDays > 1 ? 's' : ''})</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    
                    {shipping > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">{formatCurrency(shipping)}</span>
                      </div>
                    )}
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>20% Discount ({effectiveRentalDays} days+)</span>
                        <span className="font-medium">-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    
                    {instantDeliveryCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 flex items-center">
                          <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                          Instant Delivery
                        </span>
                        <span className="font-medium">{formatCurrency(instantDeliveryCharge)}</span>
                      </div>
                    )}
                    
                    {lateNightCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Late Night Charge</span>
                        <span className="font-medium">{formatCurrency(lateNightCharge)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold">{formatCurrency(total)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Rental period: {new Date(`${startDate}T${startTime}`).toLocaleString()} 
                      <br />
                      to {new Date(`${endDate}T${endTime}`).toLocaleString()}
                      <br />
                      ({effectiveRentalDays} day{effectiveRentalDays > 1 ? 's' : ''} / {rentalHours} hours)
                    </p>
                  </div>
                  
                  {/* Delivery Information */}
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <div className="flex items-center mb-2">
                      <Truck className="h-5 w-5 text-primary mr-2" />
                      <h4 className="font-medium text-gray-800">Delivery Information</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {currentHour < 9 
                        ? "Your equipment will be delivered between 9 AM and 12 PM today" 
                        : currentHour < 12
                          ? "Your equipment will be delivered between 12 PM and 3 PM today"
                          : currentHour < 15 
                            ? "Your equipment will be delivered between 3 PM and 6 PM today" 
                            : currentHour < 21 
                              ? "Your equipment will be delivered between 6 PM and 9 PM today" 
                              : "Your equipment will be delivered between 9 AM and 12 PM tomorrow (late night charge applied)"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Selected time slot: {timeSlots.find(slot => slot.value === deliveryTimeSlot)?.label}
                    </p>
                    {deliveryOption === "instant" && (
                      <p className="text-sm text-yellow-600 font-medium mt-2">
                        ⚡ Instant delivery selected - Equipment will arrive within 60 minutes
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-primary hover:bg-blue-600"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !selectedAddressId}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {paymentMethod === 'razorpay' ? 'Opening Payment...' : 'Processing...'}
                      </>
                    ) : (
                      paymentMethod === 'razorpay' ? `Pay ${formatCurrency(total)}` : `Place Order ${formatCurrency(total)}`
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