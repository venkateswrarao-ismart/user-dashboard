// // import { useState, useEffect } from "react";
// // import { Link, useLocation, useNavigate } from "react-router-dom";
// // import { Helmet } from "react-helmet";
// // import { Trash2, ShoppingCart, ChevronRight, RefreshCw } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { useCart } from "@/hooks/useCart";
// // import { useAuth } from "@/hooks/useAuth";
// // import { formatCurrency } from "@/lib/utils";
// // import { useToast } from "@/hooks/use-toast";

// // const Cart = () => {
// //   const navigate = useNavigate()
// //   const { cart, removeItem, updateItemQuantity, isLoading } = useCart();
// //   const { isAuthenticated } = useAuth();
// //   const { toast } = useToast();
// //   const [isUpdatingQuantity, setIsUpdatingQuantity] = useState<{[key: number]: boolean}>({});
// //   const [isRemovingItem, setIsRemovingItem] = useState<{[key: number]: boolean}>({});
// //   const [promoCode, setPromoCode] = useState("");
// //   const [isApplyingPromo, setIsApplyingPromo] = useState(false);

// //   // Calculate cart summary
// //   const subtotal = cart?.total || 0;
// //   const shipping = subtotal > 50 ? 0 : 5.99;
// //   const discount = 0; // This would be calculated based on applied promo code
// //   const total = subtotal + shipping - discount;

// //   const handleQuantityChange = async (itemId: number, productId: number, newQuantity: number) => {
// //     if (newQuantity < 1) return;
    
// //     setIsUpdatingQuantity(prev => ({ ...prev, [itemId]: true }));
// //     try {
// //       await updateItemQuantity(itemId.toString(), newQuantity);
// //     } catch (error) {
// //       console.error("Failed to update quantity:", error);
// //     } finally {
// //       setIsUpdatingQuantity(prev => ({ ...prev, [itemId]: false }));
// //     }
// //   };

// //   const handleRemoveItem = async (itemId: number) => {
// //     setIsRemovingItem(prev => ({ ...prev, [itemId]: true }));
// //     try {
// //       await removeItem(itemId.toString());
// //     } catch (error) {
// //       console.error("Failed to remove item:", error);
// //     } finally {
// //       setIsRemovingItem(prev => ({ ...prev, [itemId]: false }));
// //     }
// //   };

// //   const handleApplyPromoCode = () => {
// //     if (!promoCode) return;
    
// //     setIsApplyingPromo(true);
    
// //     // Simulate promo code check
// //     setTimeout(() => {
// //       toast({
// //         title: "Invalid promo code",
// //         description: "The promo code you entered is not valid or has expired.",
// //         variant: "destructive",
// //       });
// //       setIsApplyingPromo(false);
// //     }, 1000);
// //   };

// //   const handleProceedToCheckout = () => {
// //     if (!isAuthenticated) {
// //       toast({
// //         title: "Sign in required",
// //         description: "Please sign in to continue with checkout.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }
    
// //     if (!cart || cart.items.length === 0) {
// //       toast({
// //         title: "Empty cart",
// //         description: "Your cart is empty. Add some items before checkout.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }
    
// //     navigate("/checkout");
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="bg-gray-50 py-8">
// //         <div className="container mx-auto px-4">
// //           <div className="flex justify-center items-center py-16">
// //             <RefreshCw className="h-8 w-8 text-primary animate-spin" />
// //             <span className="ml-2 text-xl font-medium">Loading your cart...</span>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!cart || cart.items.length === 0) {
// //     return (
// //       <div className="bg-gray-50 py-8">
// //         <div className="container mx-auto px-4">
// //           <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
          
// //           <div className="bg-white rounded-lg shadow-sm p-8 text-center">
// //             <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
// //               <ShoppingCart className="w-full h-full" />
// //             </div>
// //             <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
// //             <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
// //             <Button 
// //               className="bg-primary hover:bg-blue-600" 
// //               size="lg"
// //               onClick={() => navigate("/products")}
// //             >
// //               Start Shopping
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       <Helmet>
// //         <title>Your Cart | MultiVendor Marketplace</title>
// //         <meta name="description" content="Review the items in your shopping cart, update quantities, and proceed to checkout." />
// //       </Helmet>
      
