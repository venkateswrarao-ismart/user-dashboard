// // import LoginModal from "@/components/auth/LoginModal";
// // import RegisterModal from "@/components/auth/RegisterModal";
// // import VendorRegisterModal from "@/components/auth/VendorRegisterModal";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { useAuth } from "@/hooks/useAuth";
// // import { useCart } from "@/hooks/useCart";
// // import {
// //   ChevronDown,
// //   Menu,
// //   Search,
// //   ShoppingCart,
// //   Store
// // } from "lucide-react";
// // import { useEffect, useRef, useState } from "react";
// // import { Link, useLocation ,useNavigate} from "react-router-dom";

// // const Header = () => {
// //    const navigate = useNavigate();
 
// //   const { user, isAuthenticated, logout } = useAuth();
// //   const { cart } = useCart();
// //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// //   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
// //   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
// //   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
// //   const [isVendorRegisterModalOpen, setIsVendorRegisterModalOpen] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");
  
// //   const userMenuRef = useRef<HTMLDivElement>(null);
  
// //   const cartItemCount = cart?.items?.length || 0;
  
// //   const toggleMobileMenu = () => {
// //     setIsMobileMenuOpen(!isMobileMenuOpen);
// //   };
  
// //   const toggleUserMenu = () => {
// //     setIsUserMenuOpen(!isUserMenuOpen);
// //   };
  
 

// //   const handleSearch = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
// //   };
  
// //   const handleLogout = () => {
// //     logout();
// //     setIsUserMenuOpen(false);
// //   };
  
// //   const openLoginModal = () => {
// //     setIsLoginModalOpen(true);
// //     setIsUserMenuOpen(false);
// //   };
  
// //   const openRegisterModal = () => {
// //     setIsRegisterModalOpen(true);
// //     setIsUserMenuOpen(false);
// //   };
  
// //   const openVendorRegisterModal = () => {
// //     setIsVendorRegisterModalOpen(true);
// //     setIsUserMenuOpen(false);
// //   };
  
