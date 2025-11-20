// import { Switch, Route } from "wouter";
// import { queryClient } from "./lib/queryClient";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import NotFound from "@/pages/not-found";
// import Home from "@/pages/Home";
// import ProductList from "@/pages/ProductList";
// import ProductDetail from "@/pages/ProductDetail";
// import Cart from "@/pages/Cart";
// import Checkout from "@/pages/Checkout";
// import OrderSuccess from "@/pages/OrderSuccess";
// import UserProfile from "@/pages/UserProfile";
// import UserOrders from "@/pages/UserOrders";
// import UserAddresses from "@/pages/UserAddresses";
// import VendorDashboard from "@/pages/VendorDashboard";
// import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";
// import { AuthProvider } from "@/hooks/useAuth";
// import { CartProvider } from "@/hooks/useCart";
// import Categories from "./components/home/Categories";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// function Router() {
//   return (
//     <Switch>
//       <Route path="/" component={Home} />
//       <Route path="/products" component={ProductList} />
//       <Route path="/categories" component={Categories} />
//       <Route path="/products/:slug" component={ProductDetail} />
//       <Route path="/category/:slug" element={<ProductList />} />
//       <Route path="/cart" component={Cart} />
//       <Route path="/checkout" component={Checkout} />
//       <Route path="/order-success/:orderId" component={OrderSuccess} />
//       <Route path="/profile" component={UserProfile} />
//       <Route path="/orders" component={UserOrders} />
//       <Route path="/addresses" component={UserAddresses} />
//       <Route path="/vendor/dashboard" component={VendorDashboard} />
//       <Route component={NotFound} />
//     </Switch>
//   );
// }

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider>
//         <CartProvider>
//           <TooltipProvider>
//             <div className="flex min-h-screen flex-col font-sans bg-gray-50 text-gray-800">
//               <Header />
//               <main className="flex-1">
//                 <Router />
//               </main>
//               <Footer />
//               <Toaster />
//             </div>
//           </TooltipProvider>
//         </CartProvider>
//       </AuthProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProductList from "@/pages/ProductList";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import UserProfile from "@/pages/UserProfile";
import UserOrders from "@/pages/UserOrders";
import UserAddresses from "@/pages/UserAddresses";
import VendorDashboard from "@/pages/VendorDashboard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import Categories from "./components/home/Categories";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <div className="flex min-h-screen flex-col font-sans bg-gray-50 text-gray-800">
              <Router>
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/categories/:id" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/category/:slug" element={<ProductList />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/orders" element={<UserOrders />} />
                    <Route path="/addresses" element={<UserAddresses />} />
                    <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main> 
                <Footer />
                <Toaster />
              </Router>
            </div>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
