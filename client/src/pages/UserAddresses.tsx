// // import { useState, useEffect } from "react";
// // import { useLocation } from "react-router-dom";
// // import { Helmet } from "react-helmet";
// // import { useQuery } from "@tanstack/react-query";
// // import { 
// //   RefreshCw, 
// //   MapPin, 
// //   ChevronRight, 
// //   Edit, 
// //   Trash2, 
// //   Plus, 
// //   Check, 
// //   AlertCircle, 
// //   HomeIcon 
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { 
// //   Dialog, 
// //   DialogContent, 
// //   DialogHeader, 
// //   DialogTitle, 
// //   DialogDescription,
// //   DialogFooter,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { z } from "zod";
// // import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { useAuth } from "@/hooks/useAuth";
// // import { apiRequest } from "@/lib/queryClient";
// // import { queryClient } from "@/lib/queryClient";
// // import { useToast } from "@/hooks/use-toast";

// // const addressSchema = z.object({
// //   addressLine1: z.string().min(1, "Address is required"),
// //   addressLine2: z.string().optional(),
// //   city: z.string().min(1, "City is required"),
// //   state: z.string().min(1, "State is required"),
// //   postalCode: z.string().min(1, "Postal code is required"),
// //   country: z.string().min(1, "Country is required"),
// //   isDefault: z.boolean().default(false),
// // });

// // type Address = z.infer<typeof addressSchema> & { id: number, userId: number };

// // const UserAddresses = () => {
// //   const [, navigate] = useLocation();
// //   const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
// //   const { toast } = useToast();
// //   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
// //   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
// //   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
// //   const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [isDeleting, setIsDeleting] = useState(false);

// //   // Redirect to login if not authenticated
// //   useEffect(() => {
// //     if (!isAuthLoading && !isAuthenticated) {
// //       navigate("/");
// //     }
// //   }, [isAuthLoading, isAuthenticated, navigate]);

// //   // Fetch user addresses
// //   const { 
// //     data: addresses = [], 
// //     isLoading: isAddressesLoading, 
// //     error: addressesError,
// //     refetch: refetchAddresses
// //   } = useQuery<Address[]>({
// //     queryKey: ['/api/users/addresses'],
// //     enabled: isAuthenticated,
// //   });

// //   // Address form
// //   const form = useForm<z.infer<typeof addressSchema>>({
// //     resolver: zodResolver(addressSchema),
// //     defaultValues: {
// //       addressLine1: "",
// //       addressLine2: "",
// //       city: "",
// //       state: "",
// //       postalCode: "",
// //       country: "",
// //       isDefault: false,
// //     },
// //   });

// //   // Reset form when selected address changes
// //   useEffect(() => {
// //     if (selectedAddress) {
// //       form.reset({
// //         addressLine1: selectedAddress.addressLine1,
// //         addressLine2: selectedAddress.addressLine2 || "",
// //         city: selectedAddress.city,
// //         state: selectedAddress.state,
// //         postalCode: selectedAddress.postalCode,
// //         country: selectedAddress.country,
// //         isDefault: selectedAddress.isDefault,
// //       });
// //     } else {
// //       form.reset({
// //         addressLine1: "",
// //         addressLine2: "",
// //         city: "",
// //         state: "",
// //         postalCode: "",
// //         country: "",
// //         isDefault: false,
// //       });
// //     }
// //   }, [selectedAddress, form]);

// //   const onAddressSubmit = async (data: z.infer<typeof addressSchema>) => {
// //     if (!isAuthenticated) return;
    
// //     setIsSubmitting(true);
// //     try {
// //       if (selectedAddress) {
// //         // Update existing address
// //         await apiRequest("PUT", `/api/users/addresses/${selectedAddress.id}`, data);
// //         toast({
// //           title: "Address updated",
// //           description: "Your address has been updated successfully.",
// //         });
// //         setIsEditDialogOpen(false);
// //       } else {
// //         // Create new address
// //         await apiRequest("POST", "/api/users/addresses", data);
// //         toast({
// //           title: "Address added",
// //           description: "Your new address has been added successfully.",
// //         });
// //         setIsAddDialogOpen(false);
// //       }
      
// //       queryClient.invalidateQueries({ queryKey: ['/api/users/addresses'] });
// //     } catch (error) {
// //       console.error("Failed to save address:", error);
// //       toast({
// //         title: "Failed to save address",
// //         description: "There was an error saving your address. Please try again.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsSubmitting(false);
// //       setSelectedAddress(null);
// //     }
// //   };

// //   const handleDeleteAddress = async () => {
// //     if (!selectedAddress) return;
    
// //     setIsDeleting(true);
// //     try {
// //       await apiRequest("DELETE", `/api/users/addresses/${selectedAddress.id}`, undefined);
      
// //       toast({
// //         title: "Address deleted",
// //         description: "Your address has been deleted successfully.",
// //       });
      
// //       queryClient.invalidateQueries({ queryKey: ['/api/users/addresses'] });
// //       setIsDeleteDialogOpen(false);
// //     } catch (error) {
// //       console.error("Failed to delete address:", error);
// //       toast({
// //         title: "Failed to delete address",
// //         description: "There was an error deleting your address. Please try again.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsDeleting(false);
// //       setSelectedAddress(null);
// //     }
// //   };

// //   const openEditDialog = (address: Address) => {
// //     setSelectedAddress(address);
// //     setIsEditDialogOpen(true);
// //   };

// //   const openDeleteDialog = (address: Address) => {
// //     setSelectedAddress(address);
// //     setIsDeleteDialogOpen(true);
// //   };

// //   if (isAuthLoading || isAddressesLoading) {
// //     return (
// //       <div className="bg-gray-50 min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
// //           <p className="text-gray-600">Loading your addresses...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!isAuthenticated || !user) {
// //     return null; // Will redirect via useEffect
// //   }

// //   return (
// //     <>
// //       <Helmet>
// //         <title>My Addresses | MultiVendor Marketplace</title>
// //         <meta name="description" content="Manage your shipping addresses for faster checkout and delivery." />
// //       </Helmet>
      
// //       <div className="bg-gray-50 py-8">
// //         <div className="container mx-auto px-4">
// //           {/* Breadcrumb */}
// //           <div className="flex items-center text-sm text-gray-500 mb-6">
// //             <Button 
// //               variant="link" 
// //               className="p-0 h-auto text-gray-500 hover:text-primary"
// //               onClick={() => navigate("/")}
// //             >
// //               Home
// //             </Button>
// //             <ChevronRight className="h-4 w-4 mx-2" />
// //             <span className="text-gray-700">My Addresses</span>
// //           </div>
          
// //           <div className="flex justify-between items-center mb-6">
// //             <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
// //             <Button 
// //               className="bg-primary hover:bg-blue-600"
// //               onClick={() => setIsAddDialogOpen(true)}
// //             >
// //               <Plus className="mr-2 h-4 w-4" />
// //               Add New Address
// //             </Button>
// //           </div>
          
// //           {addressesError ? (
// //             <Card>
// //               <CardContent className="pt-6 pb-6 text-center">
// //                 <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
// //                 <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Addresses</h2>
// //                 <p className="text-gray-600 mb-6">There was an error loading your addresses. Please try again later.</p>
// //                 <Button 
// //                   onClick={() => refetchAddresses()}
// //                   className="bg-primary hover:bg-blue-600"
// //                 >
// //                   Retry
// //                 </Button>
// //               </CardContent>
// //             </Card>
// //           ) : addresses.length === 0 ? (
// //             <Card>
// //               <CardContent className="pt-6 pb-6 text-center">
// //                 <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// //                 <h2 className="text-xl font-semibold text-gray-800 mb-2">No Addresses Found</h2>
// //                 <p className="text-gray-600 mb-6">You haven't added any shipping addresses yet.</p>
// //                 <Button 
// //                   onClick={() => setIsAddDialogOpen(true)}
// //                   className="bg-primary hover:bg-blue-600"
// //                 >
// //                   <Plus className="mr-2 h-4 w-4" />
// //                   Add New Address
// //                 </Button>
// //               </CardContent>
// //             </Card>
// //           ) : (
// //             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
// //               {addresses.map((address) => (
// //                 <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
// //                   <CardHeader className="pb-2">
// //                     <div className="flex justify-between items-start">
// //                       <div className="flex items-center">
// //                         <MapPin className="h-5 w-5 text-primary mr-2" />
// //                         <CardTitle className="text-lg">
// //                           {address.addressLine1.split(',')[0]}
// //                         </CardTitle>
// //                       </div>
// //                       {address.isDefault && (
// //                         <span className="text-xs text-white bg-primary px-2 py-0.5 rounded-full">
// //                           Default
// //                         </span>
// //                       )}
// //                     </div>
// //                     <CardDescription>
// //                       Shipping Address
// //                     </CardDescription>
// //                   </CardHeader>
// //                   <CardContent>
// //                     <div className="text-gray-600">
// //                       <p>{address.addressLine1}</p>
// //                       {address.addressLine2 && <p>{address.addressLine2}</p>}
// //                       <p>
// //                         {address.city}, {address.state} {address.postalCode}
// //                       </p>
// //                       <p>{address.country}</p>
// //                     </div>
// //                   </CardContent>
// //                   <CardFooter className="flex justify-between">
// //                     <Button 
// //                       variant="outline" 
// //                       size="sm"
// //                       onClick={() => openEditDialog(address)}
// //                     >
// //                       <Edit className="mr-2 h-4 w-4" />
// //                       Edit
// //                     </Button>
// //                     <Button 
// //                       variant="outline" 
// //                       size="sm"
// //                       className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
// //                       onClick={() => openDeleteDialog(address)}
// //                     >
// //                       <Trash2 className="mr-2 h-4 w-4" />
// //                       Delete
// //                     </Button>
// //                   </CardFooter>
// //                 </Card>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>
      
// //       {/* Add Address Dialog */}
// //       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
// //         <DialogContent className="sm:max-w-[550px]">
// //           <DialogHeader>
// //             <DialogTitle>Add New Address</DialogTitle>
// //             <DialogDescription>
// //               Add a new shipping address for easier checkout.
// //             </DialogDescription>
// //           </DialogHeader>
          
// //           <Form {...form}>
// //             <form onSubmit={form.handleSubmit(onAddressSubmit)} className="space-y-4">
// //               <FormField
// //                 control={form.control}
// //                 name="addressLine1"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Address Line 1</FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="Street address" {...field} disabled={isSubmitting} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
              
// //               <FormField
// //                 control={form.control}
// //                 name="addressLine2"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Address Line 2 (Optional)</FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="Apartment, suite, unit, etc." {...field} disabled={isSubmitting} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
              
// //               <div className="grid grid-cols-2 gap-4">
// //                 <FormField
// //                   control={form.control}
// //                   name="city"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>City</FormLabel>
// //                       <FormControl>
// //                         <Input placeholder="City" {...field} disabled={isSubmitting} />
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
                
// //                 <FormField
// //                   control={form.control}
// //                   name="state"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>State / Province</FormLabel>
// //                       <FormControl>
// //                         <Input placeholder="State" {...field} disabled={isSubmitting} />
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //               </div>
              
// //               <div className="grid grid-cols-2 gap-4">
// //                 <FormField
// //                   control={form.control}
// //                   name="postalCode"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Postal Code</FormLabel>
// //                       <FormControl>
// //                         <Input placeholder="Postal code" {...field} disabled={isSubmitting} />
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
                
// //                 <FormField
// //                   control={form.control}
// //                   name="country"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Country</FormLabel>
// //                       <FormControl>
// //                         <Input placeholder="Country" {...field} disabled={isSubmitting} />
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //               </div>
              
// //               <FormField
// //                 control={form.control}
// //                 name="isDefault"
// //                 render={({ field }) => (
// //                   <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
// //                     <FormControl>
// //                       <Checkbox
// //                         checked={field.value}
// //                         onCheckedChange={field.onChange}
// //                         disabled={isSubmitting}
// //                       />
// //                     </FormControl>
// //                     <div className="space-y-1 leading-none">
// //                       <FormLabel>Set as default address</FormLabel>
// //                       <p className="text-sm text-gray-500">
// //                         Make this your default shipping address.
// //                       </p>
// //                     </div>
// //                   </FormItem>
// //                 )}
// //               />
              
// //               <DialogFooter>
// //                 <Button 
// //                   type="button" 
// //                   variant="outline" 
// //                   onClick={() => setIsAddDialogOpen(false)}
// //                   disabled={isSubmitting}
// //                 >
// //                   Cancel
// //                 </Button>
// //                 <Button 
// //                   type="submit" 
// //                   className="bg-primary hover:bg-blue-600"
// //                   disabled={isSubmitting}
// //                 >
// //                   {isSubmitting ? (
// //                     <>
// //                       <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
// //                       Saving...
// //                     </>
// //                   ) : (
// //                     "Save Address"
// //                   )}
// //                 </Button>
// //               </DialogFooter>
// //             </form>
// //           </Form>
// //         </DialogContent>
// //       </Dialog>
      
// //       {/* Edit Address Dialog */}
// //       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
// //         <DialogContent className="sm:max-w-[550px]">
// //           <DialogHeader>
// //             <DialogTitle>Edit Address</DialogTitle>
// //             <DialogDescription>
// //               Update your shipping address details.
// //             </DialogDescription>
// //           </DialogHeader>
          
// //           <Form {...form}>
// //             <form onSubmit={form.handleSubmit(onAddressSubmit)} className="space-y-4">
// //               <FormField
// //                 control={form.control}
// //                 name="addressLine1"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Address Line 1</FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="Street address" {...field} disabled={isSubmitting} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
              
// //               <FormField
// //                 control={form.control}
// //                 name="addressLine2"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Address Line 2 (Optional)</FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="Apartment, suite, unit, etc." {...field} disabled={isSubmitting} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
              
// //               <div className="grid grid-cols-2 gap-4">
// //                 <FormField
// //                   control={form.control}
// //                   name="city"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>City</FormLabel>
// //                       <FormControl>
// //                         <Input placeholder="City" {...field} disabled={isSubmitting} />
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
                
// //                 <FormField
// //                   control={form.control}
// //                   name="state"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>State / Province</FormLabel>
// //                       <FormControl>
// //                         <Input placeholder="State" {...field} disabled={isSubmitting} />
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //               </div>
              
// //               <div className="grid grid-cols-2 gap-4">
// //                 <FormField
// //                   control={form.control}
// //                   name="postalCode"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Postal Code</FormLabel>
// //                       <FormControl>
// //                         <Input placeholder="Postal code" {...field} disabled={isSubmitting} />
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
                
// //                 <FormField
// //                   control={form.control}
// //                   name="country"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel>Country</FormLabel>
// //                       <FormControl>
// //                         <Input placeholder="Country" {...field} disabled={isSubmitting} />
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //               </div>
              
// //               <FormField
// //                 control={form.control}
// //                 name="isDefault"
// //                 render={({ field }) => (
// //                   <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
// //                     <FormControl>
// //                       <Checkbox
// //                         checked={field.value}
// //                         onCheckedChange={field.onChange}
// //                         disabled={isSubmitting}
// //                       />
// //                     </FormControl>
// //                     <div className="space-y-1 leading-none">
// //                       <FormLabel>Set as default address</FormLabel>
// //                       <p className="text-sm text-gray-500">
// //                         Make this your default shipping address.
// //                       </p>
// //                     </div>
// //                   </FormItem>
// //                 )}
// //               />
              
// //               <DialogFooter>
// //                 <Button 
// //                   type="button" 
// //                   variant="outline" 
// //                   onClick={() => setIsEditDialogOpen(false)}
// //                   disabled={isSubmitting}
// //                 >
// //                   Cancel
// //                 </Button>
// //                 <Button 
// //                   type="submit" 
// //                   className="bg-primary hover:bg-blue-600"
// //                   disabled={isSubmitting}
// //                 >
// //                   {isSubmitting ? (
// //                     <>
// //                       <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
// //                       Updating...
// //                     </>
// //                   ) : (
// //                     "Update Address"
// //                   )}
// //                 </Button>
// //               </DialogFooter>
// //             </form>
// //           </Form>
// //         </DialogContent>
// //       </Dialog>
      
// //       {/* Delete Confirmation Dialog */}
// //       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
// //         <DialogContent className="sm:max-w-[400px]">
// //           <DialogHeader>
// //             <DialogTitle>Delete Address</DialogTitle>
// //             <DialogDescription>
// //               Are you sure you want to delete this address? This action cannot be undone.
// //             </DialogDescription>
// //           </DialogHeader>
          
// //           <DialogFooter>
// //             <Button 
// //               type="button" 
// //               variant="outline" 
// //               onClick={() => setIsDeleteDialogOpen(false)}
// //               disabled={isDeleting}
// //             >
// //               Cancel
// //             </Button>
// //             <Button 
// //               type="button" 
// //               variant="destructive"
// //               onClick={handleDeleteAddress}
// //               disabled={isDeleting}
// //             >
// //               {isDeleting ? (
// //                 <>
// //                   <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
// //                   Deleting...
// //                 </>
// //               ) : (
// //                 "Delete Address"
// //               )}
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>
// //     </>
// //   );
// // };

// // export default UserAddresses;
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Fixed import
// import { Helmet } from "react-helmet";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/lib/supabase";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { 
//   Home, 
//   MapPin, 
//   Trash2, 
//   Edit, 
//   Plus, 
//   CheckCircle, 
//   Save,
//   Loader2
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import MapPicker from "@/components/MapPicker";

// // Address type definition
// type Address = {
//   id: string;
//   user_id: string;
//   address_type: string;
//   is_default: boolean;
//   name: string | null;
//   address_line1: string | null;
//   address_line2: string | null;
//   city: string | null;
//   state: string | null;
//   postal_code: string | null;
//   country: string | null;
//   phone: string | null;
//   landmark: string | null;
//   created_at: string;
//   updated_at: string;
//   latitude: number | null;
//   longitude: number | null;
// };

// // Form validation schema
// const addressSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   address_type: z.string().default("home"),
//   address_line1: z.string().min(5, "Address must be at least 5 characters"),
//   address_line2: z.string().optional(),
//   city: z.string().min(2, "City must be at least 2 characters"),
//   state: z.string().min(2, "State must be at least 2 characters"),
//   postal_code: z.string().min(3, "Postal code must be at least 3 characters"),
//   country: z.string().min(2, "Country must be at least 2 characters").default("India"),
//   phone: z.string().min(10, "Phone must be at least 10 characters"),
//   landmark: z.string().optional(),
//   is_default: z.boolean().default(false),
//   latitude: z.number().nullable(),
// longitude: z.number().nullable(),

// });

// type AddressFormValues = z.infer<typeof addressSchema>;

// const UserAddresses = () => {
//   const navigate = useNavigate(); // Correct hook
//   const { toast } = useToast();
//   const { user, isAuthenticated } = useAuth();
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingAddress, setEditingAddress] = useState<Address | null>(null);
//   const [isDeleting, setIsDeleting] = useState<string | null>(null);
// const [isMapOpen, setIsMapOpen] = useState(false);