// //   // Close menu when clicking outside
// //   useEffect(() => {
// //     function handleClickOutside(event: MouseEvent) {
// //       if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
// //         setIsUserMenuOpen(false);
// //       }
// //     }
    
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => {
// //       document.removeEventListener("mousedown", handleClickOutside);
// //     };
// //   }, []);
  
// //   return (
// //     <header className="bg-white shadow-sm sticky top-0 z-50">
// //       <div className="container mx-auto px-4">
// //         <div className="flex items-center justify-between py-4">
// //           {/* Logo */}
// //           <div className="flex items-center">
// //             <Link to="/" className="flex items-center space-x-2">
// //             <img
// //                     src={ "/rent-xp.png"}
// //                     alt="Uploaded"
// //                     className="max-h-28 rounded-md "
// //                   />
              
// //             </Link>
// //           </div>

// //           {/* Search Bar - Desktop */}
// //           <div className="hidden md:flex flex-1 mx-8">
// //             <form onSubmit={handleSearch} className="relative w-full">
// //               <Input
// //                 type="text"
// //                 placeholder="Search Consoles, PC'S..."
// //                 className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //               />
// //               <Button 
// //                 type="submit" 
// //                 variant="ghost" 
// //                 className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-primary"
// //               >
// //                 <Search className="h-4 w-4" />
// //               </Button>
// //             </form>
// //           </div>

// //           {/* Navigation Items */}
// //           <div className="flex items-center space-x-6">
// //             <nav className="hidden md:flex items-center space-x-6">
// //               <Link to="/" className={`text-gray-600 hover:text-primary transition ${window.location.href === '/' ? 'text-primary' : ''}`}>
// //                 Home
// //               </Link>
// //               <Link to="/categories" className={`text-gray-600 hover:text-primary transition ${window.location.href === '/products' ? 'text-primary' : ''}`}>
// //                 Categories
// //               </Link>
// //               {/* <Link href="/products?type=vendors" className={`text-gray-600 hover:text-primary transition ${location.includes('vendors') ? 'text-primary' : ''}`}>
// //                 Vendors
// //               </Link> */}
// //             </nav>
// //             <div className="flex items-center space-x-4">
// //               <Link to="/cart" className="text-gray-600 hover:text-primary text-lg relative" aria-label="Shopping cart">
// //                 <ShoppingCart className="h-6 w-6" />
// //                 {cartItemCount > 0 && (
// //                   <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
// //                     {cartItemCount}
// //                   </span>
// //                 )}
// //               </Link>
// //               <div className="hidden md:block relative" ref={userMenuRef}>
// //                 <button
// //                   id="userMenuBtn"
// //                   className="flex items-center text-sm font-medium text-gray-700 hover:text-primary"
// //                   onClick={toggleUserMenu}
// //                 >
// //                   <span className="mr-1">
// //                     {isAuthenticated ? `${user?.username || 'Account'}` : 'Account'}
// //                   </span>
// //                   <ChevronDown className="h-4 w-4" />
// //                 </button>
// //                 {isUserMenuOpen && (
// //                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
// //                     {!isAuthenticated ? (
// //                       <div className="py-1">
// //                         <button
// //                           onClick={openLoginModal}
// //                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
// //                         >
// //                           Sign In
// //                         </button>
// //                         <button
// //                           onClick={openRegisterModal}
// //                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
// //                         >
// //                           Register
// //                         </button>
// //                         {/* <button
// //                           onClick={openVendorRegisterModal}
// //                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
// //                         >
// //                           Become a Vendor
// //                         </button> */}
// //                       </div>
// //                     ) : (
// //                       <div className="py-1">
// //                         <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
// //                           My Profile
// //                         </Link>
// //                         <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
// //                           My Orders
// //                         </Link>
// //                         <Link to="/addresses" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
// //                           Addresses
// //                         </Link>
// //                         <Link to="/cart" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
// //                           Cart
// //                         </Link>
// //                         {/* {user?.isVendor && (
// //                           <Link href="/vendor/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
// //                             Vendor Dashboard
// //                           </Link>
// //                         )} */}
// //                         <div className="border-t border-gray-100 my-1"></div>
// //                         <button
// //                           onClick={handleLogout}
// //                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
// //                         >
// //                           Sign Out
// //                         </button>
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //               {/* Mobile Menu Button */}
// //               <button
// //                 className="md:hidden text-gray-600"
// //                 onClick={toggleMobileMenu}
// //               >
// //                 <Menu className="h-6 w-6" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
        
// //         {/* Search Bar - Mobile */}
// //         <div className="md:hidden pb-4">
// //           <form onSubmit={handleSearch} className="relative w-full">
// //             <Input
// //               type="text"
// //               placeholder="Search products, vendors..."
// //               className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //             />
// //             <Button 
// //               type="submit" 
// //               variant="ghost" 
// //               className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-primary"
// //             >
// //               <Search className="h-4 w-4" />
// //             </Button>
// //           </form>
// //         </div>

// //         {/* Mobile Menu */}
// //         {isMobileMenuOpen && (
// //           <div className="md:hidden pb-4">
// //             <nav className="flex flex-col space-y-3">
// //               <Link to="/" className="text-gray-600 hover:text-primary transition py-2">
// //                 Home
// //               </Link>
// //               <Link to="/products" className="text-gray-600 hover:text-primary transition py-2">
// //                 Categories
// //               </Link>
// //               <Link to="/products?type=vendors" className="text-gray-600 hover:text-primary transition py-2">
// //                 Vendors
// //               </Link>
// //               {!isAuthenticated ? (
// //                 <>
// //                   <button
// //                     onClick={openLoginModal}
// //                     className="text-left text-gray-600 hover:text-primary transition py-2"
// //                   >
// //                     Sign In
// //                   </button>
// //                   <button
// //                     onClick={openRegisterModal}
// //                     className="text-left text-gray-600 hover:text-primary transition py-2"
// //                   >
// //                     Register
// //                   </button>
// //                   <button
// //                     onClick={openVendorRegisterModal}
// //                     className="text-left text-gray-600 hover:text-primary transition py-2"
// //                   >
// //                     Become a Vendor
// //                   </button>
// //                 </>
// //               ) : (
// //                 <>
// //                   <Link to="/profile" className="text-gray-600 hover:text-primary transition py-2">
// //                     My Profile
// //                   </Link>
// //                   <Link to="/orders" className="text-gray-600 hover:text-primary transition py-2">
// //                     My Orders
// //                   </Link>
// //                   <Link to="/addresses" className="text-gray-600 hover:text-primary transition py-2">
// //                     Addresses
// //                   </Link>
// //                   {user?.isVendor && (
// //                     <Link to="/vendor/dashboard" className="text-gray-600 hover:text-primary transition py-2">
// //                       Vendor Dashboard
// //                     </Link>
// //                   )}
// //                   <button
// //                     onClick={handleLogout}
// //                     className="text-left text-gray-600 hover:text-primary transition py-2"
// //                   >
// //                     Sign Out
// //                   </button>
// //                 </>
// //               )}
// //             </nav>
// //           </div>
// //         )}
// //       </div>
      
// //       {/* Modals */}
// //       <LoginModal 
// //         isOpen={isLoginModalOpen} 
// //         onClose={() => setIsLoginModalOpen(false)} 
// //         onShowRegister={() => {
// //           setIsLoginModalOpen(false);
// //           setIsRegisterModalOpen(true);
// //         }}
// //       />
      
// //       <RegisterModal 
// //         isOpen={isRegisterModalOpen} 
// //         onClose={() => setIsRegisterModalOpen(false)} 
// //         onShowLogin={() => {
// //           setIsRegisterModalOpen(false);
// //           setIsLoginModalOpen(true);
// //         }}
// //       />
      
// //       <VendorRegisterModal 
// //         isOpen={isVendorRegisterModalOpen} 
// //         onClose={() => setIsVendorRegisterModalOpen(false)} 
// //       />
// //     </header>
// //   );
// // };

// // export default Header;
// import LoginModal from "@/components/auth/LoginModal";
// import RegisterModal from "@/components/auth/RegisterModal";
// import VendorRegisterModal from "@/components/auth/VendorRegisterModal";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useAuth } from "@/hooks/useAuth";
// import { useCart } from "@/hooks/useCart";
// import {
//   ChevronDown,
//   Menu,
//   Search,
//   ShoppingCart,
//   Store,
//   MessageCircle // Added WhatsApp icon (MessageCircle from lucide-react)
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { Link, useLocation ,useNavigate} from "react-router-dom";

// const Header = () => {
//    const navigate = useNavigate();
 
//   const { user, isAuthenticated, logout } = useAuth();
//   const { cart } = useCart();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
//   const [isVendorRegisterModalOpen, setIsVendorRegisterModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
  
//   const userMenuRef = useRef<HTMLDivElement>(null);
  
//   const cartItemCount = cart?.items?.length || 0;
  
//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };
  
//   const toggleUserMenu = () => {
//     setIsUserMenuOpen(!isUserMenuOpen);
//   };
  
 

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
//   };
  
//   const handleLogout = () => {
//     logout();
//     setIsUserMenuOpen(false);
//   };
  
//   const openLoginModal = () => {
//     setIsLoginModalOpen(true);
//     setIsUserMenuOpen(false);
//   };
  
//   const openRegisterModal = () => {
//     setIsRegisterModalOpen(true);
//     setIsUserMenuOpen(false);
//   };
  
//   const openVendorRegisterModal = () => {
//     setIsVendorRegisterModalOpen(true);
//     setIsUserMenuOpen(false);
//   };
  
//   // WhatsApp redirect function
//   const handleWhatsAppClick = () => {
//     const phoneNumber = "9000888640";
//     const message = "Hello! I have a question about Rent XP.";
//     const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
//     window.open(whatsappUrl, '_blank');
//   };
  
//   // Close menu when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
//         setIsUserMenuOpen(false);
//       }
//     }
    
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
  
//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between py-4">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center space-x-2">
//             <img
//                     src={ "/rent-xp.png"}
//                     alt="Uploaded"
//                     className="max-h-28 rounded-md "
//                   />
              
//             </Link>
//           </div>

//           {/* Search Bar - Desktop */}
//           <div className="hidden md:flex flex-1 mx-8">
//             <form onSubmit={handleSearch} className="relative w-full">
//               <Input
//                 type="text"
//                 placeholder="Search Consoles, PC'S..."
//                 className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <Button 
//                 type="submit" 
//                 variant="ghost" 
//                 className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-primary"
//               >
//                 <Search className="h-4 w-4" />
//               </Button>
//             </form>
//           </div>

//           {/* Navigation Items */}
//           <div className="flex items-center space-x-6">
//             <nav className="hidden md:flex items-center space-x-6">
//               <Link to="/" className={`text-gray-600 hover:text-primary transition ${window.location.href === '/' ? 'text-primary' : ''}`}>
//                 Home
//               </Link>
//               <Link to="/categories" className={`text-gray-600 hover:text-primary transition ${window.location.href === '/products' ? 'text-primary' : ''}`}>
//                 Categories
//               </Link>
//               {/* <Link href="/products?type=vendors" className={`text-gray-600 hover:text-primary transition ${location.includes('vendors') ? 'text-primary' : ''}`}>
//                 Vendors
//               </Link> */}
//             </nav>
//             <div className="flex items-center space-x-4">
//               {/* WhatsApp Icon */}
//               <button 
//                 onClick={handleWhatsAppClick}
//                 className="text-gray-600 hover:text-green-600 text-lg transition-colors"
//                 aria-label="Contact us on WhatsApp"
//                 title="Chat with us on WhatsApp"
//               >
//                 <MessageCircle className="h-6 w-6" />
//               </button>
              
//               <Link to="/cart" className="text-gray-600 hover:text-primary text-lg relative" aria-label="Shopping cart">
//                 <ShoppingCart className="h-6 w-6" />
//                 {cartItemCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {cartItemCount}
//                   </span>
//                 )}
//               </Link>
//               <div className="hidden md:block relative" ref={userMenuRef}>
//                 <button
//                   id="userMenuBtn"
//                   className="flex items-center text-sm font-medium text-gray-700 hover:text-primary"
//                   onClick={toggleUserMenu}
//                 >
//                   <span className="mr-1">
//                     {isAuthenticated ? `${user?.username || 'Account'}` : 'Account'}
//                   </span>
//                   <ChevronDown className="h-4 w-4" />
//                 </button>
//                 {isUserMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
//                     {!isAuthenticated ? (
//                       <div className="py-1">
//                         <button
//                           onClick={openLoginModal}
//                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           Sign In
//                         </button>
//                         <button
//                           onClick={openRegisterModal}
//                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           Register
//                         </button>
//                         {/* <button
//                           onClick={openVendorRegisterModal}
//                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           Become a Vendor
//                         </button> */}
//                       </div>
//                     ) : (
//                       <div className="py-1">
//                         <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                           My Profile
//                         </Link>
//                         <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                           My Orders
//                         </Link>
//                         <Link to="/addresses" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                           Addresses
//                         </Link>
//                         <Link to="/cart" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                           Cart
//                         </Link>
//                         {/* {user?.isVendor && (
//                           <Link href="/vendor/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                             Vendor Dashboard
//                           </Link>
//                         )} */}
//                         <div className="border-t border-gray-100 my-1"></div>
//                         <button
//                           onClick={handleLogout}
//                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           Sign Out
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//               {/* Mobile Menu Button */}
//               <button
//                 className="md:hidden text-gray-600"
//                 onClick={toggleMobileMenu}
//               >
//                 <Menu className="h-6 w-6" />
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Search Bar - Mobile */}
//         <div className="md:hidden pb-4">
//           <form onSubmit={handleSearch} className="relative w-full">
//             <Input
//               type="text"
//               placeholder="Search products, vendors..."
//               className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <Button 
//               type="submit" 
//               variant="ghost" 
//               className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-primary"
//             >
//               <Search className="h-4 w-4" />
//             </Button>
//           </form>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden pb-4">
//             <nav className="flex flex-col space-y-3">
//               <Link to="/" className="text-gray-600 hover:text-primary transition py-2">
//                 Home
//               </Link>
//               <Link to="/products" className="text-gray-600 hover:text-primary transition py-2">
//                 Categories
//               </Link>
//               <Link to="/products?type=vendors" className="text-gray-600 hover:text-primary transition py-2">
//                 Vendors
//               </Link>
//               {/* WhatsApp option in mobile menu */}
//               <button
//                 onClick={handleWhatsAppClick}
//                 className="text-left text-gray-600 hover:text-green-600 transition py-2 flex items-center"
//               >
//                 <MessageCircle className="h-5 w-5 mr-2" />
//                 Contact on WhatsApp
//               </button>
//               {!isAuthenticated ? (
//                 <>
//                   <button
//                     onClick={openLoginModal}
//                     className="text-left text-gray-600 hover:text-primary transition py-2"
//                   >
//                     Sign In
//                   </button>
//                   <button
//                     onClick={openRegisterModal}
//                     className="text-left text-gray-600 hover:text-primary transition py-2"
//                   >
//                     Register
//                   </button>
//                   <button
//                     onClick={openVendorRegisterModal}
//                     className="text-left text-gray-600 hover:text-primary transition py-2"
//                   >
//                     Become a Vendor
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/profile" className="text-gray-600 hover:text-primary transition py-2">
//                     My Profile
//                   </Link>
//                   <Link to="/orders" className="text-gray-600 hover:text-primary transition py-2">
//                     My Orders
//                   </Link>
//                   <Link to="/addresses" className="text-gray-600 hover:text-primary transition py-2">
//                     Addresses
//                   </Link>
//                   {user?.isVendor && (
//                     <Link to="/vendor/dashboard" className="text-gray-600 hover:text-primary transition py-2">
//                       Vendor Dashboard
//                     </Link>
//                   )}
//                   <button
//                     onClick={handleLogout}
//                     className="text-left text-gray-600 hover:text-primary transition py-2"
//                   >
//                     Sign Out
//                   </button>
//                 </>
//               )}
//             </nav>
//           </div>
//         )}
//       </div>
      
