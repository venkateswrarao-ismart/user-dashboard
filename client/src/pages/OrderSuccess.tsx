import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Map,
  Package,
  RefreshCw
} from "lucide-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useParams } from "react-router-dom";

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

  const totalItems = order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  return (
    <>
      <Helmet>
        <title>Order Confirmation | Ismart Grocery</title>
        <meta name="description" content={`Thank you for your order! Your order #${orderId} has been received and is being processed.`} />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/orders" className="hover:text-primary">Orders</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700">Order #{orderId}</span>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              Order #{orderId}
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
                  <Package className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Total Items</h3>
                  <span className="mt-1 text-sm text-gray-600">
                    {totalItems} items
                  </span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col items-center">
                  <Map className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Delivery Address</h3>
                  <span className="mt-1 text-sm text-gray-600">
                    {order.delivery_address || 'Address not available'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">Order Items</h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row">
                      <div className="w-full sm:w-20 h-20 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
                        <img 
                          src={item.products?.image_url || '/placeholder-product.jpg'} 
                          alt={item.products?.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 sm:ml-4">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.products?.name}</h3>
                            <p className="text-sm text-gray-500">
                              SKU: {item.products?.sku || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right mt-2 sm:mt-0">
                            <p className="font-bold text-gray-900">
                              {formatCurrency(item.unit_price * item.quantity)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(item.unit_price)} x {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total_amount)}</span>
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
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {order.delivery_address || 'Address information not available'}
                  </p>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;