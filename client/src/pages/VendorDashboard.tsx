import { useEffect, useState } from "react";
import { Link,useLocation,useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  RefreshCw, 
  ChevronRight, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  User, 
  BarChart3, 
  TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";

// Import recharts components for the dashboard charts
import {
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const VendorDashboard = () => {
  const navigate = useNavigate()
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [dateRange, setDateRange] = useState("week");

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || !user?.isVendor)) {
      navigate("/");
    }
  }, [isAuthLoading, isAuthenticated, user, navigate]);

  // Fetch vendor profile
  const { 
    data: vendorProfile, 
    isLoading: isVendorLoading 
  } = useQuery({
    queryKey: ['/api/vendor/profile'],
    enabled: isAuthenticated && user?.isVendor,
    // This is a mock implementation since we don't have a direct endpoint
    queryFn: async () => {
      return {
        id: 1,
        businessName: "TechStore",
        businessEmail: "contact@techstore.com",
        description: "Premium Electronics & Gadgets",
        logoUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
        coverUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f",
        averageRating: 4.8,
        totalReviews: 243,
        status: "approved",
        totalSales: 12548.75,
        totalOrders: 98,
        totalProducts: 24,
        pendingOrders: 5
      };
    }
  });

  // Fetch recent orders
  const { 
    data: recentOrders = [], 
    isLoading: isOrdersLoading 
  } = useQuery({
    queryKey: ['/api/vendor/orders', { limit: 5 }],
    enabled: isAuthenticated && user?.isVendor,
    // Mock implementation
    queryFn: async () => {
      return [
        {
          id: 1,
          orderNumber: "ORD-1234567",
          customerName: "John Doe",
          date: "2023-06-15T10:30:00Z",
          total: 129.99,
          status: "completed"
        },
        {
          id: 2,
          orderNumber: "ORD-7654321",
          customerName: "Jane Smith",
          date: "2023-06-14T14:45:00Z",
          total: 79.99,
          status: "shipped"
        },
        {
          id: 3,
          orderNumber: "ORD-9876543",
          customerName: "Robert Johnson",
          date: "2023-06-13T09:15:00Z",
          total: 246.50,
          status: "processing"
        },
        {
          id: 4,
          orderNumber: "ORD-3456789",
          customerName: "Emily Brown",
          date: "2023-06-12T16:20:00Z",
          total: 49.99,
          status: "pending"
        },
        {
          id: 5,
          orderNumber: "ORD-8765432",
          customerName: "Michael Wilson",
          date: "2023-06-11T11:10:00Z",
          total: 185.75,
          status: "completed"
        }
      ];
    }
  });

  // Mock data for charts
  const salesData = [
    { name: "Mon", sales: 1200 },
    { name: "Tue", sales: 1900 },
    { name: "Wed", sales: 1500 },
    { name: "Thu", sales: 2400 },
    { name: "Fri", sales: 2800 },
    { name: "Sat", sales: 3200 },
    { name: "Sun", sales: 2100 },
  ];

  const productPerformanceData = [
    { name: "Smart Watch", value: 35 },
    { name: "Wireless Earbuds", value: 25 },
    { name: "Bluetooth Speaker", value: 20 },
    { name: "Power Bank", value: 15 },
    { name: "Phone Case", value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4A4A4'];

  const orderStatusData = [
    { name: "Completed", count: 45 },
    { name: "Shipped", count: 20 },
    { name: "Processing", count: 15 },
    { name: "Pending", count: 10 },
    { name: "Cancelled", count: 5 },
  ];

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

  if (isAuthLoading || isVendorLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isVendor) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <Helmet>
        <title>Vendor Dashboard | MultiVendor Marketplace</title>
        <meta name="description" content="Manage your vendor account, track sales, and monitor order status from your vendor dashboard." />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/">
              <a className="hover:text-primary">Home</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700">Vendor Dashboard</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h1>
            <div className="mt-3 sm:mt-0">
              <Tabs value={dateRange} onValueChange={setDateRange}>
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Sales</p>
                    <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(vendorProfile?.totalSales || 0)}</h3>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">12%</span>
                  <span className="text-gray-500 ml-1">vs. last period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <h3 className="text-2xl font-bold text-gray-900">{vendorProfile?.totalOrders || 0}</h3>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">8%</span>
                  <span className="text-gray-500 ml-1">vs. last period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <h3 className="text-2xl font-bold text-gray-900">{vendorProfile?.totalProducts || 0}</h3>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">5%</span>
                  <span className="text-gray-500 ml-1">vs. last period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Average Rating</p>
                    <div className="flex items-center">
                      <h3 className="text-2xl font-bold text-gray-900">{vendorProfile?.averageRating || 0}</h3>
                      <div className="flex ml-2">
                        {Array(5).fill(0).map((_, i) => (
                          <svg 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(vendorProfile?.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  {vendorProfile?.totalReviews || 0} total reviews
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sales Chart and Order Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Your sales performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => `$${value}`}
                        width={70}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, "Sales"]}
                        labelFormatter={(label) => `Day: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#3B82F6" 
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>
                  Distribution of orders by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="count"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} orders`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Total Orders:</span>
                    <span className="font-medium">{orderStatusData.reduce((sum, item) => sum + item.count, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Pending Orders:</span>
                    <span className="font-medium">{vendorProfile?.pendingOrders || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Product Performance and Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>
                  Your best performing products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={productPerformanceData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip formatter={(value) => [`${value}%`, "Sales Percentage"]} />
                      <Bar dataKey="value" fill="#3B82F6" barSize={20} radius={[0, 4, 4, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Latest orders from customers
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/vendor/orders")}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {isOrdersLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-6 w-6 text-primary animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Loading orders...</p>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No orders found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <th className="px-4 py-3">Order</th>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Total</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentOrders.map((order: any) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-medium">{order.orderNumber}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {order.customerName}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-medium">
                              {formatCurrency(order.total)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDashboard;