//       {/* Modals */}
//       <LoginModal 
//         isOpen={isLoginModalOpen} 
//         onClose={() => setIsLoginModalOpen(false)} 
//         onShowRegister={() => {
//           setIsLoginModalOpen(false);
//           setIsRegisterModalOpen(true);
//         }}
//       />
      
//       <RegisterModal 
//         isOpen={isRegisterModalOpen} 
//         onClose={() => setIsRegisterModalOpen(false)} 
//         onShowLogin={() => {
//           setIsRegisterModalOpen(false);
//           setIsLoginModalOpen(true);
//         }}
//       />
      
//       <VendorRegisterModal 
//         isOpen={isVendorRegisterModalOpen} 
//         onClose={() => setIsVendorRegisterModalOpen(false)} 
//       />
//     </header>
//   );
// };

// export default Header;

// import LoginModal from "@/components/auth/LoginModal";
// import RegisterModal from "@/components/auth/RegisterModal";
// import VendorRegisterModal from "@/components/auth/VendorRegisterModal";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useAuth } from "@/hooks/useAuth";
// import { useCart } from "@/hooks/useCart";
// import {
//   ChevronDown,
//   Menu,
//   Search,
//   ShoppingCart,
//   Store
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { Link, useLocation ,useNavigate} from "react-router-dom";