// //       <div className="bg-gray-50 py-8">
// //         <div className="container mx-auto px-4">
// //           {/* Breadcrumb */}
// //           <div className="flex items-center text-sm text-gray-500 mb-6">
// //             <Link to="/">
// //               <a className="hover:text-primary">Home</a>
// //             </Link>
// //             <ChevronRight className="h-4 w-4 mx-2" />
// //             <span className="text-gray-700">Shopping Cart</span>
// //           </div>
          
// //           <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
          
// //           <div className="flex flex-col lg:flex-row gap-8">
// //             {/* Cart Items */}
// //             <div className="flex-1">
// //               <div className="bg-white rounded-lg shadow-sm overflow-hidden">
// //                 <div className="p-6 border-b border-gray-100">
// //                   <h2 className="text-xl font-semibold">Cart Items ({cart.items.length})</h2>
// //                 </div>
                
// //                 <div className="divide-y divide-gray-100">
// //                   {cart.items.map((item) => (
// //                     <div key={item.id} className="p-6 flex flex-col sm:flex-row">
// //                       <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
// //                         <img 
// //                           src={item.product.image_url} 
// //                           alt={item.product.name} 
// //                           className="w-full h-full object-cover"
// //                         />
// //                       </div>
// //                       <div className="flex-1 sm:ml-6">
// //                         <div className="flex flex-col sm:flex-row justify-between">
// //                           <div>
// //                             <Link to={`/products/${item.products.name}`}>
// //                               <a className="text-lg font-medium text-gray-900 hover:text-primary">
// //                                 {item.products.name}
// //                               </a>
// //                             </Link>
// //                             <p className="text-sm text-gray-500 mb-2">
// //                               ID: {item.products.id}
// //                             </p>
// //                           </div>
// //                           <div className="text-right">
// //                             <p className="text-lg font-bold text-gray-900">
// //                               {formatCurrency(item.price * item.quantity)}
// //                             </p>
// //                             <p className="text-sm text-gray-500">
// //                               {formatCurrency(item.price)} each
// //                             </p>
// //                           </div>
// //                         </div>
                        
// //                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
// //                           <div className="flex items-center mb-4 sm:mb-0">
// //                             <span className="text-sm text-gray-600 mr-3">Quantity:</span>
// //                             <div className="flex items-center">
// //                               <button 
// //                                 className="w-8 h-8 rounded-l border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
// //                                 onClick={() => handleQuantityChange(item.id, Number(item.productId), item.quantity - 1)}
// //                                 disabled={isUpdatingQuantity[item.id] || item.quantity <= 1}
// //                               >
// //                                 -
// //                               </button>
// //                               <div className="w-10 h-8 border-t border-b border-gray-300 flex items-center justify-center">
// //                                 {isUpdatingQuantity[item.id] ? (
// //                                   <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />
// //                                 ) : (
// //                                   item.quantity
// //                                 )}
// //                               </div>
// //                               <button 
// //                                 className="w-8 h-8 rounded-r border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
// //                                 onClick={() => handleQuantityChange(item.id, Number(item.product_id), item.quantity + 1)}
// //                                 disabled={isUpdatingQuantity[item.id]}
// //                               >
// //                                 +
// //                               </button>
// //                             </div>
// //                           </div>
                          
// //                           <button 
// //                             className="text-sm text-red-500 flex items-center hover:text-red-700"
// //                             onClick={() => handleRemoveItem(item.id)}
// //                             disabled={isRemovingItem[item.id]}
// //                           >
// //                             {isRemovingItem[item.id] ? (
// //                               <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
// //                             ) : (
// //                               <Trash2 className="h-4 w-4 mr-1" />
// //                             )}
// //                             {isRemovingItem[item.id] ? "Removing..." : "Remove"}
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
                
