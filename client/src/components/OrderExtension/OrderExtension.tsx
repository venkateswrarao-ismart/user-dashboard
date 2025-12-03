// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/lib/supabase";
// import { formatCurrency, formatDate } from "@/lib/utils";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   AlertCircle,
//   Calendar,
//   Clock,
//   CreditCard,
//   DollarSign,
  
//   Info,
//   Plus,
//   RefreshCw,
//   Shield,
//   Zap,
// } from "lucide-react";

// const OrderExtension = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
  
//   const [extensionDays, setExtensionDays] = useState<number>(1);
//   const [paymentMethod, setPaymentMethod] = useState<string>("cash-on-delivery");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   // Fetch order details with extensions
//   const { data: order, isLoading } = useQuery({
//     queryKey: [`order-with-extensions-${orderId}`],
//     enabled: !!orderId,
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('orders')
//         .select(`
//           *,
//           order_extensions(*),
//           order_items(*, products(*))
//         `)
//         .eq('id', orderId)
//         .single();
      
//       if (error) throw error;
//       return data;
//     },
//   });

//   // Fetch extension rates configuration
//   const { data: extensionRates } = useQuery({
//     queryKey: ['extension-rates'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('store_configurations')
//         .select('extension_rates')
//         .single();
      
//       if (error) return null;
//       return data?.extension_rates || {
//         daily_rate_multiplier: 1.1, // 10% premium for extensions
//         weekly_rate_multiplier: 0.9, // 10% discount for weekly
//         monthly_rate_multiplier: 0.8, // 20% discount for monthly
//         late_extension_penalty: 1.2, // 20% penalty for late extensions
//       };
//     },
//   });

//   const mutation = useMutation({
//     mutationFn: async (extensionData: any) => {
//       const { data, error } = await supabase.functions.invoke('create-order-extension', {
//         body: extensionData,
//       });
      
//       if (error) throw error;
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [`order-with-extensions-${orderId}`] });
//       toast({
//         title: "Extension Request Sent",
//         description: "Your rental extension request has been submitted successfully.",
//       });
//       setIsDialogOpen(false);
//     },
//     onError: (error) => {
//       toast({
//         title: "Extension Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <RefreshCw className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="text-center p-8">
//         <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
//         <h3 className="text-lg font-semibold">Order Not Found</h3>
//         <p className="text-gray-500">Unable to find order details.</p>
//       </div>
//     );
//   }

//   const currentEndDate = order.extended_end_date || order.end_date;
//   const maxExtensionDays = order.max_extension_days || 30;
// //   const canExtend = order.can_extend !== false && 
// //                     order.status === 'completed' && 
// //                     (order.extension_count || 0) < 5;

// const canExtend = true;



//   const calculateExtensionCost = (days: number) => {
//     if (!order.order_items || order.order_items.length === 0) return 0;
    
//     const totalDailyRate = order.order_items.reduce((total: number, item: any) => {
//       return total + (item.unit_price * item.quantity);
//     }, 0);
    
//     let multiplier = 1.0;
    
//     // Apply rate multipliers based on extension duration
//     if (days >= 30 && extensionRates?.monthly_rate_multiplier) {
//       multiplier = extensionRates.monthly_rate_multiplier;
//     } else if (days >= 7 && extensionRates?.weekly_rate_multiplier) {
//       multiplier = extensionRates.weekly_rate_multiplier;
//     } else if (extensionRates?.daily_rate_multiplier) {
//       multiplier = extensionRates.daily_rate_multiplier;
//     }
    
//     // Apply late extension penalty if applicable
//     const currentDate = new Date();
//     const endDate = new Date(currentEndDate);
//     const isLateExtension = currentDate > endDate;
    
//     if (isLateExtension && extensionRates?.late_extension_penalty) {
//       multiplier *= extensionRates.late_extension_penalty;
//     }
    
//     return totalDailyRate * days * multiplier;
//   };

//   const extensionCost = calculateExtensionCost(extensionDays);
//   const newEndDate = new Date(currentEndDate);
//   newEndDate.setDate(newEndDate.getDate() + extensionDays);

//   const handleExtensionRequest = async () => {
//     if (!user || !orderId) return;
    
//     const extensionData = {
//       order_id: orderId,
//       extension_days: extensionDays,
//       extension_start_date: currentEndDate,
//       extension_end_date: newEndDate.toISOString(),
//       extension_rate: calculateExtensionCost(1) / 
//         (order.order_items?.reduce((total: number, item: any) => 
//           total + (item.unit_price * item.quantity), 0) || 1),
//       total_amount: extensionCost,
//       payment_method: paymentMethod,
//       created_by: user.id,
//       notes: `Extension request for ${extensionDays} day(s)`
//     };
    
//     setIsProcessing(true);
//     try {
//       mutation.mutate(extensionData);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleInstantExtension = async () => {
//     if (!user || !orderId) return;
    
//     setIsProcessing(true);
//     try {
//       const { data, error } = await supabase.functions.invoke('instant-order-extension', {
//         body: {
//           order_id: orderId,
//           extension_days: extensionDays,
//           payment_method: paymentMethod,
//           user_id: user.id,
//         },
//       });
      
//       if (error) throw error;
      
//       toast({
//         title: "Extension Approved!",
//         description: `Your rental has been extended by ${extensionDays} days.`,
//       });
      
//       queryClient.invalidateQueries({ queryKey: [`order-with-extensions-${orderId}`] });
//       setIsDialogOpen(false);
//     } catch (error: any) {
//       toast({
//         title: "Extension Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Extension Status Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Zap className="h-5 w-5 mr-2 text-primary" />
//             Rental Extension
//           </CardTitle>
//           <CardDescription>
//             Extend your rental period if you need the equipment for longer
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Current Rental Period</h4>
//                 <div className="flex items-center space-x-2 text-sm">
//                   <Calendar className="h-4 w-4 text-gray-400" />
//                   <span>{formatDate(new Date(order.start_date))}</span>
//                   <span>→</span>
//                   <span>{formatDate(new Date(currentEndDate))}</span>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Original rental: {order.rental_days || 1} day(s)
//                   {order.extension_count > 0 && (
//                     <span className="ml-2 text-blue-600">
//                       (+{order.total_extension_days || 0} extended)
//                     </span>
//                   )}
//                 </p>
//               </div>
              
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Extension Status</h4>
//                 <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
//                   canExtend 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-gray-100 text-gray-800'
//                 }`}>
//                   {canExtend ? 'Eligible for Extension' : 'Not Eligible'}
//                 </div>
//                 {!canExtend && (
//                   <p className="text-sm text-gray-500 mt-1">
//                     {order.status !== 'completed' 
//                       ? 'Complete the current rental first' 
//                       : (order.extension_count || 0) >= 5 
//                         ? 'Maximum extensions reached' 
//                         : 'Extensions not available for this order'}
//                   </p>
//                 )}
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Previous Extensions</h4>
//                 {order.order_extensions?.length > 0 ? (
//                   <div className="space-y-2">
//                     {order.order_extensions.slice(0, 3).map((ext: any) => (
//                       <div key={ext.id} className="flex justify-between text-sm">
//                         <span>{ext.extension_days} day(s)</span>
//                         <span className="text-gray-500">
//                           {formatDate(new Date(ext.created_at))}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">No previous extensions</p>
//                 )}
//               </div>
              
