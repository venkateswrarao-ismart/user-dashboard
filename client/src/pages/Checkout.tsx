import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  ChevronRight, 
  CreditCard, 
  DollarSign, 
  Truck, 
  Home, 
  Plus, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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

const Checkout = () => {
  const [, navigate] = useLocation();
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
    queryKey: ['/api/users/addresses'],
    enabled: isAuthenticated,
  });

  // Calculate order summary
  const subtotal = cart?.total || 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = parseFloat((subtotal * 0.1).toFixed(2)); // 10% tax
  const total = subtotal + shipping + tax;

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
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some items before checkout.",
        variant: "destructive",
      });
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
      const response = await apiRequest("POST", "/api/orders", {
        shippingAddressId: selectedAddressId,
        paymentMethod: paymentMethod,
      });
      
      const order = await response.json();
      setOrderId(order.id);
      setOrderPlaced(true);
      refreshCart(); // Clear the cart after successful order
      
      // Navigate to success page after a short delay
      setTimeout(() => {
        navigate(`/order-success/${order.id}`);
      }, 2000);
      
    } catch (error) {
      console.error("Failed to place order:", error);
      toast({
        title: "Failed to place order",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
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

  return (
    <>
      <Helmet>
        <title>Checkout | MultiVendor Marketplace</title>
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
                              src={item.product.imageUrl} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
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
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
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
                      Your order will typically be delivered within 3-5 business days. You will receive a confirmation email with tracking details once your order is shipped.
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
