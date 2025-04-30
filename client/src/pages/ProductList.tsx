import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Helmet } from "react-helmet";
import { Grid, List, Filter, SlidersHorizontal, ChevronRight, ChevronDown, Heart, ShoppingCart } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/product/ProductCard";
import VendorCard from "@/components/vendor/VendorCard";
import { cn, formatCurrency } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  selling_price: number;
  stock: number;
  category: string;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  category_id: string;
  brand: string | null;
  hsn_code: string | null;
  vendor_id: string | null;
  sub_category_id: string | null;
  gst_percentage: number;
  approval_status?: string;
};

type SubCategory = {
  id: string;
  name: string;
  image_url: string | null;
};

type Category = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subcategories?: SubCategory[];
};

type Vendor = {
  id: number;
  userId: number;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  category: string | null;
  status: string;
  averageRating: number | string;
  totalReviews: number;
};

const ProductList = () => {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const categoryId = location.split('/')[2];
  const searchQuery = params.get('search') || '';
  const isVendorView = params.get('type') === 'vendors';
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Fetch products based on category or search
  const { data: products = [], isLoading: isProductsLoading } = useQuery<Product[]>({
    queryKey: [
      categoryId ? `/api/categories/${categoryId}/products` : '/api/products',
      { search: searchQuery }
    ],
    enabled: !isVendorView,
    // Ensure we don't use empty data during initial load
    refetchOnMount: true,
    staleTime: 0,
  });
  
  // Fetch categories for the sidebar
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Fetch vendors if in vendor view
  const { data: vendors = [], isLoading: isVendorsLoading } = useQuery<Vendor[]>({
    queryKey: ['/api/vendors'],
    enabled: isVendorView
  });
  
  // Get the current category if we're viewing a category
  const currentCategory = categories.find((cat: Category) => cat.id === categoryId);
  
  // Sort and filter products
  console.log("Products received:", products);
  console.log("Is Products Loading:", isProductsLoading);
  
  // Double check the product structure/typing
  const safeProducts = Array.isArray(products) ? products : [];
  console.log("Safe Products Length:", safeProducts.length);
  
  const filteredAndSortedProducts = [...safeProducts].filter((product: Product) => {
    // Use selling_price if available, otherwise use regular price
    const displayPrice = product.selling_price && product.selling_price > 0 ? product.selling_price : product.price;
    // Filter by price range
    return displayPrice >= priceRange[0] && displayPrice <= priceRange[1];
  }).sort((a: Product, b: Product) => {
    // Use selling_price if available for sorting
    const aPrice = a.selling_price && a.selling_price > 0 ? a.selling_price : a.price;
    const bPrice = b.selling_price && b.selling_price > 0 ? b.selling_price : b.price;
    
    switch (sortBy) {
      case 'price-asc':
        return aPrice - bPrice;
      case 'price-desc':
        return bPrice - aPrice;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default: // featured or latest
        // For string IDs, sort by creation date if available, otherwise by name
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
          return a.name.localeCompare(b.name);
        }
    }
  });
  
  // Set page title based on current view
  let pageTitle = "All Products";
  if (currentCategory) {
    pageTitle = currentCategory.name;
  } else if (searchQuery) {
    pageTitle = `Search Results: ${searchQuery}`;
  } else if (isVendorView) {
    pageTitle = "All Vendors";
  }
  
  // Handle mobile filter toggle
  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };
  
  return (
    <>
      <Helmet>
        <title>{pageTitle} | MultiVendor Marketplace</title>
        <meta name="description" content={`Browse our collection of ${pageTitle.toLowerCase()} from verified sellers. Find great deals on quality products.`} />
      </Helmet>
      
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/">
              <span className="hover:text-primary cursor-pointer">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            {currentCategory ? (
              <>
                <Link href="/products">
                  <span className="hover:text-primary cursor-pointer">Products</span>
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-gray-700">{currentCategory.name}</span>
              </>
            ) : isVendorView ? (
              <span className="text-gray-700">Vendors</span>
            ) : searchQuery ? (
              <>
                <Link href="/products">
                  <span className="hover:text-primary cursor-pointer">Products</span>
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-gray-700">Search: {searchQuery}</span>
              </>
            ) : (
              <span className="text-gray-700">Products</span>
            )}
          </div>
          
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{pageTitle}</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar / Filters - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href="/products">
                      <span className={cn(
                        "block py-1 hover:text-primary transition cursor-pointer",
                        !categoryId && !isVendorView ? "font-semibold text-primary" : "text-gray-600"
                      )}>
                        All Products
                      </span>
                    </Link>
                  </li>
                  {categories.map((category: Category) => (
                    <li key={category.id}>
                      <Link href={`/category/${category.id}`}>
                        <span className={cn(
                          "block py-1 hover:text-primary transition cursor-pointer",
                          categoryId === category.id ? "font-semibold text-primary" : "text-gray-600"
                        )}>
                          {category.name} {category.subcategories ? `(${category.subcategories.length})` : ''}
                        </span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/products?type=vendors">
                      <span className={cn(
                        "block py-1 hover:text-primary transition cursor-pointer",
                        isVendorView ? "font-semibold text-primary" : "text-gray-600"
                      )}>
                        All Vendors
                      </span>
                    </Link>
                  </li>
                </ul>
                
                {!isVendorView && (
                  <>
                    <div className="border-t border-gray-200 my-5"></div>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="price">
                        <AccordionTrigger className="text-lg font-semibold">Price Range</AccordionTrigger>
                        <AccordionContent>
                          <div className="mt-2 px-1">
                            <Slider
                              defaultValue={[0, 1000]}
                              max={1000}
                              step={10}
                              value={priceRange}
                              onValueChange={setPriceRange}
                              className="my-6"
                            />
                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                {formatCurrency(priceRange[0])}
                              </div>
                              <div className="text-sm">
                                {formatCurrency(priceRange[1])}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="availability">
                        <AccordionTrigger className="text-lg font-semibold">Availability</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="in-stock" />
                              <label
                                htmlFor="in-stock"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                In Stock
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="out-of-stock" />
                              <label
                                htmlFor="out-of-stock"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Out of Stock
                              </label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="ratings">
                        <AccordionTrigger className="text-lg font-semibold">Ratings</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <div key={rating} className="flex items-center space-x-2">
                                <Checkbox id={`rating-${rating}`} />
                                <label
                                  htmlFor={`rating-${rating}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                                >
                                  {Array(rating).fill(0).map((_, i) => (
                                    <svg 
                                      key={i}
                                      className="w-4 h-4 text-yellow-400 fill-current" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                    </svg>
                                  ))}
                                  <span className="ml-1">& Up</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                )}
              </div>
            </div>
            
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={toggleMobileFilter}
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  isMobileFilterOpen ? "transform rotate-180" : ""
                )} />
              </Button>
            </div>
            
            {/* Mobile Filters Panel */}
            {isMobileFilterOpen && (
              <div className="lg:hidden bg-white rounded-lg shadow-sm p-5 mb-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="categories">
                    <AccordionTrigger className="text-lg font-semibold">Categories</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 py-2">
                        <li>
                          <Link href="/products">
                            <span className={cn(
                              "block py-1 hover:text-primary transition cursor-pointer",
                              !categoryId && !isVendorView ? "font-semibold text-primary" : "text-gray-600"
                            )}>
                              All Products
                            </span>
                          </Link>
                        </li>
                        {categories.map((category: Category) => (
                          <li key={category.id}>
                            <Link href={`/category/${category.id}`}>
                              <span className={cn(
                                "block py-1 hover:text-primary transition cursor-pointer",
                                categoryId === category.id ? "font-semibold text-primary" : "text-gray-600"
                              )}>
                                {category.name} {category.subcategories ? `(${category.subcategories.length})` : ''}
                              </span>
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link href="/products?type=vendors">
                            <span className={cn(
                              "block py-1 hover:text-primary transition cursor-pointer",
                              isVendorView ? "font-semibold text-primary" : "text-gray-600"
                            )}>
                              All Vendors
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {!isVendorView && (
                    <>
                      <AccordionItem value="price">
                        <AccordionTrigger className="text-lg font-semibold">Price Range</AccordionTrigger>
                        <AccordionContent>
                          <div className="mt-2 px-1">
                            <Slider
                              defaultValue={[0, 1000]}
                              max={1000}
                              step={10}
                              value={priceRange}
                              onValueChange={setPriceRange}
                              className="my-6"
                            />
                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                {formatCurrency(priceRange[0])}
                              </div>
                              <div className="text-sm">
                                {formatCurrency(priceRange[1])}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="availability">
                        <AccordionTrigger className="text-lg font-semibold">Availability</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="in-stock-mobile" />
                              <label
                                htmlFor="in-stock-mobile"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                In Stock
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="out-of-stock-mobile" />
                              <label
                                htmlFor="out-of-stock-mobile"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Out of Stock
                              </label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="ratings">
                        <AccordionTrigger className="text-lg font-semibold">Ratings</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <div key={rating} className="flex items-center space-x-2">
                                <Checkbox id={`rating-${rating}-mobile`} />
                                <label
                                  htmlFor={`rating-${rating}-mobile`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                                >
                                  {Array(rating).fill(0).map((_, i) => (
                                    <svg 
                                      key={i}
                                      className="w-4 h-4 text-yellow-400 fill-current" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                    </svg>
                                  ))}
                                  <span className="ml-1">& Up</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </>
                  )}
                </Accordion>
              </div>
            )}
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Sort and View Controls */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm mr-2">Sort By:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {!isVendorView && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                      <span className="sr-only">Grid view</span>
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                      <span className="sr-only">List view</span>
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Products or Vendors Grid */}
              {isVendorView ? (
                // Vendors View
                isVendorsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6).fill(0).map((_, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm animate-pulse">
                        <div className="h-32 bg-gray-200"></div>
                        <div className="flex justify-center -mt-10 mb-3">
                          <div className="w-20 h-20 rounded-full bg-gray-300"></div>
                        </div>
                        <div className="p-5 space-y-3">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
                          <div className="h-4 bg-gray-100 rounded w-full mx-auto"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : vendors.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Vendors Found</h3>
                    <p className="text-gray-600">We couldn't find any vendors matching your criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendors.map((vendor: Vendor) => (
                      <VendorCard key={vendor.id} vendor={vendor} />
                    ))}
                  </div>
                )
              ) : (
                // Products View
                isProductsLoading ? (
                  <div className={cn(
                    viewMode === 'grid' 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                      : "space-y-6"
                  )}>
                    {Array(8).fill(0).map((_, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse",
                          viewMode === 'list' && "flex"
                        )}
                      >
                        <div className={cn(
                          "bg-gray-200",
                          viewMode === 'grid' ? "aspect-w-1 aspect-h-1 w-full h-56" : "h-36 w-36 flex-shrink-0"
                        )}></div>
                        <div className="p-4 space-y-3 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Products</h3>
                    <p className="text-gray-600">Please wait while we fetch products...</p>
                  </div>
                ) : filteredAndSortedProducts.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
                    <p className="text-gray-600">We couldn't find any products matching your criteria.</p>
                    <Button 
                      className="mt-4 bg-primary hover:bg-blue-600"
                      onClick={() => {
                        setPriceRange([0, 1000]);
                        setSortBy("featured");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredAndSortedProducts.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredAndSortedProducts.map((product: Product) => (
                        <div 
                          key={product.id} 
                          className="flex flex-col sm:flex-row bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
                        >
                          <div className="sm:w-48 h-48">
                            <img 
                              src={product.image_url || '/placeholder-product.jpg'} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4 flex flex-col">
                            <div>
                              <h3 className="font-medium text-lg text-gray-900 hover:text-primary transition mb-1">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                {product.description || "No description available."}
                              </p>
                              <div className="flex items-center space-x-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg 
                                    key={star} 
                                    className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-yellow-400'}`}
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                  </svg>
                                ))}
                                <span className="text-xs text-gray-500 ml-1">(42)</span>
                              </div>
                            </div>
                            <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                              <div>
                                {product.selling_price > 0 && product.selling_price < product.price ? (
                                  <>
                                    <span className="text-lg font-bold text-gray-900">{formatCurrency(product.selling_price)}</span>
                                    <span className="text-sm text-gray-500 line-through ml-2">
                                      {formatCurrency(product.price)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-gray-600 hover:text-primary"
                                >
                                  <Heart className="h-4 w-4 mr-1" />
                                  Wishlist
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="bg-primary hover:bg-blue-600"
                                  disabled={product.stock <= 0}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-1" />
                                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )
              )}
              
              {/* Pagination */}
              {!isProductsLoading && !isVendorsLoading && 
               ((isVendorView && vendors.length > 0) || 
                (!isVendorView && filteredAndSortedProducts.length > 0)) && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-1">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="bg-primary text-white">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