// const Header = () => {
//    const navigate = useNavigate();
 
//   const { user, isAuthenticated, logout } = useAuth();
//   const { cart } = useCart();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
//   const [isVendorRegisterModalOpen, setIsVendorRegisterModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
  
//   const userMenuRef = useRef<HTMLDivElement>(null);
  
//   const cartItemCount = cart?.items?.length || 0;
  
//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };
  
//   const toggleUserMenu = () => {
//     setIsUserMenuOpen(!isUserMenuOpen);
//   };
  
 

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
//   };
  
//   const handleLogout = () => {
//     logout();
//     setIsUserMenuOpen(false);
//   };
  
//   const openLoginModal = () => {
//     setIsLoginModalOpen(true);
//     setIsUserMenuOpen(false);
//   };
  
//   const openRegisterModal = () => {
//     setIsRegisterModalOpen(true);
//     setIsUserMenuOpen(false);
//   };
  
//   const openVendorRegisterModal = () => {
//     setIsVendorRegisterModalOpen(true);
//     setIsUserMenuOpen(false);
//   };
  
//   // WhatsApp redirect function
//   const handleWhatsAppClick = () => {
//     const phoneNumber = "9000888640";
//     const message = "Hello! I have a question about Rent XP.";
//     const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
//     window.open(whatsappUrl, '_blank');
//   };
  