//   // Initialize form
//   const form = useForm<AddressFormValues>({
//     resolver: zodResolver(addressSchema),
//     defaultValues: {
//       name: "",
//       address_type: "home",
//       address_line1: "",
//       address_line2: "",
//       city: "",
//       state: "",
//       postal_code: "",
//       country: "India",
//       phone: "",
//       landmark: "",
//       is_default: false,
//     },
//   });

//   // Fetch addresses
//   const fetchAddresses = async () => {
//     if (!user) return;
    
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from('user_addresses')
//         .select('*')
//         .eq('user_id', user.id)
//         .order('is_default', { ascending: false })
//         .order('created_at', { ascending: false });

//       if (error) throw error;
      
//       setAddresses(data || []);
//     } catch (error) {
//       console.error('Error fetching addresses:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load addresses",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/");
//       return;
//     }
//     fetchAddresses();
//   }, [user, isAuthenticated, navigate]);

//   // Handle form submission
//   const onSubmit = async (values: AddressFormValues) => {
//     if (!user) return;

//     try {
//       // If setting as default, unset other defaults first
//       if (values.is_default) {
//         const { error: updateError } = await supabase
//           .from('user_addresses')
//           .update({ is_default: false })
//           .eq('user_id', user.id)
//           .eq('is_default', true);