// //                 <div className="p-6 border-t border-gray-100 bg-gray-50">
// //                   <Link to="/products">
// //                     <a className="text-primary hover:underline flex items-center">
// //                       <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
// //                       Continue Shopping
// //                     </a>
// //                   </Link>
// //                 </div>
// //               </div>
// //             </div>
            
// //             {/* Order Summary */}
// //             <div className="lg:w-80">
// //               <div className="bg-white rounded-lg shadow-sm">
// //                 <div className="p-6 border-b border-gray-100">
// //                   <h2 className="text-xl font-semibold">Order Summary</h2>
// //                 </div>
                
// //                 <div className="p-6">
// //                   <div className="space-y-4">
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
// //                     {discount > 0 && (
// //                       <div className="flex justify-between text-green-600">
// //                         <span>Discount</span>
// //                         <span className="font-medium">-{formatCurrency(discount)}</span>
// //                       </div>
// //                     )}
// //                     <div className="border-t border-gray-200 pt-4 mt-4">
// //                       <div className="flex justify-between">
// //                         <span className="text-lg font-bold">Total</span>
// //                         <span className="text-lg font-bold">{formatCurrency(total)}</span>
// //                       </div>
// //                       <p className="text-xs text-gray-500 mt-1">
// //                         Including VAT
// //                       </p>
// //                     </div>
// //                   </div>
                  
// //                   <div className="mt-6">
// //                     <div className="flex mb-4">
// //                       <Input
// //                         type="text"
// //                         placeholder="Promo code"
// //                         className="rounded-r-none"
// //                         value={promoCode}
// //                         onChange={(e) => setPromoCode(e.target.value)}
// //                       />
// //                       <Button 
// //                         variant="outline" 
// //                         className="rounded-l-none border-l-0"
// //                         onClick={handleApplyPromoCode}
// //                         disabled={isApplyingPromo || !promoCode}
// //                       >
// //                         {isApplyingPromo ? 
// //                           <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : 
// //                           "Apply"}
// //                       </Button>
// //                     </div>
                    
// //                     <Button 
// //                       className="w-full bg-primary hover:bg-blue-600"
// //                       size="lg"
// //                       onClick={handleProceedToCheckout}
// //                     >
// //                       Proceed to Checkout
// //                     </Button>
                    
// //                     <div className="mt-4 text-center">
// //                       <p className="text-sm text-gray-500">
// //                         Secure checkout powered by our payment partners
// //                       </p>
// //                       <div className="flex justify-center space-x-2 mt-2">
// //                         <div className="w-10 h-6 bg-gray-200 rounded"></div>
// //                         <div className="w-10 h-6 bg-gray-200 rounded"></div>
// //                         <div className="w-10 h-6 bg-gray-200 rounded"></div>
// //                         <div className="w-10 h-6 bg-gray-200 rounded"></div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default Cart;


// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet";
// import { Trash2, ShoppingCart, ChevronRight, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useCart } from "@/hooks/useCart";
// import { useAuth } from "@/hooks/useAuth";
// import { formatCurrency } from "@/lib/utils";
// import { useToast } from "@/hooks/use-toast";

// const Cart = () => {
//   const navigate = useNavigate();
//   const { cart, removeItem, updateItemQuantity, isLoading } = useCart();
//   const { isAuthenticated } = useAuth();
//   const { toast } = useToast();
//   const [isUpdatingQuantity, setIsUpdatingQuantity] = useState<{ [key: number]: boolean }>({});
//   const [isRemovingItem, setIsRemovingItem] = useState<{ [key: number]: boolean }>({});
//   const [promoCode, setPromoCode] = useState("");
//   const [isApplyingPromo, setIsApplyingPromo] = useState(false);

//   const subtotal = cart?.total || 0;
//   const shipping = subtotal > 50 ? 0 : 5.99;
//   const discount = 0;
//   const total = subtotal + shipping - discount;

//   const handleQuantityChange = async (itemId: number, newQuantity: number) => {
//     if (newQuantity < 1) return;