//   // Close menu when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
//         setIsUserMenuOpen(false);
//       }
//     }
    
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
  
//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between py-4">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center space-x-2">
//             <img
//                     src={ "/rent-xp.png"}
//                     alt="Uploaded"
//                     className="max-h-28 rounded-md "
//                   />
              
//             </Link>
//           </div>

//           {/* Search Bar - Desktop */}
//           <div className="hidden md:flex flex-1 mx-8">
//             <form onSubmit={handleSearch} className="relative w-full">
//               <Input
//                 type="text"
//                 placeholder="Search Consoles, PC'S..."
//                 className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <Button 
//                 type="submit" 
//                 variant="ghost" 
//                 className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-primary"
//               >
//                 <Search className="h-4 w-4" />
//               </Button>
//             </form>
//           </div>

//           {/* Navigation Items */}
//           <div className="flex items-center space-x-6">
//             <nav className="hidden md:flex items-center space-x-6">
//               <Link to="/" className={`text-gray-600 hover:text-primary transition ${window.location.href === '/' ? 'text-primary' : ''}`}>
//                 Home
//               </Link>
//               <Link to="/categories" className={`text-gray-600 hover:text-primary transition ${window.location.href === '/products' ? 'text-primary' : ''}`}>
//                 Categories
//               </Link>
//               {/* <Link href="/products?type=vendors" className={`text-gray-600 hover:text-primary transition ${location.includes('vendors') ? 'text-primary' : ''}`}>
//                 Vendors
//               </Link> */}
//             </nav>
//             <div className="flex items-center space-x-4">
//               {/* WhatsApp Icon */}
//               <button 
//                 onClick={handleWhatsAppClick}
//                 className="text-gray-600 hover:opacity-80 transition-opacity p-1"
//                 aria-label="Contact us on WhatsApp"
//                 title="Chat with us on WhatsApp"
//               >
//                 <img 
//                   src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/2062095_application_chat_communication_logo_whatsapp_icon.svg/2048px-2062095_application_chat_communication_logo_whatsapp_icon.svg.png" 
//                   alt="WhatsApp" 
//                   className="h-6 w-6 object-contain"
//                 />
//               </button>
              