//         if (updateError) throw updateError;
//       }

//       if (editingAddress) {
//         // Update existing address
//        const { error } = await supabase
//   .from('user_addresses')
//   .update({
//     ...values,
//     latitude: values.latitude,
//     longitude: values.longitude,
//     updated_at: new Date().toISOString(),
//   })
//   .eq('id', editingAddress.id);


//         if (error) throw error;
        
//         toast({
//           title: "Success",
//           description: "Address updated successfully",
//         });
//       } else {
//         // Create new address
//        const { error } = await supabase
//   .from('user_addresses')
//   .insert({
//     ...values,
//     latitude: values.latitude,
//     longitude: values.longitude,
//     user_id: user.id,
//   });


//         if (error) throw error;
        
//         toast({
//           title: "Success",
//           description: "Address added successfully",
//         });
//       }

//       // Reset and refresh
//       form.reset();
//       setEditingAddress(null);
//       setIsDialogOpen(false);
//       fetchAddresses();
//     } catch (error) {
//       console.error('Error saving address:', error);
//       toast({
//         title: "Error",
//         description: "Failed to save address",
//         variant: "destructive",
//       });
//     }
//   };

//   // Handle delete address
//   const handleDelete = async (addressId: string) => {
//     if (!user) return;

//     try {
//       setIsDeleting(addressId);
//       const { error } = await supabase
//         .from('user_addresses')
//         .delete()
//         .eq('id', addressId)
//         .eq('user_id', user.id);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Address deleted successfully",
//       });
      