//     setIsUpdatingQuantity((prev) => ({ ...prev, [itemId]: true }));
//     try {
//       await updateItemQuantity(itemId.toString(), newQuantity);
//     } catch (error) {
//       console.error("Failed to update quantity:", error);
//     } finally {
//       setIsUpdatingQuantity((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleRemoveItem = async (itemId: number) => {
//     setIsRemovingItem((prev) => ({ ...prev, [itemId]: true }));
//     try {
//       await removeItem(itemId.toString());
//     } catch (error) {
//       console.error("Failed to remove item:", error);
//     } finally {
//       setIsRemovingItem((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleApplyPromoCode = () => {
//     if (!promoCode) return;

//     setIsApplyingPromo(true);
//     setTimeout(() => {
//       toast({
//         title: "Invalid promo code",
//         description: "The promo code you entered is not valid or has expired.",
//         variant: "destructive",
//       });
//       setIsApplyingPromo(false);
//     }, 1000);
//   };

//   const handleProceedToCheckout = () => {
//     if (!isAuthenticated) {
//       toast({
//         title: "Sign in required",
//         description: "Please sign in to continue with checkout.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!cart || cart.items.length === 0) {
//       toast({
//         title: "Empty cart",
//         description: "Your cart is empty. Add some items before checkout.",
//         variant: "destructive",
//       });
//       return;
//     }

//     navigate("/checkout");
//   };

//   if (isLoading) {
//     return (
//       <div className="bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-center items-center py-16">
//             <RefreshCw className="h-8 w-8 text-primary animate-spin" />
//             <span className="ml-2 text-xl font-medium">Loading your cart...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!cart || cart.items.length === 0) {
//     return (
//       <div className="bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
//           <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//             <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
//               <ShoppingCart className="w-full h-full" />
//             </div>
//             <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
//             <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
//             <Button className="bg-primary hover:bg-blue-600" size="lg" onClick={() => navigate("/products")}>
//               Start Shopping
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }


//   console.log("product image url ",cart)

//   return (
//     <>
//       <Helmet>
//         <title>Your Cart | MultiVendor Marketplace</title>
//         <meta name="description" content="Review the items in your shopping cart, update quantities, and proceed to checkout." />
//       </Helmet>

//       <div className="bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center text-sm text-gray-500 mb-6">
//             <Link to="/" className="hover:text-primary">
//               Home
//             </Link>
//             <ChevronRight className="h-4 w-4 mx-2" />
//             <span className="text-gray-700">Shopping Cart</span>
//           </div>

//           <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

//           <div className="flex flex-col lg:flex-row gap-8">
//             <div className="flex-1">
//               <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                 <div className="p-6 border-b border-gray-100">
//                   <h2 className="text-xl font-semibold">Cart Items ({cart.items.length})</h2>
//                 </div>

//                 <div className="divide-y divide-gray-100">
//                   {cart.items.map((item) => (
//                     <div key={item.id} className="p-6 flex flex-col sm:flex-row">
//                       <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
//                         <img src={item?.products?.image_url} alt={item?.products?.name} className="w-full h-full object-cover" />
//                       </div>
//                       <div className="flex-1 sm:ml-6">
//                         <div className="flex flex-col sm:flex-row justify-between">
//                           <div>
//                             <Link to={`/products/${item?.products?.id}`} className="text-lg font-medium text-gray-900 hover:text-primary">
//                               {item?.products?.name}
//                             </Link>
//                             <p className="text-sm text-gray-500 mb-2">ID: {item?.products?.id}</p>
//                           </div>
//                           <div className="text-right">
//                             <p className="text-lg font-bold text-gray-900">
//                               {item?.products?.selling_price * item?.quantity}
//                             </p>
//                             <p className="text-sm text-gray-500">{formatCurrency(item?.products?.selling_price)} each</p>
//                           </div>
//                         </div>

