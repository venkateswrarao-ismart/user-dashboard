import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square overflow-hidden cursor-pointer">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="object-cover w-full h-full hover:scale-105 transition-transform"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-lg cursor-pointer hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.compareAtPrice}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => addToCart(product.id.toString(), 1)}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}