//       fetchAddresses();
//     } catch (error) {
//       console.error('Error deleting address:', error);
//       toast({
//         title: "Error",
//         description: "Failed to delete address",
//         variant: "destructive",
//       });
//     } finally {
//       setIsDeleting(null);
//     }
//   };

//   // Handle set as default
//   const handleSetDefault = async (addressId: string) => {
//     if (!user) return;

//     try {
//       // Start a transaction: unset all defaults, then set the selected one
//       const { error: unsetError } = await supabase
//         .from('user_addresses')
//         .update({ is_default: false })
//         .eq('user_id', user.id)
//         .eq('is_default', true);

//       if (unsetError) throw unsetError;

//       const { error: setError } = await supabase
//         .from('user_addresses')
//         .update({ is_default: true })
//         .eq('id', addressId)
//         .eq('user_id', user.id);

//       if (setError) throw setError;

//       toast({
//         title: "Success",
//         description: "Default address updated",
//       });
      
//       fetchAddresses();
//     } catch (error) {
//       console.error('Error setting default address:', error);
//       toast({
//         title: "Error",
//         description: "Failed to set default address",
//         variant: "destructive",
//       });
//     }
//   };

//   // Handle edit address
//   const handleEdit = (address: Address) => {
//     setEditingAddress(address);
//     form.reset({
//       name: address.name || "",
//       address_type: address.address_type || "home",
//       address_line1: address.address_line1 || "",
//       address_line2: address.address_line2 || "",
//       city: address.city || "",
//       state: address.state || "",
//       postal_code: address.postal_code || "",
//       country: address.country || "India",
//       phone: address.phone || "",
//       landmark: address.landmark || "",
//       is_default: address.is_default || false,
//     });
//     setIsDialogOpen(true);
//   };