//               <div className="bg-blue-50 p-3 rounded-lg">
//                 <div className="flex items-start">
//                   <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
//                   <div>
//                     <p className="text-sm text-blue-800">
//                       Extensions are subject to equipment availability and approval.
//                       Additional charges may apply.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button 
//                 disabled={!canExtend}
//                 className="w-full"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Request Extension
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Extend Rental Period</DialogTitle>
//                 <DialogDescription>
//                   Select how many additional days you need the equipment
//                 </DialogDescription>
//               </DialogHeader>
              
//               <div className="space-y-4 py-4">
//                 {/* Extension Duration */}
//                 <div className="space-y-2">
//                   <Label htmlFor="extension-days">Extension Duration</Label>
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setExtensionDays(1)}
//                       className={extensionDays === 1 ? "bg-primary text-white" : ""}
//                     >
//                       1 Day
//                     </Button>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setExtensionDays(3)}
//                       className={extensionDays === 3 ? "bg-primary text-white" : ""}
//                     >
//                       3 Days
//                     </Button>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setExtensionDays(7)}
//                       className={extensionDays === 7 ? "bg-primary text-white" : ""}
//                     >
//                       1 Week
//                     </Button>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setExtensionDays(30)}
//                       className={extensionDays === 30 ? "bg-primary text-white" : ""}
//                     >
//                       1 Month
//                     </Button>
//                   </div>
//                   <div className="flex items-center space-x-2 mt-2">
//                     <Input
//                       id="extension-days"
//                       type="number"
//                       min="1"
//                       max={maxExtensionDays}
//                       value={extensionDays}
//                       onChange={(e) => {
//                         const value = parseInt(e.target.value);
//                         if (value >= 1 && value <= maxExtensionDays) {
//                           setExtensionDays(value);
//                         }
//                       }}
//                       className="w-24"
//                     />
//                     <span className="text-sm text-gray-500">
//                       Max: {maxExtensionDays} days
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Extension Details */}
//                 <div className="bg-gray-50 p-3 rounded-lg space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">New End Date:</span>
//                     <span className="font-medium">{formatDate(newEndDate)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Additional Days:</span>
//                     <span className="font-medium">{extensionDays} day(s)</span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between font-semibold">
//                     <span>Extension Cost:</span>
//                     <span className="text-lg">{formatCurrency(extensionCost)}</span>
//                   </div>
//                   <p className="text-xs text-gray-500">
//                     Rate: {formatCurrency(calculateExtensionCost(1) / extensionDays)} per day
//                   </p>
//                 </div>
                
//                 {/* Payment Method */}
//                 <div className="space-y-2">
//                   <Label>Payment Method</Label>
//                   <Tabs defaultValue="cash-on-delivery" onValueChange={setPaymentMethod}>
//                     <TabsList className="grid w-full grid-cols-2">
//                       <TabsTrigger value="cash-on-delivery" className="flex items-center">
//                         <DollarSign className="h-4 w-4 mr-2" />
//                         Cash on Delivery
//                       </TabsTrigger>
//                       <TabsTrigger value="razorpay" className="flex items-center">
//                         <CreditCard className="h-4 w-4 mr-2" />
//                         Razorpay
//                       </TabsTrigger>
//                     </TabsList>
//                   </Tabs>
//                 </div>
                
//                 {/* Instant vs Manual Approval */}
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//                   <div className="flex items-start">
//                     <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
//                     <div>
//                       <h4 className="font-medium text-yellow-800 text-sm">
//                         Instant Extension Available
//                       </h4>
//                       <p className="text-yellow-700 text-xs mt-1">
//                         Get your extension approved instantly with online payment.
//                         Manual approval may take 2-4 hours.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <DialogFooter className="flex flex-col sm:flex-row gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsDialogOpen(false)}
//                   disabled={isProcessing}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={handleExtensionRequest}
//                   disabled={isProcessing}
//                   className="flex-1"
//                 >
//                   {isProcessing ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     'Request Manual Approval'
//                   )}
//                 </Button>
//                 <Button
//                   onClick={handleInstantExtension}
//                   disabled={isProcessing || paymentMethod === 'cash-on-delivery'}
//                   className="flex-1"
//                 >
//                   {isProcessing ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <Zap className="h-4 w-4 mr-2" />
//                       Instant Extension
//                     </>
//                   )}
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </CardFooter>
//       </Card>