//               <Link to="/cart" className="text-gray-600 hover:text-primary text-lg relative" aria-label="Shopping cart">
//                 <ShoppingCart className="h-6 w-6" />
//                 {cartItemCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {cartItemCount}
//                   </span>
//                 )}
//               </Link>
//               <div className="hidden md:block relative" ref={userMenuRef}>
//                 <button
//                   id="userMenuBtn"
//                   className="flex items-center text-sm font-medium text-gray-700 hover:text-primary"
//                   onClick={toggleUserMenu}
//                 >
//                   <span className="mr-1">
//                     {isAuthenticated ? `${user?.username || 'Account'}` : 'Account'}
//                   </span>
//                   <ChevronDown className="h-4 w-4" />
//                 </button>
//                 {isUserMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
//                     {!isAuthenticated ? (
//                       <div className="py-1">
//                         <button
//                           onClick={openLoginModal}
//                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           Sign In
//                         </button>
//                         <button
//                           onClick={openRegisterModal}
//                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           Register
//                         </button>
//                         {/* <button
//                           onClick={openVendorRegisterModal}
//                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           Become a Vendor
//                         </button> */}
//                       </div>
//                     ) : (
//                       <div className="py-1">
//                         <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                           My Profile
//                         </Link>
//                         <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                           My Orders
//                         </Link>
//                         <Link to="/addresses" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                           Addresses
//                         </Link>
//                         <Link to="/cart" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                           Cart
//                         </Link>
//                         {/* {user?.isVendor && (
//                           <Link href="/vendor/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                             Vendor Dashboard
//                           </Link>
//                         )} */}
//                         <div className="border-t border-gray-100 my-1"></div>
//                         <button
//                           onClick={handleLogout}
//                           className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         >
//                           Sign Out
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//               {/* Mobile Menu Button */}
//               <button
//                 className="md:hidden text-gray-600"
//                 onClick={toggleMobileMenu}
//               >
//                 <Menu className="h-6 w-6" />
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Search Bar - Mobile */}
//         <div className="md:hidden pb-4">
//           <form onSubmit={handleSearch} className="relative w-full">
//             <Input
//               type="text"
//               placeholder="Search products, vendors..."
//               className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <Button 
//               type="submit" 
//               variant="ghost" 
//               className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-primary"
//             >
//               <Search className="h-4 w-4" />
//             </Button>
//           </form>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden pb-4">
//             <nav className="flex flex-col space-y-3">
//               <Link to="/" className="text-gray-600 hover:text-primary transition py-2">
//                 Home
//               </Link>
//               <Link to="/products" className="text-gray-600 hover:text-primary transition py-2">
//                 Categories
//               </Link>
//               <Link to="/products?type=vendors" className="text-gray-600 hover:text-primary transition py-2">
//                 Vendors
//               </Link>
//               {/* WhatsApp option in mobile menu */}
//               <button
//                 onClick={handleWhatsAppClick}
//                 className="text-left text-gray-600 hover:text-green-600 transition py-2 flex items-center"
//               >
//                 <img 
//                   src="https://png.pngtree.com/element_our/sm/20180626/sm_5b321c99945a2.png" 
//                   alt="WhatsApp" 
//                   className="h-5 w-5 mr-2 object-contain"
//                 />
//                 Contact on WhatsApp
//               </button>
//               {!isAuthenticated ? (
//                 <>
//                   <button
//                     onClick={openLoginModal}
//                     className="text-left text-gray-600 hover:text-primary transition py-2"
//                   >
//                     Sign In
//                   </button>
//                   <button
//                     onClick={openRegisterModal}
//                     className="text-left text-gray-600 hover:text-primary transition py-2"
//                   >
//                     Register
//                   </button>
//                   <button
//                     onClick={openVendorRegisterModal}
//                     className="text-left text-gray-600 hover:text-primary transition py-2"
//                   >
//                     Become a Vendor
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/profile" className="text-gray-600 hover:text-primary transition py-2">
//                     My Profile
//                   </Link>
//                   <Link to="/orders" className="text-gray-600 hover:text-primary transition py-2">
//                     My Orders
//                   </Link>
//                   <Link to="/addresses" className="text-gray-600 hover:text-primary transition py-2">
//                     Addresses
//                   </Link>
//                   {user?.isVendor && (
//                     <Link to="/vendor/dashboard" className="text-gray-600 hover:text-primary transition py-2">
//                       Vendor Dashboard
//                     </Link>
//                   )}
//                   <button
//                     onClick={handleLogout}
//                     className="text-left text-gray-600 hover:text-primary transition py-2"
//                   >
//                     Sign Out
//                   </button>
//                 </>
//               )}
//             </nav>
//           </div>
//         )}
//       </div>
      