//   // Get address type icon
//   const getAddressTypeIcon = (type: string) => {
//     switch (type) {
//       case 'home': return <Home className="h-4 w-4" />;
//       case 'work': return <MapPin className="h-4 w-4" />;
//       default: return <MapPin className="h-4 w-4" />;
//     }
//   };

//   if (!isAuthenticated) {
//     return null;
//   }

//   return (
//     <>
//       <Helmet>
//         <title>Manage Addresses | RENTXP</title>
//         <meta name="description" content="Manage your delivery addresses" />
//       </Helmet>

//       <div className="bg-gray-50 min-h-screen py-8">
//         <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
//   <DialogContent className="max-w-3xl">
//     <DialogHeader>
//       <DialogTitle>Select Location</DialogTitle>
//     </DialogHeader>

//    <MapPicker
//   onSelect={(coords) => {
//     form.setValue("latitude", coords.lat);
//     form.setValue("longitude", coords.lng);
//     setIsMapOpen(false);
//   }}
//   defaultLat={form.watch("latitude") || 28.6139}
//   defaultLng={form.watch("longitude") || 77.2090}
// />

//   </DialogContent>
// </Dialog>

//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
//               <p className="text-gray-600">Manage your delivery addresses</p>
//             </div>
//             <Button 
//               onClick={() => {
//                 setEditingAddress(null);
//                 form.reset({
//                   name: "",
//                   address_type: "home",
//                   address_line1: "",
//                   address_line2: "",
//                   city: "",
//                   state: "",
//                   postal_code: "",
//                   country: "India",
//                   phone: "",
//                   landmark: "",
//                   is_default: false,
//                 });
//                 setIsDialogOpen(true);
//               }}
//               className="bg-primary hover:bg-blue-600"
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               Add New Address
//             </Button>