//       {/* Extension History */}
//       {order.order_extensions?.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Extension History</CardTitle>
//             <CardDescription>
//               Previous extension requests for this order
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {order.order_extensions.map((extension: any) => (
//                 <div key={extension.id} className="border rounded-lg p-4">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h4 className="font-medium">
//                         {extension.extension_days} Day Extension
//                       </h4>
//                       <div className="flex items-center text-sm text-gray-500 mt-1">
//                         <Calendar className="h-3 w-3 mr-1" />
//                         {formatDate(new Date(extension.extension_start_date))}
//                         <span className="mx-2">→</span>
//                         {formatDate(new Date(extension.extension_end_date))}
//                       </div>
//                       {extension.notes && (
//                         <p className="text-sm text-gray-600 mt-2">{extension.notes}</p>
//                       )}
//                     </div>
//                     <div className="text-right">
//                       <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
//                         extension.status === 'approved' 
//                           ? 'bg-green-100 text-green-800'
//                           : extension.status === 'pending'
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {extension.status}
//                       </div>
//                       <p className="font-bold mt-2">{formatCurrency(extension.total_amount)}</p>
//                       <p className="text-xs text-gray-500">
//                         {formatDate(new Date(extension.created_at))}
//                       </p>
//                     </div>
//                   </div>
//                   {extension.approved_by && (
//                     <div className="flex items-center text-sm text-gray-500 mt-3 pt-3 border-t">
//                       <Shield className="h-3 w-3 mr-1" />
//                       Approved by staff
//                       {extension.approved_at && (
//                         <span className="ml-2">
//                           on {formatDate(new Date(extension.approved_at))}
//                         </span>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// // export default OrderExtension;
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Info,
  Plus,
  RefreshCw,
  Shield,
  Zap,
  X,
} from "lucide-react";

const OrderExtension = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [extensionDays, setExtensionDays] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash-on-delivery");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customDaysInput, setCustomDaysInput] = useState<string>("1");
  console.log(customDaysInput,"customdaysinput")

  // Fetch order details with extensions
  const { data: order, isLoading } = useQuery({
    queryKey: [`order-with-extensions-${orderId}`],
    enabled: !!orderId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_extensions(*),
          order_items(*, products(*))
        `)
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch extension rates configuration
  const { data: extensionRates } = useQuery({
    queryKey: ['extension-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_configurations')
        .select('extension_rates')
        .single();
      
      if (error) return null;
      return data?.extension_rates || {
        daily_rate_multiplier: 1.1, // 10% premium for extensions
        late_extension_penalty: 1.2, // 20% penalty for late extensions
      };
    },
  });

  const mutation = useMutation({
    mutationFn: async (extensionData: any) => {
      const { data, error } = await supabase.functions.invoke('create-order-extension', {
        body: extensionData,
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`order-with-extensions-${orderId}`] });
      toast({
        title: "Extension Request Sent",
        description: "Your rental extension request has been submitted successfully.",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Extension Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold">Order Not Found</h3>
        <p className="text-gray-500">Unable to find order details.</p>
      </div>
    );
  }

  const currentEndDate = order.extended_end_date || order.end_date;
  const maxExtensionDays = order.max_extension_days || 1;
//   const canExtend = order.can_extend !== false && 
//                     order.status === 'completed' && 
//                     (order.extension_count || 0) < 5;

const canExtend = true;

  const calculateExtensionCost = (days: number) => {
    if (!order.order_items || order.order_items.length === 0) return 0;
    
    const totalDailyRate = order.order_items.reduce((total: number, item: any) => {
      return total + (item.unit_price * item.quantity);
    }, 0);
    
    let multiplier = 1.0;
    
    // Apply rate multipliers based on extension duration
    if (extensionRates?.daily_rate_multiplier) {
      multiplier = extensionRates.daily_rate_multiplier;
    }
    
    // Apply late extension penalty if applicable
    const currentDate = new Date();
    const endDate = new Date(currentEndDate);
    const isLateExtension = currentDate > endDate;
    
    if (isLateExtension && extensionRates?.late_extension_penalty) {
      multiplier *= extensionRates.late_extension_penalty;
    }
    
    return totalDailyRate * days * multiplier;
  };

  const extensionCost = calculateExtensionCost(extensionDays);
  const newEndDate = new Date(currentEndDate);
  newEndDate.setDate(newEndDate.getDate() + extensionDays);

  const handleExtensionRequest = async () => {
    if (!user || !orderId) return;
    
    const extensionData = {
      order_id: orderId,
      extension_days: extensionDays,
      extension_start_date: currentEndDate,
      extension_end_date: newEndDate.toISOString(),
      extension_rate: calculateExtensionCost(1) / 
        (order.order_items?.reduce((total: number, item: any) => 
          total + (item.unit_price * item.quantity), 0) || 1),
      total_amount: extensionCost,
      payment_method: paymentMethod,
      created_by: user.id,
      notes: `Extension request for ${extensionDays} day(s)`
    };
    
    setIsProcessing(true);
    try {
      mutation.mutate(extensionData);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInstantExtension = async () => {
    if (!user || !orderId) return;
    
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('instant-order-extension', {
        body: {
          order_id: orderId,
          extension_days: extensionDays,
          payment_method: paymentMethod,
          user_id: user.id,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Extension Approved!",
        description: `Your rental has been extended by ${extensionDays} days.`,
      });
      
      queryClient.invalidateQueries({ queryKey: [`order-with-extensions-${orderId}`] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Extension Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle custom days input
  const handleCustomDaysChange = (value: string) => {
    setCustomDaysInput(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= maxExtensionDays) {
      setExtensionDays(numValue);
    }
  };

  return (
    <div className="space-y-6">
      {/* Extension Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Rental Extension
          </CardTitle>
          <CardDescription>
            Extend your rental period if you need the equipment for longer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Current Rental Period</h4>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{formatDate(new Date(order.start_date))}</span>
                  <span>→</span>
                  <span>{formatDate(new Date(currentEndDate))}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Original rental: {order.rental_days || 1} day(s)
                  {order.extension_count > 0 && (
                    <span className="ml-2 text-blue-600">
                      (+{order.total_extension_days || 0} extended)
                    </span>
                  )}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Extension Status</h4>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  canExtend 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {canExtend ? 'Eligible for Extension' : 'Not Eligible'}
                </div>
                {!canExtend && (
                  <p className="text-sm text-gray-500 mt-1">
                    {order.status !== 'completed' 
                      ? 'Complete the current rental first' 
                      : (order.extension_count || 0) >= 5 
                        ? 'Maximum extensions reached' 
                        : 'Extensions not available for this order'}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Previous Extensions</h4>
                {order.order_extensions?.length > 0 ? (
                  <div className="space-y-2">
                    {order.order_extensions.slice(0, 3).map((ext: any) => (
                      <div key={ext.id} className="flex justify-between text-sm">
                        <span>{ext.extension_days} day(s)</span>
                        <span className="text-gray-500">
                          {formatDate(new Date(ext.created_at))}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No previous extensions</p>
                )}
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800">
                      Max extension allowed: {maxExtensionDays} day(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                disabled={!canExtend}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Request Extension
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] max-w-md md:max-w-lg">
              <DialogHeader className=" top-0 bg-background pb-4 z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-lg md:text-xl">Extend Rental Period</DialogTitle>
                    <DialogDescription className="text-sm">
                      Select how many additional days you need the equipment
                    </DialogDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 -mt-2 -mr-2"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                {/* Extension Duration */}
                <div className="space-y-3">
                  <Label htmlFor="extension-days">Extension Duration</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={extensionDays === 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setExtensionDays(1);
                        setCustomDaysInput("1");
                      }}
                      className="flex-1"
                    >
                      1 Day
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Label htmlFor="custom-days" className="whitespace-nowrap text-sm">
                        Custom Days:
                      </Label>
                      <Input
                        id="custom-days"
                        type="number"
                        min="1"
                        max={maxExtensionDays}
                        value={customDaysInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCustomDaysInput(value);
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1 && numValue <= maxExtensionDays) {
                            setExtensionDays(numValue);
                          }
                        }}
                        onBlur={(e) => {
                          const value = parseInt(e.target.value);
                          if (isNaN(value) || value < 1) {
                            setCustomDaysInput("1");
                            setExtensionDays(1);
                          } else if (value > maxExtensionDays) {
                            setCustomDaysInput(maxExtensionDays.toString());
                            setExtensionDays(maxExtensionDays);
                          }
                        }}
                        className="w-20 sm:w-24"
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      Maximum: {maxExtensionDays} day(s)
                    </span>
                  </div>
                </div>
                
                {/* Extension Details */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">New End Date:</p>
                      <p className="font-medium text-sm">{formatDate(newEndDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Additional Days:</p>
                      <p className="font-medium text-sm">{extensionDays} day(s)</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <span className="font-semibold text-base">Extension Cost:</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(extensionCost)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Daily rate: {formatCurrency(calculateExtensionCost(1) / extensionDays)}
                  </p>
                </div>
                
                {/* Payment Method */}
                <div className="space-y-3">
                  <Label className="text-sm">Payment Method</Label>
                  <Tabs defaultValue="cash-on-delivery" onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-2 h-10">
                      <TabsTrigger value="cash-on-delivery" className="flex items-center justify-center text-xs sm:text-sm">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="truncate">Cash on Delivery</span>
                      </TabsTrigger>
                      <TabsTrigger value="razorpay" className="flex items-center justify-center text-xs sm:text-sm">
                        <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="truncate">Razorpay</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {/* Instant vs Manual Approval */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-yellow-800 text-sm">
                        Instant Extension Available
                      </h4>
                      <p className="text-yellow-700 text-xs mt-1">
                        Get your extension approved instantly with online payment.
                        Manual approval may take 2-4 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t mt-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <Button
                      variant="outline"
                      onClick={handleExtensionRequest}
                      disabled={isProcessing}
                      className="flex-1 h-11"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          <span className="text-sm">Processing...</span>
                        </>
                      ) : (
                        <span className="text-sm">Request Manual Approval</span>
                      )}
                    </Button>
                    <Button
                      onClick={handleInstantExtension}
                      disabled={isProcessing || paymentMethod === 'cash-on-delivery'}
                      className="flex-1 h-11"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          <span className="text-sm">Processing...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          <span className="text-sm">Instant Extension</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isProcessing}
                    className="h-11 mt-2 sm:mt-0 sm:w-24"
                  >
                    Cancel
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {/* Extension History */}
      {order.order_extensions?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extension History</CardTitle>
            <CardDescription>
              Previous extension requests for this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.order_extensions.map((extension: any) => (
                <div key={extension.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {extension.extension_days} Day Extension
                      </h4>
                      <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1 gap-2">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(new Date(extension.extension_start_date))}
                        </div>
                        <span className="text-gray-400">→</span>
                        <div>
                          {formatDate(new Date(extension.extension_end_date))}
                        </div>
                      </div>
                      {extension.notes && (
                        <p className="text-sm text-gray-600 mt-2">{extension.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        extension.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : extension.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {extension.status}
                      </div>
                      <p className="font-bold mt-2 text-lg">{formatCurrency(extension.total_amount)}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(new Date(extension.created_at))}
                      </p>
                    </div>
                  </div>
                  {extension.approved_by && (
                    <div className="flex items-center text-sm text-gray-500 mt-3 pt-3 border-t">
                      <Shield className="h-3 w-3 mr-1" />
                      Approved by staff
                      {extension.approved_at && (
                        <span className="ml-2">
                          on {formatDate(new Date(extension.approved_at))}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderExtension;

// import { useState, useEffect, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/lib/supabase";
// import { formatCurrency, formatDate } from "@/lib/utils";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   AlertCircle,
//   Calendar,
//   Clock,
//   CreditCard,
//   DollarSign,
//   Info,
//   Plus,
//   RefreshCw,
//   Shield,
//   Zap,
//   X,
// } from "lucide-react";

// const OrderExtension = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
  
//   const [extensionDays, setExtensionDays] = useState<number>(1);
//   const [customDaysInput, setCustomDaysInput] = useState<string>("1");
//   const [paymentMethod, setPaymentMethod] = useState<string>("cash-on-delivery");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   // Fetch order details with extensions
//   const { data: order, isLoading } = useQuery({
//     queryKey: [`order-with-extensions-${orderId}`],
//     enabled: !!orderId,
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('orders')
//         .select(`
//           *,
//           order_extensions(*),
//           order_items(*, products(*))
//         `)
//         .eq('id', orderId)
//         .single();
      
//       if (error) throw error;
//       return data;
//     },
//   });

//   // Fetch extension rates configuration
//   const { data: extensionRates } = useQuery({
//     queryKey: ['extension-rates'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('store_configurations')
//         .select('extension_rates')
//         .single();
      
//       if (error) return null;
//       return data?.extension_rates || {
//         daily_rate_multiplier: 1.1, // 10% premium for extensions
//         late_extension_penalty: 1.2, // 20% penalty for late extensions
//       };
//     },
//   });

//   // Update customDaysInput when extensionDays changes (e.g., from button clicks)
//   useEffect(() => {
//     setCustomDaysInput(extensionDays.toString());
//   }, [extensionDays]);

//   const mutation = useMutation({
//     mutationFn: async (extensionData: any) => {
//       const { data, error } = await supabase.functions.invoke('create-order-extension', {
//         body: extensionData,
//       });
      
//       if (error) throw error;
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [`order-with-extensions-${orderId}`] });
//       toast({
//         title: "Extension Request Sent",
//         description: "Your rental extension request has been submitted successfully.",
//       });
//       setIsDialogOpen(false);
//     },
//     onError: (error) => {
//       toast({
//         title: "Extension Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <RefreshCw className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="text-center p-8">
//         <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
//         <h3 className="text-lg font-semibold">Order Not Found</h3>
//         <p className="text-gray-500">Unable to find order details.</p>
//       </div>
//     );
//   }

//   const currentEndDate = order.extended_end_date || order.end_date;
//   const maxExtensionDays = order.max_extension_days || 1;
//   const canExtend = order.can_extend !== false && 
//                     order.status === 'completed' && 
//                     (order.extension_count || 0) < 5;

//   // Calculate extension cost with useMemo to avoid recalculating on every render
//   const calculateExtensionCost = useMemo(() => {
//     return (days: number) => {
//       if (!order.order_items || order.order_items.length === 0) return 0;
      
//       const totalDailyRate = order.order_items.reduce((total: number, item: any) => {
//         return total + (item.unit_price * item.quantity);
//       }, 0);
      
//       let multiplier = 1.0;
      
//       // Apply rate multipliers based on extension duration
//       if (extensionRates?.daily_rate_multiplier) {
//         multiplier = extensionRates.daily_rate_multiplier;
//       }
      
//       // Apply late extension penalty if applicable
//       const currentDate = new Date();
//       const endDate = new Date(currentEndDate);
//       const isLateExtension = currentDate > endDate;
      
//       if (isLateExtension && extensionRates?.late_extension_penalty) {
//         multiplier *= extensionRates.late_extension_penalty;
//       }
      
//       return totalDailyRate * days * multiplier;
//     };
//   }, [order.order_items, extensionRates, currentEndDate]);

//   // Calculate current extension cost and new end date
//   const extensionCost = useMemo(() => {
//     return calculateExtensionCost(extensionDays);
//   }, [calculateExtensionCost, extensionDays]);

//   const newEndDate = useMemo(() => {
//     const date = new Date(currentEndDate);
//     date.setDate(date.getDate() + extensionDays);
//     return date;
//   }, [currentEndDate, extensionDays]);

//   const handleExtensionRequest = async () => {
//     if (!user || !orderId) return;
    
//     const extensionData = {
//       order_id: orderId,
//       extension_days: extensionDays,
//       extension_start_date: currentEndDate,
//       extension_end_date: newEndDate.toISOString(),
//       extension_rate: calculateExtensionCost(1) / 
//         (order.order_items?.reduce((total: number, item: any) => 
//           total + (item.unit_price * item.quantity), 0) || 1),
//       total_amount: extensionCost,
//       payment_method: paymentMethod,
//       created_by: user.id,
//       notes: `Extension request for ${extensionDays} day(s)`
//     };
    
//     setIsProcessing(true);
//     try {
//       mutation.mutate(extensionData);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleInstantExtension = async () => {
//     if (!user || !orderId) return;
    
//     setIsProcessing(true);
//     try {
//       const { data, error } = await supabase.functions.invoke('instant-order-extension', {
//         body: {
//           order_id: orderId,
//           extension_days: extensionDays,
//           payment_method: paymentMethod,
//           user_id: user.id,
//         },
//       });
      
//       if (error) throw error;
      
//       toast({
//         title: "Extension Approved!",
//         description: `Your rental has been extended by ${extensionDays} days.`,
//       });
      
//       queryClient.invalidateQueries({ queryKey: [`order-with-extensions-${orderId}`] });
//       setIsDialogOpen(false);
//     } catch (error: any) {
//       toast({
//         title: "Extension Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Handle custom days input
//   const handleCustomDaysChange = (value: string) => {
//     setCustomDaysInput(value);
    
//     // Parse the value and validate
//     const numValue = parseInt(value);
    
//     if (!isNaN(numValue)) {
//       // Set the actual extension days (clamp between 1 and maxExtensionDays)
//       const clampedValue = Math.max(1, Math.min(numValue, maxExtensionDays));
//       setExtensionDays(clampedValue);
      
//       // Update input display if it was out of bounds
//       if (numValue !== clampedValue) {
//         setCustomDaysInput(clampedValue.toString());
//       }
//     }
//   };

//   const handleCustomDaysBlur = () => {
//     // On blur, ensure the input shows the actual extension days
//     setCustomDaysInput(extensionDays.toString());
//   };

//   return (
//     <div className="space-y-6">
//       {/* Extension Status Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Zap className="h-5 w-5 mr-2 text-primary" />
//             Rental Extension
//           </CardTitle>
//           <CardDescription>
//             Extend your rental period if you need the equipment for longer
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Current Rental Period</h4>
//                 <div className="flex items-center space-x-2 text-sm">
//                   <Calendar className="h-4 w-4 text-gray-400" />
//                   <span>{formatDate(new Date(order.start_date))}</span>
//                   <span>→</span>
//                   <span>{formatDate(new Date(currentEndDate))}</span>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Original rental: {order.rental_days || 1} day(s)
//                   {order.extension_count > 0 && (
//                     <span className="ml-2 text-blue-600">
//                       (+{order.total_extension_days || 0} extended)
//                     </span>
//                   )}
//                 </p>
//               </div>
              
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Extension Status</h4>
//                 <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
//                   canExtend 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-gray-100 text-gray-800'
//                 }`}>
//                   {canExtend ? 'Eligible for Extension' : 'Not Eligible'}
//                 </div>
//                 {!canExtend && (
//                   <p className="text-sm text-gray-500 mt-1">
//                     {order.status !== 'completed' 
//                       ? 'Complete the current rental first' 
//                       : (order.extension_count || 0) >= 5 
//                         ? 'Maximum extensions reached' 
//                         : 'Extensions not available for this order'}
//                   </p>
//                 )}
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Previous Extensions</h4>
//                 {order.order_extensions?.length > 0 ? (
//                   <div className="space-y-2">
//                     {order.order_extensions.slice(0, 3).map((ext: any) => (
//                       <div key={ext.id} className="flex justify-between text-sm">
//                         <span>{ext.extension_days} day(s)</span>
//                         <span className="text-gray-500">
//                           {formatDate(new Date(ext.created_at))}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">No previous extensions</p>
//                 )}
//               </div>
              
//               <div className="bg-blue-50 p-3 rounded-lg">
//                 <div className="flex items-start">
//                   <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
//                   <div>
//                     <p className="text-sm text-blue-800">
//                       Max extension allowed: {maxExtensionDays} day(s)
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button 
//                 disabled={!canExtend}
//                 className="w-full"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Request Extension
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-h-[85vh] overflow-y-auto w-[95vw] max-w-md md:max-w-lg">
//               <DialogHeader className="sticky top-0 bg-background pb-4 z-10">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <DialogTitle className="text-lg md:text-xl">Extend Rental Period</DialogTitle>
//                     <DialogDescription className="text-sm">
//                       Select how many additional days you need the equipment
//                     </DialogDescription>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 -mt-2 -mr-2"
//                     onClick={() => setIsDialogOpen(false)}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </DialogHeader>
              
//               <div className="space-y-4 py-2">
//                 {/* Extension Duration */}
//                 <div className="space-y-3">
//                   <Label htmlFor="extension-days">Extension Duration</Label>
//                   <div className="flex gap-2">
//                     <Button
//                       type="button"
//                       variant={extensionDays === 1 ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => {
//                         setExtensionDays(1);
//                         // customDaysInput will be updated by useEffect
//                       }}
//                       className="flex-1"
//                     >
//                       1 Day
//                     </Button>
//                   </div>
                  
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
//                     <div className="flex items-center gap-2 w-full sm:w-auto">
//                       <Label htmlFor="custom-days" className="whitespace-nowrap text-sm">
//                         Custom Days:
//                       </Label>
//                       <Input
//                         id="custom-days"
//                         type="number"
//                         min="1"
//                         max={maxExtensionDays}
//                         value={customDaysInput}
//                         onChange={(e) => handleCustomDaysChange(e.target.value)}
//                         onBlur={handleCustomDaysBlur}
//                         className="w-20 sm:w-24"
//                       />
//                     </div>
//                     <span className="text-sm text-gray-500">
//                       Maximum: {maxExtensionDays} day(s)
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Extension Details - Updated in real-time */}
//                 <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-3">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div>
//                       <p className="text-sm text-gray-600">New End Date:</p>
//                       <p className="font-medium text-sm">{formatDate(newEndDate)}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Additional Days:</p>
//                       <p className="font-medium text-sm">{extensionDays} day(s)</p>
//                     </div>
//                   </div>
//                   <Separator />
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
//                     <span className="font-semibold text-base">Extension Cost:</span>
//                     <span className="text-lg font-bold text-primary">
//                       {formatCurrency(extensionCost)}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500">
//                     Daily rate: {formatCurrency(calculateExtensionCost(1) / extensionDays)}
//                     {calculateExtensionCost(1) / extensionDays > (order.total_amount || 0) / (order.rental_days || 1) && 
//                       " (Includes 10% extension premium)"}
//                   </p>
//                 </div>
                
//                 {/* Equipment Summary */}
//                 <div className="border rounded-lg p-3">
//                   <h4 className="font-medium text-sm mb-2">Equipment Summary</h4>
//                   <div className="space-y-2 max-h-40 overflow-y-auto">
//                     {order.order_items?.map((item: any, index: number) => {
//                       const itemDailyRate = item.unit_price * item.quantity;
//                       const itemExtensionCost = itemDailyRate * extensionDays * 
//                         (extensionRates?.daily_rate_multiplier || 1.1);
                      
//                       return (
//                         <div key={index} className="flex justify-between items-center text-sm">
//                           <div className="flex items-center gap-2">
//                             <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden">
//                               <img 
//                                 src={item.products?.image_url || '/placeholder.jpg'} 
//                                 alt={item.products?.name}
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                             <div>
//                               <p className="font-medium truncate max-w-[120px]">{item.products?.name}</p>
//                               <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-medium">{formatCurrency(itemExtensionCost)}</p>
//                             <p className="text-xs text-gray-500">
//                               {formatCurrency(itemDailyRate)} × {extensionDays} days
//                             </p>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
                
//                 {/* Payment Method */}
//                 <div className="space-y-3">
//                   <Label className="text-sm">Payment Method</Label>
//                   <Tabs defaultValue="cash-on-delivery" onValueChange={setPaymentMethod}>
//                     <TabsList className="grid w-full grid-cols-2 h-10">
//                       <TabsTrigger value="cash-on-delivery" className="flex items-center justify-center text-xs sm:text-sm">
//                         <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//                         <span className="truncate">Cash on Delivery</span>
//                       </TabsTrigger>
//                       <TabsTrigger value="razorpay" className="flex items-center justify-center text-xs sm:text-sm">
//                         <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//                         <span className="truncate">Razorpay</span>
//                       </TabsTrigger>
//                     </TabsList>
//                   </Tabs>
//                 </div>
                
//                 {/* Instant vs Manual Approval */}
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//                   <div className="flex items-start">
//                     <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-medium text-yellow-800 text-sm">
//                         Instant Extension Available
//                       </h4>
//                       <p className="text-yellow-700 text-xs mt-1">
//                         Get your extension approved instantly with online payment.
//                         Manual approval may take 2-4 hours.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t mt-4">
//                 <div className="flex flex-col sm:flex-row gap-3 w-full">
//                   <div className="flex flex-col sm:flex-row gap-2 w-full">
//                     <Button
//                       variant="outline"
//                       onClick={handleExtensionRequest}
//                       disabled={isProcessing}
//                       className="flex-1 h-11"
//                     >
//                       {isProcessing ? (
//                         <>
//                           <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                           <span className="text-sm">Processing...</span>
//                         </>
//                       ) : (
//                         <span className="text-sm">Request Manual Approval</span>
//                       )}
//                     </Button>
//                     <Button
//                       onClick={handleInstantExtension}
//                       disabled={isProcessing || paymentMethod === 'cash-on-delivery'}
//                       className="flex-1 h-11"
//                     >
//                       {isProcessing ? (
//                         <>
//                           <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                           <span className="text-sm">Processing...</span>
//                         </>
//                       ) : (
//                         <>
//                           <Zap className="h-4 w-4 mr-2" />
//                           <span className="text-sm">Instant Extension</span>
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     onClick={() => setIsDialogOpen(false)}
//                     disabled={isProcessing}
//                     className="h-11 mt-2 sm:mt-0 sm:w-24"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </CardFooter>
//       </Card>

//       {/* Extension History */}
//       {order.order_extensions?.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Extension History</CardTitle>
//             <CardDescription>
//               Previous extension requests for this order
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {order.order_extensions.map((extension: any) => (
//                 <div key={extension.id} className="border rounded-lg p-4">
//                   <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
//                     <div className="flex-1">
//                       <h4 className="font-medium">
//                         {extension.extension_days} Day Extension
//                       </h4>
//                       <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1 gap-2">
//                         <div className="flex items-center">
//                           <Calendar className="h-3 w-3 mr-1" />
//                           {formatDate(new Date(extension.extension_start_date))}
//                         </div>
//                         <span className="text-gray-400">→</span>
//                         <div>
//                           {formatDate(new Date(extension.extension_end_date))}
//                         </div>
//                       </div>
//                       {extension.notes && (
//                         <p className="text-sm text-gray-600 mt-2">{extension.notes}</p>
//                       )}
//                     </div>
//                     <div className="flex flex-col items-end">
//                       <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
//                         extension.status === 'approved' 
//                           ? 'bg-green-100 text-green-800'
//                           : extension.status === 'pending'
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {extension.status}
//                       </div>
//                       <p className="font-bold mt-2 text-lg">{formatCurrency(extension.total_amount)}</p>
//                       <p className="text-xs text-gray-500">
//                         {formatDate(new Date(extension.created_at))}
//                       </p>
//                     </div>
//                   </div>
//                   {extension.approved_by && (
//                     <div className="flex items-center text-sm text-gray-500 mt-3 pt-3 border-t">
//                       <Shield className="h-3 w-3 mr-1" />
//                       Approved by staff
//                       {extension.approved_at && (
//                         <span className="ml-2">
//                           on {formatDate(new Date(extension.approved_at))}
//                         </span>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// // export default OrderExtension;
// import { useState, useEffect, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/lib/supabase";
// import { formatCurrency, formatDate } from "@/lib/utils";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   AlertCircle,
//   Calendar,
//   Clock,
//   CreditCard,
//   DollarSign,
//   Info,
//   Plus,
//   RefreshCw,
//   Shield,
//   Zap,
//   X,
// } from "lucide-react";

// // Default extension rates configuration
// const DEFAULT_EXTENSION_RATES = {
//   daily_rate_multiplier: 1.1, // 10% premium for extensions
//   late_extension_penalty: 1.2, // 20% penalty for late extensions
// };

// const OrderExtension = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
  
//   const [extensionDays, setExtensionDays] = useState<number>(1);
//   const [customDaysInput, setCustomDaysInput] = useState<string>("1");
//   const [paymentMethod, setPaymentMethod] = useState<string>("cash-on-delivery");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [extensionRates, setExtensionRates] = useState(DEFAULT_EXTENSION_RATES);

//   // Fetch order details with extensions
//   const { data: order, isLoading } = useQuery({
//     queryKey: [`order-with-extensions-${orderId}`],
//     enabled: !!orderId,
//     queryFn: async () => {
//       try {
//         const { data, error } = await supabase
//           .from('orders')
//           .select(`
//             *,
//             order_extensions(*),
//             order_items(*, products(*))
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

//   // Reset days when dialog opens
//   useEffect(() => {
//     if (isDialogOpen) {
//       setExtensionDays(1);
//       setCustomDaysInput("1");
//     }
//   }, [isDialogOpen]);

//   // Update customDaysInput when extensionDays changes
//   useEffect(() => {
//     setCustomDaysInput(extensionDays.toString());
//   }, [extensionDays]);

//   const mutation = useMutation({
//     mutationFn: async (extensionData: any) => {
//       try {
//         // First, try to insert into order_extensions table if it exists
//         const { data: extensionDataResult, error: extensionError } = await supabase
//           .from('order_extensions')
//           .insert({
//             order_id: extensionData.order_id,
//             extension_days: extensionData.extension_days,
//             extension_start_date: extensionData.extension_start_date,
//             extension_end_date: extensionData.extension_end_date,
//             extension_rate: extensionData.extension_rate,
//             total_amount: extensionData.total_amount,
//             payment_method: extensionData.payment_method,
//             status: 'pending',
//             created_at: new Date().toISOString(),
//             notes: extensionData.notes
//           })
//           .select()
//           .single();
        
//         if (extensionError) {
//           console.log('order_extensions table may not exist, updating orders directly');
//         }
        
//         // Always update the orders table
//         const { error: updateError } = await supabase
//           .from('orders')
//           .update({
//             extension_count: (order?.extension_count || 0) + 1,
//             total_extension_days: (order?.total_extension_days || 0) + extensionData.extension_days,
//             extended_end_date: extensionData.extension_end_date,
//             updated_at: new Date().toISOString()
//           })
//           .eq('id', orderId);
        
//         if (updateError) throw updateError;
        
//         return { success: true, data: extensionDataResult };
//       } catch (error) {
//         throw error;
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [`order-with-extensions-${orderId}`] });
//       toast({
//         title: "Extension Request Sent",
//         description: "Your rental extension request has been submitted successfully.",
//       });
//       setIsDialogOpen(false);
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Extension Failed",
//         description: error.message || "There was an error processing your request.",
//         variant: "destructive",
//       });
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <RefreshCw className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="text-center p-8">
//         <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
//         <h3 className="text-lg font-semibold">Order Not Found</h3>
//         <p className="text-gray-500">Unable to find order details.</p>
//       </div>
//     );
//   }

//   const currentEndDate = order.extended_end_date || order.end_date;
//   const maxExtensionDays = order.max_extension_days || 1;
//   const canExtend = order.can_extend !== false && 
//                     order.status === 'completed' && 
//                     (order.extension_count || 0) < 5;

//   // Calculate extension cost
//   const calculateExtensionCost = (days: number) => {
//     if (!order.order_items || order.order_items.length === 0) return 0;
    
//     const totalDailyRate = order.order_items.reduce((total: number, item: any) => {
//       return total + (item.unit_price * item.quantity);
//     }, 0);
    
//     let multiplier = extensionRates.daily_rate_multiplier || 1.1;
    
//     // Apply late extension penalty if applicable
//     const currentDate = new Date();
//     const endDate = new Date(currentEndDate);
//     const isLateExtension = currentDate > endDate;
    
//     if (isLateExtension && extensionRates.late_extension_penalty) {
//       multiplier *= extensionRates.late_extension_penalty;
//     }
    
//     return totalDailyRate * days * multiplier;
//   };

//   // Calculate current extension cost and new end date
//   const extensionCost = useMemo(() => {
//     return calculateExtensionCost(extensionDays);
//   }, [extensionDays, order.order_items, extensionRates, currentEndDate]);

//   const newEndDate = useMemo(() => {
//     const date = new Date(currentEndDate);
//     date.setDate(date.getDate() + extensionDays);
//     return date;
//   }, [currentEndDate, extensionDays]);

//   const handleExtensionRequest = async () => {
//     if (!user || !orderId) return;
    
//     const extensionData = {
//       order_id: orderId,
//       extension_days: extensionDays,
//       extension_start_date: currentEndDate,
//       extension_end_date: newEndDate.toISOString(),
//       extension_rate: calculateExtensionCost(1) / 
//         (order.order_items?.reduce((total: number, item: any) => 
//           total + (item.unit_price * item.quantity), 0) || 1),
//       total_amount: extensionCost,
//       payment_method: paymentMethod,
//       notes: `Extension request for ${extensionDays} day(s)`
//     };
    
//     setIsProcessing(true);
//     try {
//       mutation.mutate(extensionData);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleInstantExtension = async () => {
//     if (!user || !orderId) return;
    
//     setIsProcessing(true);
//     try {
//       // Create extension record
//       const extensionData = {
//         order_id: orderId,
//         extension_days: extensionDays,
//         extension_start_date: currentEndDate,
//         extension_end_date: newEndDate.toISOString(),
//         extension_rate: calculateExtensionCost(1) / 
//           (order.order_items?.reduce((total: number, item: any) => 
//             total + (item.unit_price * item.quantity), 0) || 1),
//         total_amount: extensionCost,
//         payment_method: paymentMethod,
//         status: 'approved',
//         created_at: new Date().toISOString(),
//         approved_at: new Date().toISOString(),
//         approved_by: user.id,
//         notes: `Instant extension approved for ${extensionDays} day(s)`
//       };
      
//       // Try to insert into order_extensions table
//       try {
//         const { data, error } = await supabase
//           .from('order_extensions')
//           .insert(extensionData)
//           .select()
//           .single();
        
//         if (error) {
//           console.log('order_extensions table insert error:', error.message);
//         }
//       } catch (error) {
//         console.log('order_extensions table may not exist');
//       }
      
//       // Always update the orders table
//       const { error: updateError } = await supabase
//         .from('orders')
//         .update({
//           extension_count: (order.extension_count || 0) + 1,
//           total_extension_days: (order.total_extension_days || 0) + extensionDays,
//           extended_end_date: newEndDate.toISOString(),
//           updated_at: new Date().toISOString(),
//           status: 'extended'
//         })
//         .eq('id', orderId);
      
//       if (updateError) throw updateError;
      
//       toast({
//         title: "Extension Approved!",
//         description: `Your rental has been extended by ${extensionDays} days.`,
//       });
      
//       queryClient.invalidateQueries({ queryKey: [`order-with-extensions-${orderId}`] });
//       setIsDialogOpen(false);
//     } catch (error: any) {
//       toast({
//         title: "Extension Failed",
//         description: error.message || "There was an error processing your extension.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Handle custom days input - SIMPLIFIED VERSION
//   const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setCustomDaysInput(value);
    
//     // Parse the value
//     const numValue = parseInt(value);
    
//     if (!isNaN(numValue)) {
//       // Clamp the value between 1 and maxExtensionDays
//       const clampedValue = Math.max(1, Math.min(numValue, maxExtensionDays));
//       setExtensionDays(clampedValue);
      
//       // Update input if it was out of bounds
//       if (numValue !== clampedValue) {
//         setCustomDaysInput(clampedValue.toString());
//       }
//     }
//   };

//   // Handle blur - clean up the input
//   const handleCustomDaysBlur = () => {
//     if (customDaysInput === '' || parseInt(customDaysInput) < 1) {
//       setCustomDaysInput("1");
//       setExtensionDays(1);
//     } else if (parseInt(customDaysInput) > maxExtensionDays) {
//       setCustomDaysInput(maxExtensionDays.toString());
//       setExtensionDays(maxExtensionDays);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Extension Status Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Zap className="h-5 w-5 mr-2 text-primary" />
//             Rental Extension
//           </CardTitle>
//           <CardDescription>
//             Extend your rental period if you need the equipment for longer
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Current Rental Period</h4>
//                 <div className="flex items-center space-x-2 text-sm">
//                   <Calendar className="h-4 w-4 text-gray-400" />
//                   <span>{formatDate(new Date(order.start_date))}</span>
//                   <span>→</span>
//                   <span>{formatDate(new Date(currentEndDate))}</span>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Original rental: {order.rental_days || 1} day(s)
//                   {order.extension_count > 0 && (
//                     <span className="ml-2 text-blue-600">
//                       (+{order.total_extension_days || 0} extended)
//                     </span>
//                   )}
//                 </p>
//               </div>
              
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Extension Status</h4>
//                 <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
//                   canExtend 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-gray-100 text-gray-800'
//                 }`}>
//                   {canExtend ? 'Eligible for Extension' : 'Not Eligible'}
//                 </div>
//                 {!canExtend && (
//                   <p className="text-sm text-gray-500 mt-1">
//                     {order.status !== 'completed' 
//                       ? 'Complete the current rental first' 
//                       : (order.extension_count || 0) >= 5 
//                         ? 'Maximum extensions reached' 
//                         : 'Extensions not available for this order'}
//                   </p>
//                 )}
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-medium text-gray-900 mb-2">Previous Extensions</h4>
//                 {order.order_extensions?.length > 0 ? (
//                   <div className="space-y-2">
//                     {order.order_extensions.slice(0, 3).map((ext: any) => (
//                       <div key={ext.id} className="flex justify-between text-sm">
//                         <span>{ext.extension_days} day(s)</span>
//                         <span className="text-gray-500">
//                           {formatDate(new Date(ext.created_at))}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">No previous extensions</p>
//                 )}
//               </div>
              
//               <div className="bg-blue-50 p-3 rounded-lg">
//                 <div className="flex items-start">
//                   <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
//                   <div>
//                     <p className="text-sm text-blue-800">
//                       Max extension allowed: {maxExtensionDays} day(s)
//                     </p>
//                     <p className="text-xs text-blue-600 mt-1">
//                       Extension rate includes {((extensionRates.daily_rate_multiplier - 1) * 100).toFixed(0)}% premium
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button 
//                 disabled={!canExtend}
//                 className="w-full"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Request Extension
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-h-[85vh] overflow-y-auto w-[95vw] max-w-md md:max-w-lg">
//               <DialogHeader className="sticky top-0 bg-background pb-4 z-10">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <DialogTitle className="text-lg md:text-xl">Extend Rental Period</DialogTitle>
//                     <DialogDescription className="text-sm">
//                       Select how many additional days you need the equipment
//                     </DialogDescription>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 -mt-2 -mr-2"
//                     onClick={() => setIsDialogOpen(false)}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </DialogHeader>
              
//               <div className="space-y-4 py-2">
//                 {/* Extension Duration */}
//                 <div className="space-y-3">
//                   <Label htmlFor="extension-days">Extension Duration</Label>
//                   <div className="flex gap-2">
//                     <Button
//                       type="button"
//                       variant={extensionDays === 1 ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => {
//                         setExtensionDays(1);
//                       }}
//                       className="flex-1"
//                     >
//                       1 Day
//                     </Button>
//                   </div>
                  
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
//                     <div className="flex items-center gap-2 w-full sm:w-auto">
//                       <Label htmlFor="custom-days" className="whitespace-nowrap text-sm">
//                         Custom Days:
//                       </Label>
//                       <Input
//                         id="custom-days"
//                         type="number"
//                         min="1"
//                         max={maxExtensionDays}
//                         value={customDaysInput}
//                         onChange={handleCustomDaysChange}
//                         onBlur={handleCustomDaysBlur}
//                         className="w-24 sm:w-28"
//                       />
//                     </div>
//                     <span className="text-sm text-gray-500">
//                       Maximum: {maxExtensionDays} day(s)
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Extension Details - Updated in real-time */}
//                 <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-3">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div>
//                       <p className="text-sm text-gray-600">New End Date:</p>
//                       <p className="font-medium text-sm">{formatDate(newEndDate)}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Additional Days:</p>
//                       <p className="font-medium text-sm">{extensionDays} day(s)</p>
//                     </div>
//                   </div>
//                   <Separator />
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
//                     <span className="font-semibold text-base">Extension Cost:</span>
//                     <span className="text-lg font-bold text-primary">
//                       {formatCurrency(extensionCost)}
//                     </span>
//                   </div>
//                   <div className="text-xs text-gray-500 space-y-1">
//                     <p>
//                       Daily rate: {formatCurrency(calculateExtensionCost(1) / extensionDays)}
//                     </p>
//                     <p className="text-amber-600">
//                       Includes {((extensionRates.daily_rate_multiplier - 1) * 100).toFixed(0)}% extension premium
//                     </p>
//                   </div>
//                 </div>
                
//                 {/* Equipment Summary */}
//                 {order.order_items && order.order_items.length > 0 && (
//                   <div className="border rounded-lg p-3">
//                     <h4 className="font-medium text-sm mb-2">Cost Breakdown</h4>
//                     <div className="space-y-2 max-h-40 overflow-y-auto">
//                       {order.order_items.map((item: any, index: number) => {
//                         const itemDailyRate = item.unit_price * item.quantity;
//                         const itemExtensionCost = itemDailyRate * extensionDays * extensionRates.daily_rate_multiplier;
                        
//                         return (
//                           <div key={index} className="flex justify-between items-center text-sm">
//                             <div className="flex items-center gap-2">
//                               <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
//                                 {item.products?.image_url ? (
//                                   <img 
//                                     src={item.products.image_url} 
//                                     alt={item.products.name}
//                                     className="w-full h-full object-cover"
//                                   />
//                                 ) : (
//                                   <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                                     <Info className="h-4 w-4 text-gray-400" />
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="min-w-0">
//                                 <p className="font-medium truncate max-w-[120px]">{item.products?.name || 'Product'}</p>
//                                 <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="font-medium">{formatCurrency(itemExtensionCost)}</p>
//                               <p className="text-xs text-gray-500">
//                                 {formatCurrency(itemDailyRate)} × {extensionDays} days
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       <Separator />
//                       <div className="flex justify-between items-center font-medium pt-1">
//                         <span>Total:</span>
//                         <span>{formatCurrency(extensionCost)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Payment Method */}
//                 <div className="space-y-3">
//                   <Label className="text-sm">Payment Method</Label>
//                   <Tabs defaultValue="cash-on-delivery" onValueChange={setPaymentMethod}>
//                     <TabsList className="grid w-full grid-cols-2 h-10">
//                       <TabsTrigger value="cash-on-delivery" className="flex items-center justify-center text-xs sm:text-sm">
//                         <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//                         <span className="truncate">Cash on Delivery</span>
//                       </TabsTrigger>
//                       <TabsTrigger value="razorpay" className="flex items-center justify-center text-xs sm:text-sm">
//                         <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//                         <span className="truncate">Razorpay</span>
//                       </TabsTrigger>
//                     </TabsList>
//                   </Tabs>
//                 </div>
                
//                 {/* Instant vs Manual Approval */}
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//                   <div className="flex items-start">
//                     <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-medium text-yellow-800 text-sm">
//                         Instant Extension Available
//                       </h4>
//                       <p className="text-yellow-700 text-xs mt-1">
//                         Get your extension approved instantly with online payment.
//                         Manual approval may take 2-4 hours.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t mt-4">
//                 <div className="flex flex-col sm:flex-row gap-3 w-full">
//                   <div className="flex flex-col sm:flex-row gap-2 w-full">
//                     <Button
//                       variant="outline"
//                       onClick={handleExtensionRequest}
//                       disabled={isProcessing}
//                       className="flex-1 h-11"
//                     >
//                       {isProcessing ? (
//                         <>
//                           <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                           <span className="text-sm">Processing...</span>
//                         </>
//                       ) : (
//                         <span className="text-sm">Request Manual Approval</span>
//                       )}
//                     </Button>
//                     <Button
//                       onClick={handleInstantExtension}
//                       disabled={isProcessing || paymentMethod === 'cash-on-delivery'}
//                       className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 text-white"
//                     >
//                       {isProcessing ? (
//                         <>
//                           <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                           <span className="text-sm">Processing...</span>
//                         </>
//                       ) : (
//                         <>
//                           <Zap className="h-4 w-4 mr-2" />
//                           <span className="text-sm">Instant Extension</span>
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     onClick={() => setIsDialogOpen(false)}
//                     disabled={isProcessing}
//                     className="h-11 mt-2 sm:mt-0 sm:w-24"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </CardFooter>
//       </Card>

//       {/* Extension History */}
//       {((order.order_extensions && order.order_extensions.length > 0) || order.extension_count > 0) && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Extension History</CardTitle>
//             <CardDescription>
//               Previous extension requests for this order
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {order.order_extensions && order.order_extensions.length > 0 ? (
//                 order.order_extensions.map((extension: any) => (
//                   <div key={extension.id} className="border rounded-lg p-4">
//                     <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
//                       <div className="flex-1">
//                         <h4 className="font-medium">
//                           {extension.extension_days} Day Extension
//                         </h4>
//                         <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1 gap-2">
//                           <div className="flex items-center">
//                             <Calendar className="h-3 w-3 mr-1" />
//                             {formatDate(new Date(extension.extension_start_date))}
//                           </div>
//                           <span className="text-gray-400">→</span>
//                           <div>
//                             {formatDate(new Date(extension.extension_end_date))}
//                           </div>
//                         </div>
//                         {extension.notes && (
//                           <p className="text-sm text-gray-600 mt-2">{extension.notes}</p>
//                         )}
//                       </div>
//                       <div className="flex flex-col items-end">
//                         <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
//                           extension.status === 'approved' 
//                             ? 'bg-green-100 text-green-800'
//                             : extension.status === 'pending'
//                             ? 'bg-yellow-100 text-yellow-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {extension.status}
//                         </div>
//                         <p className="font-bold mt-2 text-lg">{formatCurrency(extension.total_amount)}</p>
//                         <p className="text-xs text-gray-500">
//                           {formatDate(new Date(extension.created_at))}
//                         </p>
//                       </div>
//                     </div>
//                     {extension.approved_by && (
//                       <div className="flex items-center text-sm text-gray-500 mt-3 pt-3 border-t">
//                         <Shield className="h-3 w-3 mr-1" />
//                         Approved by staff
//                         {extension.approved_at && (
//                           <span className="ml-2">
//                             on {formatDate(new Date(extension.approved_at))}
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : order.extension_count > 0 ? (
//                 <div className="border rounded-lg p-4">
//                   <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
//                     <div className="flex-1">
//                       <h4 className="font-medium">
//                         {order.total_extension_days || 1} Day Extension
//                       </h4>
//                       <p className="text-sm text-gray-600 mt-2">
//                         This order has been extended {order.extension_count} time(s)
//                         for a total of {order.total_extension_days || 1} additional day(s)
//                       </p>
//                     </div>
//                     <div className="flex flex-col items-end">
//                       <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
//                         Extended
//                       </div>
//                       <p className="text-xs text-gray-500 mt-2">
//                         End date: {formatDate(new Date(order.extended_end_date || order.end_date))}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ) : null}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default OrderExtension;