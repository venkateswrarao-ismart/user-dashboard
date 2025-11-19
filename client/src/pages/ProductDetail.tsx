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
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";


const ProductDetail = () => {
 
    const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const { user } = useAuth();

   const { cart, refreshCart } = useCart();


  console.log('userdetails',user)

  console.log('product-id',slug)

  // Fetch product details from Supabase
  const { data: product, isLoading, error } = useQuery({
    queryKey: [`product-${slug}`],
    queryFn: async () => {
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select(`
            *,
            categories(name)
          `)
          .eq('id', slug)
          .single();

        if (productError) throw productError;
        if (!productData) throw new Error('Product not found');

        // Get images
        let images = [];
        if (productData.product_photos?.length > 0) {
          images = productData.product_photos;
        } else if (productData.image_url) {
          images = [productData.image_url];
        } else {
          images = ['https://via.placeholder.com/400x400?text=No+Image'];
        }

        // Fetch reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productData.id)
          .order('created_at', { ascending: false });

        return {
          ...productData,
          images,
          category: productData.categories?.name || "General",
          specifications: [
            { name: "Brand", value: productData.brand || "Unknown" },
            { name: "Category", value: productData.categories?.name || "General" },
            { name: "HSN Code", value: productData.hsn_code || "N/A" },
            { name: "GST", value: `${productData.gst_percentage || 0}%` },
            { name: "Weight", value: productData.weight ? 
              `${productData.weight} ${productData.unit_of_measurement || 'g'}` : "N/A" },
            { name: "Article ID", value: productData.article_id || "N/A" }
          ],
          reviews: reviewsData || []
        };
      } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
    }
  });

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: [`related-products-${product?.category_id}`],
    enabled: !!product,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(name)')
          .neq('id', slug)
          .eq('category_id', product?.category_id)
          .limit(4);

        if (error) throw error;

        return data.map(p => ({
          ...p,
          images: p.product_photos?.length > 0 || p.image_url ? 
            (p.product_photos || [p.image_url]) : 
            ['https://via.placeholder.com/400x400']
        }));
      } catch (error) {
        console.error('Error fetching related products:', error);
        return [];
      }
    }
  });

  const discount = product?.mrp && product.mrp > product.price
    ? calculateDiscountPercentage(product.price, product.mrp)
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
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to add items to cart",
          variant: "destructive"
        });
        return navigate('/login');
      }
  
      setIsAddingToCart(true);
      
      try {
        if (!navigator.onLine) {
          throw new Error("You appear to be offline. Please check your connection.");
        }
  
        // 1. Get or create cart for the user
        let { data: cart, error: cartError } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', user.id)
          .single();
  
        if (!cart) {
          const { data: newCart, error: newCartError } = await supabase
            .from('carts')
            .insert({ user_id: user.id })
            .select('id')
            .single();
  
          if (newCartError) throw newCartError;
          cart = newCart;
        }
  
        // 2. Check if product exists in cart items
        const { data: existingItem, error: itemError } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('cart_id', cart.id)
          .eq('product_id', slug)
          .maybeSingle();
  
        if (itemError) throw itemError;
  
        if (existingItem) {
          // Update quantity if item exists
          const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);
  
          if (updateError) throw updateError;
        } else {
          // Add new item if doesn't exist
          const { error: insertError } = await supabase
            .from('cart_items')
            .insert({
              cart_id: cart.id,
              product_id: slug,
              quantity: quantity
            });
  
          if (insertError) throw insertError;
        }

        refreshCart();
  
        toast({
          title: "✅ Added to cart",
          description: `${quantity} × ${product.name}`,
        });
      } catch (error: any) {
        console.error('Cart Error:', error);
  
        let userMessage = "Failed to add item to cart";
        if (error.message.includes("offline")) {
          userMessage = "Network unavailable - check your connection";
        } else if (error.code === '23505') {
          userMessage = "Item already exists in cart";
        }
  
        toast({
          title: "❌ Error",
          description: userMessage,
          variant: "destructive",
          duration: 5000
        });
      } finally {
        setIsAddingToCart(false);
      }
    };

  const handleAddToWishlist = () => {
    if (!product) return;
    
    setIsAddingToWishlist(true);

    setTimeout(() => {
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
      setIsAddingToWishlist(false);
    }, 500);
  };

  const handleShare = () => {
    if (!product) return;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard.",
      });
    }
  };

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

  return (
    <>
      <Helmet>
        <title>{product.name} | MultiVendor Marketplace</title>
        <meta name="description" content={product.description || `Buy ${product.name}`} />
      </Helmet>

      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/products" className="hover:text-primary">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700">{product.name}</span>
          </div>
          
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
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                
                <div className="flex items-center mb-6">
                  {product.selling_price && product.selling_price > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{(product.selling_price*quantity).toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-500 line-through ml-3">
                        ₹{(product.price*quantity).toFixed(2)}
                      </span>
                      {/* <Badge className="ml-3 bg-red-500">
                        {discount}% OFF
                      </Badge> */}
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
                      product.stock > 10 ? 'bg-green-500' : 
                      product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span>
                      {product.stock > 10 ? 'In Stock' : 
                       product.stock > 0 ? `Low Stock (${product.stock} left)` : 
                       'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
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

                {/* Action Buttons */}
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

                {/* Shipping Info */}
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
                      {product.description || "No detailed description available."}
                    </p>
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
                          {product.specifications.map((spec: any, index: number) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="py-3 px-4 text-sm font-medium text-gray-900 w-1/3">
                                {spec.name}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
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
                      <Button className="bg-primary hover:bg-blue-600">
                        Write a Review
                      </Button>
                    </div>
                    
                    {product.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {product.reviews.map((review: any) => (
                          <div key={review.id} className="border-t border-gray-200 pt-6">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800">
                                {review.user_name || "Anonymous"}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
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
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No reviews yet. Be the first to review this product!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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