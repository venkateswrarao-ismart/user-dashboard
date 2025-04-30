import ProductCard from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { calculateDiscountPercentage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck
} from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useParams } from "wouter";

const ProductDetail = () => {
  const { slug: productId } = useParams();
  const [, navigate] = useLocation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${productId}`],
    queryFn: async () => {
      try {
        // Fetch all products and find the one with matching ID
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        
        const products = await res.json();
        const product = products.find((p: any) => p.id === productId);
        
        if (!product) {
          throw new Error('Product not found');
        }
        
        // Add additional fields needed for the UI based on the actual API response
        return {
          ...product,
          images: [product.image_url || 'https://via.placeholder.com/400x400?text=No+Image', product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'],
          compareAtPrice: product.price,
          vendor: {
            id: product.vendor_id || "unknown",
            businessName: product.brand || "Unknown Vendor",
            averageRating: 4.5,
            totalReviews: 10
          },
          specifications: [
            { name: "Brand", value: product.brand || "Unknown" },
            { name: "Category", value: product.category || "General" },
            { name: "HSN Code", value: product.hsn_code || "N/A" },
            { name: "GST", value: `${product.gst_percentage || 0}%` },
            { name: "Status", value: product.approval_status || "N/A" }
          ],
          reviews: [
            {
              id: 1,
              author: "Customer",
              rating: 5,
              date: new Date().toISOString().split('T')[0],
              content: "Good quality product!"
            }
          ]
        };
      } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
    },
  });
  
  // Fetch related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: [`/api/products/related`, product?.category_id],
    enabled: !!product,
    queryFn: async () => {
      try {
        // Fetch products from the same category
        const res = await fetch(`/api/categories/${product.category_id}/products?limit=4`);
        if (!res.ok) throw new Error('Failed to fetch related products');
        
        const products = await res.json();
        return products.filter((p: any) => p.id !== product.id).slice(0, 4);
      } catch (error) {
        console.error('Error fetching related products:', error);
        return [];
      }
    },
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mt-4"></div>
              <div className="h-24 bg-gray-100 rounded w-full mt-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button 
          className="bg-primary hover:bg-blue-600"
          onClick={() => navigate('/products')}
        >
          Browse Products
        </Button>
      </div>
    );
  }
  
  const discount = product.compareAtPrice 
    ? calculateDiscountPercentage(product.price, product.compareAtPrice) 
    : 0;
  
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newQuantity = parseInt(value, 10);
      
      if (!isNaN(newQuantity)) {
        setQuantity(Math.max(1, Math.min(newQuantity, product.stock)));
      } else if (value === '') {
        setQuantity(1);
      }
    };
    
    const handleQuantityBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '') {
        setQuantity(1);
        return;
      }
      
      const newQuantity = parseInt(value, 10);
      if (isNaN(newQuantity)) {
        setQuantity(1);
      } else {
        setQuantity(Math.max(1, Math.min(newQuantity, product.stock)));
      }
    };
    
    const incrementQuantity = () => {
      if (quantity < product.stock) {
        setQuantity(prev => prev + 1);
      }
    };
    
    const decrementQuantity = () => {
      if (quantity > 1) {
        setQuantity(prev => prev - 1);
      }
    };
    
    
  
    const handleAddToCart = async () => {
      setIsAddingToCart(true);
      
      try {
        // First verify network connectivity
        if (!navigator.onLine) {
          throw new Error("You appear to be offline. Please check your connection.");
        }
    
        // Try fetching product with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
        
        const retryFetch = async (url: string, options = {}, retries = 3) => {
          try {
            return await fetch(url, options);
          } catch (err) {
            if (retries <= 0) throw err;
            await new Promise(res => setTimeout(res, 1000));
            return retryFetch(url, options, retries - 1);
          }
        };
        
        const verifyRes = await fetch(`/api/products/${product.id}`, {
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));
    
        if (!verifyRes.ok) {
          throw new Error(`Product verification failed (${verifyRes.status})`);
        }
    
        // Add to cart
        await addItem(product.id, quantity);
        
        toast({
          title: "✅ Added to cart",
          description: `${quantity} × ${product.name}`,
        });
      } catch (error: any) {
        console.error('Cart Error:', {
          error: error.message,
          productId: product.id,
          stack: error.stack
        });
    
        let userMessage = "Failed to add item to cart";
        
        if (error.message.includes("offline")) {
          userMessage = "Network unavailable - please check your internet connection";
        } else if (error.name === "AbortError") {
          userMessage = "Request timed out - server may be unavailable";
        } else if (error.message.includes("Failed to fetch")) {
          userMessage = "Cannot connect to the server - please try again later";
        }
    
        toast({
          title: "❌ Error",
          description: userMessage,
          variant: "destructive",
          duration: 5000 // Show longer for important errors
        });
      } finally {
        setIsAddingToCart(false);
      }
    };
  
  const handleAddToWishlist = () => {
    setIsAddingToWishlist(true);
    
    // Mock wishlist functionality
    setTimeout(() => {
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
      setIsAddingToWishlist(false);
    }, 500);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard.",
      });
    }
  };
  
  return (
    <>
      <Helmet>
        <title>{product.name} | MultiVendor Marketplace</title>
        <meta name="description" content={product.description || `Buy ${product.name} at great prices.`} />
      </Helmet>
      
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/">
              <span className="hover:text-primary cursor-pointer">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/products">
              <span className="hover:text-primary cursor-pointer">Products</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700">{product.name}</span>
          </div>
          
          {/* Product details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={product.images[selectedImage]} 
                    alt={product.name} 
                    className="w-full h-96 object-contain"
                  />
                </div>
                <div className="flex space-x-4">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      className={`border-2 rounded-md overflow-hidden w-20 h-20 flex-shrink-0 ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - view ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Product Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <Link href={`/vendor/${product.vendor.id}`}>
                  <span className="text-primary hover:underline text-sm mb-4 inline-block cursor-pointer">
                    By {product.vendor.businessName}
                  </span>
                </Link>
                
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-yellow-400'}`} 
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    (42 reviews)
                  </span>
                </div>
                
                <div className="flex items-center mb-6">
                  {product.selling_price && product.selling_price > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{(product.selling_price * quantity).toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-500 line-through ml-3">
                        ₹{(product.price * quantity).toFixed(2)}
                      </span>
                      <Badge className="ml-3 bg-red-500">
                        {Math.round(((product.price - product.selling_price) / product.price) * 100)}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{(product.price * quantity).toFixed(2)}
                    </span>
                  )}
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  <div className="flex items-center text-sm mb-2">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span>
                      {product.stock > 10 
                        ? 'In Stock' 
                        : product.stock > 0 
                          ? `Low Stock (${product.stock} left)` 
                          : 'Out of Stock'
                      }
                    </span>
                  </div>
                </div>
                
                {/* Quantity and Add to Cart */}
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-r-none"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1 || product.stock <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                        id="quantity"
                        type="number"
                        className="h-10 w-16 rounded-none text-center"
                        value={quantity}
                        onChange={handleQuantityChange}
                        onBlur={handleQuantityBlur}
                        min="1"
                        max={product.stock}
                        disabled={product.stock <= 0}
                      />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-l-none"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock || product.stock <= 0}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button
                    className="flex-1 sm:flex-none bg-primary hover:bg-blue-600"
                    size="lg"
                    disabled={isAddingToCart || product.stock <= 0}
                    onClick={handleAddToCart}
                  >
                    {isAddingToCart ? (
                      <>
                        <span className="animate-spin mr-2">
                          <RefreshCw className="h-5 w-5" />
                        </span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 sm:flex-none"
                    disabled={isAddingToWishlist}
                    onClick={handleAddToWishlist}
                  >
                    <Heart className={`mr-2 h-5 w-5 ${isAddingToWishlist ? 'animate-pulse text-red-500' : ''}`} />
                    Wishlist
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
                
                {/* Shipping & Returns */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Free Shipping</h4>
                      <p className="text-xs text-gray-500">Free standard shipping on orders over ₹1,500</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <RefreshCw className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Easy Returns</h4>
                      <p className="text-xs text-gray-500">30 days to return or exchange unused items</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ShieldCheck className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Secure Checkout</h4>
                      <p className="text-xs text-gray-500">Safe & encrypted checkout process</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-6">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-2">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                    <p className="text-gray-600">
                      {product.description || "No detailed description available for this product."}
                    </p>
                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800">Features</h4>
                        <ul className="mt-2 space-y-2">
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>High-quality materials</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>Durable construction</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>Easy to use</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <span>Versatile functionality</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="specifications">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="divide-y divide-gray-200">
                          {product.specifications?.map((spec: any, index: number) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="py-3 px-4 text-sm font-medium text-gray-900 w-1/3">{spec.name}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{spec.value}</td>
                            </tr>
                          )) || (
                            <tr>
                              <td colSpan={2} className="py-3 px-4 text-sm text-gray-500 text-center">
                                No specifications available for this product.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">Customer Reviews</h3>
                      <Button className="bg-primary hover:bg-blue-600">Write a Review</Button>
                    </div>
                    
                    <div className="mb-8 flex items-center">
                      <div className="flex items-center space-x-1 mr-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-yellow-400'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xl font-bold">4.2</span>
                      <span className="text-gray-500 ml-2">out of 5</span>
                      <span className="text-gray-500 ml-4">(42 reviews)</span>
                    </div>
                    
                    {product.reviews?.length > 0 ? (
                      <div className="space-y-6">
                        {product.reviews.map((review: any) => (
                          <div key={review.id} className="border-t border-gray-200 pt-6">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-800">{review.author}</h4>
                                <p className="text-sm text-gray-500">Verified Purchase</p>
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <div className="flex items-center mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${
                                    star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <p className="text-gray-600">{review.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Vendor Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={product.vendor?.logoUrl || "https://via.placeholder.com/96"}
                  alt={product.vendor?.businessName || "Vendor"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.vendor?.businessName}</h3>
                <div className="flex items-center justify-center md:justify-start space-x-1 mb-3">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{product.vendor?.averageRating?.toFixed(1) || "0.0"}</span>
                  <span className="text-gray-500">
                    ({product.vendor?.totalReviews || 0} reviews)
                  </span>
                </div>
                <p className="text-gray-600 mb-4 max-w-2xl">
                  {product.vendor?.description || "This vendor offers quality products at competitive prices."}
                </p>
                <Link href={`/vendor/${product.vendor?.id}`}>
                  <a className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition">
                    View Shop
                  </a>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct: any) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