//         <Button onClick={() => setIsMapOpen(true)}>
//   Select Location on Map
// </Button>
//           </div>

//           {isLoading ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader2 className="h-8 w-8 text-primary animate-spin" />
//             </div>
//           ) : addresses.length === 0 ? (
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="text-center py-12">
//                   <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
//                   <p className="text-gray-500 mb-6">Add an address to get started with your orders</p>
//                   <Button 
//                     onClick={() => setIsDialogOpen(true)}
//                     className="bg-primary hover:bg-blue-600"
//                   >
//                     <Plus className="mr-2 h-4 w-4" />
//                     Add Your First Address
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {addresses.map((address) => (
//                 <Card 
//                   key={address.id} 
//                   className={`relative ${address.is_default ? 'border-primary border-2' : ''}`}
//                 >
//                   {address.is_default && (
//                     <div className="absolute top-4 right-4">
//                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
//                         <CheckCircle className="h-3 w-3 mr-1" />
//                         Default
//                       </span>
//                     </div>
//                   )}
                  
//                   <CardHeader className="pb-3">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         {getAddressTypeIcon(address.address_type)}
//                         <span className="ml-2 text-sm font-medium capitalize">
//                           {address.address_type}
//                         </span>
//                       </div>
//                     </div>
//                     <CardTitle className="text-lg">{address.name || 'Untitled Address'}</CardTitle>
//                   </CardHeader>
                  
//                   <CardContent className="pb-3">
//                     <div className="space-y-1 text-sm text-gray-600">
//                       <p>{address.address_line1}</p>
//                       {address.address_line2 && <p>{address.address_line2}</p>}
//                       <p>
//                         {address.city}, {address.state} {address.postal_code}
//                       </p>
//                       <p>{address.country}</p>
//                       {address.landmark && <p>Landmark: {address.landmark}</p>}
//                       {address.phone && <p>Phone: {address.phone}</p>}
//                     </div>
//                   </CardContent>
                  
//                   <CardFooter className="flex justify-between pt-3 border-t">
//                     <div className="flex space-x-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleEdit(address)}
//                       >
//                         <Edit className="h-3 w-3 mr-1" />
//                         Edit
//                       </Button>
                      
//                       {!address.is_default && (
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleSetDefault(address.id)}
//                         >
//                           Set as Default
//                         </Button>
//                       )}
//                     </div>
                    
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleDelete(address.id)}
//                       disabled={isDeleting === address.id}
//                       className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                     >
//                       {isDeleting === address.id ? (
//                         <Loader2 className="h-3 w-3 animate-spin" />
//                       ) : (
//                         <Trash2 className="h-3 w-3" />
//                       )}
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add/Edit Address Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               {editingAddress ? 'Edit Address' : 'Add New Address'}
//             </DialogTitle>
//             <DialogDescription>
//               {editingAddress 
//                 ? 'Update your address details' 
//                 : 'Add a new delivery address for your orders'}
//             </DialogDescription>
//           </DialogHeader>

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Address Name *</FormLabel>
//                     <FormControl>
//                       <Input placeholder="e.g., Home, Office, etc." {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="address_type"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Address Type</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select type" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="home">Home</SelectItem>
//                         <SelectItem value="work">Work</SelectItem>
//                         <SelectItem value="other">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="phone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Phone Number *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="+91 9876543210" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="postal_code"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Postal Code *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="110001" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="address_line1"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Address Line 1 *</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Street address, P.O. Box, etc." {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="address_line2"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Address Line 2</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Apartment, suite, unit, building, floor, etc." {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="city"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>City *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="City" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="state"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>State *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="State" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="country"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Country *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Country" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="landmark"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Landmark (Optional)</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Nearby landmark for easy delivery" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="is_default"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                     <div className="space-y-1 leading-none">
//                       <FormLabel>
//                         Set as default address
//                       </FormLabel>
//                       <p className="text-sm text-gray-500">
//                         This will be your primary delivery address
//                       </p>
//                     </div>
//                   </FormItem>
//                 )}
//               />

//               <FormField
//   control={form.control}
//   name="latitude"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Latitude</FormLabel>
//       <FormControl>
//         <Input disabled placeholder="Lat from map" {...field} />
//       </FormControl>
//     </FormItem>
//   )}
// />

// <FormField
//   control={form.control}
//   name="longitude"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Longitude</FormLabel>
//       <FormControl>
//         <Input disabled placeholder="Lng from map" {...field} />
//       </FormControl>
//     </FormItem>
//   )}
// />


//               <DialogFooter className="pt-4">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => {
//                     setIsDialogOpen(false);
//                     setEditingAddress(null);
//                     form.reset();
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" className="bg-primary hover:bg-blue-600">
//                   {editingAddress ? 'Update Address' : 'Add Address'}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default UserAddresses;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Home,
  MapPin,
  Trash2,
  Edit,
  Plus,
  CheckCircle,
  Save,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import MapPicker from "@/components/MapPicker";


// Address schema
const addressSchema = z.object({
  name: z.string().min(2),
  address_type: z.string(),
  address_line1: z.string().min(5),
  address_line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postal_code: z.string().min(3),
  country: z.string().min(2),
  phone: z.string().min(10),
  landmark: z.string().optional(),
  is_default: z.boolean().default(false),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

type AddressFormValues = z.infer<typeof addressSchema>;
type Address = any;


export default function UserAddresses() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);


  // Form initialization
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      address_type: "home",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      phone: "",
      landmark: "",
      is_default: false,
      latitude: null,
      longitude: null,
    },
  });


  // Fetch saved addresses
  const fetchAddresses = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      setAddresses(data || []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load addresses", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return navigate("/");
    fetchAddresses();
  }, [isAuthenticated]);


  // Reverse Geocode → Convert lat/lng → Address
  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

      const res = await fetch(url);
      const data = await res.json();

      const addr = data.address || {};

      form.setValue("city", addr.city || addr.town || addr.village || "");
      form.setValue("state", addr.state || "");
      form.setValue("postal_code", addr.postcode || "");
      form.setValue("country", addr.country || "India");
      form.setValue("address_line1", addr.road || addr.suburb || "");
      form.setValue("address_line2", addr.neighbourhood || "");
    } catch (err) {
      console.log("Reverse geocoding failed");
    }
  };


  // Save Form (Add/Edit)
  const onSubmit = async (values: AddressFormValues) => {
    if (!user) return;

    try {
      if (values.is_default) {
        await supabase
          .from("user_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      if (editingAddress) {
        await supabase
          .from("user_addresses")
          .update({ ...values })
          .eq("id", editingAddress.id);
      } else {
        await supabase
          .from("user_addresses")
          .insert({ ...values, user_id: user.id });
      }

      toast({ title: "Success", description: "Address saved successfully" });
      setIsDialogOpen(false);
      form.reset();
      fetchAddresses();

    } catch (err) {
      toast({ title: "Error", description: "Failed to save address", variant: "destructive" });
    }
  };


  // Edit Address
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);

    form.reset({
      ...address
    });
  };


  // Delete Address
  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await supabase.from("user_addresses").delete().eq("id", id);
      fetchAddresses();
      toast({ title: "Deleted", description: "Address removed" });
    } catch {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
    setIsDeleting(null);
  };


  if (!isAuthenticated) return null;


  return (
    <>
      <Helmet>
        <title>Manage Addresses | RENTXP</title>
      </Helmet>

      <div className="bg-gray-50 min-h-screen p-6">

        {isMapOpen && (
  <MapPicker
    defaultLat={form.watch("latitude") || 28.6139}
    defaultLng={form.watch("longitude") || 77.2090}
    onSelect={async (coords) => {
      // Set lat/lng
      form.setValue("latitude", coords.lat);
      form.setValue("longitude", coords.lng);

      // Close map
      setIsMapOpen(false);

      // Reset form with coordinates
      setEditingAddress(null);
      form.reset({ latitude: coords.lat, longitude: coords.lng });

      // Open Add/Edit dialog
      setIsDialogOpen(true);

      // Fetch address details from coordinates
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`;
        const res = await fetch(url);
        const data = await res.json();
        const addr = data.address || {};

        // Autofill form fields with fallbacks
        form.setValue("city", addr.city || addr.town || addr.village || "");
        form.setValue("state", addr.state || addr.region || addr.county || "");
        form.setValue("postal_code", addr.postcode || "");
        form.setValue("country", addr.country || "India");
        form.setValue("address_line1", addr.road || addr.suburb || "");
        form.setValue("address_line2", addr.neighbourhood || "");
        form.setValue("landmark", addr.hamlet || addr.locality || "");
      } catch (err) {
        console.error("Reverse geocoding failed", err);
      }
    }}
  />
)}


        {/* 🔵 MAP PICKER DIALOG */}
        {/* {isMapOpen && (
  <MapPicker
    defaultLat={form.watch("latitude") || 28.6139}
    defaultLng={form.watch("longitude") || 77.2090}
    onSelect={async (coords) => {
      // Set lat/lng
      form.setValue("latitude", coords.lat);
      form.setValue("longitude", coords.lng);

      // Close map
      setIsMapOpen(false);

      // Reset form with coordinates
      setEditingAddress(null);
      form.reset({ latitude: coords.lat, longitude: coords.lng });

      // Open Add/Edit dialog
      setIsDialogOpen(true);

      // Fetch address details from coordinates
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`;
        const res = await fetch(url);
        const data = await res.json();
        const addr = data.address || {};

        // Autofill form fields
        form.setValue("city", addr.city || addr.town || addr.village || "");
        form.setValue("state", addr.state || "");
        form.setValue("postal_code", addr.postcode || "");
        form.setValue("country", addr.country || "India");
        form.setValue("address_line1", addr.road || addr.suburb || "");
        form.setValue("address_line2", addr.neighbourhood || "");
        form.setValue("landmark", addr.hamlet || addr.locality || ""); // optional
      } catch (err) {
        console.error("Reverse geocoding failed", err);
      }
    }}
  />
)} */}

 {/* <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>Select Location</DialogTitle>
    </DialogHeader>

    {isMapOpen && (
      <MapPicker
        defaultLat={form.watch("latitude") || 28.6139}
        defaultLng={form.watch("longitude") || 77.2090}
        onSelect={(coords) => {
          form.setValue("latitude", coords.lat);
          form.setValue("longitude", coords.lng);
          setIsMapOpen(false);
          setEditingAddress(null);
          form.reset({ latitude: coords.lat, longitude: coords.lng });
          setIsDialogOpen(true);
        }}
      />
    )}
  </DialogContent>
</Dialog> */}


        {/* PAGE HEADER */}
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">My Addresses</h1>
              <p className="text-gray-600">Manage your delivery addresses</p>
            </div>

            <div className="flex gap-2">

              <Button
                onClick={() => {
                  setEditingAddress(null);
                  form.reset();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4" /> Add New Address
              </Button>

              <Button variant="outline" onClick={() => setIsMapOpen(true)}>
                Select on Map
              </Button>

            </div>
          </div>


          {/* ADDRESS LIST */}
          {isLoading ? (
            <div className="flex justify-center p-20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {addresses.map((a) => (
                <Card key={a.id} className={`${a.is_default ? "border-blue-600 border-2" : ""}`}>

                  <CardHeader>
                    <CardTitle>{a.name}</CardTitle>
                    <CardDescription>{a.address_type}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p>{a.address_line1}</p>
                    <p>{a.address_line2}</p>
                    <p>{a.city}, {a.state}</p>
                    <p>{a.postal_code}</p>
                    <p>{a.country}</p>
                    <p>Phone: {a.phone}</p>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(a)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>

                    <Button size="sm" variant="ghost" className="text-red-600"
                      onClick={() => handleDelete(a.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}

            </div>
          )}
        </div>
      </div>


      {/* 🔵 ADD/EDIT FORM DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">

          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* NAME */}
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* TYPE */}
              <FormField name="address_type" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />

              {/* PHONE + PINCODE */}
              <div className="grid grid-cols-2 gap-4">
                <FormField name="phone" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )} />

                <FormField name="postal_code" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )} />
              </div>

              {/* ADDRESS LINE 1 */}
              <FormField name="address_line1" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1 *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                </FormItem>
              )} />

              {/* ADDRESS LINE 2 */}
              <FormField name="address_line2" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                </FormItem>
              )} />

              {/* CITY + STATE + COUNTRY */}
              <div className="grid grid-cols-3 gap-4">
                <FormField name="city" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )} />

                <FormField name="state" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )} />

                <FormField name="country" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )} />
              </div>

              {/* LANDMARK */}
              <FormField name="landmark" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Landmark</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                </FormItem>
              )} />

              {/* LAT & LNG (READ ONLY) */}
              <div className="grid grid-cols-2 gap-4">
                <FormField name="latitude" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input readOnly value={field.value ?? ""} />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField name="longitude" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input readOnly value={field.value ?? ""} />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              {/* DEFAULT CHECK */}
              <FormField name="is_default" control={form.control} render={({ field }) => (
                <FormItem className="flex gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Set as Default Address</FormLabel>
                </FormItem>
              )} />


              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingAddress ? "Update" : "Add"}</Button>
              </DialogFooter>

            </form>
          </Form>

        </DialogContent>
      </Dialog>

    </>
  );
}