//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
//                           <div className="flex items-center mb-4 sm:mb-0">
//                             <span className="text-sm text-gray-600 mr-3">Quantity:</span>
//                             <div className="flex items-center">
//                               <button
//                                 className="w-8 h-8 rounded-l border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
//                                 onClick={() => handleQuantityChange(item?.id, item?.quantity - 1)}
//                                 disabled={isUpdatingQuantity[item?.id] || item?.quantity <= 1}
//                               >
//                                 -
//                               </button>
//                               <div className="w-10 h-8 border-t border-b border-gray-300 flex items-center justify-center">
//                                 {isUpdatingQuantity[item?.id] ? (
//                                   <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />
//                                 ) : (
//                                   item?.quantity
//                                 )}
//                               </div>
//                               <button
//                                 className="w-8 h-8 rounded-r border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
//                                 onClick={() => handleQuantityChange(item?.id, item?.quantity + 1)}
//                                 disabled={isUpdatingQuantity[item?.id]}
//                               >
//                                 +
//                               </button>
//                             </div>
//                           </div>

//                           <button
//                             className="text-sm text-red-500 flex items-center hover:text-red-700"
//                             onClick={() => handleRemoveItem(item?.id)}
//                             disabled={isRemovingItem[item?.id]}
//                           >
//                             {isRemovingItem[item?.id] ? (
//                               <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
//                             ) : (
//                               <Trash2 className="h-4 w-4 mr-1" />
//                             )}
//                             {isRemovingItem[item?.id] ? "Removing..." : "Remove"}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="p-6 border-t border-gray-100 bg-gray-50">
//                   <Link to="/products" className="text-primary hover:underline flex items-center">
//                     <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
//                     Continue Shopping
//                   </Link>
//                 </div>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="lg:w-80">
//               <div className="bg-white rounded-lg shadow-sm">
//                 <div className="p-6 border-b border-gray-100">
//                   <h2 className="text-xl font-semibold">Order Summary</h2>
//                 </div>

//                 <div className="p-6">
//                   <div className="space-y-4">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Subtotal</span>
//                       <span className="font-medium">{subtotal}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Shipping</span>
//                       <span className="font-medium">
//                         {shipping === 0 ? "Free" : shipping}
//                       </span>
//                     </div>
//                     {discount > 0 && (
//                       <div className="flex justify-between text-green-600">
//                         <span>Discount</span>
//                         <span className="font-medium">-{formatCurrency(discount)}</span>
//                       </div>
//                     )}
//                     <div className="border-t border-gray-200 pt-4 mt-4">
//                       <div className="flex justify-between">
//                         <span className="text-lg font-bold">Total</span>
//                         <span className="text-lg font-bold">{formatCurrency(total)}</span>
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">Including VAT</p>
//                     </div>
//                   </div>

//                   <div className="mt-6">
//                     <div className="flex mb-4">
//                       <Input
//                         type="text"
//                         placeholder="Promo code"
//                         className="rounded-r-none"
//                         value={promoCode}
//                         onChange={(e) => setPromoCode(e.target.value)}
//                       />
//                       <Button
//                         variant="outline"
//                         className="rounded-l-none border-l-0"
//                         onClick={handleApplyPromoCode}
//                         disabled={isApplyingPromo || !promoCode}
//                       >
//                         {isApplyingPromo ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : "Apply"}
//                       </Button>
//                     </div>

//                     <Button className="w-full bg-primary hover:bg-blue-600" size="lg" onClick={handleProceedToCheckout}>
//                       Proceed to Checkout
//                     </Button>

