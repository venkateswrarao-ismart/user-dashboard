import { useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  CheckCircle, 
  Truck, 
  Package, 
  CreditCard, 
  Map, 
  ChevronRight, 
  RefreshCw, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  // Fetch order details
  const { 
    data: order, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: [`/api/orders/${orderId}`],
    enabled: !!orderId && isAuthenticated,
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

  return (
    <>
      <Helmet>
        <title>Order Confirmation | MultiVendor Marketplace</title>
        <meta name="description" content={`Thank you for your order! Your order #${orderId} has been received and is being processed.`} />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/">
              <a className="hover:text-primary">Home</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/orders">
              <a className="hover:text-primary">Orders</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700">Order #{orderId}</span>
          </div>
          
          {/* Order Confirmation */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              Order #{order.orderNumber}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
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
                  <CreditCard className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Payment Method</h3>
                  <span className="mt-1 text-sm text-gray-600">
                    {order.paymentMethod === 'cash-on-delivery' ? 'Cash on Delivery' : order.paymentMethod}
                  </span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col items-center">
                  <Truck className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Estimated Delivery</h3>
                  <span className="mt-1 text-sm text-gray-600">3-5 Business Days</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">Order Items</h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row">
                      <div className="w-full sm:w-20 h-20 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 sm:ml-4">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">
                              Sold by: {item.vendor?.businessName || "Unknown Vendor"}
                            </p>
                          </div>
                          <div className="text-right mt-2 sm:mt-0">
                            <p className="font-bold text-gray-900">{formatCurrency(item.total)}</p>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(item.price)} x {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary and Shipping Info */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(order.total * 0.9)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {order.total > 50 ? "Free" : formatCurrency(5.99)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatCurrency(order.total * 0.1)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
              
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <Map className="h-5 w-5 text-primary mr-2" />
                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                  </div>
                </div>
                <div className="p-6">
                  {order.shippingAddress ? (
                    <div>
                      <p className="font-medium text-gray-900 mb-1">
                        {order.shippingAddress.addressLine1}
                      </p>
                      {order.shippingAddress.addressLine2 && (
                        <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
                      )}
                      <p className="text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-gray-600">{order.shippingAddress.country}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Address information not available</p>
                  )}
                </div>
              </div>
              
              {/* Actions */}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