//       {/* Modals */}
//       <LoginModal 
//         isOpen={isLoginModalOpen} 
//         onClose={() => setIsLoginModalOpen(false)} 
//         onShowRegister={() => {
//           setIsLoginModalOpen(false);
//           setIsRegisterModalOpen(true);
//         }}
//       />
      
//       <RegisterModal 
//         isOpen={isRegisterModalOpen} 
//         onClose={() => setIsRegisterModalOpen(false)} 
//         onShowLogin={() => {
//           setIsRegisterModalOpen(false);
//           setIsLoginModalOpen(true);
//         }}
//       />
      
//       <VendorRegisterModal 
//         isOpen={isVendorRegisterModalOpen} 
//         onClose={() => setIsVendorRegisterModalOpen(false)} 
//       />
//     </header>
//   );
// };

// export default Header;

import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import VendorRegisterModal from "@/components/auth/VendorRegisterModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  Store
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation ,useNavigate} from "react-router-dom";

const Header = () => {
   const navigate = useNavigate();
 
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isVendorRegisterModalOpen, setIsVendorRegisterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const cartItemCount = cart?.items?.length || 0;
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };
  
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };
  
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsUserMenuOpen(false);
  };
  
  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsUserMenuOpen(false);
  };
  
  const openVendorRegisterModal = () => {
    setIsVendorRegisterModalOpen(true);
    setIsUserMenuOpen(false);
  };
  
  // WhatsApp redirect function
  const handleWhatsAppClick = () => {
    const phoneNumber = "919000888640"; // Updated: India country code + phone number
    const message = "Hello! I have a question about Rent XP.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
            <img
                    src={ "/rent-xp.png"}
                    alt="Uploaded"
                    className="max-h-28 rounded-md "
                  />
              
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search Consoles, PC'S..."
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-primary"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`text-gray-600 hover:text-primary transition ${window.location.href === '/' ? 'text-primary' : ''}`}>
                Home
              </Link>
              <Link to="/categories" className={`text-gray-600 hover:text-primary transition ${window.location.href === '/products' ? 'text-primary' : ''}`}>
                Categories
              </Link>
              {/* <Link href="/products?type=vendors" className={`text-gray-600 hover:text-primary transition ${location.includes('vendors') ? 'text-primary' : ''}`}>
                Vendors
              </Link> */}
            </nav>
            <div className="flex items-center space-x-4">
              {/* WhatsApp Icon */}
              <button 
                onClick={handleWhatsAppClick}
                className="text-gray-600 hover:opacity-80 transition-opacity p-1"
                aria-label="Contact us on WhatsApp"
                title="Chat with us on WhatsApp"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/2062095_application_chat_communication_logo_whatsapp_icon.svg/2048px-2062095_application_chat_communication_logo_whatsapp_icon.svg.png" 
                  alt="WhatsApp" 
                  className="h-6 w-6 object-contain"
                />
              </button>
              
              <Link to="/cart" className="text-gray-600 hover:text-primary text-lg relative" aria-label="Shopping cart">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <div className="hidden md:block relative" ref={userMenuRef}>
                <button
                  id="userMenuBtn"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-primary"
                  onClick={toggleUserMenu}
                >
                  <span className="mr-1">
                    {isAuthenticated ? `${user?.username || 'Account'}` : 'Account'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {!isAuthenticated ? (
                      <div className="py-1">
                        <button
                          onClick={openLoginModal}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={openRegisterModal}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Register
                        </button>
                        {/* <button
                          onClick={openVendorRegisterModal}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Become a Vendor
                        </button> */}
                      </div>
                    ) : (
                      <div className="py-1">
                        <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          My Profile
                        </Link>
                        <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          My Orders
                        </Link>
                        <Link to="/addresses" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Addresses
                        </Link>
                        <Link to="/cart" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Cart
                        </Link>
                        {/* {user?.isVendor && (
                          <Link href="/vendor/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                            Vendor Dashboard
                          </Link>
                        )} */}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-600"
                onClick={toggleMobileMenu}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="text"
              placeholder="Search Products, Consoles..."
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-primary"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-600 hover:text-primary transition py-2">
                Home
              </Link>
              <Link to="/products" className="text-gray-600 hover:text-primary transition py-2">
                Categories
              </Link>
            
              {/* WhatsApp option in mobile menu */}
              <button
                onClick={handleWhatsAppClick}
                className="text-left text-gray-600 hover:text-green-600 transition py-2 flex items-center"
              >
                <img 
                  src="https://png.pngtree.com/element_our/sm/20180626/sm_5b321c99945a2.png" 
                  alt="WhatsApp" 
                  className="h-5 w-5 mr-2 object-contain"
                />
                Contact on WhatsApp
              </button>
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={openLoginModal}
                    className="text-left text-gray-600 hover:text-primary transition py-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openRegisterModal}
                    className="text-left text-gray-600 hover:text-primary transition py-2"
                  >
                    Register
                  </button>
              
                </>
              ) : (
                <>
                  <Link to="/profile" className="text-gray-600 hover:text-primary transition py-2">
                    My Profile
                  </Link>
                  <Link to="/orders" className="text-gray-600 hover:text-primary transition py-2">
                    My Orders
                  </Link>
                  <Link to="/addresses" className="text-gray-600 hover:text-primary transition py-2">
                    Addresses
                  </Link>
              
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-600 hover:text-primary transition py-2"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onShowRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
        onShowLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
      
      <VendorRegisterModal 
        isOpen={isVendorRegisterModalOpen} 
        onClose={() => setIsVendorRegisterModalOpen(false)} 
      />
    </header>
  );
};

export default Header;