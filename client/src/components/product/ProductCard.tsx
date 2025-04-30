import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { calculateDiscountPercentage } from "@/lib/utils";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  category_id: string;
  approval_status: string;
  rejection_reason: string | null;
  submitted_at: string;
  approved_at: string | null;
  brand: string;
  hsn_code: string;
  vendor_id: string | null;
  sub_category_id: string;
  selling_price: number;
  gst_percentage: number;
  updated_by: string | null;
};

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  
  // Calculate discount if selling_price is available and lower than regular price
  const discount = product.selling_price > 0 && product.selling_price < product.price
    ? calculateDiscountPercentage(product.selling_price, product.price)
    : 0;
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      await addItem(product.id, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlistLoading(true);
    
    // Mock wishlist functionality
    setTimeout(() => {
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
      setIsWishlistLoading(false);
    }, 500);
  };
  
  const getStockStatus = () => {
    if (product.stock <= 0) {
      return { text: "Out of Stock", className: "bg-red-100 text-red-800" };
    } else if (product.stock < 10) {
      return { text: "Low Stock", className: "bg-yellow-100 text-yellow-800" };
    } else {
      return { text: "In Stock", className: "bg-green-100 text-green-800" };
    }
  };
  
  const stockStatus = getStockStatus();
  
  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition h-full">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="block cursor-pointer">
            <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 relative h-56">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Link>
        <div className="absolute top-2 right-2 space-y-2">
          <Button
            size="icon"
            variant="outline"
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-primary transition"
            onClick={handleAddToWishlist}
            disabled={isWishlistLoading}
          >
            <Heart className={`h-4 w-4 ${isWishlistLoading ? 'animate-pulse' : ''}`} />
            <span className="sr-only">Add to wishlist</span>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-primary transition"
            onClick={handleAddToCart}
            disabled={isLoading || product.stock <= 0}
          >
            <ShoppingCart className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
        {/* {discount > 0 && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-500 text-white block">-{discount}%</Badge>
          </div>
        )} */}
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-yellow-400'}`} 
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">(42)</span>
        </div>
        <Link href={`/products/${product.id}`}>
          <div className="block cursor-pointer">
            <h3 className="font-medium text-gray-900 group-hover:text-primary transition mb-1 truncate">
              {product.name}
            </h3>
          </div>
        </Link>
        <p className="text-xs text-gray-500 mb-2 truncate">
          By{" "}
          <Link href={`/brand/${encodeURIComponent(product.brand)}`}>
            <span className="text-primary hover:underline cursor-pointer">
              {product.brand || "Unknown Brand"}
            </span>
          </Link>
        </p>
        <div className="flex items-center justify-between">
          <div>
            {product.selling_price && product.selling_price > 0 ? (
              <>
                <span className="text-lg font-bold text-gray-900">₹{(product.selling_price).toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{(product.price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">₹{(product.price).toFixed(2)}</span>
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded ${stockStatus.className}`}>
            {stockStatus.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