//                     <div className="mt-4 text-center">
//                       <p className="text-sm text-gray-500">Secure checkout powered by our payment partners</p>
//                       <div className="flex justify-center space-x-2 mt-2">
//                         <div className="w-10 h-6 bg-gray-200 rounded"></div>
//                         <div className="w-10 h-6 bg-gray-200 rounded"></div>
//                         <div className="w-10 h-6 bg-gray-200 rounded"></div>
//                         <div className="w-10 h-6 bg-gray-200 rounded"></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Cart;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Trash2, ShoppingCart, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeItem, updateItemQuantity, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState<{ [key: number]: boolean }>({});
  const [isRemovingItem, setIsRemovingItem] = useState<{ [key: number]: boolean }>({});
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Calculate cart totals
  const subtotal = cart?.items.reduce((acc, item) => 
    acc + (item?.products?.selling_price * item?.quantity), 0) || 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsUpdatingQuantity(prev => ({ ...prev, [itemId]: true }));
    try {
      await updateItemQuantity(itemId.toString(), newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdatingQuantity(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setIsRemovingItem(prev => ({ ...prev, [itemId]: true }));
    try {
      await removeItem(itemId.toString());
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsRemovingItem(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleApplyPromoCode = () => {
    if (!promoCode) return;

    setIsApplyingPromo(true);
    setTimeout(() => {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is not valid or has expired.",
        variant: "destructive",
      });
      setIsApplyingPromo(false);
    }, 1000);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to continue with checkout.",
        variant: "destructive",
      });
      return;
    }

    if (!cart || cart.items.length === 0) {
      // toast({
      //   title: "Empty cart",
      //   description: "Your cart is empty. Add some items before checkout.",
      //   variant: "destructive",
      // });
      return;
    }

    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-16">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            <span className="ml-2 text-xl font-medium">Loading your cart...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
              <ShoppingCart className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Button
              className="bg-primary hover:bg-blue-600"
              size="lg"
              onClick={() => navigate("/products")}
            >
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Cart | MultiVendor Marketplace</title>
        <meta name="description" content="Review the items in your shopping cart, update quantities, and proceed to checkout." />
      </Helmet>

      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700">Shopping Cart</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">Cart Items ({cart.items.length})</h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {cart.items.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row">
                      <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
                        <img
                          src={item?.products?.image_url}
                          alt={item?.products?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 sm:ml-6">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div>
                            <Link
                              to={`/products/${item?.products?.id}`}
                              className="text-lg font-medium text-gray-900 hover:text-primary"
                            >
                              {item?.products?.name}
                            </Link>
                            <p className="text-sm text-gray-500 mb-2">
                              ID: {item?.products?.id}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(item?.products?.selling_price * item?.quantity)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(item?.products?.selling_price)} each
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
                          <div className="flex items-center mb-4 sm:mb-0">
                            <span className="text-sm text-gray-600 mr-3">Quantity:</span>
                            <div className="flex items-center">
                              <button
                                className="w-8 h-8 rounded-l border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                                onClick={() => handleQuantityChange(item?.id, item?.quantity - 1)}
                                disabled={isUpdatingQuantity[item?.id] || item?.quantity <= 1}
                              >
                                -
                              </button>
                              <div className="w-10 h-8 border-t border-b border-gray-300 flex items-center justify-center">
                                {isUpdatingQuantity[item?.id] ? (
                                  <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />
                                ) : (
                                  item.quantity
                                )}
                              </div>
                              <button
                                className="w-8 h-8 rounded-r border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                                onClick={() => handleQuantityChange(item?.id, item?.quantity + 1)}
                                disabled={isUpdatingQuantity[item?.id]}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <button
                            className="text-sm text-red-500 flex items-center hover:text-red-700"
                            onClick={() => handleRemoveItem(item?.id)}
                            disabled={isRemovingItem[item?.id]}
                          >
                            {isRemovingItem[item?.id] ? (
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-1" />
                            )}
                            {isRemovingItem[item?.id] ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <Link to="/products" className="text-primary hover:underline flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-80">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
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
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-lg font-bold">{formatCurrency(total)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Including VAT
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex mb-4">
                      <Input
                        type="text"
                        placeholder="Promo code"
                        className="rounded-r-none"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        className="rounded-l-none border-l-0"
                        onClick={handleApplyPromoCode}
                        disabled={isApplyingPromo || !promoCode}
                      >
                        {isApplyingPromo ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : "Apply"}
                      </Button>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-blue-600"
                      size="lg"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                    </Button>

                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500">
                        Secure checkout powered by our payment partners
                      </p>
                      <div className="flex justify-center space-x-2 mt-2">
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;